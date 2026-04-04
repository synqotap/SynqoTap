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
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('Could not update password. Please try again.'); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
    setTimeout(() => { window.location.href = '/portal' }, 2000)
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthColors = ['', '#E24B4A', '#EF9F27', '#1D9E75']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong ✓']
  const strengthWidths = ['0%', '25%', '60%', '100%']

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans">
      <header className="bg-[#0E0E16] border-b border-[#1C1C2E] px-6 h-14 flex items-center justify-between sticky top-0 z-10">
        <a href="/" className="font-syne font-black text-lg">
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>
        <a href="/portal" className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">
          ← Back to portal
        </a>
      </header>

      <div className="max-w-md mx-auto px-5 py-12">
        {isFirstLogin && (
          <div className="bg-[#00E5FF]/[0.08] border border-[#00E5FF]/20 rounded-xl px-5 py-4 mb-6 text-sm leading-relaxed">
            👋 <strong className="text-[#00E5FF]">Welcome to SynqoTap.</strong> Please create a personal password before continuing.
          </div>
        )}

        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8">
          <h1 className="font-syne font-black text-xl tracking-tight mb-2">
            {isFirstLogin ? 'Create your password' : 'Change password'}
          </h1>
          <p className="text-sm text-[#6B6B80] mb-6">
            {isFirstLogin
              ? 'Choose a secure password to access your portal.'
              : 'Update your portal access password.'}
          </p>

          <div className="text-xs text-[#6B6B80] bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 mb-5">
            📧 {userEmail}
          </div>

          {success ? (
            <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl px-4 py-4 text-sm text-[#5DCAA5] text-center">
              ✓ Password updated. Redirecting to portal...
            </div>
          ) : (
            <form onSubmit={handleChange} className="flex flex-col gap-4">
              {error && (
                <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-4 py-3 text-sm text-[#F09595]">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">New password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    autoComplete="new-password"
                    className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B6B80] hover:text-[#F2F2F4]"
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full bg-[#22223A] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: strengthWidths[strength], background: strengthColors[strength] }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>
                      {strengthLabels[strength]}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-[#6B6B80] mb-1.5 block">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
                {confirm && (
                  <p className="text-xs mt-1" style={{ color: password === confirm ? '#5DCAA5' : '#F09595' }}>
                    {password === confirm ? '✓ Passwords match' : "Passwords don't match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00E5FF] text-[#07070C] font-syne font-bold py-3.5 rounded-full hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-[#07070C]/20 border-t-[#07070C] animate-spin" />
                    Saving...
                  </>
                ) : (
                  isFirstLogin ? 'Create password and enter →' : 'Update password →'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
