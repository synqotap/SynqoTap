const IconCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
  </svg>
)
const IconPencil = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
  </svg>
)
const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
  </svg>
)

const STEPS = [
  { num: '01', icon: <IconCart />, title: 'Choose and buy', desc: 'Select your card and complete payment. Your profile is created automatically.' },
  { num: '02', icon: <IconPencil />, title: 'Customize your profile', desc: 'Upload your logo, add your info and configure your buttons. Changes appear instantly.' },
  { num: '03', icon: <IconBox />, title: 'Receive and use', desc: 'Your card arrives programmed and ready. Hold it to any smartphone and share your contact.' },
]

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 px-5" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Process</div>
          <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4 font-[family-name:var(--font-syne)]">As simple as it should be</h2>
          <p className="text-[#6B6B80] text-base sm:text-lg font-light">From purchase to sharing your contact in less than 48 hours.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-px bg-[#1C1C2E] rounded-2xl overflow-hidden">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-[#0E0E16] p-6 sm:p-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div
                className="font-black mb-4 select-none font-[family-name:var(--font-syne)]"
                style={{ fontSize: '3.5rem', lineHeight: 1, color: 'rgba(0,229,255,0.10)' }}
              >
                {s.num}
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mb-4">
                {s.icon}
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2 font-[family-name:var(--font-syne)]">{s.title}</h3>
              <p className="text-[#6B6B80] text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
