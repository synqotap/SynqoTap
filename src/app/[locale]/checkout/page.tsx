'use client'
import { useState } from 'react'

export default function CheckoutPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleBuy(cardType: 'pvc' | 'metal') {
    setLoading(cardType)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardType, quantity: 1 }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Error al iniciar el pago. Intenta de nuevo.')
    } catch {
      alert('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 24px}
        .wrap{max-width:720px;width:100%;margin:0 auto;text-align:center}
        .back{display:inline-flex;align-items:center;gap:6px;color:#6B6B80;text-decoration:none;font-size:14px;margin-bottom:40px;transition:color 0.2s}
        .back:hover{color:#F2F2F4}
        h1{font-family:'Syne',sans-serif;font-weight:800;font-size:40px;letter-spacing:-1.5px;margin-bottom:12px}
        .sub{color:#6B6B80;font-size:16px;margin-bottom:48px}
        .cards{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px;text-align:left;transition:border-color 0.3s,transform 0.3s;position:relative}
        .card:hover{border-color:rgba(0,229,255,0.3);transform:translateY(-4px)}
        .card.featured{border-color:#00E5FF;background:linear-gradient(160deg,rgba(0,229,255,0.06) 0%,#0E0E16 60%)}
        .badge{position:absolute;top:20px;right:20px;background:#00E5FF;color:#07070C;font-size:11px;font-weight:700;padding:4px 10px;border-radius:50px}
        .icon{font-size:36px;margin-bottom:16px}
        .name{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;margin-bottom:8px}
        .desc{color:#6B6B80;font-size:14px;margin-bottom:20px;line-height:1.6}
        .price{font-family:'Syne',sans-serif;font-weight:800;font-size:44px;letter-spacing:-2px;margin-bottom:24px}
        .price span{font-size:16px;font-weight:400;color:#6B6B80;letter-spacing:0}
        .features{list-style:none;margin-bottom:28px}
        .features li{display:flex;align-items:center;gap:8px;font-size:14px;padding:7px 0;border-bottom:1px solid #1C1C2E;color:rgba(255,255,255,0.8)}
        .features li:last-child{border-bottom:none}
        .check{color:#00E5FF}
        .btn{width:100%;padding:14px;border-radius:50px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;transition:all 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn-cyan{background:#00E5FF;color:#07070C;box-shadow:0 0 30px rgba(0,229,255,0.2)}
        .btn-cyan:hover{box-shadow:0 0 50px rgba(0,229,255,0.4)}
        .btn-outline{background:transparent;color:#F2F2F4;border:1px solid #22223A}
        .btn-outline:hover{border-color:rgba(0,229,255,0.4);color:#00E5FF}
        .btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#07070C;border-radius:50%;animation:spin 0.8s linear infinite}
        .spinner-white{border:2px solid rgba(255,255,255,0.2);border-top-color:#F2F2F4}
        @keyframes spin{to{transform:rotate(360deg)}}
        .secure{margin-top:24px;font-size:13px;color:#6B6B80}
        @media(max-width:600px){.cards{grid-template-columns:1fr}}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@300;400&display=swap" rel="stylesheet"/>

      <div className="wrap">
        <a href="/" className="back">← Volver al inicio</a>
        <h1>Elige tu SmartCard</h1>
        <p className="sub">Pago único. Sin suscripciones. Envío incluido.</p>

        <div className="cards">
          {/* PVC */}
          <div className="card">
            <div className="icon">💳</div>
            <div className="name">PVC Card</div>
            <div className="desc">Ligera, resistente y elegante. Perfecta para networking cotidiano.</div>
            <div className="price">$39<span> USD</span></div>
            <ul className="features">
              <li><span className="check">✓</span> Chip NFC programado</li>
              <li><span className="check">✓</span> Perfil digital ilimitado</li>
              <li><span className="check">✓</span> Actualizaciones en tiempo real</li>
              <li><span className="check">✓</span> URL personalizada</li>
              <li><span className="check">✓</span> 3 templates de diseño</li>
            </ul>
            <button
              className="btn btn-outline"
              onClick={() => handleBuy('pvc')}
              disabled={loading !== null}
            >
              {loading === 'pvc' ? <><div className="spinner spinner-white"/>Procesando...</> : 'Comprar PVC →'}
            </button>
          </div>

          {/* METAL */}
          <div className="card featured">
            <div className="badge">Popular</div>
            <div className="icon">⚡</div>
            <div className="name">Metal Card</div>
            <div className="desc">Acero inoxidable premium. Primera impresión que no se olvida.</div>
            <div className="price">$79<span> USD</span></div>
            <ul className="features">
              <li><span className="check">✓</span> Todo lo del PVC</li>
              <li><span className="check">✓</span> Acero inoxidable premium</li>
              <li><span className="check">✓</span> Acabado mate o espejo</li>
              <li><span className="check">✓</span> Grabado láser incluido</li>
              <li><span className="check">✓</span> Estuche de presentación</li>
            </ul>
            <button
              className="btn btn-cyan"
              onClick={() => handleBuy('metal')}
              disabled={loading !== null}
            >
              {loading === 'metal' ? <><div className="spinner"/>Procesando...</> : 'Comprar Metal →'}
            </button>
          </div>
        </div>

        <p className="secure">🔒 Pago seguro con Stripe · Tu información está protegida</p>
      </div>
    </>
  )
}