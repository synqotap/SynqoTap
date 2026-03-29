export default function SuccessPage() {
  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 24px}
        .wrap{max-width:480px;width:100%;margin:0 auto;text-align:center}
        .icon{font-size:64px;margin-bottom:24px;animation:pop 0.5s cubic-bezier(0.23,1,0.32,1)}
        @keyframes pop{0%{transform:scale(0)}100%{transform:scale(1)}}
        h1{font-family:'Syne',sans-serif;font-weight:800;font-size:36px;letter-spacing:-1px;margin-bottom:12px}
        .sub{color:#6B6B80;font-size:16px;line-height:1.7;margin-bottom:32px}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:24px;margin-bottom:28px;text-align:left}
        .card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#00E5FF;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px}
        .step{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #1C1C2E;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5}
        .step:last-child{border-bottom:none}
        .step-num{width:24px;height:24px;border-radius:50%;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:#00E5FF;flex-shrink:0;margin-top:1px}
        .btn{display:inline-flex;align-items:center;gap:8px;background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;transition:opacity 0.2s;box-shadow:0 0 30px rgba(0,229,255,0.2)}
        .btn:hover{opacity:0.85}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400&display=swap" rel="stylesheet"/>

      <div className="wrap">
        <div className="icon">🎉</div>
        <h1>¡Compra exitosa!</h1>
        <p className="sub">Tu pedido está confirmado. En unos minutos recibirás un email con tus credenciales de acceso al portal.</p>

        <div className="card">
          <div className="card-title">¿Qué pasa ahora?</div>
          <div className="step">
            <div className="step-num">1</div>
            <div>Revisa tu email — te enviamos las credenciales para acceder a tu portal.</div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div>Entra al portal y personaliza tu perfil — nombre, botones, logo.</div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div>Programamos tu tarjeta NFC y la enviamos a tu dirección en 1-3 días.</div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div>Recibes tu tarjeta lista para usar. ¡Empieza a compartir tu contacto!</div>
          </div>
        </div>

        <a href="/portal" className="btn">Ir a mi portal →</a>
      </div>
    </>
  )
}