const DEMO_BUTTONS = [
  {
    label: 'Call',
    bg: 'rgba(34,197,94,0.15)', color: '#22C55E',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    bg: 'rgba(37,211,102,0.15)', color: '#25D366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.613l6.058-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.382l-.36-.214-3.732.903.918-3.636-.234-.374A9.818 9.818 0 1112 21.818z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    bg: 'rgba(99,179,237,0.15)', color: '#63B3ED',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    bg: 'rgba(10,102,194,0.15)', color: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
]

export default function Demo() {
  return (
    <section className="py-20 sm:py-24 px-5 bg-[#0E0E16]" id="demo">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Demo</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4 font-[family-name:var(--font-syne)]">This is what your profile looks like</h2>
            <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-6 leading-relaxed">The page that opens when someone taps your card. Elegant, fast, and completely yours to edit anytime.</p>
            <div className="space-y-3 mb-6">
              {['Loads in under 1 second', 'No apps or downloads needed', 'Edit in real time from your portal', 'Your URL: synqotap.com/c/your-name'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="text-[#00E5FF] flex-shrink-0">→</span>{item}
                </div>
              ))}
            </div>
            <a href="/c/synqo-tap-ub9u" target="_blank" className="text-[#00E5FF] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity text-sm sm:text-base">
              View full demo →
            </a>
          </div>

          {/* Profile card replica */}
          <div className="max-w-xs mx-auto w-full rounded-3xl overflow-hidden border border-[#22223A] bg-[#07070C]">
            <div className="h-20 relative overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#1C1C2E 0%,#13131F 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(0,229,255,0.06) 0%,transparent 70%)' }} />
            </div>
            <div className="px-5 flex items-end justify-between" style={{ marginTop: '-36px', position: 'relative', zIndex: 1 }}>
              <div
                className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-black text-xl text-white flex-shrink-0 font-[family-name:var(--font-syne)]"
                style={{ background: 'linear-gradient(135deg,#00E5FF,#7B61FF)', border: '3px solid #07070C', position: 'relative', zIndex: 2 }}
              >
                AR
              </div>
              <div className="mb-1 inline-flex items-center gap-1.5 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-2 rounded-full font-[family-name:var(--font-syne)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Save contact
              </div>
            </div>
            <div className="px-5 pt-3 pb-3">
              <div className="font-black text-lg mb-0.5 font-[family-name:var(--font-syne)]">Alex Rivera</div>
              <div className="text-sm font-medium mb-0.5 text-[#00E5FF]">CEO & Founder</div>
              <div className="text-sm text-[#6B6B80]">TechCorp Solutions</div>
            </div>
            <div className="border-t border-[#1C1C2E] mx-5" />
            <div className="px-5 py-4 space-y-2">
              {DEMO_BUTTONS.map((btn, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-2xl px-3 py-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: btn.bg, color: btn.color }}
                  >
                    {btn.icon}
                  </div>
                  <span className="text-sm font-medium flex-1">{btn.label}</span>
                  <span className="text-[#6B6B80] text-lg">›</span>
                </div>
              ))}
            </div>
            <div className="text-center pb-4 text-xs text-[#6B6B80]">Created with <span className="text-[#00E5FF]">SynqoTap</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
