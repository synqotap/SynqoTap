'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Home() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const cardRef = useRef<HTMLDivElement>(null)

  const otherLocale = locale === 'es' ? 'en' : 'es'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  useEffect(() => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar')
    const handleScroll = () => {
      if (!navbar) return
      if (window.scrollY > 30) {
        navbar.style.background = 'rgba(7,7,12,0.88)'
        navbar.style.backdropFilter = 'blur(20px)'
        navbar.style.borderBottomColor = '#1C1C2E'
      } else {
        navbar.style.background = 'transparent'
        navbar.style.backdropFilter = 'none'
        navbar.style.borderBottomColor = 'transparent'
      }
    }
    window.addEventListener('scroll', handleScroll)

    // 3D card mouse effect (desktop only)
    const card = cardRef.current
    const handleMouseMove = (e: MouseEvent) => {
      if (!card || window.innerWidth < 768) return
      const rx = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * -8
      const ry = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 12
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const handleMouseLeave = () => {
      if (!card) return
      card.style.transform = 'rotateY(-15deg) rotateX(5deg)'
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // FAQ accordion
    const faqs = document.querySelectorAll('.faq-item')
    faqs.forEach(item => {
      const q = item.querySelector('.faq-q')
      const a = item.querySelector('.faq-a') as HTMLElement
      const icon = item.querySelector('.faq-icon') as HTMLElement
      q?.addEventListener('click', () => {
        const isOpen = a?.style.maxHeight && a.style.maxHeight !== '0px'
        document.querySelectorAll('.faq-a').forEach((el) => {
          (el as HTMLElement).style.maxHeight = '0px';
          (el as HTMLElement).style.paddingTop = '0'
        })
        document.querySelectorAll('.faq-icon').forEach((el) => {
          (el as HTMLElement).style.transform = 'rotate(0deg)'
        })
        if (!isOpen && a) {
          a.style.maxHeight = a.scrollHeight + 'px'
          a.style.paddingTop = '12px'
          if (icon) icon.style.transform = 'rotate(45deg)'
        }
      })
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const pvcFeatures = ['features.nfc','features.profile','features.realtime','features.url','features.templates']
  const metalFeatures = ['features.allPvc','features.steel','features.finish','features.laser','features.case']
  const bizFeatures = ['features.min10','features.discount','features.branding','features.central','features.support']
  const pvcIncludes = ['includes.nfc','includes.forever','includes.unlimited','includes.templates','includes.url','includes.email']
  const metalIncludes = ['includes.allPvc','includes.steel','includes.premium','includes.laser','includes.case','includes.priority']

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] overflow-x-hidden" style={{fontFamily:"'DM Sans', sans-serif"}}>

      {/* NAV */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between transition-all duration-300" style={{borderBottom:'1px solid transparent'}}>
        <a href={`/${locale}`} className="text-lg font-black tracking-tight flex-shrink-0" style={{fontFamily:"'Syne', sans-serif"}}>
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#6B6B80]">
          <a href="#productos" className="hover:text-white transition-colors">{t('nav.products')}</a>
          <a href="#como-funciona" className="hover:text-white transition-colors">{t('nav.howItWorks')}</a>
          <a href="#demo" className="hover:text-white transition-colors">{t('nav.demo')}</a>
          <a href="#precios" className="hover:text-white transition-colors">{t('nav.pricing')}</a>
          <a href="#faq" className="hover:text-white transition-colors">{t('nav.faq')}</a>
          <a href={`/${locale}/login`} className="hover:text-white transition-colors">{t('nav.login')}</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(switchPath)}
            className="text-xs text-[#6B6B80] border border-[#22223A] px-3 py-1.5 rounded-full hover:text-white hover:border-[#6B6B80] transition-all">
            {otherLocale === 'en' ? 'EN' : 'ES'}
          </button>
          <a href={`/${locale}/checkout`}
            className="bg-[#00E5FF] text-[#07070C] font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity whitespace-nowrap"
            style={{fontFamily:"'Syne', sans-serif"}}>
            {t('nav.buy')}
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-24 pb-16 px-5">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"/>
                {t('hero.tag')}
              </div>
              <h1 className="font-black leading-tight tracking-tighter mb-6 text-[clamp(2rem,6vw,4rem)]" style={{fontFamily:"'Syne', sans-serif"}}>
                {t('hero.title')}<br/><span className="text-[#00E5FF]">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-[#6B6B80] text-base sm:text-lg leading-relaxed mb-8 font-light max-w-md">{t('hero.subtitle')}</p>
              <div className="flex flex-wrap gap-4 mb-12">
                <a href={`/${locale}/checkout`}
                  className="bg-[#00E5FF] text-[#07070C] font-bold px-7 py-3.5 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base"
                  style={{fontFamily:"'Syne', sans-serif"}}>
                  {t('hero.cta')}
                </a>
                <a href="#demo" className="text-white/70 inline-flex items-center gap-2 hover:text-white transition-colors py-3.5 text-sm sm:text-base">
                  {t('hero.demo')}
                </a>
              </div>
              <div className="flex gap-6 sm:gap-8 pt-8 border-t border-[#1C1C2E]">
                {[
                  {val:'3s', label:t('hero.stat1')},
                  {val:'∞', label:t('hero.stat2')},
                  {val:'24h', label:t('hero.stat3')},
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-black" style={{fontFamily:"'Syne', sans-serif"}}>{s.val}</div>
                    <div className="text-xs text-[#6B6B80] leading-tight mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D CARD */}
            <div className="relative flex justify-center items-center h-64 sm:h-80 md:h-96">
              <div
                ref={cardRef}
                className="w-64 sm:w-72 h-40 sm:h-44 rounded-2xl relative overflow-hidden cursor-pointer"
                style={{
                  background:'linear-gradient(135deg,#12122A,#1A1A38,#0E0E20)',
                  border:'1px solid rgba(0,229,255,0.25)',
                  boxShadow:'0 40px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)',
                  transform:'rotateY(-15deg) rotateX(5deg)',
                  transformStyle:'preserve-3d',
                  transition:'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
                  perspective:'1000px',
                }}>
                <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 50%,rgba(0,229,255,0.12),transparent 60%)'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%)',animation:'shimmer 3s infinite'}}/>
                <div className="absolute top-7 sm:top-8 left-6 w-9 sm:w-10 h-6 sm:h-7 rounded-md" style={{background:'linear-gradient(135deg,#C8A04B,#E8C87A,#B8903C)'}}/>
                <div className="absolute bottom-7 sm:bottom-8 left-6 font-bold text-sm sm:text-base tracking-widest text-white" style={{fontFamily:"'Syne', sans-serif"}}>ALEX RIVERA</div>
                <div className="absolute bottom-3 sm:bottom-4 left-6 text-xs text-white/40 tracking-widest uppercase">CEO · TECHCORP</div>
              </div>
              <div className="absolute top-2 sm:top-4 right-0 sm:right-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{animation:'float 4s ease-in-out infinite'}}>
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] flex-shrink-0"/>
                <span className="text-[#6B6B80]">{t('hero.badge1')}</span>
              </div>
              <div className="absolute bottom-6 sm:bottom-8 left-0 sm:left-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl" style={{animation:'float 4s ease-in-out infinite 1.5s'}}>
                <span className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0"/>
                <span className="text-[#6B6B80]">{t('hero.badge3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-24 px-5" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">{t('how.label')}</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('how.title')}</h2>
            <p className="text-[#6B6B80] text-base sm:text-lg font-light">{t('how.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-[#1C1C2E] rounded-2xl overflow-hidden">
            {[
              {num:'01', icon:'🛒', title:t('how.step1Title'), desc:t('how.step1Desc')},
              {num:'02', icon:'✏️', title:t('how.step2Title'), desc:t('how.step2Desc')},
              {num:'03', icon:'📦', title:t('how.step3Title'), desc:t('how.step3Desc')},
            ].map((step, i) => (
              <div key={i} className="bg-[#0E0E16] p-6 sm:p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                <div className="text-4xl sm:text-5xl font-black text-white/[0.03] mb-4 tracking-tighter" style={{fontFamily:"'Syne', sans-serif"}}>{step.num}</div>
                <div className="w-11 h-11 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-lg mb-4">{step.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{step.title}</h3>
                <p className="text-[#6B6B80] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 sm:py-24 px-5" id="productos">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">{t('products.label')}</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('products.title')}</h2>
            <p className="text-[#6B6B80] text-base sm:text-lg font-light">{t('products.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {icon:'💳', name:t('products.pvcName'), desc:t('products.pvcDesc'), price:'39', featured:false, features:pvcFeatures, btn:t('products.buyPvc'), href:`/${locale}/checkout`},
              {icon:'⚡', name:t('products.metalName'), desc:t('products.metalDesc'), price:'79', featured:true, features:metalFeatures, btn:t('products.buyMetal'), href:`/${locale}/checkout`},
              {icon:'🏢', name:t('products.bizName'), desc:t('products.bizDesc'), price:null, featured:false, features:bizFeatures, btn:t('products.contact'), href:'mailto:synqotap@gmail.com'},
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl p-6 sm:p-8 relative transition-all duration-300 hover:-translate-y-1 ${p.featured ? 'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]' : 'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured && <div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">{t('products.popular')}</div>}
                <div className="text-3xl sm:text-4xl mb-4 sm:mb-5">{p.icon}</div>
                <div className="font-black text-xl sm:text-2xl tracking-tight mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{p.name}</div>
                <div className="text-[#6B6B80] text-sm mb-4 sm:mb-5 leading-relaxed">{p.desc}</div>
                <div className="font-black tracking-tight mb-5 sm:mb-6" style={{fontFamily:"'Syne', sans-serif", fontSize: p.price ? '36px' : '24px'}}>
                  {p.price ? <>${p.price}<span className="text-base font-normal text-[#6B6B80]"> {t('products.usd')}</span></> : t('products.bizPrice')}
                </div>
                <ul className="mb-6 sm:mb-7 space-y-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-1.5 border-b border-[#1C1C2E] last:border-0">
                      <span className="text-[#00E5FF] text-xs flex-shrink-0">✓</span>{t(`products.${f}`)}
                    </li>
                  ))}
                </ul>
                <a href={p.href} className={`block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all ${p.featured ? 'bg-[#00E5FF] text-[#07070C]' : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`}
                  style={{fontFamily:"'Syne', sans-serif"}}>
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
              <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">{t('demo.label')}</div>
              <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('demo.title')}</h2>
              <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-6 sm:mb-8 leading-relaxed">{t('demo.subtitle')}</p>
              <div className="space-y-3 mb-6 sm:mb-8">
                {[t('demo.feat1'),t('demo.feat2'),t('demo.feat3'),t('demo.feat4')].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="text-[#00E5FF] flex-shrink-0">→</span>{item}
                  </div>
                ))}
              </div>
              <a href="/c/synqo-tap-ub9u" target="_blank" className="text-[#00E5FF] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity text-sm sm:text-base">
                {t('demo.viewDemo')}
              </a>
            </div>
            <div className="bg-[#13131F] border border-[#22223A] rounded-3xl p-6 sm:p-8 max-w-xs mx-auto w-full">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl sm:text-3xl font-black text-white" style={{background:'linear-gradient(135deg,#00E5FF,#7B61FF)', fontFamily:"'Syne', sans-serif"}}>AR</div>
              <div className="text-center font-bold text-lg sm:text-xl mb-1" style={{fontFamily:"'Syne', sans-serif"}}>Alex Rivera</div>
              <div className="text-center text-sm text-[#6B6B80] mb-1">CEO & Founder</div>
              <div className="text-center text-sm text-[#00E5FF] mb-5 sm:mb-6">TechCorp Solutions</div>
              <div className="space-y-2 sm:space-y-2.5">
                {[{icon:'📞',label:'Call'},{icon:'💬',label:'WhatsApp'},{icon:'✉️',label:'Email'},{icon:'💼',label:'LinkedIn'}].map((btn, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-xl p-2.5 sm:p-3 text-sm">
                    <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base flex-shrink-0 bg-white/5">{btn.icon}</div>
                    <span>{btn.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 sm:py-24 px-5" id="precios">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">{t('pricing.label')}</div>
          <h2 className="font-black text-2xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('pricing.title')}</h2>
          <p className="text-[#6B6B80] mb-10 sm:mb-12 font-light">{t('pricing.subtitle')}</p>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {[
              {type:t('products.pvcName'), price:'39', featured:false, includes:pvcIncludes, btn:t('pricing.buyPvc'), href:`/${locale}/checkout`},
              {type:t('products.metalName'), price:'79', featured:true, includes:metalIncludes, btn:t('pricing.buyMetal'), href:`/${locale}/checkout`},
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl p-6 sm:p-8 text-left relative ${p.featured ? 'border border-[#00E5FF]' : 'border border-[#22223A] bg-[#0E0E16]'}`}>
                {p.featured && <div className="absolute top-4 right-4 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">{t('pricing.recommended')}</div>}
                <div className="font-bold text-base sm:text-lg mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{p.type}</div>
                <div className="font-black text-4xl sm:text-5xl tracking-tight leading-none mb-1" style={{fontFamily:"'Syne', sans-serif"}}>${p.price}</div>
                <div className="text-xs text-[#6B6B80] mb-5 sm:mb-6">{t('pricing.oneTime')}</div>
                <div className="text-sm text-[#6B6B80] leading-loose mb-5 sm:mb-6">
                  {p.includes.map((item, j) => <div key={j}>✓ {t(`pricing.${item}`)}</div>)}
                </div>
                <a href={p.href} className={`block w-full text-center py-3 sm:py-3.5 rounded-full font-bold text-sm transition-all ${p.featured ? 'bg-[#00E5FF] text-[#07070C]' : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`}
                  style={{fontFamily:"'Syne', sans-serif"}}>
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
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">{t('faq.label')}</div>
            <h2 className="font-black text-2xl sm:text-4xl tracking-tight" style={{fontFamily:"'Syne', sans-serif"}}>{t('faq.title')}</h2>
          </div>
          <div>
            {[
              {q:t('faq.q1'), a:t('faq.a1')},
              {q:t('faq.q2'), a:t('faq.a2')},
              {q:t('faq.q3'), a:t('faq.a3')},
              {q:t('faq.q4'), a:t('faq.a4')},
              {q:t('faq.q5'), a:t('faq.a5')},
            ].map((item, i) => (
              <div key={i} className="faq-item border-b border-[#1C1C2E] py-4 sm:py-5">
                <div className="faq-q flex justify-between items-center cursor-pointer gap-4 font-bold text-sm sm:text-base" style={{fontFamily:"'Syne', sans-serif"}}>
                  {item.q}
                  <span className="faq-icon text-xl sm:text-2xl text-[#00E5FF] font-light flex-shrink-0 transition-transform duration-300">+</span>
                </div>
                <div className="faq-a text-[#6B6B80] text-sm leading-relaxed overflow-hidden transition-all duration-300" style={{maxHeight:'0px'}}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,255,0.06),transparent)]"/>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-black text-2xl sm:text-5xl tracking-tight mb-5 leading-tight" style={{fontFamily:"'Syne', sans-serif"}}>{t('cta.title')}</h2>
          <p className="text-[#6B6B80] text-base sm:text-lg font-light mb-8 sm:mb-10">{t('cta.subtitle')}</p>
          <a href={`/${locale}/checkout`}
            className="bg-[#00E5FF] text-[#07070C] font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)] text-sm sm:text-base"
            style={{fontFamily:"'Syne', sans-serif"}}>
            {t('cta.btn')}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E0E16] border-t border-[#1C1C2E] px-5 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="font-black text-xl mb-3" style={{fontFamily:"'Syne', sans-serif"}}>Synqo<span className="text-[#00E5FF]">Tap</span></div>
              <p className="text-[#6B6B80] text-sm leading-relaxed">{t('footer.tagline')}</p>
            </div>
            <div>
              <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('footer.product')}</div>
              <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                <li><a href={`/${locale}/checkout`} className="hover:text-white transition-colors">{t('footer.pvc')}</a></li>
                <li><a href={`/${locale}/checkout`} className="hover:text-white transition-colors">{t('footer.metal')}</a></li>
                <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">{t('footer.business')}</a></li>
                <li><a href="/c/synqo-tap-ub9u" className="hover:text-white transition-colors">{t('nav.demo')}</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('footer.info')}</div>
              <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                <li><a href="#como-funciona" className="hover:text-white transition-colors">{t('footer.howItWorks')}</a></li>
                <li><a href="#precios" className="hover:text-white transition-colors">{t('footer.pricing')}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
                <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>{t('footer.account')}</div>
              <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                <li><a href={`/${locale}/login`} className="hover:text-white transition-colors">{t('footer.login')}</a></li>
                <li><a href={`/${locale}/portal`} className="hover:text-white transition-colors">{t('footer.myProfile')}</a></li>
                <li><a href={`/${locale}/portal`} className="hover:text-white transition-colors">{t('footer.myOrders')}</a></li>
                <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">{t('footer.support')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#1C1C2E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6B6B80]">
            <span>{t('footer.rights')}</span>
            <span>
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              {' · '}
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </div>
  )
}