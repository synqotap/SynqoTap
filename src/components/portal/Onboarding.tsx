'use client'
import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useImageUpload } from '@/hooks/useImageUpload'
import { updateProfile } from '@/services/profiles'
import { addButton } from '@/services/buttons'
import { BUTTON_CONFIG } from '@/types/app'
import type { Profile, Customer, ProfileButton, ButtonType } from '@/types/app'

type OnboardingProps = {
  profile: Profile
  customer: Customer
  onComplete: () => void
}

const CONTACT_FIELDS: Array<{
  key: 'phone' | 'whatsapp' | 'email' | 'website' | 'calendly'
  label: string
  placeholder: string
  type: ButtonType
  icon: React.ReactNode
}> = [
  {
    key: 'phone',
    label: 'Phone',
    placeholder: '+1 555 000 0000',
    type: 'phone',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    placeholder: '+1 555 000 0000',
    type: 'whatsapp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.103 1.523 5.824L.057 23.882a.5.5 0 00.613.613l6.058-1.466A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.382l-.36-.214-3.732.903.918-3.636-.234-.374A9.818 9.818 0 1112 21.818z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'your@email.com',
    type: 'email',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    key: 'website',
    label: 'Website',
    placeholder: 'https://yoursite.com',
    type: 'website',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    key: 'calendly',
    label: 'Booking link',
    placeholder: 'calendly.com/yourname',
    type: 'calendly',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
]

export function Onboarding({ profile, customer, onComplete }: OnboardingProps) {
  const supabase = createClient()
  const { upload, uploadingAvatar } = useImageUpload(profile.id)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(customer.full_name || '')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [bio, setBio] = useState('')
  const [contacts, setContacts] = useState<Record<string, string>>({
    phone: '', whatsapp: '', email: customer.email || '', website: '', calendly: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file, 'avatar')
    if (url) {
      setAvatarUrl(url)
      await updateProfile(supabase, profile.id, { avatar_url: url })
    }
  }

  async function handleSubmit() {
    setSaving(true)
    const profileUpdates: Partial<Profile> = {
      display_name: displayName.trim() || 'My Profile',
      job_title: jobTitle.trim() || null,
      company_name: company.trim() || null,
      bio: bio.trim() || null,
    }
    await updateProfile(supabase, profile.id, profileUpdates)

    // Create buttons for filled contact fields
    for (const field of CONTACT_FIELDS) {
      const value = contacts[field.key]?.trim()
      if (value) {
        await addButton(supabase, profile.id, {
          type: field.type,
          value,
          label: BUTTON_CONFIG[field.type].label,
          position: CONTACT_FIELDS.indexOf(field),
        })
      }
    }

    setSaving(false)
    onComplete()
  }

  const initials = (displayName || 'Me')
    .split(' ')
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-syne font-black text-lg">Synqo<span className="text-[#00E5FF]">Tap</span></span>
        </div>
        <h1 className="font-syne font-black text-2xl tracking-tight mb-1">Set up your profile</h1>
        <p className="text-sm text-[#6B6B80]">This takes 30 seconds. You can always change it later.</p>
      </div>

      <div className="px-5 pb-32 flex flex-col gap-6 max-w-lg">

        {/* Section 1 — Header info */}
        <div className="flex flex-col gap-3">
          <input
            className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none focus:border-[#00E5FF]/60 transition-colors"
            placeholder="Full name"
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

        {/* Section 2 — Contact buttons */}
        <div>
          <p className="text-sm font-semibold text-[#F2F2F4] mb-3">How can people reach you?</p>
          <div className="flex flex-col gap-2.5">
            {CONTACT_FIELDS.map(field => (
              <div key={field.key} className="flex items-center gap-3 bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-3 focus-within:border-[#00E5FF]/60 transition-colors">
                <span className="text-[#6B6B80] shrink-0">{field.icon}</span>
                <input
                  className="flex-1 bg-transparent text-sm text-[#F2F2F4] placeholder-[#3A3A50] outline-none"
                  placeholder={field.placeholder}
                  value={contacts[field.key]}
                  onChange={e => setContacts(c => ({ ...c, [field.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-[#3A3A50] mt-2 ml-1">You can add more buttons later</p>
        </div>

        {/* Section 3 — Photo */}
        <div>
          <p className="text-sm font-semibold text-[#F2F2F4] mb-3">Profile photo <span className="text-[#3A3A50] font-normal">(optional)</span></p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-dashed border-[#22223A] hover:border-[#00E5FF]/40 transition-colors"
            >
              {uploadingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0E0E16]">
                  <div className="w-5 h-5 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
                </div>
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0E0E16] gap-1">
                  <div className="text-2xl font-black font-syne text-[#3A3A50]">{initials}</div>
                </div>
              )}
            </button>
            <div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="text-sm text-[#00E5FF] font-medium hover:opacity-75 transition-opacity"
              >
                Upload photo
              </button>
              <p className="text-xs text-[#3A3A50] mt-0.5">JPG or PNG, max 5MB</p>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
      </div>

      {/* Sticky submit */}
      <div className="fixed bottom-0 inset-x-0 bg-[#07070C]/95 backdrop-blur px-5 pb-8 pt-4 border-t border-[#1C1C2E]">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-[#00E5FF] text-[#07070C] font-bold text-sm rounded-2xl py-4 disabled:opacity-60 active:scale-[0.98] transition-all"
          >
            {saving ? 'Setting up...' : 'Set up my profile →'}
          </button>
          <button
            onClick={() => {
              updateProfile(supabase, profile.id, { display_name: 'My Profile' }).then(onComplete)
            }}
            className="text-sm text-[#3A3A50] hover:text-[#6B6B80] transition-colors text-center py-1"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
