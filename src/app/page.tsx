'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ── Stripe checkout ──────────────────────────────────────────────────────────

async function handleBuy(cardType: 'pvc' | 'metal') {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardType, quantity: 1 }),
  })
  const data = await res.json()
  if (data.url) window.location.href = data.url
}

// ── Types ─────────────────────────────────────────────────────────────────────

type DynamicPrices = {
  prices: { pvc: number | null; metal: number | null }
}

type ActiveDiscount = {
  code: string
  description: string | null
  stripe_coupon_id: string | null
  value: number
  type: string
}

// ── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(7,7,12,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #1C1C2E' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-syne text-xl font-bold tracking-tight text-[#F2F2F4]">
          Synqo<span style={{ color: '#00E5FF' }}>Tap</span>
        </Link>

        {/* Center links – desktop */}
        <div className="hidden md:flex items-center gap-8">
          {(['Products', 'How it works', 'Demo', 'FAQ'] as const).map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/portal" className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">
            Login
          </Link>
          <a
            href="/#products"
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#00E5FF', color: '#07070C' }}
          >
            Buy now →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#F2F2F4] transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#F2F2F4] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#F2F2F4] transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1C1C2E] px-5 py-4 flex flex-col gap-4" style={{ background: 'rgba(7,7,12,0.97)' }}>
          {(['Products', 'How it works', 'Demo', 'FAQ'] as const).map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-[#F2F2F4]"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
          <hr style={{ borderColor: '#1C1C2E' }} />
          <Link href="/portal" className="text-sm text-[#6B6B80]">Login</Link>
          <a
            href="/#products"
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-center"
            style={{ background: '#00E5FF', color: '#07070C' }}
          >
            Buy now →
          </a>
        </div>
      )}
    </nav>
  )
}

// ── Hero 3D Card ─────────────────────────────────────────────────────────────

function HeroCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)
      setRot({ x: -dy * 14, y: dx * 14 })
    })
  }, [])

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    setRot({ x: 0, y: 0 })
  }, [])

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: '900px' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Glow behind */}
      <div
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00E5FF 0%, transparent 70%)' }}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-72 h-44 rounded-2xl overflow-hidden select-none cursor-pointer"
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: rot.x === 0 && rot.y === 0 ? 'transform 0.6s ease' : 'transform 0.1s ease',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '1px solid rgba(0,229,255,0.2)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.08)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 animate-shimmer pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)',
          }}
        />

        {/* Gold chip */}
        <div
          className="absolute top-5 left-5 w-10 h-7 rounded-md"
          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f5d060 40%, #a8851f 100%)' }}
        >
          <div className="absolute inset-0 grid grid-cols-3 gap-px p-0.5 opacity-60">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-[1px]" style={{ background: 'rgba(0,0,0,0.3)' }} />
            ))}
          </div>
        </div>

        {/* NFC icon */}
        <div className="absolute top-5 right-5 opacity-40">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5">
            <path d="M20 12a8 8 0 0 1-8 8" strokeLinecap="round" />
            <path d="M17 12a5 5 0 0 1-5 5" strokeLinecap="round" />
            <path d="M14 12a2 2 0 0 1-2 2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Name / title */}
        <div className="absolute bottom-5 left-5">
          <p className="font-syne font-bold text-base text-[#F2F2F4] tracking-wide">ALEX RIVERA</p>
          <p className="text-xs text-[#6B6B80] mt-0.5 tracking-widest uppercase">CEO · TechCorp</p>
        </div>

        {/* SynqoTap watermark */}
        <div className="absolute bottom-5 right-5 font-syne text-xs font-bold" style={{ color: '#00E5FF', opacity: 0.6 }}>
          SynqoTap
        </div>
      </div>

      {/* Floating badge: Profile updated */}
      <div
        className="absolute -top-3 -right-4 animate-float flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{
          background: 'rgba(0,229,255,0.1)',
          border: '1px solid rgba(0,229,255,0.25)',
          color: '#00E5FF',
          animationDelay: '0s',
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
        Profile updated
      </div>

      {/* Floating badge: NFC active */}
      <div
        className="absolute -bottom-3 -left-4 animate-float flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{
          background: 'rgba(123,97,255,0.1)',
          border: '1px solid rgba(123,97,255,0.3)',
          color: '#A78BFA',
          animationDelay: '1.5s',
        }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: '#7B61FF' }} />
        NFC active
      </div>
    </div>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full mb-8 text-xs font-medium"
            style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#00E5FF' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]" />
            </span>
            NFC Technology
          </div>

          {/* H1 */}
          <h1 className="font-syne font-bold text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-6 text-[#F2F2F4]">
            Share your contact<br />
            with a single{' '}
            <span style={{ color: '#00E5FF' }}>tap</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#6B6B80] text-lg leading-relaxed mb-10 max-w-md">
            One NFC card. Your entire professional identity — phone, email, socials, links — all shared instantly. No app required.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-14">
            <a
              href="/#products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#00E5FF', color: '#07070C' }}
            >
              Get my card →
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:bg-white/5"
              style={{ border: '1px solid #1C1C2E', color: '#F2F2F4' }}
            >
              Watch live demo ▶
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { value: '3s', label: 'to share' },
              { value: '∞', label: 'updates' },
              { value: '24h', label: 'support' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-syne font-bold text-2xl" style={{ color: '#00E5FF' }}>{stat.value}</p>
                <p className="text-xs text-[#6B6B80] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="hidden lg:flex justify-center items-center">
          <HeroCard />
        </div>
      </div>
    </section>
  )
}

