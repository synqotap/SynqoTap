'use client'
import { useRef } from 'react'
import type { Profile } from '@/types/app'
import { Spinner } from '@/components/ui'

type ExtendedProfile = Profile & { cover_url?: string | null; accent_color?: string | null }

type ImageUploadProps = {
  profile: ExtendedProfile
  onUpload: (file: File, type: 'avatar' | 'cover') => Promise<void>
  uploadingAvatar: boolean
  uploadingCover: boolean
}

export function ImageUpload({ profile, onUpload, uploadingAvatar, uploadingCover }: ImageUploadProps) {
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const initials = (profile.display_name || 'ST')
    .split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()
  const accent = profile.accent_color || '#00E5FF'

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') {
    const file = e.target.files?.[0]
    if (file) onUpload(file, type)
    e.target.value = ''
  }

  return (
    <div>
      {/* Cover */}
      <div
        className="relative w-full rounded-xl overflow-hidden cursor-pointer group mb-4"
        style={{ height: '112px' }}
        onClick={() => coverRef.current?.click()}
      >
        {profile.cover_url ? (
          <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full border-2 border-dashed border-[#22223A] rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}18, #0E0E16)` }}
          >
            <span className="text-xs text-[#6B6B80]">Click to upload cover</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
          {uploadingCover
            ? <Spinner />
            : <span className="text-sm font-medium text-white">Change cover</span>}
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e, 'cover')}
        />
      </div>

      {/* Avatar */}
      <div
        className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer group"
        onClick={() => avatarRef.current?.click()}
      >
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center font-black text-xl font-syne text-white"
            style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)` }}
          >
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
          {uploadingAvatar
            ? <Spinner size="sm" />
            : <span className="text-xs font-medium text-white">Change</span>}
        </div>
        <input
          ref={avatarRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFile(e, 'avatar')}
        />
      </div>
    </div>
  )
}
