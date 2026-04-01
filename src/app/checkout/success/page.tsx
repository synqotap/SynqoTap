import { Card } from '@/components/ui'

const STEPS = [
  'Check your email — we sent you login credentials for your portal.',
  'Log in and customize your profile — name, buttons, logo.',
  'We program your NFC card and ship it within 1-3 business days.',
  'Receive your card ready to use. Start sharing your contact!',
]

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] flex items-center justify-center px-6 py-10 font-[family-name:var(--font-dm-sans)]">
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400&display=swap" rel="stylesheet" />
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-black text-3xl sm:text-4xl tracking-tight mb-3 font-[family-name:var(--font-syne)]">
          Purchase successful!
        </h1>
        <p className="text-[#6B6B80] text-base leading-relaxed mb-8">
          Your order is confirmed. In a few minutes you&apos;ll receive an email with your portal access credentials.
        </p>

        <Card className="mb-7 text-left">
          <div className="text-xs font-medium tracking-widest uppercase text-[#00E5FF] mb-4">
            What happens next?
          </div>
          <div className="flex flex-col divide-y divide-[#1C1C2E]">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-6 h-6 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-xs text-[#00E5FF] flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <a
          href="/portal"
          className="inline-flex items-center gap-2 bg-[#00E5FF] text-[#07070C] font-bold px-8 py-3.5 rounded-full hover:opacity-85 transition-opacity font-[family-name:var(--font-syne)]"
        >
          Go to my portal →
        </a>
      </div>
    </div>
  )
}
