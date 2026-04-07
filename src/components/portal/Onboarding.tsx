'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useImageUpload } from '@/hooks/useImageUpload'
import { updateProfile } from '@/services/profiles'
import { addButton } from '@/services/buttons'
import {
  BUTTON_CONFIG, ACCENT_COLORS, TEMPLATES,
  type Profile, type Customer, type ButtonType, type ProfileTemplate,
} from '@/types/app'

type OnboardingProps = {
  profile: Profile
  customer: Customer
  onComplete: () => void
}

// ── Quick-add button types for step 2 ────────────────────────
const QUICK_BUTTONS: Array<{ type: ButtonType; placeholder: string }> = [
  { type: 'phone',     placeholder: '+1 555 000 0000' },
  { type: 'whatsapp',  placeholder: '+1 555 000 0000' },
  { type: 'sms',       placeholder: '+1 555 000 0000' },
  { type: 'email',     placeholder: 'your@email.com' },
  { type: 'instagram', placeholder: '@yourhandle' },
  { type: 'linkedin',  placeholder: 'linkedin.com/in/you' },
  { type: 'facebook',  placeholder: 'facebook.com/you' },
  { type: 'tiktok',    placeholder: '@yourhandle' },
  { type: 'twitter',   placeholder: '@yourhandle' },
  { type: 'website',   placeholder: 'https://yoursite.com' },
  { type: 'calendly',  placeholder: 'calendly.com/yourname' },
]

// ── Step progress indicator ───────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            background: i === current ? '#00E5FF' : i < current ? '#00E5FF40' : '#22223A',
          }}
        />
      ))}
    </div>
  )
}

