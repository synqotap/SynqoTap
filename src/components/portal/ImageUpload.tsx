'use client'
import { useRef } from 'react'
import { Profile } from '@/types/app'

type ImageUploadProps = {
  profile: Profile
  onUpload: (file: File, type: 'avatar' | 'cover') => void
  uploadingAvatar: boolean
  uploadingCover: boolean
}

export default function ImageUpload({ profile, onUpload, uploadingAvatar, uploadingCover }: ImageUploadProps) {
  const avatarRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const accent = profile.accent_color || '#00E5FF'
  const initials = (profile.display_name || 'ST').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

  return (
    <div className="flex flex-col gap-4">
      {/* Cover */}
      <div>
        <p className="text-xs text-[#6B6B80] mb-2">Cover photo</p>
        <div
          onClick={() => coverRef.current?.click()}
          className="relative w-full h-28 rounded-xl border-2 border-dashed border-[#22223A] overflow-hidden bg-[#13131F] cursor-pointer group hover:border-[#00E5FF]/40 transition-colors"
        >
          {profile.cover_url ? (
            <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[#3A3A50]">
              {uploadingCover ? 'Uploading...' : '+ Add cover photo'}
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
            {uploadingCover ? 'Uploading...' : '📷 Change cover'}
          </div>
        </div>
        <input
          ref={coverRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => e.target.files?.[0] && onUpload(e.target.files[0], 'cover')}
        />
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-[#6B6B80] mb-2">Profile photo</p>
          <div
            onClick={() => avatarRef.current?.click()}
            className="relative w-20 h-20 rounded-full border-2 border-dashed border-[#22223A] overflow-hidden bg-[#13131F] cursor-pointer group hover:border-[#00E5FF]/40 transition-colors"
          >
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div
                className="w-full h-full rounded-full flex items-center justify-center font-black text-xl text-white font-[family-name:var(--font-syne)]"
                style={{ background: `linear-gradient(135deg, ${accent}, #7B61FF)` }}
              >
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
              {uploadingAvatar ? '...' : '📷'}
            </div>
          </div>
          <input
            ref={avatarRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={e => e.target.files?.[0] && onUpload(e.target.files[0], 'avatar')}
          />
        </div>
        <p className="text-xs text-[#6B6B80] leading-relaxed">
          Click image to change.<br />
          Square, min 400×400px.<br />
          JPG, PNG or WebP.
        </p>
      </div>
    </div>
  )
}
