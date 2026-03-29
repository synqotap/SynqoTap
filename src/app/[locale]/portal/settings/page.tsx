'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      // Si viene de un reset link o es primer login
      const params = new URLSearchParams(window.location.search)
      if (params.get('first') === 'true') setIsFirstLogin(true)
    }
    check()
  }, [])

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('No se pudo actualizar la contraseña. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setTimeout(() => { window.location.href = '/portal' }, 2000)
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:56px}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .back{color:#6B6B80;text-decoration:none;font-size:13px;display:flex;align-items:center;gap:6px;transition:color 0.2s}
        .back:hover{color:#F2F2F4}
        .wrap{max-width:480px;margin:60px auto;padding:0 24px}
        .alert{background:rgba(0,229,255,0.08);border:1px solid rgba(0,229,255,0.2);border-radius:12px;padding:16px 20px;margin-bottom:28px;font-size:14px;color:#F2F2F4;line-height:1.6}
        .alert strong{color:#00E5FF}
        .card{background:#0E0E16;border:1px solid #22223A;border-radius:16px;padding:32px}
        h1{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.5px;margin-bottom:8px}
        .sub{color:#6B6B80;font-size:14px;margin-bottom:28px;line-height:1.5}
        .email-box{background:#13131F;border:1px solid #22223A;border-radius:8px;padding:10px 14px;font-size:13px;color:#6B6B80;margin-bottom:20px}
        .field{margin-bottom:16px}
        label{display:block;font-size:13px;color:#6B6B80;margin-bottom:6px}
        input{width:100%;background:#13131F;border:1px solid #22223A;border-radius:10px;padding:12px 14px;color:#F2F2F4;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s}
        input:focus{border-color:#00E5FF}
        input::placeholder{color:#3A3A50}
        .strength{height:4px;border-radius:2px;margin-top:6px;transition:all 0.3s;background:#22223A}
        .btn{width:100%;padding:13px;border-radius:50px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;background:#00E5FF;color:#07070C;margin-top:8px;transition:opacity 0.2s}
        .btn:hover{opacity:0.85}
        .btn:disabled{opacity:0.5;cursor:not-allowed}
        .error{background:rgba(226,75,74,0.1);border:1px solid rgba(226,75,74,0.3);border-radius:8px;padding:10px 12px;font-size:13px;color:#F09595;margin-bottom:16px}
        .success-box{background:rgba(29,158,117,0.1);border:1px solid rgba(29,158,117,0.3);border-radius:8px;padding:16px;font-size:14px;color:#5DCAA5;text-align:center}
        .hint{font-size:12px;color:#3A3A50;margin-top:4px}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>

      <div className="topbar">
        <a href="/" className="logo">Smart<span>Card</span></a>
        <a href="/portal" className="back">← Volver al portal</a>
      </div>

      <div className="wrap">
        {isFirstLogin && (
          <div className="alert">
            👋 <strong>Bienvenido a SmartCard.</strong> Por seguridad, crea una contraseña personal antes de continuar.
          </div>
        )}

        <div className="card">
          <h1>{isFirstLogin ? 'Crea tu contraseña' : 'Cambiar contraseña'}</h1>
          <p className="sub">
            {isFirstLogin
              ? 'Elige una contraseña segura para acceder a tu portal.'
              : 'Actualiza tu contraseña de acceso al portal.'}
          </p>

          <div className="email-box">📧 {userEmail}</div>

          {success ? (
            <div className="success-box">
              ✓ Contraseña actualizada correctamente. Redirigiendo al portal...
            </div>
          ) : (
            <form onSubmit={handleChange}>
              {error && <div className="error">{error}</div>}

              <div className="field">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <div className="strength" style={{
                  width: password.length === 0 ? '0%' :
                         password.length < 6 ? '25%' :
                         password.length < 10 ? '60%' : '100%',
                  background: password.length === 0 ? '#22223A' :
                              password.length < 6 ? '#E24B4A' :
                              password.length < 10 ? '#EF9F27' : '#1D9E75',
                }}/>
                <div className="hint">
                  {password.length === 0 ? '' :
                   password.length < 6 ? 'Muy corta' :
                   password.length < 10 ? 'Aceptable' : 'Contraseña segura ✓'}
                </div>
              </div>

              <div className="field">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                {confirm && password !== confirm && (
                  <div className="hint" style={{color:'#F09595'}}>No coinciden</div>
                )}
                {confirm && password === confirm && (
                  <div className="hint" style={{color:'#5DCAA5'}}>✓ Coinciden</div>
                )}
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : isFirstLogin ? 'Crear contraseña y entrar →' : 'Actualizar contraseña →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}