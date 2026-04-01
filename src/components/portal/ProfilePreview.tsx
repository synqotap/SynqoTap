'use client'
import { Profile, ProfileButton, BUTTON_TYPE_CONFIG, ButtonType } from '@/types/app'
import { Modal } from '@/components/ui'

type ProfilePreviewProps = {
  open: boolean
  onClose: () => void
  profile: Profile
  buttons: ProfileButton[]
}

const BUTTON_ICONS: Record<string, string> = {
  phone: '📞', whatsapp: '💬', email: '✉️', instagram: '📷',
  linkedin: '💼', facebook: '👥', tiktok: '🎵', website: '🌐', calendly: '📅',
}

export default function ProfilePreview({ open, onClose, profile, buttons }: ProfilePreviewProps) {
  const accent = profile.accent_color || '#00E5FF'
  const initials = (profile.display_name || 'ST').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
  const activeButtons = buttons.filter(b => b.is_active).slice(0, 5)

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold font-[family-name:var(--font-syne)]">Profile preview</h3>
        <button onClick={onClose} className="text-[#6B6B80] hover:text-[#F2F2F4] text-xl leading-none">✕</button>
      </div>
      {/* Mini profile card */}
      <div className="bg-[#07070C] rounded-2xl overflow-hidden border border-[#1C1C2E]">
        <div
          className="h-20"
          style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 20%, #07070C), #0E0E16)` }}
        />
        <div className="px-4 flex items-end justify-between" style={{ marginTop: '-32px' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-black text-lg text-white font-[family-name:var(--font-syne)] flex-shrink-0"
            style={{
              background: profile.avatar_url ? 'transparent' : `linear-gradient(135deg, ${accent}, #7B61FF)`,
              border: '3px solid #07070C',
            }}
          >
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              : initials}
          </div>
          <div
            className="mb-1 text-xs font-bold px-2.5 py-1.5 rounded-full font-[family-name:var(--font-syne)]"
            style={{ background: accent, color: '#07070C' }}
          >
            + Save
          </div>
        </div>
        <div className="px-4 pt-2 pb-3">
          <div className="font-black text-base font-[family-name:var(--font-syne)]">{profile.display_name || 'Your name'}</div>
          {profile.job_title && <div className="text-xs mt-0.5" style={{ color: accent }}>{profile.job_title}</div>}
          {profile.company_name && <div className="text-xs text-[#6B6B80]">{profile.company_name}</div>}
        </div>
        {activeButtons.length > 0 && (
          <div className="border-t border-[#1C1C2E] mx-4" />
        )}
        <div className="px-4 py-3 flex flex-col gap-2">
          {activeButtons.map((btn, i) => {
            const config = BUTTON_TYPE_CONFIG[btn.type as ButtonType]
            return (
              <div key={i} className="flex items-center gap-2.5 bg-[#0E0E16] border border-[#1C1C2E] rounded-xl px-3 py-2">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs flex-shrink-0">
                  {BUTTON_ICONS[btn.type] || '🔗'}
                </div>
                <span className="text-xs text-[#F2F2F4]">{btn.label || config?.label}</span>
              </div>
            )
          })}
        </div>
        <div className="text-center pb-3 text-xs text-[#3A3A50]">Created with SynqoTap</div>
      </div>
    </Modal>
  )
}
