import type { Profile, ProfileButton, ButtonType, ProfileTemplate } from '@/types/app'
import { BUTTON_CONFIG } from '@/types/app'
import { Modal } from '@/components/ui'

type ExtendedProfile = Profile & { accent_color?: string | null; cover_url?: string | null; template?: string | null }

type ProfilePreviewProps = {
  open: boolean
  onClose: () => void
  profile: ExtendedProfile
  buttons: ProfileButton[]
}

export function ProfilePreview({ open, onClose, profile, buttons }: ProfilePreviewProps) {
  const accent = profile.accent_color || '#00E5FF'
  const template = (profile.template || 'minimal') as ProfileTemplate
  const isBold = template === 'bold'
  const isSoft = template === 'soft'
  const isCard = template === 'card'

  const initials = (profile.display_name || 'ST')
    .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()

  const active = buttons
    .filter(b => b.is_active)
    .sort((a, b) => a.position - b.position)
    .slice(0, 4)

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-[#F2F2F4]">Profile preview</p>
          <button onClick={onClose} className="text-[#6B6B80] hover:text-[#F2F2F4] text-xl leading-none">×</button>
        </div>

        {/* ── BOLD preview ── */}
        {isBold && (
          <div className="rounded-2xl overflow-hidden bg-[#0E0E16]">
            {/* Cover */}
            <div className="w-full h-20 relative overflow-hidden">
              {profile.cover_url ? (
                <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent} 0%, #1A1A2E 60%, #0E0E16 100%)` }} />
              )}
            </div>
            {/* Avatar centered, square */}
            <div className="flex flex-col items-center px-4" style={{ marginTop: '-22px' }}>
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || ''}
                  className="w-14 h-14 rounded-xl object-cover"
                  style={{ border: '3px solid #0E0E16' }}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg font-syne text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, border: '3px solid #0E0E16' }}
                >
                  {initials}
                </div>
              )}
              <div className="mt-2 mb-3 text-center">
                {profile.display_name && (
                  <h3 className="font-syne font-black text-base">{profile.display_name}</h3>
                )}
                {profile.job_title && (
                  <span
                    className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1"
                    style={{ background: accent, color: '#07070C' }}
                  >
                    {profile.job_title}
                  </span>
                )}
                {profile.company_name && (
                  <p className="text-xs text-[#6B6B80] mt-1">{profile.company_name}</p>
                )}
              </div>
              {active.length > 0 && (
                <div className="flex flex-col gap-1.5 pb-3 w-full">
                  {active.map(btn => {
                    const config = BUTTON_CONFIG[btn.type as ButtonType]
                    if (!config) return null
                    return (
                      <div
                        key={btn.id}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                        style={{
                          background: '#13131F',
                          borderTop: '1px solid #1C1C2E',
                          borderRight: '1px solid #1C1C2E',
                          borderBottom: '1px solid #1C1C2E',
                          borderLeft: `3px solid ${accent}`,
                        }}
                      >
                        <div className="w-6 h-6 flex items-center justify-center shrink-0" style={{ color: accent }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/></svg>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-[#F2F2F4]">{btn.label || config.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SOFT preview ── */}
        {isSoft && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: `radial-gradient(ellipse 100% 50% at 50% 0%, ${accent}14 0%, #07070C 70%)` }}
          >
            <div className="flex flex-col items-center px-4 pt-5 pb-3">
              {/* Avatar with accent ring */}
              <div className="rounded-full mb-3" style={{ padding: '2px', background: accent }}>
                <div className="rounded-full bg-[#07070C]" style={{ padding: '2px' }}>
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name || ''}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg font-syne text-white"
                      style={{ background: `linear-gradient(135deg, ${accent}50, #7B61FF50)` }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center mb-3">
                {profile.display_name && (
                  <h3 className="font-syne font-black text-base">{profile.display_name}</h3>
                )}
                {profile.job_title && (
                  <p className="text-xs italic mt-0.5" style={{ color: accent }}>{profile.job_title}</p>
                )}
                {profile.company_name && (
                  <p className="text-xs text-[#6B6B80]">{profile.company_name}</p>
                )}
              </div>
              {active.length > 0 && (
                <div className="flex flex-col gap-1.5 pb-2 w-full">
                  {active.map(btn => {
                    const config = BUTTON_CONFIG[btn.type as ButtonType]
                    if (!config) return null
                    return (
                      <div
                        key={btn.id}
                        className="flex items-center justify-center gap-2 rounded-full px-3 py-2"
                        style={{ background: `${accent}1F`, border: `1px solid ${accent}4D` }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: config.bgColor, color: config.iconColor }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><circle cx="12" cy="12" r="10"/></svg>
                        </div>
                        <span className="text-xs font-medium text-[#F2F2F4]">{btn.label || config.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CARD preview ── */}
        {isCard && (
          <>
            <div className="w-full h-20 rounded-xl overflow-hidden">
              {profile.cover_url ? (
                <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accent}33, #0E0E16)` }} />
              )}
            </div>
            <div className="px-4" style={{ marginTop: '-24px' }}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.display_name || ''} className="w-14 h-14 rounded-full object-cover" style={{ border: '3px solid #0E0E16' }} />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg font-syne text-white" style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, border: '3px solid #0E0E16' }}>{initials}</div>
              )}
              <div className="mt-2 mb-3">
                {profile.display_name && <h3 className="font-syne font-black text-base">{profile.display_name}</h3>}
                {profile.job_title && <p className="text-sm" style={{ color: accent }}>{profile.job_title}</p>}
              </div>
              {active.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 pb-2">
                  {active.map(btn => {
                    const config = BUTTON_CONFIG[btn.type as ButtonType]
                    if (!config) return null
                    return (
                      <div key={btn.id} className="flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3" style={{ background: '#0E0E16', border: '1px solid #1C1C2E' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: config.bgColor, color: config.iconColor }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>
                        </div>
                        <span className="text-xs text-[#F2F2F4] text-center leading-tight">{btn.label || config.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── MINIMAL preview (default) ── */}
        {!isBold && !isSoft && !isCard && (
          <>
            {/* Cover */}
            <div className="w-full h-20 rounded-xl overflow-hidden">
              {profile.cover_url ? (
                <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full"
                  style={{ background: `linear-gradient(135deg, ${accent}33, #0E0E16)` }}
                />
              )}
            </div>
            {/* Avatar + info left-aligned */}
            <div className="px-4" style={{ marginTop: '-24px' }}>
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || ''}
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: '3px solid #0E0E16' }}
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg font-syne text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, border: '3px solid #0E0E16' }}
                >
                  {initials}
                </div>
              )}
              <div className="mt-2 mb-3">
                {profile.display_name && (
                  <h3 className="font-syne font-black text-base">{profile.display_name}</h3>
                )}
                {profile.job_title && (
                  <p className="text-sm" style={{ color: accent }}>{profile.job_title}</p>
                )}
                {profile.company_name && (
                  <p className="text-xs text-[#6B6B80]">{profile.company_name}</p>
                )}
              </div>
              {active.length > 0 && (
                <div className="flex flex-col gap-1.5 pb-2">
                  {active.map(btn => {
                    const config = BUTTON_CONFIG[btn.type as ButtonType]
                    if (!config) return null
                    return (
                      <div
                        key={btn.id}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                        style={{ background: '#0E0E16', border: '1px solid #1C1C2E' }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold"
                          style={{ background: config.bgColor, color: config.iconColor }}
                        >
                          {config.label.charAt(0)}
                        </div>
                        <span className="text-xs text-[#F2F2F4] flex-1">{btn.label || config.label}</span>
                        <span className="text-[#3A3A50] text-sm">›</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
