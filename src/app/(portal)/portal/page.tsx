'use client'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useButtons } from '@/hooks/useButtons'
import { useOrders } from '@/hooks/useOrders'
import { useImageUpload } from '@/hooks/useImageUpload'
import { createClient } from '@/lib/supabase/client'
import { PortalTopbar } from '@/components/layout'
import { Onboarding } from '@/components/portal/Onboarding'
import { SettingsDrawer } from '@/components/portal/SettingsDrawer'
import { OrdersDrawer } from '@/components/portal/OrdersDrawer'
import { Modal } from '@/components/ui'
import ProfileButtons, { ICONS } from '@/components/profile/ProfileButtons'
import SaveContactButton from '@/components/profile/SaveContactButton'
import {
  BUTTON_CONFIG, ADMIN_EMAIL, ACCENT_COLORS,
  type ProfileTemplate, type ProfileButton, type ButtonType,
} from '@/types/app'
import { updateProfile } from '@/services/profiles'

// ── Add-button panel configuration ──────────────────────────
const ADD_PANEL_CATEGORIES: Array<{
  label: string
  types: ButtonType[]
}> = [
  {
    label: 'Contact',
    types: ['phone', 'whatsapp', 'email', 'telegram'],
  },
  {
    label: 'Social',
    types: ['instagram', 'linkedin', 'facebook', 'tiktok', 'twitter', 'snapchat', 'youtube'],
  },
  {
    label: 'Payments',
    types: ['zelle', 'cashapp', 'venmo', 'paypal'],
  },
  {
    label: 'Web & More',
    types: ['website', 'calendly', 'maps', 'custom'],
  },
]


