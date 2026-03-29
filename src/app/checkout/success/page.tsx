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
        .card-title{font-family:'Syne',sans-serif;font-weight:700;font-size:13px;color:#00E5FF;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px}
        .step{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #1C1C2E;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.5}
        .step:last-child{border-bottom:none}
        .step-num{width:24px;height:24px;border-radius:50%;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;color:#00E5FF;flex-shrink:0;margin-top:1px}
        .btn{display:inline-flex;align-items:center;gap:8px;background:#00E5FF;color:#07070C;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;padding:14px 32px;border-radius:50px;text-decoration:none;transition:opacity 0.2s}
        .btn:hover{opacity:0.85}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400&display=swap" rel="stylesheet"/>
      <div className="wrap">
        <div className="icon">🎉</div>
        <h1>Purchase successful!</h1>
        <p className="sub">Your order is confirmed. In a few minutes you'll receive an email with your portal access credentials.</p>
        <div className="card">
          <div className="card-title">What happens next?</div>
          {[
            'Check your email — we sent you login credentials for your portal.',
            'Log in and customize your profile — name, buttons, logo.',
            'We program your NFC card and ship it within 1-3 business days.',
            'Receive your card ready to use. Start sharing your contact!',
          ].map((s,i) => (
            <div key={i} className="step">
              <div className="step-num">{i+1}</div>
              <div>{s}</div>
            </div>
          ))}
        </div>
        <a href="/portal" className="btn">Go to my portal →</a>
      </div>
    </>
  )
}