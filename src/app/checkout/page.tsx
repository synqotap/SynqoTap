'use client'
import { useState } from 'react'
import { Card, Button } from '@/components/ui'

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

  const CARDS = [
    {
      type: 'pvc' as const,
      icon: '💳',
      name: 'PVC Card',
      desc: 'Light, durable and elegant. Perfect for everyday networking.',
      price: '39',
      featured: false,
      features: ['Programmed NFC chip', 'Unlimited digital profile', 'Real-time updates', 'Custom URL', '3 design templates'],
    },
    {
      type: 'metal' as const,
      icon: '⚡',
      name: 'Metal Card',
      desc: "Premium stainless steel. A first impression that won't be forgotten.",
      price: '79',
      featured: true,
      features: ['Everything in PVC', 'Premium stainless steel', 'Matte or mirror finish', 'Laser engraving included', 'Presentation case'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] flex items-center justify-center px-5 py-12 font-[family-name:var(--font-dm-sans)]">
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet" />
      <div className="w-full max-w-2xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors mb-10">
          ← Back to home
        </a>
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight mb-3 font-[family-name:var(--font-syne)]">Choose your SynqoTap</h1>
        <p className="text-[#6B6B80] mb-10">One payment. No subscriptions. Shipping included.</p>

        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map(card => (
            <Card
              key={card.type}
              className={`relative transition-all hover:-translate-y-1 duration-300 ${card.featured ? 'border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]' : ''}`}
            >
              {card.featured && (
                <div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Popular</div>
              )}
              <div className="text-4xl mb-4">{card.icon}</div>
              <div className="font-black text-2xl tracking-tight mb-2 font-[family-name:var(--font-syne)]">{card.name}</div>
              <div className="text-sm text-[#6B6B80] mb-5 leading-relaxed">{card.desc}</div>
              <div className="font-black text-5xl tracking-tight mb-1 font-[family-name:var(--font-syne)]">${card.price}</div>
              <div className="text-xs text-[#6B6B80] mb-6">USD · one-time payment</div>
              <ul className="mb-7 space-y-1">
                {card.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                    <span className="text-[#00E5FF] text-xs">✓</span>{f}
                  </li>
                ))}
              </ul>
              <Button
                variant={card.featured ? 'primary' : 'outline'}
                onClick={() => handleBuy(card.type)}
                loading={loading === card.type}
                disabled={loading !== null}
                fullWidth
                size="lg"
              >
                {loading === card.type ? 'Redirecting...' : `Buy ${card.name} →`}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-[#6B6B80] mt-8">🔒 Secure payment with Stripe · Your information is protected</p>
      </div>
    </div>
  )
}