export default function PortalPage() {
  // ── Data hooks ───────────────────────────────────────────────
  const { userId, email, isLoading: authLoading } = useAuth({ requireAuth: true })
  const { profile, setProfile, customer, loading, saving: _saving, save, reload } = useProfile(userId)
  const { buttons, add, update, remove, reorder } = useButtons(profile?.id ?? null)
  const { orders, loading: ordersLoading } = useOrders(customer?.id ?? null)
  const { upload, uploadingAvatar, uploadingCover } = useImageUpload(profile?.id ?? null)
  const supabase = createClient()

  // ── UI state ─────────────────────────────────────────────────
  const [isEditMode, setIsEditMode] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [editingButton, setEditingButton] = useState<ProfileButton | null>(null)
  const [editValueInput, setEditValueInput] = useState('')
  const [editLabelInput, setEditLabelInput] = useState('')
  const [editIsActive, setEditIsActive] = useState(true)
  const [editIsNewEmpty, setEditIsNewEmpty] = useState(false)

  // ── Inline editing ───────────────────────────────────────────
  const [inlineValues, setInlineValues] = useState({
    display_name: '',
    job_title: '',
    company_name: '',
    bio: '',
  })

  // ── File refs ────────────────────────────────────────────────
  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const isAdmin = email === ADMIN_EMAIL
  const profileUrl = profile
    ? `${typeof window !== 'undefined' ? window.location.origin : 'https://www.synqotap.com'}/c/${profile.slug}`
    : ''

  // Sync inline values and check onboarding when profile loads
  useEffect(() => {
    if (!profile) return
    setShowOnboarding(!profile.display_name)
    setInlineValues({
      display_name: profile.display_name || '',
      job_title: profile.job_title || '',
      company_name: profile.company_name || '',
      bio: profile.bio || '',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  // ── Handlers ─────────────────────────────────────────────────
  async function handleImageUpload(file: File, type: 'avatar' | 'cover') {
    const url = await upload(file, type)
    if (url && profile) {
      const field = type === 'avatar' ? 'avatar_url' : 'cover_url'
      await updateProfile(supabase, profile.id, { [field]: url })
      setProfile({ ...profile, [field]: url })
    }
  }

  function handleFieldBlur(field: keyof typeof inlineValues) {
    save({ [field]: inlineValues[field] || null })
  }

  function handleFieldChange(field: keyof typeof inlineValues, value: string) {
    setInlineValues(v => ({ ...v, [field]: value }))
  }

  async function handleAddButtonType(type: ButtonType) {
    if (!profile) return
    setShowAddPanel(false)
    await add({ type, value: '', label: BUTTON_CONFIG[type].label })
  }

  function handleEditButton(btn: ProfileButton) {
    setEditingButton(btn)
    setEditValueInput(btn.value || '')
    setEditLabelInput(btn.label || BUTTON_CONFIG[btn.type as ButtonType]?.label || '')
    setEditIsActive(btn.is_active)
    setEditIsNewEmpty(!btn.value)
  }

  async function handleSaveEdit() {
    if (!editingButton) return
    const trimmed = editValueInput.trim()
    if (trimmed) {
      await update(editingButton.id, {
        value: trimmed,
        label: editLabelInput.trim() || BUTTON_CONFIG[editingButton.type as ButtonType]?.label || '',
        is_active: editIsActive,
      })
    } else {
      await remove(editingButton.id)
    }
    setEditingButton(null)
  }

  function handleEditModalClose() {
    if (editingButton && editIsNewEmpty) {
      remove(editingButton.id)
    }
    setEditingButton(null)
  }

  function handleReorder(reordered: ProfileButton[]) {
    // Preserve inactive buttons (they're excluded from the active list passed to DnD)
    const inactive = buttons.filter(b => !b.is_active)
    reorder([...reordered, ...inactive])
  }

  function toggleEditMode() {
    if (isEditMode) {
      // Save all pending inline fields on exit
      save({
        display_name: inlineValues.display_name || null,
        job_title: inlineValues.job_title || null,
        company_name: inlineValues.company_name || null,
        bio: inlineValues.bio || null,
      })
      setIsEditMode(false)
      setShowAddPanel(false)
    } else {
      setIsEditMode(true)
    }
  }

  // ── Loading / error states ───────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
        <p className="text-sm text-[#6B6B80] font-dm-sans">Profile not found.</p>
      </div>
    )
  }

  // ── Onboarding ───────────────────────────────────────────────
  if (showOnboarding) {
    return (
      <Onboarding
        profile={profile}
        customer={customer!}
        onComplete={() => { setShowOnboarding(false); reload() }}
      />
    )
  }

  // ── Template variables ───────────────────────────────────────
  const accent = profile.accent_color || '#00E5FF'
  const template = (profile.template || 'minimal') as ProfileTemplate
  const isBold = template === 'bold'
  const isSoft = template === 'soft'
  const bgPage = isBold ? '#0E0E16' : '#07070C'

  const initials = (profile.display_name || 'ST')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  // ── Shared sub-renders ───────────────────────────────────────

  // Design selector row (template + accent, only in edit mode)
  function renderDesignSelector() {
    if (!isEditMode) return null
    return (
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80] mb-2.5">Template</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {(['minimal', 'bold', 'soft', 'card'] as ProfileTemplate[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setProfile({ ...profile!, template: t })
                save({ template: t })
              }}
              className={`shrink-0 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                template === t
                  ? 'border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]'
                  : 'border-[#22223A] bg-[#0E0E16] text-[#6B6B80]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80] mt-4 mb-2.5">Accent</p>
        <div className="flex gap-2.5">
          {ACCENT_COLORS.map(color => (
            <button
              key={color}
              onClick={() => {
                setProfile({ ...profile!, accent_color: color })
                save({ accent_color: color })
              }}
              className="w-7 h-7 rounded-full transition-transform active:scale-90"
              style={{
                background: color,
                outline: accent === color ? `2px solid ${color}` : 'none',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Inline text field (shows input in edit mode, plain text otherwise)
  function renderInlineField(
    field: keyof typeof inlineValues,
    displayEl: React.ReactNode,
    inputClassName: string,
    placeholder: string,
    multiline?: boolean,
  ) {
    if (!isEditMode) return displayEl
    if (multiline) {
      return (
        <textarea
          className={`${inputClassName} bg-transparent border-b border-[#00E5FF]/50 outline-none resize-none w-full`}
          value={inlineValues[field]}
          onChange={e => handleFieldChange(field, e.target.value)}
          onBlur={() => handleFieldBlur(field)}
          placeholder={placeholder}
          rows={2}
        />
      )
    }
    return (
      <input
        className={`${inputClassName} bg-transparent border-b border-[#00E5FF]/50 outline-none w-full`}
        value={inlineValues[field]}
        onChange={e => handleFieldChange(field, e.target.value)}
        onBlur={() => handleFieldBlur(field)}
        placeholder={placeholder}
      />
    )
  }

  // Cover photo (used by minimal/card and bold templates)
  function renderCover(height: string) {
    return (
      <div className={`w-full ${height} relative overflow-hidden`}>
        {profile!.cover_url ? (
          <img src={profile!.cover_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: isBold
                ? `linear-gradient(135deg, ${accent} 0%, #1A1A2E 60%, ${bgPage} 100%)`
                : `linear-gradient(135deg, color-mix(in srgb, ${accent} 25%, ${bgPage}) 0%, #0E0E16 60%, ${bgPage} 100%)`,
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${bgPage})` }} />
        {isEditMode && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.25)' }}
            onClick={() => coverInputRef.current?.click()}
          >
            {uploadingCover ? (
              <div className="w-6 h-6 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                📷 Change cover
              </span>
            )}
          </div>
        )}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')}
        />
      </div>
    )
  }

  // Avatar (circle variant — minimal/card/soft)
  function renderAvatarCircle(sizeClass: string, borderColor: string, ringAccent?: boolean) {
    const cls = `${sizeClass} rounded-full object-cover`
    const border = ringAccent
      ? undefined
      : { border: `4px solid ${borderColor}` }

    const avatarEl = profile!.avatar_url ? (
      <img src={profile!.avatar_url} alt={profile!.display_name || ''} className={cls} style={border} />
    ) : (
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center font-black text-3xl text-white font-syne`}
        style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, ...border }}
      >
        {initials}
      </div>
    )

    if (ringAccent) {
      return (
        <div className="rounded-full" style={{ padding: 3, background: accent }}>
          <div className="rounded-full" style={{ padding: 2, background: borderColor }}>
            {avatarEl}
          </div>
        </div>
      )
    }
    return avatarEl
  }

  // Avatar (square variant — bold)
  function renderAvatarSquare() {
    return profile!.avatar_url ? (
      <img
        src={profile!.avatar_url}
        alt={profile!.display_name || ''}
        className="w-28 h-28 rounded-2xl object-cover"
        style={{ border: `4px solid ${bgPage}` }}
      />
    ) : (
      <div
        className="w-28 h-28 rounded-2xl flex items-center justify-center font-black text-4xl text-white font-syne"
        style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)`, border: `4px solid ${bgPage}` }}
      >
        {initials}
      </div>
    )
  }

  // Avatar click wrapper (edit mode)
  function wrapAvatarEdit(avatarEl: React.ReactNode) {
    return (
      <div className="relative">
        {avatarEl}
        {isEditMode && (
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => avatarInputRef.current?.click()}
          >
            {uploadingAvatar ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              <span className="text-white text-xs font-medium">📷</span>
            )}
          </div>
        )}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'avatar')}
        />
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // BOLD TEMPLATE
  // ══════════════════════════════════════════════════════════════
  if (isBold) {
    return (
      <div className="min-h-screen text-[#F2F2F4] font-dm-sans pb-32" style={{ background: bgPage }}>
        <PortalTopbar
          isEditMode={isEditMode}
          isAdmin={isAdmin}
          onMenuOpen={() => setShowSettings(true)}
          saveContactSlot={<SaveContactButton profile={profile} buttons={buttons} accent={accent} compact />}
        />

        {renderCover('h-60')}

        <div className="max-w-lg mx-auto px-5">
          {/* Avatar — centered, square */}
          <div className="flex flex-col items-center" style={{ marginTop: -56, position: 'relative', zIndex: 10 }}>
            {wrapAvatarEdit(renderAvatarSquare())}
          </div>

          {/* Info — centered */}
          <div className="mt-5 mb-6 text-center">
            {renderInlineField(
              'display_name',
              profile.display_name && (
                <h1 className="font-black text-4xl tracking-tight font-syne mb-3">{profile.display_name}</h1>
              ),
              'font-black text-4xl tracking-tight font-syne mb-3 text-center',
              'Your name',
            )}
            {renderInlineField(
              'job_title',
              profile.job_title && (
                <span
                  className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-2"
                  style={{ background: accent, color: '#07070C' }}
                >
                  {profile.job_title}
                </span>
              ),
              'text-xs font-bold uppercase tracking-widest text-center',
              'Job title',
            )}
            {renderInlineField(
              'company_name',
              profile.company_name && (
                <p className="text-sm text-[#6B6B80] font-medium mt-1">{profile.company_name}</p>
              ),
              'text-sm text-[#6B6B80] font-medium mt-1 text-center',
              'Company',
            )}
            {renderInlineField(
              'bio',
              profile.bio && (
                <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm mx-auto">{profile.bio}</p>
              ),
              'text-sm text-[#6B6B80] leading-relaxed mt-3 text-center',
              'Short bio…',
              true,
            )}
          </div>

          {(buttons.filter(b => b.is_active).length > 0 || isEditMode) && (
            <div className="border-t mb-5" style={{ borderColor: `${accent}40` }} />
          )}

          {renderDesignSelector()}

          <ProfileButtons
            buttons={buttons}
            accent={accent}
            template="bold"
            isEditMode={isEditMode}
            onDelete={remove}
            onReorder={handleReorder}
            onEditButton={handleEditButton}
          />

          <div className="text-center mt-10">
            <a href="https://www.synqotap.com" className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors">
              Created with <span style={{ color: accent }}>SynqoTap</span>
            </a>
          </div>
        </div>

        {renderFloatingButtons()}
        {renderAddPanel()}
        {renderEditModal()}
        {renderSettingsDrawer()}
        {renderOrdersDrawer()}
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // SOFT TEMPLATE
  // ══════════════════════════════════════════════════════════════
  if (isSoft) {
    return (
      <div
        className="min-h-screen text-[#F2F2F4] font-dm-sans pb-32"
        style={{ background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${accent}14 0%, #07070C 65%)` }}
      >
        <PortalTopbar
          isEditMode={isEditMode}
          isAdmin={isAdmin}
          onMenuOpen={() => setShowSettings(true)}
          saveContactSlot={<SaveContactButton profile={profile} buttons={buttons} accent={accent} compact />}
        />

        <div className="max-w-lg mx-auto px-5 pt-11">
          {/* Avatar — centered circle with accent ring */}
          <div className="flex flex-col items-center mb-6 pt-10">
            {wrapAvatarEdit(renderAvatarCircle('w-28 h-28', '#07070C', true))}

            <div className="mt-4 text-center w-full">
              {renderInlineField(
                'display_name',
                profile.display_name && (
                  <h1 className="font-black text-2xl tracking-tight font-syne mb-1 text-center">{profile.display_name}</h1>
                ),
                'font-black text-2xl tracking-tight font-syne mb-1 text-center',
                'Your name',
              )}
              {renderInlineField(
                'job_title',
                profile.job_title && (
                  <p className="text-sm font-medium italic mb-0.5 text-center" style={{ color: accent }}>{profile.job_title}</p>
                ),
                'text-sm font-medium italic mb-0.5 text-center',
                'Job title',
              )}
              {renderInlineField(
                'company_name',
                profile.company_name && (
                  <p className="text-sm text-[#6B6B80] text-center">{profile.company_name}</p>
                ),
                'text-sm text-[#6B6B80] text-center',
                'Company',
              )}
              {renderInlineField(
                'bio',
                profile.bio && (
                  <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm text-center">{profile.bio}</p>
                ),
                'text-sm text-[#6B6B80] leading-relaxed mt-3 text-center',
                'Short bio…',
                true,
              )}
            </div>
          </div>

          {(buttons.filter(b => b.is_active).length > 0 || isEditMode) && (
            <div className="border-t border-[#1C1C2E] mb-5" />
          )}

          {renderDesignSelector()}

          <ProfileButtons
            buttons={buttons}
            accent={accent}
            template="soft"
            isEditMode={isEditMode}
            onDelete={remove}
            onReorder={handleReorder}
            onEditButton={handleEditButton}
          />

          <div className="text-center mt-10">
            <a href="https://www.synqotap.com" className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors">
              Created with <span style={{ color: accent }}>SynqoTap</span>
            </a>
          </div>
        </div>

        {renderFloatingButtons()}
        {renderAddPanel()}
        {renderEditModal()}
        {renderSettingsDrawer()}
        {renderOrdersDrawer()}
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // MINIMAL / CARD TEMPLATE (default)
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen text-[#F2F2F4] font-dm-sans pb-32" style={{ background: bgPage }}>
      <PortalTopbar isEditMode={isEditMode} isAdmin={isAdmin} onMenuOpen={() => setShowSettings(true)} />

      {renderCover('h-44')}

      <div className="max-w-lg mx-auto px-5">
        {/* Avatar — left-aligned, offset */}
        <div className="flex items-end justify-between" style={{ marginTop: -48, position: 'relative', zIndex: 10 }}>
          {wrapAvatarEdit(renderAvatarCircle('w-24 h-24', bgPage))}
        </div>

        {/* Info — left-aligned */}
        <div className="mt-4 mb-6">
          {renderInlineField(
            'display_name',
            profile.display_name && (
              <h1 className="font-black text-2xl tracking-tight font-syne mb-1">{profile.display_name}</h1>
            ),
            'font-black text-2xl tracking-tight font-syne mb-1',
            'Your name',
          )}
          {renderInlineField(
            'job_title',
            profile.job_title && (
              <p className="text-base font-medium mb-0.5" style={{ color: accent }}>{profile.job_title}</p>
            ),
            'text-base font-medium mb-0.5',
            'Job title',
          )}
          {renderInlineField(
            'company_name',
            profile.company_name && (
              <p className="text-sm text-[#6B6B80]">{profile.company_name}</p>
            ),
            'text-sm text-[#6B6B80]',
            'Company',
          )}
          {renderInlineField(
            'bio',
            profile.bio && (
              <p className="text-sm text-[#6B6B80] leading-relaxed mt-3 max-w-sm">{profile.bio}</p>
            ),
            'text-sm text-[#6B6B80] leading-relaxed mt-3',
            'Short bio…',
            true,
          )}
        </div>

        {(buttons.filter(b => b.is_active).length > 0 || isEditMode) && (
          <div className="border-t border-[#1C1C2E] mb-5" />
        )}

        {renderDesignSelector()}

        <ProfileButtons
          buttons={buttons}
          accent={accent}
          template={template}
          isEditMode={isEditMode}
          onDelete={remove}
          onReorder={handleReorder}
          onEditButton={handleEditButton}
        />

        <div className="text-center mt-10">
          <a href="https://www.synqotap.com" className="text-xs text-[#3A3A50] hover:text-[#6B6B80] transition-colors">
            Created with <span style={{ color: accent }}>SynqoTap</span>
          </a>
        </div>
      </div>

      {renderFloatingButtons()}
      {renderAddPanel()}
      {renderEditModal()}
      {renderSettingsDrawer()}
      {renderOrdersDrawer()}
    </div>
  )

  // ══════════════════════════════════════════════════════════════
  // OVERLAYS & FLOATING UI
  // ══════════════════════════════════════════════════════════════

  function renderFloatingButtons() {
    return (
      <>
        {/* Edit / Save toggle */}
        <button
          onClick={toggleEditMode}
          className="fixed bottom-6 right-5 z-40 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all active:scale-95"
          style={{
            background: isEditMode ? '#1D9E75' : '#00E5FF',
            color: '#07070C',
          }}
          aria-label={isEditMode ? 'Save changes' : 'Edit profile'}
        >
          {isEditMode ? (
            // Checkmark
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            // Pencil
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          )}
        </button>

        {/* Add button strip (only in edit mode) */}
        {isEditMode && (
          <button
            onClick={() => setShowAddPanel(p => !p)}
            className="fixed bottom-6 right-24 z-40 h-14 px-5 rounded-2xl flex items-center gap-2 shadow-2xl transition-all active:scale-95 font-medium text-sm"
            style={{ background: '#00E5FF', color: '#07070C' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add button
          </button>
        )}
      </>
    )
  }

  function renderAddPanel() {
    return (
      <div
        className={`fixed inset-x-0 bottom-24 z-40 px-4 transition-all duration-300 ease-out ${
          showAddPanel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl shadow-2xl max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <p className="text-sm font-semibold text-[#F2F2F4]">Add a button</p>
            <button
              onClick={() => setShowAddPanel(false)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="px-5 pb-5 flex flex-col gap-4">
            {ADD_PANEL_CATEGORIES.map(cat => (
              <div key={cat.label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B80] mb-2">{cat.label}</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {cat.types.map(type => {
                    const cfg = BUTTON_CONFIG[type]
                    return (
                      <button
                        key={type}
                        onClick={() => handleAddButtonType(type)}
                        className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition-all"
                        style={{ width: 48 }}
                      >
                        <div
                          className="flex items-center justify-center rounded-xl"
                          style={{ width: 48, height: 48, background: cfg.bgColor, color: cfg.iconColor }}
                        >
                          {ICONS[type]}
                        </div>
                        <span className="text-[10px] text-[#6B6B80] text-center leading-tight w-full truncate">
                          {cfg.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function renderEditModal() {
    if (!editingButton) return null
    const config = BUTTON_CONFIG[editingButton.type as ButtonType]
    const icon = ICONS[editingButton.type as ButtonType]
    return (
      <Modal open={!!editingButton} onClose={handleEditModalClose}>
        <div className="p-5 flex flex-col gap-4">
          {/* Icon header */}
          <div className="flex justify-center pt-1">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: config?.bgColor, color: config?.iconColor }}
            >
              <span className="[&>svg]:w-7 [&>svg]:h-7">{icon}</span>
            </div>
          </div>

          {/* Value */}
          <div>
            <p className="text-xs text-[#6B6B80] mb-1.5">{config?.label} value</p>
            <input
              className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
              value={editValueInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValueInput(e.target.value)}
              placeholder={config?.placeholder || 'Enter value'}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSaveEdit() }}
              autoFocus
            />
          </div>

          {/* Custom label */}
          <div>
            <p className="text-xs text-[#6B6B80] mb-1.5">Custom label <span className="text-[#3A3A50]">(optional)</span></p>
            <input
              className="w-full bg-[#13131F] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
              value={editLabelInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLabelInput(e.target.value)}
              placeholder={config?.label || 'Label'}
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-[#F2F2F4]">Show on profile</span>
            <button
              onClick={() => setEditIsActive(v => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative ${editIsActive ? 'bg-[#00E5FF]' : 'bg-[#22223A]'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${editIsActive ? 'left-5' : 'left-0.5'}`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => { remove(editingButton.id); setEditingButton(null) }}
              className="px-4 py-3 rounded-xl border border-[#E24B4A]/30 text-[#E24B4A] text-sm font-medium hover:bg-[#E24B4A]/10 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-3 rounded-xl bg-[#00E5FF] text-[#07070C] text-sm font-bold active:scale-[0.98] transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  function renderSettingsDrawer() {
    return (
      <SettingsDrawer
        open={showSettings}
        onClose={() => setShowSettings(false)}
        profileUrl={profileUrl}
        slug={profile!.slug}
        isAdmin={isAdmin}
        onOpenOrders={() => setShowOrders(true)}
      />
    )
  }

  function renderOrdersDrawer() {
    return (
      <OrdersDrawer
        open={showOrders}
        onClose={() => setShowOrders(false)}
        orders={orders}
        loading={ordersLoading}
      />
    )
  }
}
