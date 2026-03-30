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
const Spinner = ({ dark }: { dark?: boolean }) => (
  <div style={{width:16,height:16,borderRadius:'50%',flexShrink:0,border:dark?'2px solid rgba(0,0,0,0.2)':'2px solid rgba(255,255,255,0.2)',borderTopColor:dark?'#07070C':'#F2F2F4',animation:'spin 0.8s linear infinite'}}/>
)

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [openFaq, setOpenFaq] = useState<number|null>(0)
  const [buyLoading, setBuyLoading] = useState<string|null>(null)

  async function handleBuy(cardType:'pvc'|'metal') {
    setBuyLoading(cardType)
    try {
      const res = await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cardType,quantity:1})})
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Error starting payment. Please try again.')
    } catch { alert('Connection error. Please try again.') }
    finally { setBuyLoading(null) }
  }

  useEffect(() => {
    const navbar = document.getElementById('navbar')
    const handleScroll = () => {
      if (!navbar) return
      if (window.scrollY > 30) { navbar.style.background='rgba(7,7,12,0.9)';navbar.style.backdropFilter='blur(20px)';navbar.style.borderBottomColor='#1C1C2E' }
      else { navbar.style.background='transparent';navbar.style.backdropFilter='none';navbar.style.borderBottomColor='transparent' }
    }
    window.addEventListener('scroll', handleScroll)
    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || window.innerWidth < 768) return
      const rx = ((e.clientY - window.innerHeight/2)/(window.innerHeight/2))*-8
      const ry = ((e.clientX - window.innerWidth/2)/(window.innerWidth/2))*12
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', () => { if (card) card.style.transform='rotateY(-15deg) rotateX(5deg)' })
    return () => { window.removeEventListener('scroll',handleScroll);document.removeEventListener('mousemove',handleMouseMove) }
  }, [])

  const faqs = [
    {q:'Do I need an app to use the card?',a:"No. Your card works with the phone's native NFC. The person scanning you only needs their smartphone — no download required."},
    {q:'Can I update my profile later?',a:'Yes, as many times as you want at no extra cost. Change your number, email, or title — updates reflect in real time.'},
    {q:'How long does shipping take?',a:'We program and ship in 1-3 business days. Delivery in 5-10 business days to the US and Latin America.'},
    {q:'What if I lose my card?',a:'Your profile stays active. Buy a replacement card and it will be programmed with the same profile URL.'},
    {q:'Does it work with iPhones and Android?',a:'Yes. NFC works on iPhones from model 7 (iOS 14+) and on virtually all Android phones since 2015.'},
  ]

  const steps = [
    {num:'01',icon:<IconCart/>,title:'Choose and buy',desc:'Select your card and complete payment. Your profile is created automatically.'},
    {num:'02',icon:<IconPencil/>,title:'Customize your profile',desc:'Upload your logo, add your info and configure your buttons. Changes appear instantly.'},
    {num:'03',icon:<IconBox/>,title:'Receive and use',desc:'Your card arrives programmed and ready. Hold it to any smartphone and share your contact.'},
  ]

  const demoBtns = [
    {label:'Call',bg:'rgba(34,197,94,0.15)',color:'#22C55E',
      icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>},
    {label:'WhatsApp',bg:'rgba(37,211,102,0.15)',color:'#25D366',
      icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.613l6.058-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.382l-.36-.214-3.732.903.918-3.636-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>},
    {label:'Email',bg:'rgba(99,179,237,0.15)',color:'#63B3ED',
      icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>},
    {label:'LinkedIn',bg:'rgba(10,102,194,0.15)',color:'#0A66C2',
      icon:<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>},
  ]

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] overflow-x-hidden" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between transition-all duration-300" style={{borderBottom:'1px solid transparent'}}>
        <a href="/" className="text-xl font-black tracking-tight flex-shrink-0" style={{fontFamily:"'Syne',sans-serif"}}>Synqo<span className="text-[#00E5FF]">Tap</span></a>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#6B6B80]">
          {[['#products','Products'],['#how-it-works','How it works'],['#demo','Demo'],['#pricing','Pricing'],['#faq','FAQ']].map(([href,label])=>(
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
          <a href="/login" className="hover:text-white transition-colors">Login</a>
        </div>
        <button onClick={()=>handleBuy('pvc')} disabled={buyLoading!==null} className="bg-[#00E5FF] text-[#07070C] font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity flex items-center gap-2 disabled:opacity-60" style={{fontFamily:"'Syne',sans-serif"}}>
          {buyLoading?<><Spinner dark/>Redirecting…</>:'Buy now →'}
        </button>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16 px-5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"/>NFC Technology
              </div>
              <h1 className="font-black leading-tight tracking-tighter mb-6 text-[clamp(2rem,6vw,4.25rem)]" style={{fontFamily:"'Syne',sans-serif"}}>
                Share your contact<br/>with a single <span className="text-[#00E5FF]">tap</span>
              </h1>
              <p className="text-[#6B6B80] text-base sm:text-lg leading-relaxed mb-8 font-light max-w-md">
                A physical card with an NFC chip connected to your digital profile. No apps, no friction. Your complete contact, always up to date.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <button onClick={()=>handleBuy('pvc')} disabled={buyLoading!==null} className="bg-[#00E5FF] text-[#07070C] font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base disabled:opacity-60 disabled:translate-y-0" style={{fontFamily:"'Syne',sans-serif"}}>
                  {buyLoading==='pvc'?<><Spinner dark/>Redirecting…</>:'Get my card →'}
                </button>
                <a href="#demo" className="text-white/70 inline-flex items-center gap-2 hover:text-white transition-colors py-3.5 text-sm sm:text-base">Watch live demo ▶</a>
              </div>
              <div className="flex gap-6 sm:gap-10 pt-8 border-t border-[#1C1C2E]">
                {[['3s','To share contact'],['∞','Free updates'],['24h','Profile active after purchase']].map(([val,label])=>(
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
            {steps.map((s,i)=>(
              <div key={i} className="bg-[#0E0E16] p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                <div className="font-black mb-4 select-none" style={{fontFamily:"'Syne',sans-serif",fontSize:'3.5rem',lineHeight:1,color:'rgba(0,229,255,0.10)'}}>{s.num}</div>
                <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mb-4">{s.icon}</div>
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
              {icon:'💳',name:'PVC Card',desc:'Light, durable and elegant. Perfect for everyday networking.',price:'39',featured:false,features:['Programmed NFC chip','Unlimited digital profile','Real-time updates','Custom URL','3 design templates'],btn:'Buy PVC →',type:'pvc' as const},
              {icon:'⚡',name:'Metal Card',desc:"Stainless steel finish. A first impression that won't be forgotten.",price:'79',featured:true,features:['Everything in PVC','Premium stainless steel','Matte or mirror finish','Laser engraving included','Presentation case'],btn:'Buy Metal →',type:'metal' as const},
              {icon:'🏢',name:'Business',desc:'Volume for teams. Discounts starting at 10 units.',price:null,featured:false,features:['Orders from 10 units','Volume discounts','Corporate branding','Centralized management','Dedicated support'],btn:'Contact us →',type:null},
            ].map((p,i)=>(
              <div key={i} className={`rounded-2xl p-6 sm:p-8 relative transition-all hover:-translate-y-1 duration-300 ${p.featured?'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]':'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured&&<div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Popular</div>}
                <div className="text-3xl sm:text-4xl mb-4">{p.icon}</div>
                <div className="font-black text-xl sm:text-2xl tracking-tight mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{p.name}</div>
                <div className="text-[#6B6B80] text-sm mb-4 leading-relaxed">{p.desc}</div>
                <div className="font-black tracking-tight mb-5" style={{fontFamily:"'Syne',sans-serif",fontSize:p.price?'36px':'24px'}}>
                  {p.price?<>${p.price}<span className="text-base font-normal text-[#6B6B80]"> USD</span></>:'Custom'}
                </div>
                <ul className="mb-6 space-y-1">
                  {p.features.map((f,j)=>(
                    <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                      <span className="text-[#00E5FF] text-xs flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                </ul>
                {p.type?(
                  <button onClick={()=>handleBuy(p.type!)} disabled={buyLoading!==null} className={`w-full py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${p.featured?'bg-[#00E5FF] text-[#07070C]':'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`} style={{fontFamily:"'Syne',sans-serif"}}>
                    {buyLoading===p.type?<><Spinner dark={p.featured}/>Redirecting…</>:p.btn}
                  </button>
                ):(
                  <a href="mailto:synqotap@gmail.com" className="block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF] transition-all" style={{fontFamily:"'Syne',sans-serif"}}>{p.btn}</a>
                )}
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
                {['Loads in under 1 second','No apps or downloads needed','Edit in real time from your portal','Your URL: synqotap.com/c/your-name'].map((item,i)=>(
                  <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="text-[#00E5FF] flex-shrink-0">→</span>{item}
                  </div>
                ))}
              </div>
              <a href="/c/synqo-tap-ub9u" target="_blank" className="text-[#00E5FF] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity text-sm sm:text-base">View full demo →</a>
            </div>

            {/* Profile card — matches real /c/[slug] design */}
            <div className="max-w-xs mx-auto w-full rounded-3xl overflow-hidden border border-[#22223A]" style={{background:'#07070C'}}>
              <div className="h-24 relative overflow-hidden">
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,229,255,0.2) 0%,#0E0E16 60%,#07070C 100%)'}}/>
              </div>
              <div className="px-5 flex items-end justify-between" style={{marginTop:'-40px'}}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl text-white flex-shrink-0" style={{background:'linear-gradient(135deg,#00E5FF,#7B61FF)',border:'3px solid #07070C',fontFamily:"'Syne',sans-serif"}}>AR</div>
                <div className="mb-1 inline-flex items-center gap-1.5 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-2 rounded-full" style={{fontFamily:"'Syne',sans-serif"}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Save contact
                </div>
              </div>
              <div className="px-5 pt-3 pb-3">
                <div className="font-black text-lg mb-0.5" style={{fontFamily:"'Syne',sans-serif"}}>Alex Rivera</div>
                <div className="text-sm font-medium mb-0.5" style={{color:'#00E5FF'}}>CEO & Founder</div>
                <div className="text-sm text-[#6B6B80]">TechCorp Solutions</div>
              </div>
              <div className="border-t border-[#1C1C2E] mx-5"/>
              <div className="px-5 py-4 space-y-2">
                {demoBtns.map((btn,i)=>(
                  <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-2xl px-3 py-2.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:btn.bg,color:btn.color}}>{btn.icon}</div>
                    <span className="text-sm font-medium flex-1">{btn.label}</span>
                    <span className="text-[#6B6B80] text-lg">›</span>
                  </div>
                ))}
              </div>
              <div className="text-center pb-4 text-xs text-[#6B6B80]">Created with <span style={{color:'#00E5FF'}}>SynqoTap</span></div>
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
              {type:'PVC Card',price:'39',featured:false,includes:['PVC card with NFC','Digital profile forever','Unlimited edits','3 templates','Custom URL','Email support'],btn:'Buy PVC',cardType:'pvc' as const},
              {type:'Metal Card',price:'79',featured:true,includes:['Everything in PVC','Stainless steel','Premium finish','Laser engraving','Case included','Priority support'],btn:'Buy Metal',cardType:'metal' as const},
            ].map((p,i)=>(
              <div key={i} className={`rounded-2xl p-6 sm:p-8 text-left relative ${p.featured?'border border-[#00E5FF]':'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured&&<div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Recommended</div>}
                <div className="font-bold text-base sm:text-lg mb-2" style={{fontFamily:"'Syne',sans-serif"}}>{p.type}</div>
                <div className="font-black text-4xl sm:text-5xl tracking-tight leading-none mb-1" style={{fontFamily:"'Syne',sans-serif"}}>${p.price}</div>
                <div className="text-xs text-[#6B6B80] mb-5">one-time payment · shipping included</div>
                <div className="text-sm text-[#6B6B80] leading-loose mb-5">{p.includes.map((item,j)=><div key={j}>✓ {item}</div>)}</div>
                <button onClick={()=>handleBuy(p.cardType)} disabled={buyLoading!==null} className={`w-full py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${p.featured?'bg-[#00E5FF] text-[#07070C]':'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`} style={{fontFamily:"'Syne',sans-serif"}}>
                  {buyLoading===p.cardType?<><Spinner dark={p.featured}/>Redirecting…</>:p.btn}
                </button>
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
            {faqs.map((item,i)=>(
              <div key={i} className="border-b border-[#1C1C2E]">
                <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex justify-between items-center py-4 sm:py-5 gap-4 text-left">
                  <span className="font-bold text-sm sm:text-base" style={{fontFamily:"'Syne',sans-serif"}}>{item.q}</span>
                  <span className="text-xl text-[#00E5FF] font-light flex-shrink-0 transition-transform duration-300" style={{transform:openFaq===i?'rotate(45deg)':'rotate(0deg)'}}>+</span>
                </button>
                <div className="overflow-hidden transition-all duration-300" style={{maxHeight:openFaq===i?'300px':'0px'}}>
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
          <button onClick={()=>handleBuy('pvc')} disabled={buyLoading!==null} className="bg-[#00E5FF] text-[#07070C] font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base disabled:opacity-60 disabled:translate-y-0" style={{fontFamily:"'Syne',sans-serif"}}>
            {buyLoading==='pvc'?<><Spinner dark/>Redirecting…</>:'Start now — from $39 →'}
          </button>
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
              {title:'Product',links:[['Buy PVC','pvc'],['Buy Metal','metal'],['Business','mailto:synqotap@gmail.com'],['Demo','/c/synqo-tap-ub9u']]},
              {title:'Info',links:[['How it works','#how-it-works'],['Pricing','#pricing'],['FAQ','#faq'],['Contact','mailto:synqotap@gmail.com']]},
              {title:'Account',links:[['Login','/login'],['My profile','/portal'],['My orders','/portal'],['Support','mailto:synqotap@gmail.com']]},
            ].map((col,i)=>(
              <div key={i}>
                <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne',sans-serif"}}>{col.title}</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  {col.links.map(([label,href],j)=>(
                    <li key={j}>
                      {(label==='Buy PVC'||label==='Buy Metal')?(
                        <button onClick={()=>handleBuy(label==='Buy PVC'?'pvc':'metal')} className="hover:text-white transition-colors text-left">{label}</button>
                      ):(
                        <a href={href} className="hover:text-white transition-colors">{label}</a>
                      )}
                    </li>
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
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  )
}