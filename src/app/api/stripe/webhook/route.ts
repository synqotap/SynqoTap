import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { sendPurchaseConfirmation } from '@/lib/resend/emails'
import {
  generateSlug,
  generateTempPassword,
  getCardUnitPrice,
  generateInvoiceNumber,
} from '@/lib/stripe/helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const cardType = session.metadata?.card_type || 'pvc'
  const quantity = parseInt(session.metadata?.quantity || '1')
  const customerEmail = session.customer_details?.email!
  const customerName = session.customer_details?.name || 'Customer'

  try {
    const tempPassword = generateTempPassword()

    // 1. Create or update auth user
    const userId = await createOrUpdateAuthUser(customerEmail, customerName, tempPassword)
    if (!userId) throw new Error('Could not create auth user')

    // 2. Create or update customer record
    const customerId = await createOrUpdateCustomer(userId, customerEmail, customerName, cardType)
    if (!customerId) throw new Error('Could not create customer')

    // 3. Create profile
    const slug = generateSlug(customerName)
    const profileId = await createProfile(customerId, slug, customerName)

    // 4. Create order
    const unitPrice = getCardUnitPrice(cardType)
    const orderId = await createOrder(
      customerId, profileId, cardType, quantity,
      unitPrice, session
    )

    // 5. Create card records
    if (orderId && profileId) {
      await createCardRecords(orderId, profileId, quantity, `${process.env.NEXT_PUBLIC_APP_URL}/c/${slug}`)
    }

    // 6. Create invoice
    if (orderId) {
      await createInvoice(orderId, customerId, unitPrice * quantity)
    }

    // 7. Send confirmation email
    await sendPurchaseConfirmation({
      email: customerEmail,
      name: customerName,
      cardType,
      slug,
      tempPassword,
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// ── Helper functions ─────────────────────────────────────────────────────────

async function createOrUpdateAuthUser(
  email: string,
  fullName: string,
  tempPassword: string
): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (!error && data?.user?.id) return data.user.id

  if (error?.message.includes('already registered') || error?.message.includes('already been registered')) {
    const { data: list } = await supabase.auth.admin.listUsers()
    const existing = list?.users?.find(u => u.email === email)
    if (existing) {
      await supabase.auth.admin.updateUserById(existing.id, { password: tempPassword })
      return existing.id
    }
  }

  console.error('Auth error:', error)
  return null
}

async function createOrUpdateCustomer(
  userId: string,
  email: string,
  fullName: string,
  plan: string
): Promise<string | null> {
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) {
    await supabase
      .from('customers')
      .update({ user_id: userId, force_password_change: true, plan })
      .eq('id', existing.id)
    return existing.id
  }

  const { data } = await supabase
    .from('customers')
    .insert({
      user_id: userId,
      email,
      full_name: fullName,
      plan,
      force_password_change: true,
    })
    .select('id')
    .single()

  return data?.id ?? null
}

async function createProfile(
  customerId: string,
  slug: string,
  displayName: string
): Promise<string | null> {
  const { data } = await supabase
    .from('profiles')
    .insert({
      customer_id: customerId,
      slug,
      display_name: displayName,
      template: 'minimal',
      is_published: true,
    })
    .select('id')
    .single()
  return data?.id ?? null
}

async function createOrder(
  customerId: string,
  profileId: string | null,
  cardType: string,
  quantity: number,
  unitPrice: number,
  session: Stripe.Checkout.Session
): Promise<string | null> {
  const shippingAddress = session.shipping_details?.address ? {
    line1: session.shipping_details.address.line1,
    line2: session.shipping_details.address.line2,
    city: session.shipping_details.address.city,
    state: session.shipping_details.address.state,
    postal_code: session.shipping_details.address.postal_code,
    country: session.shipping_details.address.country,
    name: session.shipping_details.name,
  } : null

  const { data } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      profile_id: profileId,
      card_type: cardType,
      quantity,
      unit_price: unitPrice,
      total_amount: unitPrice * quantity,
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      status: 'paid',
      shipping_address: shippingAddress,
    })
    .select('id')
    .single()
  return data?.id ?? null
}

async function createCardRecords(
  orderId: string,
  profileId: string,
  quantity: number,
  nfcUrl: string
): Promise<void> {
  await supabase.from('cards').insert(
    Array.from({ length: quantity }, () => ({
      order_id: orderId,
      profile_id: profileId,
      nfc_url: nfcUrl,
      nfc_status: 'pending',
    }))
  )
}

async function createInvoice(
  orderId: string,
  customerId: string,
  amount: number
): Promise<void> {
  const invoiceNumber = await generateInvoiceNumber(supabase)
  await supabase.from('invoices').insert({
    order_id: orderId,
    customer_id: customerId,
    invoice_number: invoiceNumber,
    amount,
    status: 'sent',
  })
}