// ── How it works ─────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    title: 'Choose and buy',
    desc: 'Pick the card that fits your style — PVC or premium Metal. Ships to your door.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Customize',
    desc: 'Set up your profile, add your links and social handles. Change it anytime.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Receive and use',
    desc: 'Tap your card to any phone. Your full profile opens instantly — no app, no friction.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-6xl mx-auto px-5">
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E5FF' }}>Process</p>
        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-16">
          As simple as it<br />should be
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {HOW_STEPS.map(step => (
            <div
              key={step.num}
              className="relative rounded-2xl p-7 group"
              style={{ background: '#0E0E16', border: '1px solid #1C1C2E' }}
            >
              {/* Large step number */}
              <p
                className="font-syne font-bold text-7xl leading-none mb-6 select-none"
                style={{ color: 'rgba(0,229,255,0.07)' }}
              >
                {step.num}
              </p>

              {/* Icon box */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF' }}
              >
                {step.icon}
              </div>

              <h3 className="font-syne font-bold text-lg text-[#F2F2F4] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6B6B80] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Discount Popup ────────────────────────────────────────────────────────────

function DiscountPopup({ discount, onClose }: { discount: ActiveDiscount; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const isAutomatic = !discount.code

  function copyCode() {
    navigator.clipboard.writeText(discount.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div className="relative bg-[#0E0E16] border border-[#00E5FF]/30 rounded-2xl p-8 max-w-sm w-full mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B6B80] hover:text-[#F2F2F4] text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <div className="text-5xl text-center mb-4">🎉</div>
        <h3 className="font-syne font-black text-2xl text-[#F2F2F4] text-center mb-3">Special offer</h3>
        {discount.description && (
          <p className="text-[#6B6B80] text-sm text-center mb-6">{discount.description}</p>
        )}
        {!isAutomatic && (
          <>
            <div className="bg-[#07070C] border border-[#00E5FF]/30 rounded-xl px-4 py-3 font-mono text-xl text-[#00E5FF] font-bold text-center mb-3">
              {discount.code}
            </div>
            <button
              onClick={copyCode}
              className="w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-colors"
              style={{
                background: copied ? 'rgba(0,229,255,0.15)' : 'rgba(0,229,255,0.08)',
                color: '#00E5FF',
                border: '1px solid rgba(0,229,255,0.2)',
              }}
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </>
        )}
        <a
          href="/#products"
          onClick={onClose}
          className="block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: '#00E5FF', color: '#07070C' }}
        >
          Shop now →
        </a>
      </div>
    </div>
  )
}

// ── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'PVC',
    price: '$39',
    period: 'one-time',
    desc: 'Durable NFC card for professionals who want a clean, effective first impression.',
    features: ['NFC + QR code', 'Unlimited profile updates', 'Custom links & socials', 'Free shipping'],
    cta: 'Buy PVC →',
    cardType: 'pvc' as const,
    featured: false,
  },
  {
    name: 'Metal',
    price: '$79',
    period: 'one-time',
    desc: 'Premium brushed metal card that makes a statement. Built to last a lifetime.',
    features: ['Everything in PVC', 'Brushed stainless steel', 'Premium engraving', 'Priority shipping'],
    cta: 'Buy Metal →',
    cardType: 'metal' as const,
    featured: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    period: 'per team',
    desc: 'Cards for your entire team with centralized management and branded profiles.',
    features: ['Volume pricing', 'Team dashboard', 'Brand customization', 'Dedicated support'],
    cta: 'Contact us →',
    cardType: null,
    featured: false,
  },
]

function Products({ dp, activeDiscount }: { dp?: DynamicPrices; activeDiscount?: ActiveDiscount | null }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const carouselRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = carouselRef.current
    const card = cardRefs.current[1]
    if (!el || !card) return
    const target = card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2
    el.scrollLeft = target
  }, [])

  function onCarouselScroll() {
    const el = carouselRef.current
    if (!el) return
    // Center of the visible viewport within the scroll container
    const center = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - cardCenter)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActiveIndex(closest)
  }

  function scrollToCard(i: number) {
    const el = carouselRef.current
    const card = cardRefs.current[i]
    if (!el || !card) return
    const target = card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  return (
    <section id="products" className="py-24">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E5FF' }}>Products</p>
        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-16">
          Choose your card
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(p => (
            <ProductCard key={p.name} p={p} dp={dp} activeDiscount={activeDiscount} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            onScroll={onCarouselScroll}
            className="flex overflow-x-auto pb-6 scrollbar-hide scroll-smooth"
            style={{ perspective: '1000px' }}
          >
            {/* leading spacer so first card centers */}
            <div className="shrink-0 w-[19vw]" />
            {PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                ref={el => { cardRefs.current[i] = el }}
                className="shrink-0 w-[62vw] max-w-[240px] -mx-4 transition-all duration-300 ease-out"
                style={{
                  zIndex: activeIndex === i ? 10 : 0,
                  opacity: activeIndex === i ? 1 : 0.5,
                  transform: activeIndex === i ? 'scale(1)' : 'scale(0.90)',
                  pointerEvents: activeIndex === i ? 'auto' : 'none',
                }}
              >
                <MobileProductCard p={p} dp={dp} activeDiscount={activeDiscount} />
              </div>
            ))}
            {/* trailing spacer */}
            <div className="shrink-0 w-[19vw]" />
          </div>

          {/* Label indicators */}
          <div className="flex justify-center gap-6 mt-2">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.name}
                onClick={() => scrollToCard(i)}
                className="text-xs font-bold font-syne transition-colors duration-200"
                style={{ color: activeIndex === i ? '#00E5FF' : '#3A3A50' }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const MOBILE_CARD_ICONS: Record<string, string> = {
  PVC: '💳',
  Metal: '⚡',
  Business: '🏢',
}

function MobileProductCard({ p, dp, activeDiscount }: { p: typeof PRODUCTS[number]; dp?: DynamicPrices; activeDiscount?: ActiveDiscount | null }) {
  const key = p.cardType as 'pvc' | 'metal' | null
  const currentPrice = key && dp ? dp.prices[key] : null
  const isLoading = key !== null && currentPrice == null
  const isAutoDiscount = !!(activeDiscount && key && currentPrice != null)
  const autoDiscountedPrice = isAutoDiscount
    ? activeDiscount!.type === 'percentage'
      ? Math.round(currentPrice! * (1 - activeDiscount!.value / 100) * 100) / 100
      : currentPrice! - activeDiscount!.value
    : null


  return (
    <div className="relative pt-5">
      {p.featured && (
        <div
          className="absolute top-0 left-1/2 bg-[#00E5FF] text-[#07070C] font-bold text-xs px-4 py-1.5 rounded-full font-syne whitespace-nowrap"
          style={{ transform: 'translateX(-50%)', zIndex: 20 }}
        >
          Most popular
        </div>
      )}
      <div
        className={`flex flex-col items-center p-5 rounded-2xl ${p.featured ? 'min-h-110' : 'min-h-105'}`}
        style={{
          background: p.featured ? 'linear-gradient(145deg, #0E1A2A 0%, #0E0E16 100%)' : '#0E0E16',
          border: p.featured ? '1px solid #00E5FF' : '1px solid #1C1C2E',
          boxShadow: p.featured ? '0 0 30px rgba(0,229,255,0.15)' : 'none',
        }}
      >
        {/* Icon */}
        <div className="text-3xl mb-3">{MOBILE_CARD_ICONS[p.name] ?? '💳'}</div>

        {/* Name */}
        <p className="font-syne font-black text-lg text-[#F2F2F4] mb-3 text-center">{p.name}</p>

        {/* Price */}
        <div className="text-center mb-4">
          {isLoading ? (
            <div className="h-12 w-24 bg-[#1C1C2E] rounded-lg animate-pulse mx-auto" />
          ) : key === null ? (
            <p className="font-syne font-black text-4xl text-[#F2F2F4]">{p.price}</p>
          ) : autoDiscountedPrice != null ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg text-[#6B6B80] line-through">${currentPrice}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {activeDiscount!.description ?? 'Special offer'}
                </span>
              </div>
              <p className="font-syne font-black text-5xl text-[#00E5FF]">${autoDiscountedPrice}</p>
            </>
          ) : (
            <p className="font-syne font-black text-4xl text-[#F2F2F4]">${currentPrice}</p>
          )}
          <p className="text-xs text-[#6B6B80] mt-0.5">USD · one-time</p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#1C1C2E] mb-4" />

        {/* Features */}
        <ul className="flex flex-col gap-2 w-full flex-1 mb-5">
          {p.features.slice(0, 3).map(f => (
            <li key={f} className="flex items-start gap-2 text-xs text-[#F2F2F4]">
              <span className="shrink-0" style={{ color: '#00E5FF' }}>✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* Button */}
        {p.cardType ? (
          <button
            onClick={() => handleBuy(p.cardType!)}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer"
            style={
              p.featured
                ? { background: '#00E5FF', color: '#07070C' }
                : { background: '#13131F', color: '#F2F2F4', border: '1px solid #1C1C2E' }
            }
          >
            {p.cta}
          </button>
        ) : (
          <a
            href="mailto:synqotap@gmail.com"
            className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-all duration-200 active:scale-95 block"
            style={{ background: '#13131F', color: '#F2F2F4', border: '1px solid #1C1C2E' }}
          >
            {p.cta}
          </a>
        )}
      </div>
    </div>
  )
}

function ProductCard({ p, compact = false, dp, activeDiscount }: { p: typeof PRODUCTS[number]; compact?: boolean; dp?: DynamicPrices; activeDiscount?: ActiveDiscount | null }) {
  const visibleFeatures = compact ? p.features.slice(0, 3) : p.features
  const key = p.cardType as 'pvc' | 'metal' | null
  const currentPrice = key && dp ? dp.prices[key] : null
  const isLoading = key !== null && currentPrice == null
  const isAutoDiscount = !!(activeDiscount && key && currentPrice != null)
  const autoDiscountedPrice = isAutoDiscount
    ? activeDiscount!.type === 'percentage'
      ? Math.round(currentPrice! * (1 - activeDiscount!.value / 100) * 100) / 100
      : currentPrice! - activeDiscount!.value
    : null


  return (
    <div
      className={`relative rounded-2xl flex flex-col ${compact ? 'p-5' : 'p-7'}`}
      style={{
        background: p.featured ? 'linear-gradient(145deg, #0E1A2A 0%, #0E0E16 100%)' : '#0E0E16',
        border: p.featured ? '1px solid rgba(0,229,255,0.35)' : '1px solid #1C1C2E',
      }}
    >
      {p.featured && (
        <div className="text-center mb-3">
          <span className="bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full font-syne">
            Most popular
          </span>
        </div>
      )}

      <div className={compact ? 'mb-4' : 'mb-6'}>
        <p className="font-syne font-bold text-sm uppercase tracking-widest text-[#6B6B80] mb-2">{p.name}</p>
        {isLoading ? (
          <div className="h-12 w-24 bg-[#1C1C2E] rounded-lg animate-pulse" />
        ) : key === null ? (
          <div className="flex items-baseline gap-1.5">
            <span className={`font-syne font-bold text-[#F2F2F4] ${compact ? 'text-3xl' : 'text-4xl'}`}>{p.price}</span>
            <span className="text-sm text-[#6B6B80]">{p.period}</span>
          </div>
        ) : autoDiscountedPrice != null ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg text-[#6B6B80] line-through">${currentPrice}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                {activeDiscount!.description ?? 'Special offer'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-syne font-black text-[#00E5FF] ${compact ? 'text-3xl' : 'text-5xl'}`}>${autoDiscountedPrice}</span>
              <span className="text-sm text-[#6B6B80]">{p.period}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1.5">
            <span className={`font-syne font-bold text-[#F2F2F4] ${compact ? 'text-3xl' : 'text-4xl'}`}>${currentPrice}</span>
            <span className="text-sm text-[#6B6B80]">{p.period}</span>
          </div>
        )}
      </div>

      <p className={`text-sm text-[#6B6B80] leading-relaxed ${compact ? 'mb-4' : 'mb-6'}`}>{p.desc}</p>

      <ul className={`flex flex-col gap-2.5 flex-1 ${compact ? 'mb-5' : 'mb-8'}`}>
        {visibleFeatures.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-[#F2F2F4]">
            <span style={{ color: '#00E5FF' }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {p.cardType ? (
        <button
          onClick={() => handleBuy(p.cardType!)}
          className="text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
          style={
            p.featured
              ? { background: '#00E5FF', color: '#07070C' }
              : { background: '#13131F', color: '#F2F2F4', border: '1px solid #1C1C2E' }
          }
        >
          {p.cta}
        </button>
      ) : (
        <a
          href="mailto:synqotap@gmail.com"
          className="text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ background: '#13131F', color: '#F2F2F4', border: '1px solid #1C1C2E' }}
        >
          {p.cta}
        </a>
      )}
    </div>
  )
}

// ── Demo ─────────────────────────────────────────────────────────────────────

const DEMO_FEATURES = [
  'Custom profile with your photo and bio',
  'Tap to call, WhatsApp, email directly',
  'One-tap Save Contact to phone',
  'Links to all your social profiles',
  'Real-time updates — edit anytime',
  'Works on any iPhone or Android',
]


function Demo() {
  return (
    <section id="demo" className="py-24">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E5FF' }}>Demo</p>
        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-16">
          This is what your<br />profile looks like
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Feature list */}
          <div>
            <ul className="flex flex-col gap-5 mb-10">
              {DEMO_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-base shrink-0 mt-0.5" style={{ color: '#00E5FF' }}>→</span>
                  <span className="text-[#6B6B80] text-base leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile card mockup */}
          <div className="flex flex-col gap-4">
            <div className="max-w-xs mx-auto w-full rounded-3xl overflow-hidden border border-[#22223A]" style={{background:'#07070C'}}>
              {/* Cover */}
              <div className="h-20 relative overflow-hidden">
                <div className="absolute inset-0" style={{background:'linear-gradient(180deg,#1C1C2E 0%,#13131F 100%)'}}/>
                <div className="absolute inset-0" style={{background:'radial-gradient(ellipse at 50% 0%,rgba(0,229,255,0.06) 0%,transparent 70%)'}}/>
              </div>
              {/* Avatar + Save contact */}
              <div className="px-5 flex items-end justify-between" style={{marginTop:'-36px',position:'relative',zIndex:1}}>
                <div className="w-18 h-18 rounded-full flex items-center justify-center font-black text-xl text-white font-syne shrink-0" style={{background:'linear-gradient(135deg,#00E5FF,#7B61FF)',border:'3px solid #07070C',position:'relative',zIndex:2}}>
                  HV
                </div>
                <div className="mb-1 inline-flex items-center gap-1.5 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-2 rounded-full font-syne">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Save contact
                </div>
              </div>
              {/* Info */}
              <div className="px-5 pt-3 pb-3">
                <div className="font-black text-lg mb-0.5 font-syne">Humberto Villiva</div>
                <div className="text-sm font-medium mb-0.5" style={{color:'#00E5FF'}}>Tax Advisor</div>
                <div className="text-sm text-[#6B6B80]">SynqoTap</div>
              </div>
              {/* Divider */}
              <div className="border-t border-[#1C1C2E] mx-5"/>
              {/* Buttons */}
              <div className="px-5 py-4 space-y-2">
                {[
                  {label:'Call', bg:'rgba(34,197,94,0.15)', color:'#22C55E', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>},
                  {label:'WhatsApp', bg:'rgba(37,211,102,0.15)', color:'#25D366', icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.613l6.058-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.382l-.36-.214-3.732.903.918-3.636-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>},
                  {label:'Email', bg:'rgba(99,179,237,0.15)', color:'#63B3ED', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>},
                  {label:'LinkedIn', bg:'rgba(10,102,194,0.15)', color:'#0A66C2', icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>},
                ].map((btn,i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-2xl px-3 py-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:btn.bg,color:btn.color}}>{btn.icon}</div>
                    <span className="text-sm font-medium flex-1">{btn.label}</span>
                    <span className="text-[#6B6B80] text-lg">›</span>
                  </div>
                ))}
              </div>
              <div className="text-center pb-4 text-xs text-[#6B6B80]">Created with <span style={{color:'#00E5FF'}}>SynqoTap</span></div>
            </div>

            <Link
              href="/c/synqo-tap-ub9u"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors self-center"
              style={{ color: '#00E5FF' }}
            >
              View full demo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does the NFC card work?',
    a: 'You tap your SynqoTap card against the back of any smartphone (iPhone or Android). The phone detects the NFC chip and instantly opens your digital profile in the browser — no app download required.',
  },
  {
    q: 'Can I update my profile after receiving the card?',
    a: 'Yes, unlimited times. Your card always points to the same link, but you control what appears there. Change your phone number, add new socials, update your job title — it reflects immediately.',
  },
  {
    q: 'What happens if someone has NFC disabled?',
    a: 'Every SynqoTap card also includes a QR code. Anyone can scan it with their camera app to open your profile, making it a universal solution regardless of settings.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard PVC cards ship within 3–5 business days. Metal cards take 5–7 business days due to the production process. We offer priority shipping for Metal orders.',
  },
  {
    q: 'Is there a monthly fee?',
    a: 'No. SynqoTap is a one-time purchase. You pay once for your card and get lifetime access to your digital profile with unlimited updates. No subscriptions, no hidden fees.',
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-center" style={{ color: '#00E5FF' }}>FAQ</p>
        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-16 text-center">
          Everything you need<br />to know
        </h2>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{ background: '#0E0E16', border: open === i ? '1px solid rgba(0,229,255,0.3)' : '1px solid #1C1C2E' }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-sm text-[#F2F2F4] pr-4">{item.q}</span>
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-300"
                  style={{
                    background: open === i ? 'rgba(0,229,255,0.1)' : '#13131F',
                    color: open === i ? '#00E5FF' : '#6B6B80',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#6B6B80] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24 px-5">
      <div
        className="max-w-4xl mx-auto rounded-3xl px-8 py-16 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0E1A2A 0%, #0E0E16 100%)', border: '1px solid rgba(0,229,255,0.2)' }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.12) 0%, transparent 70%)' }}
        />

        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-4 relative">
          Stop handing out<br />forgotten paper cards
        </h2>
        <p className="text-[#6B6B80] mb-10 text-lg relative">One tap. Every detail. Always up to date.</p>
        <a
          href="/#products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95 relative"
          style={{ background: '#00E5FF', color: '#07070C' }}
        >
          Start Now
        </a>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t py-16 px-5" style={{ borderColor: '#1C1C2E' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-syne font-bold text-xl mb-3">
              Synqo<span style={{ color: '#00E5FF' }}>Tap</span>
            </p>
            <p className="text-sm text-[#6B6B80] leading-relaxed">
              NFC smart business cards for modern professionals.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3A3A50] mb-4">Product</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'PVC Card', href: '/checkout' },
                { label: 'Metal Card', href: '/checkout' },
                { label: 'Business', href: 'mailto:synqotap@gmail.com' },
                { label: 'Demo', href: '/c/synqo-tap-ub9u' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3A3A50] mb-4">Info</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'How it works', href: '#how-it-works' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: 'mailto:synqotap@gmail.com' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3A3A50] mb-4">Account</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Login', href: '/portal' },
                { label: 'My profile', href: '/portal' },
                { label: 'Order status', href: '/portal' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: '1px solid #1C1C2E' }}>
          <p className="text-xs text-[#3A3A50]">© {new Date().getFullYear()} SynqoTap. All rights reserved.</p>
          <p className="text-xs text-[#3A3A50]">Made for modern professionals.</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [dp, setDp] = useState<DynamicPrices>({
    prices: { pvc: null, metal: null },
  })
  const [activeDiscount, setActiveDiscount] = useState<ActiveDiscount | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  function closePopup() {
    setShowPopup(false)
  }

  useEffect(() => {
    async function fetchPricesAndDiscounts() {
      const supabase = createClient()

      const { data: pricesData } = await supabase.from('prices').select('*')
      if (pricesData) {
        const rows = pricesData as any[]
        const pvc = rows.find(r => r.card_type === 'pvc')
        const metal = rows.find(r => r.card_type === 'metal')
        setDp(prev => ({
          prices: {
            pvc: pvc ? pvc.price : prev.prices.pvc,
            metal: metal ? metal.price : prev.prices.metal,
          },
        }))
      }

      const { data: discountData } = await supabase
        .from('discounts')
        .select('code, description, stripe_coupon_id, value, type')
        .eq('is_active', true)
        .eq('show_on_home', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (discountData) {
        setActiveDiscount(discountData)
        setShowPopup(true)
      }
    }
    fetchPricesAndDiscounts()
  }, [])

  return (
    <>
      <Nav />
      {showPopup && activeDiscount && (
        <DiscountPopup discount={activeDiscount} onClose={closePopup} />
      )}
      <main>
        <Hero />
        <HowItWorks />
        <Products dp={dp} activeDiscount={activeDiscount} />
        <Demo />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
