import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendPurchaseConfirmation } from '@/lib/resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function generateSlug(name: string): string {
  const base = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 40)
  return `${base}-${Math.random().toString(36).substring(2, 6)}`
}

function generateTempPassword(): string {
  const upper = Math.random().toString(36).substring(2, 6).toUpperCase()
  const lower = Math.random().toString(36).substring(2, 5)
  const nums = Math.floor(Math.random() * 900 + 100).toString()
  return `${upper}${lower}${nums}!`
}

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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const card_type = session.metadata?.card_type || 'pvc'
    const quantity = session.metadata?.quantity || '1'
    const customerEmail = session.customer_details?.email!
    const customerName = session.customer_details?.name || 'Customer'

    try {
      const tempPassword = generateTempPassword()
      let userId: string | undefined
      let isNewUser = false

      // Try to create user — if exists, update password
      const { data: authData, error: createError } = await supabase.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: customerName },
      })

      if (createError) {
        if (createError.message.includes('already registered') || createError.message.includes('already been registered')) {
          // User exists — get their ID and update password
          const { data: existingUsers } = await supabase.auth.admin.listUsers()
          const existingUser = existingUsers?.users?.find(u => u.email === customerEmail)
          if (existingUser) {
            userId = existingUser.id
            await supabase.auth.admin.updateUserById(userId, { password: tempPassword })
          }
        } else {
          console.error('Auth error:', createError)
        }
      } else {
        userId = authData?.user?.id
        isNewUser = true
      }

      // Get or create customer
      let { data: customer } = await supabase.from('customers').select('id').eq('email', customerEmail).single()
      if (!customer && userId) {
        const { data: newCustomer } = await supabase.from('customers').insert({
          user_id: userId, email: customerEmail, full_name: customerName, plan: card_type,
        }).select('id').single()
        customer = newCustomer
      }
      if (!customer) return NextResponse.json({ error: 'Customer error' }, { status: 500 })

      // Create profile
      const slug = generateSlug(customerName)
      const { data: profile } = await supabase.from('profiles').insert({
        customer_id: customer.id, slug, display_name: customerName, template: 'minimal', is_published: true,
      }).select('id').single()

      // Create order
      const unitPrice = card_type === 'pvc' ? 39 : 79
      const { data: order } = await supabase.from('orders').insert({
        customer_id: customer.id, profile_id: profile?.id, card_type,
        quantity: parseInt(quantity), unit_price: unitPrice, total_amount: unitPrice * parseInt(quantity),
        stripe_payment_id: session.payment_intent as string, stripe_session_id: session.id, status: 'paid',
      }).select('id').single()

      // Create card records
      if (order) {
        await supabase.from('cards').insert(
          Array.from({ length: parseInt(quantity) }, () => ({ order_id: order.id, profile_id: profile?.id, nfc_status: 'pending' }))
        )
      }

      // Send confirmation email
      await sendPurchaseConfirmation({
        email: 'customerEmail', // change to customerEmail when domain is verified in Resend
        name: customerName,
        cardType: card_type,
        slug,
        tempPassword,
      })

      console.log(`✓ Order: ${order?.id} | Profile: /c/${slug} | User: ${customerEmail} | New: ${isNewUser}`)
    } catch (err) {
      console.error('Webhook error:', err)
      return NextResponse.json({ error: 'Processing error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}