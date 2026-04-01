import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPurchaseConfirmation } from '@/lib/resend'
import { generateSlug, generateTempPassword, getCardUnitPrice } from '@/lib/stripe/helpers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
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
    // 1. Create or get auth user
    const { userId, tempPassword } = await createOrUpdateAuthUser(customerEmail, customerName)
    if (!userId) throw new Error('Could not create auth user')

    // 2. Create or get customer record
    const customerId = await createOrUpdateCustomer(userId, customerEmail, customerName, cardType)
    if (!customerId) throw new Error('Could not create customer')

    // 3. Create profile
    const slug = generateSlug(customerName)
    const profileId = await createProfile(customerId, slug, customerName)

    // 4. Create order
    const unitPrice = getCardUnitPrice(cardType)
    const orderId = await createOrder(customerId, profileId, cardType, quantity, unitPrice, session)

    // 5. Create card records
    if (orderId && profileId) {
      await createCardRecords(orderId, profileId, quantity)
    }

    // 6. Send confirmation email
    await sendPurchaseConfirmation({
      email: customerEmail,
      name: customerName,
      cardType,
      slug,
      tempPassword,
    })

    console.log(`✓ Order: ${orderId} | Profile: /c/${slug} | User: ${customerEmail}`)
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// --- Helper functions ---

async function createOrUpdateAuthUser(
  email: string,
  fullName: string
): Promise<{ userId: string; tempPassword: string }> {
  const tempPassword = generateTempPassword()

  const { data: authData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (!createError && authData?.user?.id) {
    return { userId: authData.user.id, tempPassword }
  }

  // User already exists — update password
  if (createError?.message.includes('already registered') || createError?.message.includes('already been registered')) {
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)
    if (existingUser) {
      await supabase.auth.admin.updateUserById(existingUser.id, { password: tempPassword })
      return { userId: existingUser.id, tempPassword }
    }
  }

  throw new Error(`Auth error: ${createError?.message}`)
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
      .update({ user_id: userId, force_password_change: true })
      .eq('id', existing.id)
    return existing.id
  }

  const { data: newCustomer } = await supabase
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

  return newCustomer?.id ?? null
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
    })
    .select('id')
    .single()
  return data?.id ?? null
}

async function createCardRecords(
  orderId: string,
  profileId: string,
  quantity: number
): Promise<void> {
  await supabase.from('cards').insert(
    Array.from({ length: quantity }, () => ({
      order_id: orderId,
      profile_id: profileId,
      nfc_status: 'pending',
    }))
  )
}
