'use client'
import { useRef, useEffect } from 'react'

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || window.innerWidth < 768) return
      const rx = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * -8
      const ry = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const handleMouseLeave = () => {
      if (card) card.style.transform = 'rotateY(-15deg) rotateX(5deg)'
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center pt-24 pb-16 px-5">
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              NFC Technology
            </div>
            <h1 className="font-black leading-tight tracking-tighter mb-6 text-[clamp(2rem,6vw,4.25rem)] font-[family-name:var(--font-syne)]">
              Share your contact<br />with a single <span className="text-[#00E5FF]">tap</span>
            </h1>
            <p className="text-[#6B6B80] text-base sm:text-lg leading-relaxed mb-8 font-light max-w-md">
              A physical card with an NFC chip connected to your digital profile. No apps, no friction. Your complete contact, always up to date.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="/checkout"
                className="bg-[#00E5FF] text-[#07070C] font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base font-[family-name:var(--font-syne)]"
              >
                Get my card →
              </a>
              <a
                href="#demo"
                className="text-white/70 inline-flex items-center gap-2 hover:text-white transition-colors py-3.5 text-sm sm:text-base"
              >
                Watch live demo ▶
              </a>
            </div>
            <div className="flex gap-6 sm:gap-10 pt-8 border-t border-[#1C1C2E]">
              {[['3s', 'To share contact'], ['∞', 'Free updates'], ['24h', 'Profile active after purchase']].map(([val, label]) => (
                <div key={val}>
                  <div className="text-2xl font-black font-[family-name:var(--font-syne)]">{val}</div>
                  <div className="text-xs text-[#6B6B80] leading-tight mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Card */}
          <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96" style={{ perspective: '1000px' }}>
            <div
              ref={cardRef}
              className="w-64 sm:w-72 h-40 sm:h-44 rounded-2xl relative overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg,#12122A,#1A1A38,#0E0E20)',
                border: '1px solid rgba(0,229,255,0.25)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                transform: 'rotateY(-15deg) rotateX(5deg)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
              }}
            >
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%,rgba(0,229,255,0.12),transparent 60%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)', animation: 'shimmer 3s infinite' }} />
              <div className="absolute top-7 left-6 w-9 h-6 rounded-md" style={{ background: 'linear-gradient(135deg,#C8A04B,#E8C87A,#B8903C)' }} />
              <div className="absolute bottom-8 left-6 font-bold text-sm tracking-widest text-white font-[family-name:var(--font-syne)]">ALEX RIVERA</div>
              <div className="absolute bottom-3 left-6 text-xs text-white/40 tracking-widest uppercase">CEO · TECHCORP</div>
            </div>
            <div className="absolute top-2 right-0 sm:right-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] flex-shrink-0" />
              <span className="text-[#6B6B80]">Profile updated</span>
            </div>
            <div className="absolute bottom-6 left-0 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{ animation: 'float 4s ease-in-out infinite 1.5s' }}>
              <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
              <span className="text-[#6B6B80]">NFC active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
