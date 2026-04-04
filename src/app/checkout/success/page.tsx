import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import Link from 'next/link'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Props = { searchParams: Promise<{ session_id?: string }> }

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  let slug = ''
  let customerName = ''
  let cardType = ''

  if (session_id) {
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('card_type, profiles(slug, display_name)')
      .eq('stripe_session_id', session_id)
      .single()

    if (order) {
      cardType = order.card_type
      const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
      slug = profile?.slug || ''
      customerName = profile?.display_name || ''
    }
  }

  const firstName = customerName.split(' ')[0] || 'there'
  const cardName = cardType === 'pvc' ? 'PVC Card' : 'Metal Card'
  const profileUrl = slug ? `${process.env.NEXT_PUBLIC_APP_URL}/c/${slug}` : ''

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8">
          <div className="text-4xl text-center mb-4">🎉</div>
          <h1 className="font-syne font-black text-2xl text-center mb-2">
            {customerName ? `Purchase confirmed, ${firstName}!` : 'Purchase confirmed!'}
          </h1>
          <p className="text-[#6B6B80] text-sm text-center mb-8 leading-relaxed">
            Your <strong className="text-[#F2F2F4]">SynqoTap {cardName}</strong> is being programmed and will ship soon.
          </p>

          {profileUrl && (
            <div className="bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-[#6B6B80] uppercase tracking-wide mb-1.5">Your digital profile is live</p>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E5FF] font-mono text-sm break-all hover:opacity-70 transition-opacity"
              >
                {profileUrl}
              </a>
            </div>
          )}

          <div className="bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-[#6B6B80] uppercase tracking-wide mb-1.5">Check your email</p>
            <p className="text-sm text-[#F2F2F4]">We sent your login credentials to your email. Check your inbox to access your portal.</p>
          </div>

          <Link
            href="/login"
            className="block w-full bg-[#00E5FF] text-[#07070C] font-syne font-bold text-sm text-center py-3.5 rounded-full hover:opacity-85 transition-opacity"
          >
            Login to my portal →
          </Link>
        </div>

        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-6 mt-4">
          <p className="text-xs text-[#6B6B80] uppercase tracking-wide mb-4">What happens next?</p>
          <div className="flex flex-col gap-3">
            {[
              'Login and customize your profile — name, buttons, logo.',
              'We program your NFC card within 1-3 business days.',
              'You receive your card ready to use. Start sharing your contact!',
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start pb-3 border-b border-[#1C1C2E] last:border-0 last:pb-0">
                <span className="w-6 h-6 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[#F2F2F4] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#3A3A50] mt-6">
          © {new Date().getFullYear()} SynqoTap · synqotap.com
        </p>
      </div>
    </div>
  )
}
