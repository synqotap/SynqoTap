'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function resizeImage(file: File, maxSize: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const { naturalWidth: width, naturalHeight: height } = img
      if (!width || !height) { reject(new Error('zero dimensions')); return }
      const ratio = Math.min(1, maxSize / Math.max(width, height))
      const w = Math.round(width * ratio)
      const h = Math.round(height * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('no ctx')); return }
      ctx.drawImage(img, 0, 0, w, h)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load failed')) }
    // Must set src after handlers
    img.src = url
  })
}

export function useImageUpload(profileId: string | null) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const supabase = createClient()

  async function upload(file: File, type: 'avatar' | 'cover'): Promise<string | null> {
    if (!profileId) return null
    if (type === 'avatar') setUploadingAvatar(true)
    else setUploadingCover(true)

    const maxSize = type === 'avatar' ? 400 : 1400

    let uploadFile: Blob | File = file
    let contentType = 'image/jpeg'
    let ext = 'jpg'

    try {
      uploadFile = await resizeImage(file, maxSize, 0.88)
    } catch {
      // Canvas resize failed (e.g. HEIC on some browsers) — upload original as-is
      uploadFile = file
      contentType = file.type || 'application/octet-stream'
      ext = file.name.split('.').pop() ?? 'jpg'
    }

    const path = `${profileId}/${type}-${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, uploadFile, { upsert: true, contentType })

    if (type === 'avatar') setUploadingAvatar(false)
    else setUploadingCover(false)

    if (error) {
      console.error('upload error:', error.message)
      return null
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    return urlData.publicUrl
  }

  return { upload, uploadingAvatar, uploadingCover }
}
