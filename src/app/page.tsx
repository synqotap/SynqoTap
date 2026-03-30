'use client'
import { useEffect, useRef, useState } from 'react'

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
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
  </svg>
)
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
  </svg>
)
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
  </svg>
)

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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

    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || window.innerWidth < 768) return
      const rx = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * -8
      const ry = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', () => {
      if (card) card.style.transform = 'rotateY(-15deg) rotateX(5deg)'
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const faqs = [
    {q:'Do I need an app to use the card?',a:'No. Your card works with the phone\'s native NFC. The person scanning you only needs their smartphone — no download required.'},
    {q:'Can I update my profile later?',a:'Yes, as many times as you want at no extra cost. Change your number, email, or title — updates reflect in real time.'},
    {q:'How long does shipping take?',a:'We program and ship in 1-3 business days. Delivery in 5-10 business days to the US and Latin America.'},
    {q:'What if I lose my card?',a:'Your profile stays active. Buy a replacement card and it will be programmed with the same profile URL.'},
    {q:'Does it work with iPhones and Android?',a:'Yes. NFC works on iPhones from model 7 (iOS 14+) and on virtually all Android phones since 2015.'},
  ]

  const steps = [
    {num:'01', icon:<IconCart/>, title:'Choose and buy', desc:'Select your card and complete payment. Your profile is created automatically.'},
    {num:'02', icon:<IconPencil/>, title:'Customize your profile', desc:'Upload your logo, add your info and configure your buttons. Changes appear instantly.'},
    {num:'03', icon:<IconBox/>, title:'Receive and use', desc:'Your card arrives programmed and ready. Hold it to any smartphone and share your contact.'},
  ]

  const demoButtons = [
    {icon:<IconPhone/>, label:'Call'},
    {icon:<IconChat/>, label:'WhatsApp'},
    {icon:<IconMail/>, label:'Email'},
    {icon:<IconBriefcase/>, label:'LinkedIn'},
  ]

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] overflow-x-hidden" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between transition-all duration-300" style={{borderBottom:'1px solid transparent'}}>
        <a href="/" className="text-xl font-black tracking-tight flex-shrink-0" style={{fontFamily:"'Syne',sans-serif"}}>
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#6B6B80]">
          {[['#products','Products'],['#how-it-works','How it works'],['#demo','Demo'],['#pricing','Pricing'],['#faq','FAQ']].map(([href,label]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
          <a href="/login" className="hover:text-white transition-colors">Login</a>
        </div>
        <a href="/checkout?plan=pvc" className="bg-[#00E5FF] text-[#07070C] font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity" style={{fontFamily:"'Syne',sans-serif"}}>
          Buy now →
        </a>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16 px-5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"/>
                NFC Technology
              </div>
              <h1 className="font-black leading-tight tracking-tighter mb-6 text-[clamp(2rem,6vw,4.25rem)]" style={{fontFamily:"'Syne',sans-serif"}}>
                Share your contact<br/>with a single <span className="text-[#00E5FF]">tap</span>
              </h1>
              <p className="text-[#6B6B80] text-base sm:text-lg leading-relaxed mb-8 font-light max-w-md">
                A physical card with an NFC chip connected to your digital profile. No apps, no friction. Your complete contact, always up to date.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <a href="/checkout?plan=pvc" className="bg-[#00E5FF] text-[#07070C] font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base" style={{fontFamily:"'Syne',sans-serif"}}>
                  Get my card →
                </a>
                <a href="#demo" className="text-white/70 inline-flex items-center gap-2 hover:text-white transition-colors py-3.5 text-sm sm:text-base">
                  Watch live demo ▶
                </a>
              </div>
              <div className="flex gap-6 sm:gap-10 pt-8 border-t border-[#1C1C2E]">
                {[['3s','To share contact'],['∞','Free updates'],['24h','Profile active after purchase']].map(([val,label]) => (
                  <div key={val}>
                    <div className="text-2xl font-black" style={{fontFamily:"'Syne',sans-serif"}}>{val}</div>
                    <div className="text-xs text-[#6B6B80] leading-tight mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D CARD */}
            <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96" style={{perspective:'1000px'}}>
              <div ref={cardRef} className="w-64 sm:w-72 h-40 sm:h-44 rounded-2xl relative overflow-hidden cursor-pointer" style={{background:'linear-gradient(135deg,#12122A,#1A1A38,#0E0E20)',border:'1px solid rgba(0,229,255,0.25)',boxShadow:'0 40px 80px rgba(0,0,0,0.6)',transform:'rotateY(-15deg) rotateX(5deg)',transformStyle:'preserve-3d',transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)'}}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 50%,rgba(0,229,255,0.12),transparent 60%)'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)',animation:'shimmer 3s infinite'}}/>
                <div className="absolute top-7 left-6 w-9 h-6 rounded-md" style={{background:'linear-gradient(135deg,#C8A04B,#E8C87A,#B8903C)'}}/>
                <div className="absolute bottom-8 left-6 font-bold text-sm tracking-widest text-white" style={{fontFamily:"'Syne',sans-serif"}}>ALEX RIVERA</div>
                <div className="absolute bottom-3 left-6 text-xs text-white/40 tracking-widest uppercase">CEO · TECHCORP</div>
              </div>
              <div className="absolute top-2 right-0 sm:right-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{animation:'float 4s ease-in-out infinite'}}>
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] flex-shrink-0"/><span className="text-[#6B6B80]">Profile updated</span>
              </div>
              <div className="absolute bottom-6 left-0 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{animation:'float 4s ease-in-out infinite 1.5s'}}>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0"/><span className="text-[#6B6B80]">NFC active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24 px-5" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Process</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne',sans-serif"}}>As simple as it should be</h2>
            <p className="text-[#6B6B80] text-base sm:text-lg font-light">From purchase to sharing your contact in less than 48 hours.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-[#1C1C2E] rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <div key={i} className="bg-[#0E0E16] p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                {/* Step number — visible but decorative */}
                <div
                  className="font-black text-5xl sm:text-6xl mb-4 select-none"
                  style={{fontFamily:"'Syne',sans-serif", color:'rgba(0,229,255,0.08)', lineHeight:1}}
                >
                  {s.num}
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{s.title}</h3>
                <p className="text-[#6B6B80] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 sm:py-24 px-5" id="products">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Products</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne',sans-serif"}}>Choose your card</h2>
            <p className="text-[#6B6B80] text-base sm:text-lg font-light">Two materials, same power. Both include unlimited digital profile.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {icon:'💳',name:'PVC Card',desc:'Light, durable and elegant. Perfect for everyday networking.',price:'39',featured:false,
                features:['Programmed NFC chip','Unlimited digital profile','Real-time updates','Custom URL','3 design templates'],
                btn:'Buy PVC →',href:'/checkout?plan=pvc'},
              {icon:'⚡',name:'Metal Card',desc:'Stainless steel finish. A first impression that won\'t be forgotten.',price:'79',featured:true,
                features:['Everything in PVC','Premium stainless steel','Matte or mirror finish','Laser engraving included','Presentation case'],
                btn:'Buy Metal →',href:'/checkout?plan=metal'},
              {icon:'🏢',name:'Business',desc:'Volume for teams. Discounts starting at 10 units.',price:null,featured:false,
                features:['Orders from 10 units','Volume discounts','Corporate branding','Centralized management','Dedicated support'],
                btn:'Contact us →',href:'mailto:synqotap@gmail.com'},
            ].map((p,i) => (
              <div key={i} className={`rounded-2xl p-6 sm:p-8 relative transition-all hover:-translate-y-1 duration-300 ${p.featured?'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]':'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured&&<div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Popular</div>}
                <div className="text-3xl sm:text-4xl mb-4">{p.icon}</div>
                <div className="font-black text-xl sm:text-2xl tracking-tight mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                <div className="text-[#6B6B80] text-sm mb-4 leading-relaxed">{p.desc}</div>
                <div className="font-black tracking-tight mb-5" style={{fontFamily:"'Syne',sans-serif",fontSize:p.price?'36px':'24px'}}>
                  {p.price?<>${p.price}<span className="text-base font-normal text-[#6B6B80]"> USD</span></>:'Custom'}
                </div>
                <ul className="mb-6 space-y-1">
                  {p.features.map((f,j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                      <span className="text-[#00E5FF] text-xs flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href={p.href} className={`block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all ${p.featured?'bg-[#00E5FF] text-[#07070C]':'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`} style={{fontFamily:"'Syne',sans-serif"}}>
                  {p.btn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="py-20 sm:py-24 px-5 bg-[#0E0E16]" id="demo">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Demo</div>
              <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne',sans-serif"}}>This is what your profile looks like</h2>
              <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-6 leading-relaxed">The page that opens when someone taps your card. Elegant, fast, and completely yours to edit anytime.</p>
              <div className="space-y-3 mb-6">
                {['Loads in under 1 second','No apps or downloads needed','Edit in real time from your portal','Your URL: synqotap.com/c/your-name'].map((item,i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="text-[#00E5FF] flex-shrink-0">→</span>{item}
                  </div>
                ))}
              </div>
              <a href="/c/synqo-tap-ub9u" target="_blank" className="text-[#00E5FF] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity text-sm sm:text-base">
                View full demo →
              </a>
            </div>
            <div className="bg-[#13131F] border border-[#22223A] rounded-3xl p-6 sm:p-8 max-w-xs mx-auto w-full">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl sm:text-3xl font-black text-white" style={{background:'linear-gradient(135deg,#00E5FF,#7B61FF)',fontFamily:"'Syne',sans-serif"}}>AR</div>
              <div className="text-center font-bold text-lg sm:text-xl mb-1" style={{fontFamily:"'Syne',sans-serif"}}>Alex Rivera</div>
              <div className="text-center text-sm text-[#6B6B80] mb-1">CEO & Founder</div>
              <div className="text-center text-sm text-[#00E5FF] mb-5">TechCorp Solutions</div>
              <div className="space-y-2">
                {demoButtons.map((btn,i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-xl p-2.5 sm:p-3 text-sm">
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#00E5FF]/10 text-[#00E5FF]">
                      {btn.icon}
                    </div>
                    <span>{btn.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 sm:py-24 px-5" id="pricing">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Pricing</div>
          <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne',sans-serif"}}>One payment. Forever.</h2>
          <p className="text-[#6B6B80] mb-10 font-light">No subscriptions, no hidden fees.</p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {type:'PVC Card',price:'39',featured:false,includes:['PVC card with NFC','Digital profile forever','Unlimited edits','3 templates','Custom URL','Email support'],btn:'Buy PVC',href:'/checkout?plan=pvc'},
              {type:'Metal Card',price:'79',featured:true,includes:['Everything in PVC','Stainless steel','Premium finish','Laser engraving','Case included','Priority support'],btn:'Buy Metal',href:'/checkout?plan=metal'},
            ].map((p,i) => (
              <div key={i} className={`rounded-2xl p-6 sm:p-8 text-left relative ${p.featured?'border border-[#00E5FF]':'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured&&<div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Recommended</div>}
                <div className="font-bold text-base sm:text-lg mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{p.type}</div>
                <div className="font-black text-4xl sm:text-5xl tracking-tight leading-none mb-1" style={{fontFamily:"'Syne',sans-serif"}}>${p.price}</div>
                <div className="text-xs text-[#6B6B80] mb-5">one-time payment · shipping included</div>
                <div className="text-sm text-[#6B6B80] leading-loose mb-5">{p.includes.map((item,j) => <div key={j}>✓ {item}</div>)}</div>
                <a href={p.href} className={`block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all ${p.featured?'bg-[#00E5FF] text-[#07070C]':'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`} style={{fontFamily:"'Syne',sans-serif"}}>
                  {p.btn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24 px-5" id="faq">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">FAQ</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight" style={{fontFamily:"'Syne',sans-serif"}}>Everything you need to know</h2>
          </div>
          <div>
            {faqs.map((item, i) => (
              <div key={i} className="border-b border-[#1C1C2E]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center py-4 sm:py-5 gap-4 text-left cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base" style={{fontFamily:"'Syne',sans-serif"}}>{item.q}</span>
                  <span
                    className="text-xl text-[#00E5FF] font-light flex-shrink-0 transition-transform duration-300"
                    style={{transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)'}}
                  >+</span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: openFaq === i ? '300px' : '0px',
                  }}
                >
                  <p className="text-[#6B6B80] text-sm leading-relaxed pb-4 sm:pb-5">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,255,0.06),transparent)]"/>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-black text-2xl sm:text-5xl tracking-tight mb-5 leading-tight" style={{fontFamily:"'Syne',sans-serif"}}>Stop handing out<br/>forgotten paper cards</h2>
          <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-8 sm:mb-10">Your next connection deserves a first impression that matches.</p>
          <a href="/checkout?plan=pvc" className="bg-[#00E5FF] text-[#07070C] font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base" style={{fontFamily:"'Syne',sans-serif"}}>
            Start now — from $39 →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E0E16] border-t border-[#1C1C2E] px-5 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="font-black text-xl mb-3" style={{fontFamily:"'Syne',sans-serif"}}>Synqo<span className="text-[#00E5FF]">Tap</span></div>
              <p className="text-[#6B6B80] text-sm leading-relaxed">The business card of the future. NFC + unlimited digital profile, one payment.</p>
            </div>
            {[
              {title:'Product',links:[['Buy PVC','/checkout?plan=pvc'],['Buy Metal','/checkout?plan=metal'],['Business','mailto:synqotap@gmail.com'],['Demo','/c/synqo-tap-ub9u']]},
              {title:'Info',links:[['How it works','#how-it-works'],['Pricing','#pricing'],['FAQ','#faq'],['Contact','mailto:synqotap@gmail.com']]},
              {title:'Account',links:[['Login','/login'],['My profile','/portal'],['My orders','/portal'],['Support','mailto:synqotap@gmail.com']]},
            ].map((col,i) => (
              <div key={i}>
                <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne',sans-serif"}}>{col.title}</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  {col.links.map(([label,href],j) => (
                    <li key={j}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[#1C1C2E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6B6B80]">
            <span>© 2025 SynqoTap. All rights reserved.</span>
            <span><a href="#" className="hover:text-white transition-colors">Privacy</a> · <a href="#" className="hover:text-white transition-colors">Terms</a></span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      `}</style>
    </div>
  )
}