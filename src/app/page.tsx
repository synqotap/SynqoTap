import Link from 'next/link'

export default function Home() {

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#07070C;--bg2:#0E0E16;--bg3:#13131F;
          --cyan:#00E5FF;--white:#F2F2F4;--muted:#6B6B80;--border:#1C1C2E;--card-border:#22223A;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:'DM Sans',sans-serif;font-size:16px;line-height:1.6;overflow-x:hidden}
        body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");opacity:0.025;pointer-events:none;z-index:0}
        .orb{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0}
        .orb-1{width:600px;height:600px;background:rgba(0,229,255,0.07);top:-200px;right:-150px}
        .orb-2{width:500px;height:500px;background:rgba(120,80,255,0.05);bottom:10%;left:-150px}
        .container{max-width:1140px;margin:0 auto;padding:0 24px;position:relative;z-index:1}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;border-bottom:1px solid transparent;transition:border-color 0.3s,background 0.3s}
        nav.scrolled{background:rgba(7,7,12,0.88);backdrop-filter:blur(20px);border-color:var(--border)}
        .nav-inner{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:20px;color:var(--white);text-decoration:none;letter-spacing:-0.5px}
.logo span{color:var(--cyan)}
        .nav-links{display:flex;align-items:center;gap:32px;list-style:none}
        .nav-links a{color:var(--muted);text-decoration:none;font-size:14px;transition:color 0.2s}
        .nav-links a:hover{color:var(--white)}
        .nav-cta{background:var(--cyan);color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:13px;padding:9px 20px;border-radius:50px;text-decoration:none;transition:opacity 0.2s}
        .nav-cta:hover{opacity:0.85}
        .hero{min-height:100vh;display:flex;align-items:center;padding:120px 0 80px;position:relative}
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);color:var(--cyan);font-size:12px;font-weight:500;letter-spacing:1px;text-transform:uppercase;padding:6px 14px;border-radius:50px;margin-bottom:24px}
        .hero-tag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
        .hero h1{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(40px,5vw,68px);line-height:1.05;letter-spacing:-2px;margin-bottom:24px}
        .hero h1 em{font-style:normal;color:var(--cyan)}
        .hero p{color:var(--muted);font-size:18px;line-height:1.7;max-width:460px;margin-bottom:40px;font-weight:300}
        .hero-actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
        .btn-primary{background:var(--cyan);color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 0 40px rgba(0,229,255,0.25)}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 50px rgba(0,229,255,0.4)}
        .btn-ghost{color:var(--white);font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;opacity:0.7;transition:opacity 0.2s}
        .btn-ghost:hover{opacity:1}
        .hero-stats{display:flex;gap:32px;margin-top:48px;padding-top:40px;border-top:1px solid var(--border)}
        .stat-num{display:block;font-family:'Syne',sans-serif;font-weight:800;font-size:28px;color:var(--white)}
        .stat-label{display:block;font-size:13px;color:var(--muted)}
        .card-scene{perspective:1000px;display:flex;justify-content:center;align-items:center;height:420px;position:relative}
        .card-3d{width:340px;height:214px;border-radius:16px;background:linear-gradient(135deg,#12122A 0%,#1A1A38 50%,#0E0E20 100%);border:1px solid rgba(0,229,255,0.25);transform:rotateY(-15deg) rotateX(5deg);transform-style:preserve-3d;transition:transform 0.6s cubic-bezier(0.23,1,0.32,1);box-shadow:0 40px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04),inset 0 1px 0 rgba(255,255,255,0.08);position:relative;overflow:hidden;cursor:pointer}
        .card-3d:hover{transform:rotateY(5deg) rotateX(-3deg) scale(1.03)}
        .card-chip{width:42px;height:32px;background:linear-gradient(135deg,#C8A04B,#E8C87A,#B8903C);border-radius:6px;position:absolute;top:36px;left:28px}
        .card-glow{position:absolute;inset:0;background:radial-gradient(circle at 30% 50%,rgba(0,229,255,0.12) 0%,transparent 60%)}
        .card-shimmer{position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%);animation:shimmer 3s infinite}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        .card-name{position:absolute;bottom:40px;left:28px;font-family:'Syne',sans-serif;font-weight:700;font-size:18px;letter-spacing:1px;color:var(--white)}
        .card-title{position:absolute;bottom:22px;left:28px;font-size:12px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase}
        .card-badge{position:absolute;background:var(--bg3);border:1px solid var(--card-border);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.4)}
        .badge-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .badge-1{top:40px;right:-20px;animation:float 4s ease-in-out infinite}
        .badge-2{bottom:60px;left:-30px;animation:float 4s ease-in-out infinite 1.5s}
        .badge-3{bottom:20px;right:10px;animation:float 4s ease-in-out infinite 2.8s}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .section{padding:100px 0}
        .section-label{font-size:12px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--cyan);margin-bottom:16px}
        .section-title{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(32px,4vw,52px);letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px}
        .section-sub{color:var(--muted);font-size:18px;font-weight:300;max-width:540px}
        .steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:60px}
        .step{background:var(--bg2);padding:40px 32px;position:relative;overflow:hidden}
        .step:first-child{border-radius:14px 0 0 14px}
        .step:last-child{border-radius:0 14px 14px 0}
        .step::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);opacity:0;transition:opacity 0.3s}
        .step:hover::before{opacity:1}
        .step-num{font-family:'Syne',sans-serif;font-weight:800;font-size:56px;color:rgba(255,255,255,0.04);line-height:1;margin-bottom:20px;letter-spacing:-3px}
        .step-icon{width:48px;height:48px;border-radius:12px;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.2);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:22px}
        .step h3{font-family:'Syne',sans-serif;font-weight:700;font-size:20px;margin-bottom:10px;letter-spacing:-0.5px}
        .step p{color:var(--muted);font-size:14px;line-height:1.7}
        .products-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px}
        .product-card{background:var(--bg2);border:1px solid var(--card-border);border-radius:14px;padding:32px;position:relative;transition:border-color 0.3s,transform 0.3s;overflow:hidden}
        .product-card:hover{border-color:rgba(0,229,255,0.3);transform:translateY(-4px)}
        .product-card.featured{border-color:var(--cyan);background:linear-gradient(160deg,rgba(0,229,255,0.06) 0%,var(--bg2) 60%)}
        .product-badge{position:absolute;top:20px;right:20px;background:var(--cyan);color:#07070C;font-size:11px;font-weight:700;letter-spacing:0.5px;padding:4px 10px;border-radius:50px;text-transform:uppercase}
        .product-icon{font-size:36px;margin-bottom:20px}
        .product-name{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;letter-spacing:-0.5px;margin-bottom:8px}
        .product-desc{color:var(--muted);font-size:14px;margin-bottom:24px;line-height:1.6}
        .product-price{font-family:'Syne',sans-serif;font-weight:800;font-size:40px;letter-spacing:-2px;margin-bottom:24px}
        .product-price span{font-size:18px;font-weight:400;color:var(--muted);letter-spacing:0}
        .product-features{list-style:none;margin-bottom:28px}
        .product-features li{display:flex;align-items:center;gap:10px;font-size:14px;padding:8px 0;color:rgba(255,255,255,0.8);border-bottom:1px solid var(--border)}
        .product-features li:last-child{border-bottom:none}
        .check{color:var(--cyan);font-size:14px;flex-shrink:0}
        .btn-buy{width:100%;padding:14px;border-radius:50px;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;text-align:center;text-decoration:none;display:block;transition:all 0.2s;cursor:pointer;border:none}
        .btn-buy-primary{background:var(--cyan);color:#07070C;box-shadow:0 0 30px rgba(0,229,255,0.2)}
        .btn-buy-primary:hover{box-shadow:0 0 50px rgba(0,229,255,0.4)}
        .btn-buy-outline{background:transparent;color:var(--white);border:1px solid var(--card-border)}
        .btn-buy-outline:hover{border-color:rgba(0,229,255,0.4);color:var(--cyan)}
        .demo-section{background:var(--bg2);padding:100px 0}
        .demo-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .profile-preview{background:var(--bg3);border:1px solid var(--card-border);border-radius:24px;padding:40px;max-width:340px;margin:0 auto}
        .profile-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--cyan),#7B61FF);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:28px;color:#fff}
        .profile-name{text-align:center;font-family:'Syne',sans-serif;font-weight:700;font-size:22px;letter-spacing:-0.5px;margin-bottom:4px}
        .profile-role{text-align:center;font-size:14px;color:var(--muted);margin-bottom:2px}
        .profile-company{text-align:center;font-size:14px;color:var(--cyan);margin-bottom:24px}
        .profile-buttons{display:flex;flex-direction:column;gap:10px}
        .profile-btn{display:flex;align-items:center;gap:12px;background:var(--bg2);border:1px solid var(--card-border);border-radius:12px;padding:13px 16px;text-decoration:none;color:var(--white);font-size:14px;transition:border-color 0.2s}
        .profile-btn:hover{border-color:rgba(0,229,255,0.3)}
        .profile-btn-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:680px;margin:60px auto 0}
        .pricing-card{background:var(--bg2);border:1px solid var(--card-border);border-radius:14px;padding:36px;text-align:center;position:relative;transition:border-color 0.3s}
        .pricing-card.featured{border-color:var(--cyan)}
        .pricing-type{font-family:'Syne',sans-serif;font-weight:700;font-size:20px;margin-bottom:8px}
        .pricing-amount{font-family:'Syne',sans-serif;font-weight:800;font-size:52px;letter-spacing:-3px;line-height:1}
        .pricing-period{font-size:13px;color:var(--muted);margin:8px 0 28px}
        .pricing-includes{text-align:left;font-size:13px;color:var(--muted);line-height:2}
        .faq-grid{max-width:680px;margin:60px auto 0}
        .faq-item{border-bottom:1px solid var(--border);padding:24px 0}
        .faq-q{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;gap:16px;letter-spacing:-0.3px}
        .faq-q::after{content:'+';font-size:24px;color:var(--cyan);flex-shrink:0;transition:transform 0.3s;font-weight:300}
        .faq-item.open .faq-q::after{transform:rotate(45deg)}
        .faq-a{color:var(--muted);font-size:15px;line-height:1.7;max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s}
        .faq-item.open .faq-a{max-height:200px;padding-top:14px}
        .cta-section{padding:120px 0;text-align:center;position:relative;overflow:hidden}
        .cta-section::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(0,229,255,0.06) 0%,transparent 70%)}
        .cta-section h2{font-family:'Syne',sans-serif;font-weight:800;font-size:clamp(36px,5vw,64px);letter-spacing:-2px;margin-bottom:20px;line-height:1.05}
        .cta-section p{color:var(--muted);font-size:18px;max-width:480px;margin:0 auto 40px;font-weight:300}
        footer{background:var(--bg2);border-top:1px solid var(--border);padding:60px 0 32px}
        .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}
        .footer-brand p{color:var(--muted);font-size:14px;line-height:1.7;margin-top:12px;max-width:260px}
        .footer-col h4{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;margin-bottom:16px;letter-spacing:0.5px}
        .footer-col ul{list-style:none}
        .footer-col li{margin-bottom:10px}
        .footer-col a{color:var(--muted);text-decoration:none;font-size:14px;transition:color 0.2s}
        .footer-col a:hover{color:var(--white)}
        .footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--muted)}
        .footer-bottom a{color:var(--muted);text-decoration:none}
        .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}
        .reveal-delay-1{transition-delay:0.1s}
        .reveal-delay-2{transition-delay:0.2s}
        .reveal-delay-3{transition-delay:0.3s}
        @media(max-width:900px){
          .hero-grid,.demo-grid{grid-template-columns:1fr;gap:48px}
          .steps-grid,.products-grid{grid-template-columns:1fr}
          .step:first-child,.step:last-child{border-radius:14px}
          .pricing-grid{grid-template-columns:1fr}
          .footer-grid{grid-template-columns:1fr 1fr;gap:32px}
          .nav-links{display:none}
        }
        @media(max-width:600px){
          .hero-stats{flex-direction:column;gap:16px}
          .footer-grid{grid-template-columns:1fr}
          .footer-bottom{flex-direction:column;gap:8px;text-align:center}
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500&display=swap" rel="stylesheet"/>

      <div className="orb orb-1"/>
      <div className="orb orb-2"/>

      {/* NAV */}
      <nav id="navbar">
        <div className="container">
          <div className="nav-inner">
            <a href="/" className="logo">Synqo<span>Tap</span></a>
            <ul className="nav-links">
              <li><a href="#productos">Productos</a></li>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#precios">Precios</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="/login">Entrar</a></li>
            </ul>
            <a href="/checkout" className="nav-cta">Comprar ahora →</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-tag reveal">Tecnología NFC</div>
              <h1 className="reveal reveal-delay-1">Comparte tus datos<br/>con un solo <em>toque</em></h1>
              <p className="reveal reveal-delay-2">Una tarjeta física con chip NFC conectada a tu perfil digital. Sin apps, sin fricciones. Tu contacto completo, siempre actualizado.</p>
              <div className="hero-actions reveal reveal-delay-3">
                <a href="/checkout" className="btn-primary">Conseguir mi tarjeta →</a>
                <a href="#demo" className="btn-ghost">Ver demo en vivo ▶</a>
              </div>
              <div className="hero-stats reveal">
                <div className="stat"><span className="stat-num">3s</span><span className="stat-label">Para compartir contacto</span></div>
                <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Actualizaciones gratis</span></div>
                <div className="stat"><span className="stat-num">24h</span><span className="stat-label">Perfil activo tras compra</span></div>
              </div>
            </div>
            <div className="card-scene">
              <div className="card-badge badge-1">
                <span className="badge-dot" style={{background:'#00E5FF'}}></span>
                <span style={{fontSize:'12px',color:'#6B6B80'}}>Perfil actualizado</span>
              </div>
              <div className="card-badge badge-2">
                <span style={{fontSize:'18px'}}>📱</span>
                <span style={{fontSize:'12px',color:'#6B6B80'}}>Compatible con todos<br/>los smartphones</span>
              </div>
              <div className="card-badge badge-3">
                <span className="badge-dot" style={{background:'#22C55E'}}></span>
                <span style={{fontSize:'12px',color:'#6B6B80'}}>NFC activo</span>
              </div>
              <div className="card-3d" id="card3d">
                <div className="card-glow"/>
                <div className="card-shimmer"/>
                <div className="card-chip"/>
                <div className="card-name">ALEX RIVERA</div>
                <div className="card-title">CEO · TECHCORP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="como-funciona">
        <div className="container">
          <div className="reveal">
            <div className="section-label">Proceso</div>
            <h2 className="section-title">Tan simple como debería ser</h2>
            <p className="section-sub">De la compra a compartir tu contacto en menos de 48 horas.</p>
          </div>
          <div className="steps-grid">
            <div className="step reveal reveal-delay-1">
              <div className="step-num">01</div>
              <div className="step-icon">🛒</div>
              <h3>Elige y compra</h3>
              <p>Selecciona tu tarjeta (PVC o Metal) y completa el pago en segundos. Tu perfil se crea automáticamente.</p>
            </div>
            <div className="step reveal reveal-delay-2">
              <div className="step-num">02</div>
              <div className="step-icon">✏️</div>
              <h3>Personaliza tu perfil</h3>
              <p>Accede a tu portal, sube tu logo, agrega tus datos y configura tus botones. Los cambios se ven al instante.</p>
            </div>
            <div className="step reveal reveal-delay-3">
              <div className="step-num">03</div>
              <div className="step-icon">📦</div>
              <h3>Recibe y usa</h3>
              <p>Tu tarjeta llega programada y lista. Acércala a cualquier smartphone y comparte tu contacto con un toque.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section" id="productos" style={{paddingTop:0}}>
        <div className="container">
          <div className="reveal">
            <div className="section-label">Productos</div>
            <h2 className="section-title">Elige tu tarjeta</h2>
            <p className="section-sub">Dos materiales, el mismo poder. Ambas incluyen perfil digital ilimitado.</p>
          </div>
          <div className="products-grid">
            <div className="product-card reveal reveal-delay-1">
              <div className="product-icon">💳</div>
              <div className="product-name">PVC Card</div>
              <div className="product-desc">Ligera, resistente y elegante. Perfecta para networking cotidiano.</div>
              <div className="product-price">$39<span> USD</span></div>
              <ul className="product-features">
                <li><span className="check">✓</span> Chip NFC programado</li>
                <li><span className="check">✓</span> Perfil digital ilimitado</li>
                <li><span className="check">✓</span> Actualizaciones en tiempo real</li>
                <li><span className="check">✓</span> URL personalizada</li>
                <li><span className="check">✓</span> 3 templates de diseño</li>
              </ul>
              <a href="/checkout" className="btn-buy btn-buy-outline">Comprar PVC →</a>
            </div>
            <div className="product-card featured reveal reveal-delay-2">
              <div className="product-badge">Popular</div>
              <div className="product-icon">⚡</div>
              <div className="product-name">Metal Card</div>
              <div className="product-desc">Acabado en acero inoxidable. Primera impresión que no se olvida.</div>
              <div className="product-price">$79<span> USD</span></div>
              <ul className="product-features">
                <li><span className="check">✓</span> Todo lo del PVC</li>
                <li><span className="check">✓</span> Acero inoxidable premium</li>
                <li><span className="check">✓</span> Acabado mate o espejo</li>
                <li><span className="check">✓</span> Grabado láser incluido</li>
                <li><span className="check">✓</span> Estuche de presentación</li>
              </ul>
              <a href="/checkout" className="btn-buy btn-buy-primary">Comprar Metal →</a>
            </div>
            <div className="product-card reveal reveal-delay-3">
              <div className="product-icon">🏢</div>
              <div className="product-name">Empresas</div>
              <div className="product-desc">Volumen para equipos. Descuentos desde 10 unidades.</div>
              <div className="product-price" style={{fontSize:'32px'}}>A medida</div>
              <ul className="product-features">
                <li><span className="check">✓</span> Pedidos desde 10 unidades</li>
                <li><span className="check">✓</span> Descuentos por volumen</li>
                <li><span className="check">✓</span> Branding corporativo</li>
                <li><span className="check">✓</span> Gestión centralizada</li>
                <li><span className="check">✓</span> Soporte dedicado</li>
              </ul>
              <a href="mailto:synqotap@gmail.com" className="btn-buy btn-buy-outline">Contactar →</a>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="demo-section" id="demo">
        <div className="container">
          <div className="demo-grid">
            <div className="reveal">
              <div className="section-label">Demo</div>
              <h2 className="section-title">Así se ve tu perfil</h2>
              <p style={{color:'var(--muted)',fontSize:'17px',lineHeight:1.7,marginBottom:'32px',fontWeight:300}}>La página que abre el teléfono al tocar tu tarjeta. Elegante, rápida, y completamente tuya.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {['Carga en menos de 1 segundo','Sin apps ni descargas para quien te escanea','Edita en tiempo real desde tu portal','Tu URL: synqotap.com/c/tu-nombre'].map((item,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',fontSize:'15px'}}>
                    <span style={{color:'var(--cyan)'}}>→</span>
                    <span style={{color:'rgba(255,255,255,0.7)'}}>{item}</span>
                  </div>
                ))}
              </div>
              <a href="/c/synqo-tap-ub9u" target="_blank" style={{display:'inline-flex',alignItems:'center',gap:'8px',marginTop:'36px',color:'var(--cyan)',textDecoration:'none',fontWeight:500}}>
                Ver demo completo →
              </a>
            </div>
            <div className="reveal reveal-delay-2">
              <div className="profile-preview">
                <div className="profile-avatar">AR</div>
                <div className="profile-name">Alex Rivera</div>
                <div className="profile-role">CEO & Fundador</div>
                <div className="profile-company">TechCorp Solutions</div>
                <div className="profile-buttons">
                  {[
                    {icon:'📞',label:'Llamar',bg:'rgba(34,197,94,0.15)'},
                    {icon:'💬',label:'WhatsApp',bg:'rgba(37,211,102,0.15)'},
                    {icon:'✉️',label:'Email',bg:'rgba(0,229,255,0.1)'},
                    {icon:'💼',label:'LinkedIn',bg:'rgba(10,102,194,0.15)'},
                  ].map((btn,i) => (
                    <a key={i} href="#" className="profile-btn">
                      <div className="profile-btn-icon" style={{background:btn.bg}}>{btn.icon}</div>
                      <span>{btn.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="precios">
        <div className="container" style={{textAlign:'center'}}>
          <div className="reveal">
            <div className="section-label">Precios</div>
            <h2 className="section-title">Un pago. Para siempre.</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Sin suscripciones ni comisiones ocultas. Compra una vez y tu perfil es tuyo indefinidamente.</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card reveal reveal-delay-1">
              <div className="pricing-type">PVC Card</div>
              <div className="pricing-amount">$39</div>
              <div className="pricing-period">pago único · envío incluido</div>
              <div className="pricing-includes">✓ Tarjeta PVC con NFC<br/>✓ Perfil digital para siempre<br/>✓ Ediciones ilimitadas<br/>✓ 3 templates<br/>✓ URL personalizada<br/>✓ Soporte por email</div>
              <br/>
              <a href="/checkout" className="btn-buy btn-buy-outline">Comprar PVC</a>
            </div>
            <div className="pricing-card featured reveal reveal-delay-2">
              <div className="product-badge">Recomendado</div>
              <div className="pricing-type">Metal Card</div>
              <div className="pricing-amount">$79</div>
              <div className="pricing-period">pago único · envío incluido</div>
              <div className="pricing-includes">✓ Todo lo del PVC<br/>✓ Acero inoxidable<br/>✓ Acabado premium<br/>✓ Grabado láser<br/>✓ Estuche incluido<br/>✓ Soporte prioritario</div>
              <br/>
              <a href="/checkout" className="btn-buy btn-buy-primary">Comprar Metal</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{paddingTop:0}}>
        <div className="container">
          <div className="reveal" style={{textAlign:'center'}}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Todo lo que necesitas saber</h2>
          </div>
          <div className="faq-grid" id="faq-list">
            {[
              {q:'¿Necesito una app para usar la tarjeta?',a:'No. Tu tarjeta funciona con el NFC nativo del teléfono. La persona que te escanea solo necesita su smartphone, no descarga nada.'},
              {q:'¿Puedo actualizar mi perfil después?',a:'Sí, todas las veces que quieras sin costo adicional. Cambias el número, el email, el cargo — el cambio se refleja en tiempo real.'},
              {q:'¿Cuánto tiempo tarda el envío?',a:'Programamos y enviamos en 1-3 días hábiles. Entrega en 5-10 días hábiles a México y Latinoamérica.'},
              {q:'¿Qué pasa si pierdo mi tarjeta?',a:'Tu perfil permanece activo. Compras una tarjeta de reemplazo y se programará con tu mismo perfil URL.'},
              {q:'¿Funciona con iPhones y Android?',a:'Sí. NFC funciona en iPhones desde el modelo 7 (iOS 14+) y en prácticamente todos los Android desde 2015.'},
            ].map((item,i) => (
              <div key={i} className="faq-item">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="reveal">Deja de repartir<br/>papeles olvidados</h2>
          <p className="reveal reveal-delay-1">Tu próxima conexión merece una primera impresión a la altura.</p>
          <a href="/checkout" className="btn-primary reveal reveal-delay-2" style={{display:'inline-flex'}}>Empezar ahora — desde $39 →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo" style={{fontSize:'22px'}}>Synqo<span>Tap</span></div>  
              <p>La tarjeta de presentación del futuro. NFC + perfil digital ilimitado, un solo pago.</p>
            </div>
            <div className="footer-col"><h4>Producto</h4><ul>
              <li><a href="/checkout">Tarjeta PVC</a></li>
              <li><a href="/checkout">Tarjeta Metal</a></li>
              <li><a href="mailto:synqotap@gmail.com">Empresas</a></li>
              <li><a href="/c/synqo-tap-ub9u">Demo</a></li>
            </ul></div>
            <div className="footer-col"><h4>Info</h4><ul>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#precios">Precios</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="mailto:synqotap@gmail.com">Contacto</a></li>
            </ul></div>
            <div className="footer-col"><h4>Cuenta</h4><ul>
              <li><a href="/login">Entrar</a></li>
              <li><a href="/portal">Mi perfil</a></li>
              <li><a href="/portal">Mis pedidos</a></li>
              <li><a href="mailto:synqotap@gmail.com">Soporte</a></li>
            </ul></div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 SynqoTap. Todos los derechos reservados.</span>
            <span><a href="#">Privacidad</a> · <a href="#">Términos</a></span>
          </div>
        </div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30));
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') }), {threshold:0.1,rootMargin:'0px 0px -40px 0px'});
        reveals.forEach(r => observer.observe(r));
        setTimeout(() => reveals.forEach(r => { if(r.getBoundingClientRect().top < window.innerHeight) r.classList.add('visible') }), 50);
        const card = document.getElementById('card3d');
        if(card) document.addEventListener('mousemove', e => {
          const rx = ((e.clientY - window.innerHeight/2) / (window.innerHeight/2)) * -8;
          const ry = ((e.clientX - window.innerWidth/2) / (window.innerWidth/2)) * 12;
          card.style.transform = 'rotateX('+rx+'deg) rotateY('+ry+'deg)';
        });
        document.querySelectorAll('.faq-q').forEach(q => q.addEventListener('click', () => {
          const item = q.parentElement;
          const wasOpen = item.classList.contains('open');
          document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
          if(!wasOpen) item.classList.add('open');
        }));
      `}}/>
    </>
  )
}