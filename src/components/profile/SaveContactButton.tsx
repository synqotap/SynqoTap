'use client'
import { Profile, ProfileButton, BUTTON_CONFIG, ButtonType } from '@/types/app'

type SaveContactButtonProps = {
  profile: Profile
  buttons: ProfileButton[]
  accent: string
  compact?: boolean
}

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.readAsDataURL(blob)
    })
  } catch {
    return ''
  }
}

export default function SaveContactButton({ profile, buttons, accent, compact }: SaveContactButtonProps) {
  async function handleSave() {
    const active = buttons.filter(b => b.is_active)

    const phones = active.filter(b => b.type === 'phone').map(b => `TEL:${b.value}`)
    const emails = active.filter(b => b.type === 'email').map(b => `EMAIL:${b.value}`)
    const websites = active.filter(b => b.type === 'website').map(b => {
      const config = BUTTON_CONFIG['website']
      return `URL:${config.href(b.value)}`
    })

    const socials = active
      .filter(b => ['instagram', 'linkedin', 'facebook', 'tiktok', 'twitter', 'snapchat', 'youtube', 'telegram'].includes(b.type))
      .map(b => {
        const config = BUTTON_CONFIG[b.type as ButtonType]
        return `URL;type=${b.type.toUpperCase()}:${config.href(b.value)}`
      })

    let photoLine = ''
    if (profile.avatar_url) {
      const base64 = await fetchImageAsBase64(profile.avatar_url)
      if (base64) {
        photoLine = `PHOTO;ENCODING=b;TYPE=JPEG:${base64}`
      }
    }

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.display_name || ''}`,
      profile.job_title ? `TITLE:${profile.job_title}` : '',
      profile.company_name ? `ORG:${profile.company_name}` : '',
      ...phones,
      ...emails,
      ...websites,
      ...socials,
      photoLine,
      `NOTE:synqotap.com/c/${profile.slug}`,
      'END:VCARD',
    ].filter(Boolean).join('\n')

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.display_name || 'contact'}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleSave}
      className={`inline-flex items-center gap-1.5 font-bold rounded-full transition-all hover:opacity-85 active:scale-95 font-syne ${
        compact ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5'
      }`}
      style={{ background: accent, color: '#07070C' }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      {compact ? 'Save' : 'Save contact'}
    </button>
  )
}
