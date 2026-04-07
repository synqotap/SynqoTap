import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Database } from '@/types/database'
import { ButtonType, ProfileTemplate, ButtonGroup, ProfileButton } from '@/types/app'
import ProfileButtons from '@/components/profile/ProfileButtons'
import SaveContactButton from '@/components/profile/SaveContactButton'
import { incrementProfileView } from '@/services/profiles'

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const revalidate = 0

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('display_name, company_name, job_title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return { title: 'Profile not found' }

  const title = data.display_name || 'SynqoTap Profile'
  const description = [data.job_title, data.company_name].filter(Boolean).join(' · ')

  return {
    title,
    description: description || 'SynqoTap digital profile',
    robots: { index: false, follow: false },
    openGraph: { title, description: description || 'SynqoTap digital profile' },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*, profile_buttons(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!profile) notFound()

  if (!profile.is_active) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-4xl mb-4">⏸</div>
          <h1 className="font-syne font-black text-xl text-[#F2F2F4] mb-2">Profile paused</h1>
          <p className="text-sm text-[#6B6B80]">This profile is temporarily unavailable.</p>
        </div>
      </div>
    )
  }

  // Increment view count (fire and forget)
  incrementProfileView(supabaseAdmin, slug).catch(console.error)

  const accent = profile.accent_color || '#00E5FF'
  const template = (profile.template || 'minimal') as ProfileTemplate
  const isBold = template === 'bold'
  const isSoft = template === 'soft'

  const initials = (profile.display_name || 'ST')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const buttons = ((profile.profile_buttons || []) as unknown as any[])
    .filter((b: any) => b.is_active)
    .sort((a: any, b: any) => a.position - b.position)

  const { data: groupData } = await supabaseAdmin
    .from('button_groups')
    .select('*')
    .eq('profile_id', profile.id)
    .order('position')
  const groups = (groupData || []) as ButtonGroup[]

  // ── BOLD template ────────────────────────────────────────────
  if (isBold) {
    return (
      <div className="min-h-screen bg-[#0E0E16] text-[#F2F2F4] font-dm-sans pb-16">
        {/* Cover — taller */}
        <div className="w-full h-60 relative overflow-hidden">
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${accent} 0%, #1A1A2E 60%, #0E0E16 100%)` }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0E0E16]" />
        </div>

        <div className="max-w-lg mx-auto px-5">
          {/* Avatar — centered, square */}
          <div className="flex flex-col items-center" style={{ marginTop: '-56px', position: 'relative', zIndex: 10 }}>
            <div className="mb-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || ''}
                  className="w-28 h-28 rounded-2xl object-cover"
                  style={{ border: `4px solid #0E0E16` }}
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center font-black text-4xl text-white font-syne"
                  style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, border: '4px solid #0E0E16' }}
                >
                  {initials}
                </div>
              )}
            </div>
            <SaveContactButton profile={profile} buttons={buttons} accent={accent} />
          </div>

          {/* Info — centered */}
          <div className="mt-5 mb-6 text-center animate-fadeUp">
            {profile.display_name && (
              <h1 className="font-black text-4xl tracking-tight font-syne mb-3">
                {profile.display_name}
              </h1>
            )}
            {profile.job_title && (
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-2"
                style={{ background: accent, color: '#07070C' }}
              >
                {profile.job_title}
              </span>
            )}
            {profile.company_name && (
              <p className="text-sm text-[#6B6B80] font-medium mt-1">{profile.company_name}</p>
            )}
            {profile.bio && (
              <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm mx-auto">
                {profile.bio}
              </p>
            )}
          </div>

          {buttons.length > 0 && (
            <div className="border-t mb-5" style={{ borderColor: `${accent}40` }} />
          )}

          <ProfileButtons buttons={buttons} groups={groups} accent={accent} template="bold" />

          <div className="text-center mt-10">
            <a href="https://www.synqotap.com" className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors">
              Created with <span style={{ color: accent }}>SynqoTap</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── SOFT template ────────────────────────────────────────────
  if (isSoft) {
    return (
      <div
        className="min-h-screen text-[#F2F2F4] font-dm-sans pb-16"
        style={{ background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${accent}14 0%, #07070C 65%)` }}
      >
        {/* Cover */}
        <div className="w-full h-44 relative overflow-hidden">
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${accent}20 0%, transparent 70%)` }} />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #07070C)' }} />
        </div>

        <div className="max-w-lg mx-auto px-5">
          {/* Avatar — centered, circle with solid accent ring */}
          <div className="flex flex-col items-center mb-6 animate-fadeUp" style={{ marginTop: -48, position: 'relative', zIndex: 10 }}>
            <div
              className="rounded-full mb-4"
              style={{ padding: '3px', background: accent }}
            >
              <div className="rounded-full bg-[#07070C]" style={{ padding: '2px' }}>
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || ''}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-28 h-28 rounded-full flex items-center justify-center font-black text-3xl text-white font-syne"
                    style={{ background: `linear-gradient(135deg, ${accent}50, #7B61FF50)` }}
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {profile.display_name && (
              <h1 className="font-black text-2xl tracking-tight font-syne mb-1 text-center">
                {profile.display_name}
              </h1>
            )}
            {profile.job_title && (
              <p className="text-sm font-medium italic mb-0.5 text-center" style={{ color: accent }}>
                {profile.job_title}
              </p>
            )}
            {profile.company_name && (
              <p className="text-sm text-[#6B6B80] text-center">{profile.company_name}</p>
            )}
            {profile.bio && (
              <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm text-center">
                {profile.bio}
              </p>
            )}

            <div className="mt-4">
              <SaveContactButton profile={profile} buttons={buttons} accent={accent} />
            </div>
          </div>

          {buttons.length > 0 && (
            <div className="border-t border-[#1C1C2E] mb-5" />
          )}

          <ProfileButtons buttons={buttons} groups={groups} accent={accent} template="soft" />

          <div className="text-center mt-10">
            <a href="https://www.synqotap.com" className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors">
              Created with <span style={{ color: accent }}>SynqoTap</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── MINIMAL / CARD template ──────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans pb-16">
      {/* Cover */}
      <div className="w-full h-44 relative overflow-hidden">
        {profile.cover_url ? (
          <img
            src={profile.cover_url}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 25%, #07070C) 0%, #0E0E16 60%, #07070C 100%)`
            }}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#07070C]" />
      </div>

      {/* Avatar + Save contact */}
      <div className="max-w-lg mx-auto px-5">
        <div
          className="flex items-end justify-between"
          style={{ marginTop: '-48px', position: 'relative', zIndex: 10 }}
        >
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || ''}
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: `4px solid #07070C` }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl text-white font-syne"
                style={{
                  background: `linear-gradient(135deg, ${accent}, #7B61FF)`,
                  border: '4px solid #07070C',
                }}
              >
                {initials}
              </div>
            )}
          </div>
          <SaveContactButton
            profile={profile}
            buttons={buttons}
            accent={accent}
          />
        </div>

        {/* Info */}
        <div className="mt-4 mb-6 animate-fadeUp">
          {profile.display_name && (
            <h1 className="font-black text-2xl tracking-tight font-syne mb-1">
              {profile.display_name}
            </h1>
          )}
          {profile.job_title && (
            <p className="text-base font-medium mb-0.5" style={{ color: accent }}>
              {profile.job_title}
            </p>
          )}
          {profile.company_name && (
            <p className="text-sm text-[#6B6B80]">{profile.company_name}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Divider */}
        {buttons.length > 0 && (
          <div className="border-t border-[#1C1C2E] mb-5" />
        )}

        {/* Buttons */}
        <ProfileButtons buttons={buttons} groups={groups} accent={accent} template={template} />

        {/* Powered by */}
        <div className="text-center mt-10">
          <a
            href="https://www.synqotap.com"
            className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors"
          >
            Created with <span style={{ color: accent }}>SynqoTap</span>
          </a>
        </div>
      </div>
    </div>
  )
}
