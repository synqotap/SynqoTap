'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    window.location.href = '/portal/settings?first=true'
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/settings`,
    })

    if (error) {
      setError('No se pudo enviar el email. Intenta de nuevo.')
    } else {
      setSuccess('Te enviamos un email para restablecer tu contraseña.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .wrap{width:100%;max-width:400px}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;text-align:center;margin-bottom:40px;text-decoration:none;color:#F2F2F4;display:block}
        .logo span{color:#00E5FF}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:20px;padding:36px}
        h1{font-family:'Syne',sans-serif;font-weight:800;font-size:24px;letter-spacing:-0.5px;margin-bottom:8px}
        .sub{color:#6B6B80;font-size:14px;margin-bottom:28px;line-height:1.5}
        .field{margin-bottom:16px}
        label{display:block;font-size:13px;color:#6B6B80;margin-bottom:6px}
        input{width:100%;background:#13131F;border:1px solid #22223A;border-radius:10px;padding:12px 14px;color:#F2F2F4;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s}
        input:focus{border-color:#00E5FF}
        input::placeholder{color:#3A3A50}
        .btn{width:100%;padding:13px;border-radius:50px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;background:#00E5FF;color:#07070C;margin-top:8px;transition:opacity 0.2s;display:flex;align-items:center;justify-content:center;gap:8px}
        .btn:hover{opacity:0.85}
        .btn:disabled{opacity:0.5;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,0.2);border-top-color:#07070C;border-radius:50%;animation:spin 0.8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .error{background:rgba(226,75,74,0.1);border:1px solid rgba(226,75,74,0.3);border-radius:8px;padding:10px 12px;font-size:13px;color:#F09595;margin-bottom:16px}
        .success-box{background:rgba(99,153,34,0.1);border:1px solid rgba(99,153,34,0.3);border-radius:8px;padding:10px 12px;font-size:13px;color:#97C459;margin-bottom:16px}
        .link-btn{background:none;border:none;color:#00E5FF;font-size:13px;cursor:pointer;padding:0;font-family:'DM Sans',sans-serif;transition:opacity 0.2s}
        .link-btn:hover{opacity:0.7}
        .footer{text-align:center;margin-top:20px;font-size:13px;color:#6B6B80}
        .divider{border:none;border-top:1px solid #1C1C2E;margin:20px 0}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>

      <div className="wrap">
        <a href="/" className="logo">Smart<span>Card</span></a>

        <div className="card">
          {mode === 'login' ? (
            <>
              <h1>Bienvenido de vuelta</h1>
              <p className="sub">Ingresa a tu portal para editar tu perfil y ver el estado de tu pedido.</p>

              {error && <div className="error">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? <><div className="spinner"/>Entrando...</> : 'Entrar al portal →'}
                </button>
              </form>

              <hr className="divider"/>
              <div className="footer">
                ¿Olvidaste tu contraseña?{' '}
                <button className="link-btn" onClick={() => { setMode('reset'); setError('') }}>
                  Recupérala aquí
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Recuperar contraseña</h1>
              <p className="sub">Te enviamos un link para crear una contraseña nueva.</p>

              {error && <div className="error">{error}</div>}
              {success && <div className="success-box">{success}</div>}

              {!success && (
                <form onSubmit={handleReset}>
                  <div className="field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button className="btn" type="submit" disabled={loading}>
                    {loading ? <><div className="spinner"/>Enviando...</> : 'Enviar link →'}
                  </button>
                </form>
              )}

              <hr className="divider"/>
              <div className="footer">
                <button className="link-btn" onClick={() => { setMode('login'); setError(''); setSuccess('') }}>
                  ← Volver al login
                </button>
              </div>
            </>
          )}
        </div>

        <div className="footer" style={{marginTop:'24px'}}>
          ¿No tienes cuenta? <a href="/checkout" style={{color:'#00E5FF',textDecoration:'none'}}>Compra tu SmartCard</a>
        </div>
      </div>
    </>
  )
}