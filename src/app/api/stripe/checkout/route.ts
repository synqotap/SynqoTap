import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS: Record<string, string> = {
  pvc:   process.env.NEXT_PUBLIC_PVC_PRICE_ID!,
  metal: process.env.NEXT_PUBLIC_METAL_PRICE_ID!,
}

type CheckoutBody = {
  cardType: 'pvc' | 'metal'
  quantity: number
}

export async function POST(req: NextRequest) {
  const body = await req.json() as CheckoutBody
  const { cardType, quantity = 1 } = body

  if (!PRICE_IDS[cardType]) {
    return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.synqotap.com'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_IDS[cardType], quantity }],
    mode: 'payment',
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/checkout`,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['US', 'MX', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 'GT', 'CR', 'DO', 'PR'],
    },
    metadata: { card_type: cardType, quantity: String(quantity) },
  })

  return NextResponse.json({ url: session.url })
}
