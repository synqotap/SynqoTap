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
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUserEmail(user.email || '')
      const params = new URLSearchParams(window.location.search)
      if (params.get('first') === 'true') setIsFirstLogin(true)
    }
    check()
  }, [])

  async function handleChange(e: React.FormEvent) {
    e.preventDefault(); setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('Could not update password. Please try again.'); setLoading(false); return }
    setSuccess(true); setLoading(false)
    setTimeout(() => { window.location.href = '/portal' }, 2000)
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColor = ['#22223A','#E24B4A','#EF9F27','#1D9E75'][strength]
  const strengthLabel = ['','Weak','Fair','Strong ✓'][strength]

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#07070C;color:#F2F2F4;font-family:'DM Sans',sans-serif;min-height:100vh}
        .topbar{background:#0E0E16;border-bottom:1px solid #1C1C2E;padding:0 24px;display:flex;align-items:center;justify-content:space-between;height:56px}
        .logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#F2F2F4;text-decoration:none}
        .logo span{color:#00E5FF}
        .back{color:#6B6B80;text-decoration:none;font-size:13px}
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
        .input-wrap{position:relative}
        input{width:100%;background:#13131F;border:1px solid #22223A;border-radius:10px;padding:12px 14px;color:#F2F2F4;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s}
        input:focus{border-color:#00E5FF}
        input::placeholder{color:#3A3A50}
        .show-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#6B6B80;cursor:pointer;font-size:13px;font-family:'DM Sans',sans-serif}
        .strength-bar{height:4px;border-radius:2px;margin-top:6px;transition:all 0.3s;background:#22223A}
        .hint{font-size:12px;color:#3A3A50;margin-top:4px}
        .btn{width:100%;padding:13px;border-radius:50px;font-family:'Syne',sans-serif;font-weight:700;font-size:15px;cursor:pointer;border:none;background:#00E5FF;color:#07070C;margin-top:8px;transition:opacity 0.2s}
        .btn:hover{opacity:0.85}
        .btn:disabled{opacity:0.5;cursor:not-allowed}
        .error{background:rgba(226,75,74,0.1);border:1px solid rgba(226,75,74,0.3);border-radius:8px;padding:10px 12px;font-size:13px;color:#F09595;margin-bottom:16px}
        .success-box{background:rgba(29,158,117,0.1);border:1px solid rgba(29,158,117,0.3);border-radius:8px;padding:16px;font-size:14px;color:#5DCAA5;text-align:center}
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet"/>
      <div className="topbar">
        <a href="/" className="logo">Synqo<span>Tap</span></a>
        <a href="/portal" className="back">← Back to portal</a>
      </div>
      <div className="wrap">
        {isFirstLogin && (
          <div className="alert">
            👋 <strong>Welcome to SynqoTap.</strong> For your security, please create a personal password before continuing.
          </div>
        )}
        <div className="card">
          <h1>{isFirstLogin ? 'Create your password' : 'Change password'}</h1>
          <p className="sub">{isFirstLogin ? 'Choose a secure password to access your portal.' : 'Update your portal access password.'}</p>
          <div className="email-box">📧 {userEmail}</div>
          {success ? (
            <div className="success-box">✓ Password updated successfully. Redirecting to portal...</div>
          ) : (
            <form onSubmit={handleChange}>
              {error && <div className="error">{error}</div>}
              <div className="field">
                <label>New password</label>
                <div className="input-wrap">
                  <input type={showPass ? 'text' : 'password'} placeholder="Minimum 8 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" style={{paddingRight:'60px'}}/>
                  <button type="button" className="show-btn" onClick={() => setShowPass(!showPass)}>{showPass ? 'Hide' : 'Show'}</button>
                </div>
                <div className="strength-bar" style={{width:password.length===0?'0%':strength===1?'25%':strength===2?'60%':'100%',background:strengthColor}}/>
                <div className="hint" style={{color:strengthColor||'#3A3A50'}}>{strengthLabel}</div>
              </div>
              <div className="field">
                <label>Confirm password</label>
                <input type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password"/>
                {confirm && password !== confirm && <div className="hint" style={{color:'#F09595'}}>Passwords don't match</div>}
                {confirm && password === confirm && <div className="hint" style={{color:'#5DCAA5'}}>✓ Passwords match</div>}
              </div>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Saving...' : isFirstLogin ? 'Create password and enter →' : 'Update password →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}