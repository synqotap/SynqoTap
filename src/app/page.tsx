'use client'
import { useEffect } from 'react'
import { Hero, HowItWorks, Products, Demo, FAQ } from '@/components/home'

export default function Home() {
  useEffect(() => {
    const navbar = document.getElementById('navbar')
    const handleScroll = () => {
      if (!navbar) return
      if (window.scrollY > 30) {
        navbar.style.background = 'rgba(7,7,12,0.9)'
        navbar.style.backdropFilter = 'blur(20px)'
        navbar.style.borderBottomColor = '#1C1C2E'
      } else {
        navbar.style.background = 'transparent'
        navbar.style.backdropFilter = 'none'
        navbar.style.borderBottomColor = 'transparent'
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] overflow-x-hidden font-[family-name:var(--font-dm-sans)]">
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between transition-all duration-300"
        style={{ borderBottom: '1px solid transparent' }}
      >
        <a href="/" className="text-xl font-black tracking-tight flex-shrink-0 font-[family-name:var(--font-syne)]">
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#6B6B80]">
          {[['#products', 'Products'], ['#how-it-works', 'How it works'], ['#demo', 'Demo'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
          <a href="/login" className="hover:text-white transition-colors">Login</a>
        </div>
        <a
          href="/checkout"
          className="bg-[#00E5FF] text-[#07070C] font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity font-[family-name:var(--font-syne)]"
        >
          Buy now →
        </a>
      </nav>

      <Hero />
      <HowItWorks />
      <Products />
      <Demo />
      <FAQ />

      {/* CTA */}
      <section className="py-24 sm:py-32 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,255,0.06),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-black text-2xl sm:text-5xl tracking-tight mb-5 leading-tight font-[family-name:var(--font-syne)]">
            Stop handing out<br />forgotten paper cards
          </h2>
          <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-8 sm:mb-10">
            Your next connection deserves a first impression that matches.
          </p>
          <a
            href="/checkout"
            className="bg-[#00E5FF] text-[#07070C] font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base font-[family-name:var(--font-syne)]"
          >
            Start now — from $39 →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E0E16] border-t border-[#1C1C2E] px-5 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="font-black text-xl mb-3 font-[family-name:var(--font-syne)]">Synqo<span className="text-[#00E5FF]">Tap</span></div>
              <p className="text-[#6B6B80] text-sm leading-relaxed">The business card of the future. NFC + unlimited digital profile, one payment.</p>
            </div>
            {[
              { title: 'Product', links: [['Buy PVC', '/checkout'], ['Buy Metal', '/checkout'], ['Business', 'mailto:synqotap@gmail.com'], ['Demo', '/c/synqo-tap-ub9u']] },
              { title: 'Info', links: [['How it works', '#how-it-works'], ['Products', '#products'], ['FAQ', '#faq'], ['Contact', 'mailto:synqotap@gmail.com']] },
              { title: 'Account', links: [['Login', '/login'], ['My profile', '/portal'], ['My orders', '/portal'], ['Support', 'mailto:synqotap@gmail.com']] },
            ].map((col, i) => (
              <div key={i}>
                <div className="font-bold text-sm mb-4 font-[family-name:var(--font-syne)]">{col.title}</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  {col.links.map(([label, href], j) => (
                    <li key={j}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1C1C2E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6B6B80]">
            <span>© 2025 SynqoTap. All rights reserved.</span>
            <span>
              <a href="#" className="hover:text-white transition-colors">Privacy</a> · <a href="#" className="hover:text-white transition-colors">Terms</a>
            </span>
          </div>
        </div>
      </footer>

      {/* Keyframes needed for 3D card shimmer and floating badges in Hero */}
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  )
}
