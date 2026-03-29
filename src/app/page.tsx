import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SynqoTap — Comparte tus datos con un toque',
  description: 'Tarjeta NFC con perfil digital ilimitado. Sin apps, sin fricciones.',
}

export default function Home() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>

      <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-sans overflow-x-hidden">

        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-transparent" id="navbar"
          style={{fontFamily:"'DM Sans', sans-serif"}}>
          <a href="/" className="text-xl font-black tracking-tight" style={{fontFamily:"'Syne', sans-serif"}}>
            Synqo<span className="text-[#00E5FF]">Tap</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B6B80]">
            <a href="#productos" className="hover:text-white transition-colors">Productos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/login" className="hover:text-white transition-colors">Entrar</a>
          </div>
          <a href="/checkout"
            className="bg-[#00E5FF] text-[#07070C] font-bold text-sm px-5 py-2.5 rounded-full hover:opacity-85 transition-opacity"
            style={{fontFamily:"'Syne', sans-serif"}}>
            Comprar ahora →
          </a>
        </nav>

        {/* HERO */}
        <section className="min-h-screen flex items-center pt-24 pb-16 px-6">
          <div className="max-w-5xl mx-auto w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"/>
                  Tecnología NFC
                </div>
                <h1 className="font-black leading-tight tracking-tighter mb-6 text-4xl sm:text-5xl lg:text-6xl"
                  style={{fontFamily:"'Syne', sans-serif"}}>
                  Comparte tus datos<br/>con un solo <span className="text-[#00E5FF]">toque</span>
                </h1>
                <p className="text-[#6B6B80] text-lg leading-relaxed mb-8 font-light max-w-md">
                  Una tarjeta física con chip NFC conectada a tu perfil digital. Sin apps, sin fricciones.
                </p>
                <div className="flex flex-wrap gap-4 mb-12">
                  <a href="/checkout"
                    className="bg-[#00E5FF] text-[#07070C] font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)]"
                    style={{fontFamily:"'Syne', sans-serif"}}>
                    Conseguir mi tarjeta →
                  </a>
                  <a href="#demo" className="text-white/70 inline-flex items-center gap-2 hover:text-white transition-colors py-4">
                    Ver demo en vivo ▶
                  </a>
                </div>
                <div className="flex gap-8 pt-8 border-t border-[#1C1C2E]">
                  <div>
                    <div className="text-2xl font-black" style={{fontFamily:"'Syne', sans-serif"}}>3s</div>
                    <div className="text-xs text-[#6B6B80]">Para compartir contacto</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black" style={{fontFamily:"'Syne', sans-serif"}}>∞</div>
                    <div className="text-xs text-[#6B6B80]">Actualizaciones gratis</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black" style={{fontFamily:"'Syne', sans-serif"}}>24h</div>
                    <div className="text-xs text-[#6B6B80]">Perfil activo tras compra</div>
                  </div>
                </div>
              </div>

              {/* CARD MOCKUP */}
              <div className="relative flex justify-center items-center h-72 md:h-96">
                <div className="w-72 h-44 rounded-2xl relative overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  style={{background:'linear-gradient(135deg,#12122A,#1A1A38,#0E0E20)',border:'1px solid rgba(0,229,255,0.25)',boxShadow:'0 40px 80px rgba(0,0,0,0.6)'}}>
                  <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 50%,rgba(0,229,255,0.12),transparent 60%)'}}/>
                  <div className="absolute top-8 left-6 w-10 h-7 rounded-md" style={{background:'linear-gradient(135deg,#C8A04B,#E8C87A,#B8903C)'}}/>
                  <div className="absolute bottom-8 left-6 font-bold text-base tracking-widest" style={{fontFamily:"'Syne', sans-serif"}}>ALEX RIVERA</div>
                  <div className="absolute bottom-4 left-6 text-xs text-white/40 tracking-widest uppercase">CEO · TECHCORP</div>
                </div>
                <div className="absolute top-4 right-0 md:right-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF]"/>
                  <span className="text-[#6B6B80]">Perfil actualizado</span>
                </div>
                <div className="absolute bottom-8 left-0 md:-left-4 bg-[#13131F] border border-[#22223A] rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"/>
                  <span className="text-[#6B6B80]">NFC activo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 px-6" id="como-funciona">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Proceso</div>
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>
                Tan simple como debería ser
              </h2>
              <p className="text-[#6B6B80] text-lg font-light">De la compra a compartir tu contacto en menos de 48 horas.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-px bg-[#1C1C2E] rounded-2xl overflow-hidden">
              {[
                {num:'01', icon:'🛒', title:'Elige y compra', desc:'Selecciona tu tarjeta y completa el pago. Tu perfil se crea automáticamente.'},
                {num:'02', icon:'✏️', title:'Personaliza tu perfil', desc:'Sube tu logo, agrega tus datos y configura tus botones. Los cambios se ven al instante.'},
                {num:'03', icon:'📦', title:'Recibe y usa', desc:'Tu tarjeta llega programada. Acércala a cualquier smartphone y comparte tu contacto.'},
              ].map((step, i) => (
                <div key={i} className="bg-[#0E0E16] p-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <div className="text-5xl font-black text-white/[0.03] mb-4 tracking-tighter" style={{fontFamily:"'Syne', sans-serif"}}>{step.num}</div>
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-xl mb-4">{step.icon}</div>
                  <h3 className="font-bold text-lg mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{step.title}</h3>
                  <p className="text-[#6B6B80] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="py-24 px-6" id="productos">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Productos</div>
              <h2 className="font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Elige tu tarjeta</h2>
              <p className="text-[#6B6B80] text-lg font-light">Dos materiales, el mismo poder. Ambas incluyen perfil digital ilimitado.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {icon:'💳', name:'PVC Card', desc:'Ligera, resistente y elegante. Perfecta para networking cotidiano.', price:'39', featured:false,
                  features:['Chip NFC programado','Perfil digital ilimitado','Actualizaciones en tiempo real','URL personalizada','3 templates de diseño'],
                  btn:'Comprar PVC →', href:'/checkout'},
                {icon:'⚡', name:'Metal Card', desc:'Acabado en acero inoxidable. Primera impresión que no se olvida.', price:'79', featured:true,
                  features:['Todo lo del PVC','Acero inoxidable premium','Acabado mate o espejo','Grabado láser incluido','Estuche de presentación'],
                  btn:'Comprar Metal →', href:'/checkout'},
                {icon:'🏢', name:'Empresas', desc:'Volumen para equipos. Descuentos desde 10 unidades.', price:null, featured:false,
                  features:['Pedidos desde 10 unidades','Descuentos por volumen','Branding corporativo','Gestión centralizada','Soporte dedicado'],
                  btn:'Contactar →', href:'mailto:synqotap@gmail.com'},
              ].map((p, i) => (
                <div key={i} className={`rounded-2xl p-8 relative transition-all duration-300 hover:-translate-y-1 ${p.featured ? 'border border-[#00E5FF] bg-gradient-to-b from-[#00E5FF]/[0.06] to-[#0E0E16]' : 'border border-[#22223A] bg-[#0E0E16]'}`}>
                  {p.featured && <div className="absolute top-5 right-5 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Popular</div>}
                  <div className="text-4xl mb-5">{p.icon}</div>
                  <div className="font-black text-2xl tracking-tight mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{p.name}</div>
                  <div className="text-[#6B6B80] text-sm mb-5 leading-relaxed">{p.desc}</div>
                  <div className="font-black tracking-tight mb-6" style={{fontFamily:"'Syne', sans-serif", fontSize: p.price ? '44px' : '28px'}}>
                    {p.price ? <>${p.price}<span className="text-lg font-normal text-[#6B6B80]"> USD</span></> : 'A medida'}
                  </div>
                  <ul className="mb-7 space-y-2">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/80 py-2 border-b border-[#1C1C2E] last:border-0">
                        <span className="text-[#00E5FF] text-xs">✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <a href={p.href} className={`block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all ${p.featured ? 'bg-[#00E5FF] text-[#07070C] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]' : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`}
                    style={{fontFamily:"'Syne', sans-serif"}}>
                    {p.btn}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO */}
        <section className="py-24 px-6 bg-[#0E0E16]" id="demo">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Demo</div>
                <h2 className="font-black text-3xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Así se ve tu perfil</h2>
                <p className="text-[#6B6B80] text-lg font-light mb-8 leading-relaxed">
                  La página que abre el teléfono al tocar tu tarjeta. Elegante, rápida, y completamente tuya.
                </p>
                <div className="space-y-3 mb-8">
                  {['Carga en menos de 1 segundo','Sin apps ni descargas','Edita en tiempo real','Tu URL: synqotap.com/c/tu-nombre'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <span className="text-[#00E5FF]">→</span>{item}
                    </div>
                  ))}
                </div>
                <a href="/c/synqo-tap-ub9u" target="_blank" className="text-[#00E5FF] font-medium inline-flex items-center gap-2 hover:opacity-70 transition-opacity">
                  Ver demo completo →
                </a>
              </div>
              <div className="bg-[#13131F] border border-[#22223A] rounded-3xl p-8 max-w-xs mx-auto w-full">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white" style={{background:'linear-gradient(135deg,#00E5FF,#7B61FF)', fontFamily:"'Syne', sans-serif"}}>AR</div>
                <div className="text-center font-bold text-xl mb-1" style={{fontFamily:"'Syne', sans-serif"}}>Alex Rivera</div>
                <div className="text-center text-sm text-[#6B6B80] mb-1">CEO & Fundador</div>
                <div className="text-center text-sm text-[#00E5FF] mb-6">TechCorp Solutions</div>
                <div className="space-y-2.5">
                  {[{icon:'📞',label:'Llamar',bg:'rgba(34,197,94,0.12)'},{icon:'💬',label:'WhatsApp',bg:'rgba(37,211,102,0.12)'},{icon:'✉️',label:'Email',bg:'rgba(0,229,255,0.1)'},{icon:'💼',label:'LinkedIn',bg:'rgba(10,102,194,0.12)'}].map((btn, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#0E0E16] border border-[#1C1C2E] rounded-xl p-3 text-sm">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{background:btn.bg}}>{btn.icon}</div>
                      <span>{btn.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-24 px-6" id="precios">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">Precios</div>
            <h2 className="font-black text-3xl sm:text-4xl tracking-tight mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Un pago. Para siempre.</h2>
            <p className="text-[#6B6B80] mb-12 font-light">Sin suscripciones ni comisiones ocultas.</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {type:'PVC Card', price:'39', featured:false, includes:['Tarjeta PVC con NFC','Perfil digital para siempre','Ediciones ilimitadas','3 templates','URL personalizada','Soporte por email'], btn:'Comprar PVC', href:'/checkout'},
                {type:'Metal Card', price:'79', featured:true, includes:['Todo lo del PVC','Acero inoxidable','Acabado premium','Grabado láser','Estuche incluido','Soporte prioritario'], btn:'Comprar Metal', href:'/checkout'},
              ].map((p, i) => (
                <div key={i} className={`rounded-2xl p-8 text-left relative ${p.featured ? 'border border-[#00E5FF]' : 'border border-[#22223A] bg-[#0E0E16]'}`}>
                  {p.featured && <div className="absolute top-5 right-5 bg-[#00E5FF] text-[#07070C] text-xs font-bold px-3 py-1 rounded-full">Recomendado</div>}
                  <div className="font-bold text-lg mb-2" style={{fontFamily:"'Syne', sans-serif"}}>{p.type}</div>
                  <div className="font-black text-5xl tracking-tight leading-none mb-1" style={{fontFamily:"'Syne', sans-serif"}}>${p.price}</div>
                  <div className="text-xs text-[#6B6B80] mb-6">pago único · envío incluido</div>
                  <div className="text-sm text-[#6B6B80] leading-loose mb-6">
                    {p.includes.map((item, j) => <div key={j}>✓ {item}</div>)}
                  </div>
                  <a href={p.href} className={`block w-full text-center py-3.5 rounded-full font-bold text-sm transition-all ${p.featured ? 'bg-[#00E5FF] text-[#07070C]' : 'border border-[#22223A] text-white hover:border-[#00E5FF]/40 hover:text-[#00E5FF]'}`}
                    style={{fontFamily:"'Syne', sans-serif"}}>
                    {p.btn}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 px-6" id="faq">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-3">FAQ</div>
              <h2 className="font-black text-3xl sm:text-4xl tracking-tight" style={{fontFamily:"'Syne', sans-serif"}}>Todo lo que necesitas saber</h2>
            </div>
            <div id="faq-list" className="space-y-0">
              {[
                {q:'¿Necesito una app para usar la tarjeta?',a:'No. Tu tarjeta funciona con el NFC nativo del teléfono. La persona que te escanea solo necesita su smartphone, no descarga nada.'},
                {q:'¿Puedo actualizar mi perfil después?',a:'Sí, todas las veces que quieras sin costo adicional. Cambias el número, el email, el cargo — el cambio se refleja en tiempo real.'},
                {q:'¿Cuánto tiempo tarda el envío?',a:'Programamos y enviamos en 1-3 días hábiles. Entrega en 5-10 días hábiles a México y Latinoamérica.'},
                {q:'¿Qué pasa si pierdo mi tarjeta?',a:'Tu perfil permanece activo. Compras una tarjeta de reemplazo y se programará con tu mismo perfil URL.'},
                {q:'¿Funciona con iPhones y Android?',a:'Sí. NFC funciona en iPhones desde el modelo 7 (iOS 14+) y en prácticamente todos los Android desde 2015.'},
              ].map((item, i) => (
                <div key={i} className="faq-item border-b border-[#1C1C2E] py-5">
                  <div className="faq-q flex justify-between items-center cursor-pointer gap-4 font-bold text-base" style={{fontFamily:"'Syne', sans-serif"}}>
                    {item.q}
                    <span className="text-2xl text-[#00E5FF] font-light flex-shrink-0 transition-transform">+</span>
                  </div>
                  <div className="faq-a text-[#6B6B80] text-sm leading-relaxed overflow-hidden max-h-0 transition-all duration-300">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,229,255,0.06),transparent)]"/>
          <div className="relative max-w-2xl mx-auto">
            <h2 className="font-black text-3xl sm:text-5xl tracking-tight mb-5 leading-tight" style={{fontFamily:"'Syne', sans-serif"}}>
              Deja de repartir<br/>papeles olvidados
            </h2>
            <p className="text-[#6B6B80] text-lg font-light mb-10">Tu próxima conexión merece una primera impresión a la altura.</p>
            <a href="/checkout"
              className="bg-[#00E5FF] text-[#07070C] font-bold px-8 py-4 rounded-full inline-flex items-center gap-2 hover:-translate-y-0.5 transition-transform shadow-[0_0_40px_rgba(0,229,255,0.25)]"
              style={{fontFamily:"'Syne', sans-serif"}}>
              Empezar ahora — desde $39 →
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#0E0E16] border-t border-[#1C1C2E] px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="font-black text-xl mb-3" style={{fontFamily:"'Syne', sans-serif"}}>Synqo<span className="text-[#00E5FF]">Tap</span></div>
                <p className="text-[#6B6B80] text-sm leading-relaxed">La tarjeta de presentación del futuro. NFC + perfil digital ilimitado, un solo pago.</p>
              </div>
              <div>
                <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Producto</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  <li><a href="/checkout" className="hover:text-white transition-colors">Tarjeta PVC</a></li>
                  <li><a href="/checkout" className="hover:text-white transition-colors">Tarjeta Metal</a></li>
                  <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">Empresas</a></li>
                  <li><a href="/c/synqo-tap-ub9u" className="hover:text-white transition-colors">Demo</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Info</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
                  <li><a href="#precios" className="hover:text-white transition-colors">Precios</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">Contacto</a></li>
                </ul>
              </div>
              <div>
                <div className="font-bold text-sm mb-4" style={{fontFamily:"'Syne', sans-serif"}}>Cuenta</div>
                <ul className="space-y-2.5 text-sm text-[#6B6B80]">
                  <li><a href="/login" className="hover:text-white transition-colors">Entrar</a></li>
                  <li><a href="/portal" className="hover:text-white transition-colors">Mi perfil</a></li>
                  <li><a href="/portal" className="hover:text-white transition-colors">Mis pedidos</a></li>
                  <li><a href="mailto:synqotap@gmail.com" className="hover:text-white transition-colors">Soporte</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#1C1C2E] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#6B6B80]">
              <span>© 2025 SynqoTap. Todos los derechos reservados.</span>
              <span><a href="#" className="hover:text-white transition-colors">Privacidad</a> · <a href="#" className="hover:text-white transition-colors">Términos</a></span>
            </div>
          </div>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{__html:`
        const navbar = document.querySelector('nav');
        window.addEventListener('scroll', () => {
          if(window.scrollY > 30) {
            navbar.style.background = 'rgba(7,7,12,0.88)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottomColor = '#1C1C2E';
          } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.borderBottomColor = 'transparent';
          }
        });
        document.querySelectorAll('.faq-q').forEach(q => {
          q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = item.querySelector('.faq-a');
            const icon = q.querySelector('span');
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
            document.querySelectorAll('.faq-a').forEach(a => a.style.maxHeight = '0px');
            document.querySelectorAll('.faq-q span').forEach(s => s.style.transform = 'rotate(0deg)');
            if(!isOpen) {
              answer.style.maxHeight = answer.scrollHeight + 'px';
              answer.style.paddingTop = '12px';
              icon.style.transform = 'rotate(45deg)';
            }
          });
        });
      `}}/>
    </>
  )
}