export function Onboarding({ profile, customer, onComplete }: OnboardingProps) {
  const supabase = createClient()
  const { upload, uploadingAvatar } = useImageUpload(profile.id)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState(0) // 0=profile, 1=buttons, 2=design, 3=done
  const [saving, setSaving] = useState(false)

  // Step 1 — Profile
  const [displayName, setDisplayName] = useState(customer.full_name || '')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Step 2 — Buttons (type → value)
  const [buttonValues, setButtonValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    QUICK_BUTTONS.forEach(b => { init[b.type] = '' })
    if (customer.email) init['email'] = customer.email
    return init
  })
  const [expandedButton, setExpandedButton] = useState<string | null>('phone')

  // Step 3 — Design
  const [accentColor, setAccentColor] = useState(profile.accent_color || '#00E5FF')
  const [template, setTemplate] = useState<ProfileTemplate>((profile.template as ProfileTemplate) || 'minimal')
  const [customHex, setCustomHex] = useState('')

  // ── Handlers ─────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file, 'avatar')
    if (url) {
      setAvatarUrl(url)
      await updateProfile(supabase, profile.id, { avatar_url: url })
    }
  }

  async function saveStep1() {
    setSaving(true)
    await updateProfile(supabase, profile.id, {
      display_name: displayName.trim() || 'My Profile',
      job_title: jobTitle.trim() || null,
      company_name: company.trim() || null,
      bio: bio.trim() || null,
    })
    setSaving(false)
    setStep(1)
  }

  async function saveStep2() {
    setSaving(true)
    let pos = 0
    for (const btn of QUICK_BUTTONS) {
      const value = buttonValues[btn.type]?.trim()
      if (value) {
        await addButton(supabase, profile.id, {
          type: btn.type,
          value,
          label: BUTTON_CONFIG[btn.type].label,
          position: pos++,
        })
      }
    }
    setSaving(false)
    setStep(2)
  }

  async function saveStep3() {
    setSaving(true)
    await updateProfile(supabase, profile.id, {
      accent_color: accentColor,
      template,
    })
    setSaving(false)
    setStep(3)
  }

  function handleCustomHex(val: string) {
    setCustomHex(val)
    const hex = val.startsWith('#') ? val : `#${val}`
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) setAccentColor(hex)
  }

  const initials = (displayName || 'Me')
    .split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  const filledButtonsCount = QUICK_BUTTONS.filter(b => buttonValues[b.type]?.trim()).length

  // ── Layout wrapper ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans flex flex-col">
      {/* Top bar */}
      <div className="px-5 pt-10 pb-4 flex items-center justify-between shrink-0">
        <span className="font-syne font-black text-lg">
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </span>
        {step < 3 && <StepDots current={step} total={3} />}
      </div>

      {/* ── STEP 0: Profile ──────────────────────────────────── */}
      {step === 0 && (
        <div className="flex-1 flex flex-col">
          <div className="px-5 pt-4 pb-6">
            <h1 className="font-syne font-black text-2xl tracking-tight mb-1">
              Set up your profile
            </h1>
            <p className="text-sm text-[#6B6B80]">This is what people will see when they tap your card.</p>
          </div>

          <div className="px-5 pb-32 flex flex-col gap-4 max-w-lg">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-1">
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-18 h-18 rounded-full overflow-hidden shrink-0 border-2 border-dashed border-[#22223A] hover:border-[#00E5FF]/40 transition-colors"
              >
                {uploadingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0E0E16]">
                    <div className="w-5 h-5 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
                  </div>
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#13131F]">
                    <span className="text-xl font-black font-syne text-[#3A3A50]">{initials}</span>
                  </div>
                )}
              </button>
              <div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="text-sm text-[#00E5FF] font-medium hover:opacity-75 transition-opacity"
                >
                  Add profile photo
                </button>
                <p className="text-xs text-[#3A3A50] mt-0.5">Optional · JPG or PNG</p>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {/* Fields */}
            <input
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors"
              placeholder="Full name *"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
            <input
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors"
              placeholder="Job title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
            <input
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors"
              placeholder="Company"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
            <textarea
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors resize-none"
              placeholder="Short bio (optional)"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </div>

          <div className="fixed bottom-0 inset-x-0 bg-[#07070C]/95 backdrop-blur px-5 pb-8 pt-4 border-t border-[#1C1C2E]">
            <div className="max-w-lg mx-auto">
              <button
                onClick={saveStep1}
                disabled={saving || !displayName.trim()}
                className="w-full bg-[#00E5FF] text-[#07070C] font-bold text-sm rounded-2xl py-4 disabled:opacity-40 active:scale-[0.98] transition-all"
              >
                {saving ? 'Saving...' : 'Next: Add your buttons →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Buttons ──────────────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col">
          <div className="px-5 pt-4 pb-6">
            <h1 className="font-syne font-black text-2xl tracking-tight mb-1">
              Add your links
            </h1>
            <p className="text-sm text-[#6B6B80]">
              Select a button type and enter your info. You can add more later.
            </p>
          </div>

          <div className="px-5 pb-36 flex flex-col gap-2 max-w-lg">
            {QUICK_BUTTONS.map(btn => {
              const cfg = BUTTON_CONFIG[btn.type]
              const isExpanded = expandedButton === btn.type
              const value = buttonValues[btn.type] || ''
              const hasValue = value.trim().length > 0

              return (
                <div
                  key={btn.type}
                  className="rounded-xl border transition-all overflow-hidden"
                  style={{
                    borderColor: isExpanded ? '#00E5FF40' : hasValue ? '#00E5FF25' : '#22223A',
                    background: isExpanded ? '#00E5FF08' : hasValue ? '#00E5FF05' : '#0E0E16',
                  }}
                >
                  {/* Row header */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    onClick={() => setExpandedButton(isExpanded ? null : btn.type)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                      style={{ background: cfg.bgColor, color: cfg.iconColor }}
                    >
                      {cfg.label.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F2F2F4]">{cfg.label}</p>
                      {hasValue && !isExpanded && (
                        <p className="text-xs text-[#6B6B80] truncate">{value}</p>
                      )}
                    </div>
                    {hasValue && (
                      <div className="w-2 h-2 rounded-full bg-[#00E5FF] shrink-0" />
                    )}
                    <svg
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="w-4 h-4 text-[#3A3A50] shrink-0 transition-transform"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded input */}
                  {isExpanded && (
                    <div className="px-4 pb-3">
                      <input
                        autoFocus
                        className="w-full bg-[#07070C] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors"
                        placeholder={btn.placeholder}
                        value={value}
                        onChange={e => setButtonValues(v => ({ ...v, [btn.type]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter') setExpandedButton(null)
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="fixed bottom-0 inset-x-0 bg-[#07070C]/95 backdrop-blur px-5 pb-8 pt-4 border-t border-[#1C1C2E]">
            <div className="max-w-lg mx-auto flex flex-col gap-3">
              <button
                onClick={saveStep2}
                disabled={saving}
                className="w-full bg-[#00E5FF] text-[#07070C] font-bold text-sm rounded-2xl py-4 disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {saving
                  ? 'Saving...'
                  : filledButtonsCount > 0
                    ? `Next: Choose your style → (${filledButtonsCount} added)`
                    : 'Next: Choose your style →'}
              </button>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-[#3A3A50] hover:text-[#6B6B80] transition-colors text-center py-1"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Design ───────────────────────────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <div className="px-5 pt-4 pb-6">
            <h1 className="font-syne font-black text-2xl tracking-tight mb-1">
              Choose your style
            </h1>
            <p className="text-sm text-[#6B6B80]">Pick an accent color and a profile layout.</p>
          </div>

          <div className="px-5 pb-36 flex flex-col gap-6 max-w-lg">
            {/* Color */}
            <div>
              <p className="text-xs text-[#6B6B80] uppercase tracking-wider mb-3">Accent color</p>
              <div className="flex items-center gap-2.5 flex-wrap mb-4">
                {ACCENT_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => { setAccentColor(color); setCustomHex('') }}
                    className="w-9 h-9 rounded-full transition-all hover:scale-110"
                    style={{
                      background: color,
                      outline: accentColor === color ? `3px solid ${color}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full shrink-0 border border-[#22223A]"
                  style={{ background: accentColor }}
                />
                <input
                  type="text"
                  value={customHex || accentColor}
                  onChange={e => handleCustomHex(e.target.value)}
                  placeholder="#00E5FF"
                  className="flex-1 bg-[#0E0E16] border border-[#22223A] rounded-xl px-3 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF]/60 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Template */}
            <div>
              <p className="text-xs text-[#6B6B80] uppercase tracking-wider mb-3">Profile layout</p>
              <div className="flex flex-col gap-2">
                {(Object.entries(TEMPLATES) as [ProfileTemplate, { label: string; description: string }][]).map(([key, cfg]) => {
                  const isSelected = template === key
                  return (
                    <button
                      key={key}
                      onClick={() => setTemplate(key)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all"
                      style={{
                        background: isSelected ? `${accentColor}12` : '#0E0E16',
                        border: `1px solid ${isSelected ? accentColor : '#22223A'}`,
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full shrink-0 border-2 flex items-center justify-center"
                        style={{ borderColor: isSelected ? accentColor : '#3A3A50' }}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#F2F2F4]">{cfg.label}</p>
                        <p className="text-xs text-[#6B6B80]">{cfg.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 inset-x-0 bg-[#07070C]/95 backdrop-blur px-5 pb-8 pt-4 border-t border-[#1C1C2E]">
            <div className="max-w-lg mx-auto flex flex-col gap-3">
              <button
                onClick={saveStep3}
                disabled={saving}
                className="w-full bg-[#00E5FF] text-[#07070C] font-bold text-sm rounded-2xl py-4 disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {saving ? 'Finishing setup...' : 'Finish setup →'}
              </button>
              <button
                onClick={() => setStep(1)}
                className="text-sm text-[#3A3A50] hover:text-[#6B6B80] transition-colors text-center py-1"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Done ─────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-16 text-center max-w-sm mx-auto w-full">
          {/* Icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: `${accentColor}18` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" className="w-9 h-9">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="font-syne font-black text-3xl tracking-tight mb-3">
            You're all set!
          </h1>
          <p className="text-sm text-[#6B6B80] leading-relaxed mb-8">
            Your profile is ready. Share your card and start connecting with people.
          </p>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={onComplete}
              className="w-full font-bold text-sm rounded-2xl py-4 active:scale-[0.98] transition-all"
              style={{ background: accentColor, color: '#07070C' }}
            >
              Go to my portal
            </button>
            <a
              href={`/c/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-[#22223A] font-medium text-sm rounded-2xl py-4 text-[#6B6B80] hover:text-[#F2F2F4] hover:border-[#3A3A50] transition-all"
            >
              Preview my profile ↗
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
