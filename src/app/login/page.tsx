'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Incorrect email or password.'); setLoading(false); return }
    window.location.href = '/portal'
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/settings`,
    })
    if (error) setError('Could not send email. Please try again.')
    else setSuccess('We sent you a password reset link. Check your email.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm">
        <a href="/" className="block text-center font-syne font-black text-xl mb-10">
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>

        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8">
          {mode === 'login' ? (
            <>
              <h1 className="font-syne font-black text-xl tracking-tight mb-2">Welcome back</h1>
              <p className="text-sm text-[#6B6B80] mb-6 leading-relaxed">
                Login to your portal to edit your profile and track your order.
              </p>
              {error && (
                <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-4 py-3 text-sm text-[#F09595] mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6B80] mb-1.5 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00E5FF] text-[#07070C] font-syne font-bold py-3.5 rounded-full hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-[#07070C]/20 border-t-[#07070C] animate-spin" />
                      Logging in...
                    </>
                  ) : 'Login to portal →'}
                </button>
              </form>
              <div className="border-t border-[#1C1C2E] mt-6 pt-5 text-center text-sm text-[#6B6B80]">
                Forgot your password?{' '}
                <button
                  onClick={() => { setMode('reset'); setError('') }}
                  className="text-[#00E5FF] hover:opacity-70 transition-opacity"
                >
                  Reset it here
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-syne font-black text-xl tracking-tight mb-2">Reset password</h1>
              <p className="text-sm text-[#6B6B80] mb-6">{"We'll send you a link to create a new password."}</p>
              {error && (
                <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-4 py-3 text-sm text-[#F09595] mb-4">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl px-4 py-3 text-sm text-[#5DCAA5] mb-4">
                  {success}
                </div>
              )}
              {!success && (
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-[#6B6B80] mb-1.5 block">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00E5FF] text-[#07070C] font-syne font-bold py-3.5 rounded-full hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-[#07070C]/20 border-t-[#07070C] animate-spin" />
                        Sending...
                      </>
                    ) : 'Send reset link →'}
                  </button>
                </form>
              )}
              <div className="border-t border-[#1C1C2E] mt-6 pt-5 text-center">
                <button
                  onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                  className="text-sm text-[#00E5FF] hover:opacity-70 transition-opacity"
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#6B6B80] mt-6">
          {"Don't have an account? "}
          <a href="/checkout" className="text-[#00E5FF] hover:opacity-70 transition-opacity">
            Buy your SynqoTap
          </a>
        </p>
      </div>
    </div>
  )
}
