'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useImageUpload(profileId: string | null) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const supabase = createClient()

  async function upload(
    file: File,
    type: 'avatar' | 'cover'
  ): Promise<string | null> {
    if (!profileId) return null
    if (type === 'avatar') setUploadingAvatar(true)
    else setUploadingCover(true)

    const ext = file.name.split('.').pop()
    const path = `${profileId}/${type}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) {
      if (type === 'avatar') setUploadingAvatar(false)
      else setUploadingCover(false)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    if (type === 'avatar') setUploadingAvatar(false)
    else setUploadingCover(false)

    return urlData.publicUrl
  }

  return { upload, uploadingAvatar, uploadingCover }
}
