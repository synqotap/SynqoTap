'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card } from '@/components/ui'

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
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Incorrect email or password.'); setLoading(false); return }
    window.location.href = '/portal'
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/settings`
    })
    if (error) setError('Could not send email. Please try again.')
    else setSuccess('We sent you a password reset link. Check your email.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] flex items-center justify-center px-5 py-8 font-[family-name:var(--font-dm-sans)]">
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      <div className="w-full max-w-sm">
        <a href="/" className="block text-center text-xl font-black tracking-tight mb-10 font-[family-name:var(--font-syne)]">
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>

        <Card>
          {mode === 'login' ? (
            <>
              <h1 className="text-xl font-black tracking-tight mb-2 font-[family-name:var(--font-syne)]">Welcome back</h1>
              <p className="text-sm text-[#6B6B80] mb-6 leading-relaxed">Login to your portal to edit your profile and track your order.</p>
              {error && <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-4 py-3 text-sm text-[#F09595] mb-4">{error}</div>}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" required autoComplete="email" />
                <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required autoComplete="current-password" />
                <Button type="submit" loading={loading} fullWidth size="lg">Login to portal →</Button>
              </form>
              <div className="border-t border-[#1C1C2E] mt-5 pt-4 text-center text-sm text-[#6B6B80]">
                Forgot your password?{' '}
                <button onClick={() => { setMode('reset'); setError('') }} className="text-[#00E5FF] hover:opacity-70 transition-opacity">
                  Reset it here
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-black tracking-tight mb-2 font-[family-name:var(--font-syne)]">Reset password</h1>
              <p className="text-sm text-[#6B6B80] mb-6">{"We'll send you a link to create a new password."}</p>
              {error && <div className="bg-[#E24B4A]/10 border border-[#E24B4A]/30 rounded-xl px-4 py-3 text-sm text-[#F09595] mb-4">{error}</div>}
              {success && <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/30 rounded-xl px-4 py-3 text-sm text-[#5DCAA5] mb-4">{success}</div>}
              {!success && (
                <form onSubmit={handleReset} className="flex flex-col gap-4">
                  <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com" required />
                  <Button type="submit" loading={loading} fullWidth size="lg">Send reset link →</Button>
                </form>
              )}
              <div className="border-t border-[#1C1C2E] mt-5 pt-4 text-center">
                <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="text-sm text-[#00E5FF] hover:opacity-70 transition-opacity">
                  ← Back to login
                </button>
              </div>
            </>
          )}
        </Card>

        <p className="text-center text-sm text-[#6B6B80] mt-6">
          {"Don't have an account? "}
          <a href="/checkout" className="text-[#00E5FF] hover:opacity-70 transition-opacity">Buy your SynqoTap</a>
        </p>
      </div>
    </div>
  )
}
