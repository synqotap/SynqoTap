import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_IDS = {
  pvc:   process.env.NEXT_PUBLIC_PVC_PRICE_ID!,
  metal: process.env.NEXT_PUBLIC_METAL_PRICE_ID!,
} as const

type CardType = keyof typeof PRICE_IDS

type CheckoutBody = {
  cardType: CardType
  quantity?: number
}

export async function POST(req: NextRequest) {
  try {
    const { cardType, quantity = 1 } = await req.json() as CheckoutBody

    if (!Object.keys(PRICE_IDS).includes(cardType)) {
      return NextResponse.json({ error: 'Invalid card type' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[cardType], quantity }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: { card_type: cardType, quantity: String(quantity) },
      shipping_address_collection: {
        allowed_countries: ['US', 'MX', 'CO', 'AR', 'CL', 'PE', 'EC'],
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
