import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type CheckoutBody = {
  cardType: 'pvc' | 'metal'
  quantity: number
}

export async function POST(req: NextRequest) {
  const body = await req.json() as CheckoutBody
  const { cardType, quantity = 1 } = body

  if (!['pvc', 'metal'].includes(cardType)) {
    return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
  }

  // Fetch base price
  const { data: priceData } = await supabaseAdmin
    .from('prices')
    .select('price')
    .eq('card_type', cardType)
    .single()

  const basePrice = Number(priceData?.price || (cardType === 'pvc' ? 39 : 79))

  // Fetch active show_on_home discount
  const { data: discount } = await supabaseAdmin
    .from('discounts')
    .select('type, value, stripe_coupon_id')
    .eq('is_active', true)
    .eq('show_on_home', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Calculate final price after discount
  let finalPrice = basePrice
  if (discount) {
    finalPrice = discount.type === 'percentage'
      ? basePrice * (1 - discount.value / 100)
      : basePrice - discount.value
    finalPrice = Math.max(0, finalPrice)
  }

  const unitAmount = Math.round(finalPrice * 100)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.synqotap.com'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: cardType === 'pvc' ? 'SynqoTap PVC Card' : 'SynqoTap Metal Card',
          description: cardType === 'pvc'
            ? 'NFC smart business card - PVC'
            : 'NFC smart business card - Premium Metal',
        },
        unit_amount: unitAmount,
      },
      quantity,
    }],
    mode: 'payment',
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout`,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['US', 'MX', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 'GT', 'CR', 'DO', 'PR'],
    },
    metadata: {
      card_type: cardType,
      quantity: String(quantity),
      base_price: String(basePrice),
      discount_applied: discount ? `${discount.type}:${discount.value}` : 'none',
    },
  })

  return NextResponse.json({ url: session.url })
}
