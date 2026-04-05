'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

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
          <Link
            href="/checkout"
            className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ background: '#00E5FF', color: '#07070C' }}
          >
            Buy now →
          </Link>
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
          <Link
            href="/checkout"
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-center"
            style={{ background: '#00E5FF', color: '#07070C' }}
          >
            Buy now →
          </Link>
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
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#00E5FF', color: '#07070C' }}
            >
              Get my card →
            </Link>
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

// ── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'PVC',
    price: '$39',
    period: 'one-time',
    desc: 'Durable NFC card for professionals who want a clean, effective first impression.',
    features: ['NFC + QR code', 'Unlimited profile updates', 'Custom links & socials', 'Free shipping'],
    cta: 'Buy PVC →',
    href: '/checkout',
    featured: false,
  },
  {
    name: 'Metal',
    price: '$79',
    period: 'one-time',
    desc: 'Premium brushed metal card that makes a statement. Built to last a lifetime.',
    features: ['Everything in PVC', 'Brushed stainless steel', 'Premium engraving', 'Priority shipping'],
    cta: 'Buy Metal →',
    href: '/checkout',
    featured: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    period: 'per team',
    desc: 'Cards for your entire team with centralized management and branded profiles.',
    features: ['Volume pricing', 'Team dashboard', 'Brand customization', 'Dedicated support'],
    cta: 'Contact us →',
    href: 'mailto:synqotap@gmail.com',
    featured: false,
  },
]

function Products() {
  return (
    <section id="products" className="py-24">
      <div className="max-w-6xl mx-auto px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00E5FF' }}>Products</p>
        <h2 className="font-syne font-bold text-4xl lg:text-5xl text-[#F2F2F4] mb-16">
          Choose your card
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {PRODUCTS.map(p => (
            <div
              key={p.name}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: p.featured ? 'linear-gradient(145deg, #0E1A2A 0%, #0E0E16 100%)' : '#0E0E16',
                border: p.featured ? '1px solid rgba(0,229,255,0.35)' : '1px solid #1C1C2E',
              }}
            >
              {p.featured && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                  style={{ background: '#00E5FF', color: '#07070C' }}
                >
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <p className="font-syne font-bold text-sm uppercase tracking-widest text-[#6B6B80] mb-2">{p.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-syne font-bold text-4xl text-[#F2F2F4]">{p.price}</span>
                  <span className="text-sm text-[#6B6B80]">{p.period}</span>
                </div>
              </div>

              <p className="text-sm text-[#6B6B80] leading-relaxed mb-6">{p.desc}</p>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#F2F2F4]">
                    <span style={{ color: '#00E5FF' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={p.href}
                className="text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={
                  p.featured
                    ? { background: '#00E5FF', color: '#07070C' }
                    : { background: '#13131F', color: '#F2F2F4', border: '1px solid #1C1C2E' }
                }
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function DemoProfileCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-xs mx-auto shadow-2xl"
      style={{ background: '#0E0E16', border: '1px solid #1C1C2E' }}
    >
      {/* Cover */}
      <div
        className="h-28 relative"
        style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)' }}
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #0E0E16 100%)' }} />
      </div>

      {/* Avatar */}
      <div className="px-5 -mt-10 pb-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-syne font-bold text-xl border-2 mb-3"
          style={{ background: 'linear-gradient(135deg, #0f3460, #1a1a2e)', borderColor: '#1C1C2E', color: '#F2F2F4' }}
        >
          HV
        </div>

        {/* Save contact */}
        <button
          className="w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-colors"
          style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)' }}
        >
          Save contact
        </button>

        <h3 className="font-syne font-bold text-lg text-[#F2F2F4]">Humberto Villiva</h3>
        <p className="text-sm text-[#6B6B80] mb-1">Tax Advisor</p>
        <p className="text-xs font-semibold mb-5" style={{ color: '#00E5FF' }}>SynqoTap</p>

        {/* Buttons */}
        <div className="flex flex-col gap-2.5">
          {[
            { label: 'Call', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
            { label: 'WhatsApp', bg: 'rgba(37,211,102,0.15)', color: '#25D366' },
            { label: 'Email', bg: 'rgba(99,179,237,0.15)', color: '#63B3ED' },
            { label: 'LinkedIn', bg: 'rgba(10,102,194,0.15)', color: '#0A66C2' },
          ].map(btn => (
            <div
              key={btn.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: btn.bg, color: btn.color, border: `1px solid ${btn.color}33` }}
            >
              <span className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: btn.bg }}>›</span>
              {btn.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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

            <Link
              href="/c/synqo-tap-ub9u"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: '#00E5FF' }}
            >
              View full demo →
            </Link>
          </div>

          {/* Profile card */}
          <DemoProfileCard />
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
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95 relative"
          style={{ background: '#00E5FF', color: '#07070C' }}
        >
          Start now — from $39 →
        </Link>
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
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Products />
        <Demo />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
