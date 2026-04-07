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

    // Derive extension from MIME type so files without a proper name still work
    const mimeToExt: Record<string, string> = {
      'image/jpeg':  'jpg',
      'image/jpg':   'jpg',
      'image/png':   'png',
      'image/gif':   'gif',
      'image/webp':  'webp',
      'image/avif':  'avif',
      'image/heic':  'heic',
      'image/heif':  'heif',
      'image/bmp':   'bmp',
      'image/tiff':  'tiff',
    }
    const ext = mimeToExt[file.type] ?? (file.name.split('.').pop() ?? 'jpg')
    const path = `${profileId}/${type}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/jpeg' })

    if (type === 'avatar') setUploadingAvatar(false)
    else setUploadingCover(false)

    if (error) {
      console.error('Image upload error:', error.message)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    return urlData.publicUrl
  }

  return { upload, uploadingAvatar, uploadingCover }
}
