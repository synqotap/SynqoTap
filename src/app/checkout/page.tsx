'use client'
import { useState } from 'react'

type CardOption = {
  type: 'pvc' | 'metal'
  icon: string
  name: string
  desc: string
  price: string
  featured: boolean
  features: string[]
}

const CARDS: CardOption[] = [
  {
    type: 'pvc',
    icon: '💳',
    name: 'PVC Card',
    desc: 'Light, durable and elegant. Perfect for everyday networking.',
    price: '39',
    featured: false,
    features: [
      'Programmed NFC chip',
      'Unlimited digital profile',
      'Real-time updates',
      'Custom URL',
      '3 design templates',
    ],
  },
  {
    type: 'metal',
    icon: '⚡',
    name: 'Metal Card',
    desc: "Premium stainless steel. A first impression that won't be forgotten.",
    price: '79',
    featured: true,
    features: [
      'Everything in PVC',
      'Premium stainless steel',
      'Matte or mirror finish',
      'Laser engraving included',
      'Presentation case included',
    ],
  },
]

export default function CheckoutPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleBuy(cardType: 'pvc' | 'metal') {
    setLoading(cardType)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardType, quantity: 1 }),
      })
      const data = await res.json() as { url?: string }
      if (data.url) window.location.href = data.url
      else alert('Error starting payment. Please try again.')
    } catch {
      alert('Connection error. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-2xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors mb-10"
        >
          ← Back to home
        </a>

        <h1 className="font-syne font-black text-3xl sm:text-4xl tracking-tight mb-3">
          Choose your SynqoTap
        </h1>
        <p className="text-[#6B6B80] mb-10">One payment. No subscriptions. Shipping included.</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map(card => (
            <div
              key={card.type}
              className={`rounded-2xl p-6 sm:p-8 relative transition-all hover:-translate-y-1 duration-300 ${
                card.featured
                  ? 'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]'
                  : 'border border-[#22223A] bg-[#0E0E16]'
              }`}
            >
              {card.featured && (
                <div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full font-syne">
                  Popular
                </div>
              )}
              <div className="text-4xl mb-4">{card.icon}</div>
              <div className="font-syne font-black text-2xl tracking-tight mb-2">{card.name}</div>
              <div className="text-sm text-[#6B6B80] mb-5 leading-relaxed">{card.desc}</div>
              <div className="font-syne font-black text-5xl tracking-tight mb-1">${card.price}</div>
              <div className="text-xs text-[#6B6B80] mb-6">USD · one-time payment</div>
              <ul className="mb-7 space-y-1">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                    <span className="text-[#00E5FF] text-xs">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(card.type)}
                disabled={loading !== null}
                className={`w-full py-3.5 rounded-full font-syne font-bold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                  card.featured
                    ? 'bg-[#00E5FF] text-[#07070C] hover:opacity-85'
                    : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'
                }`}
              >
                {loading === card.type ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-current/20 border-t-current animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  `Buy ${card.name} →`
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6B6B80] mt-8">
          🔒 Secure payment with Stripe · Your information is protected
        </p>
      </div>
    </div>
  )
}
