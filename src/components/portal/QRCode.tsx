'use client'
import { useState } from 'react'

type QRCodeProps = {
  profileUrl: string
  slug: string
}

export function QRCode({ profileUrl, slug }: QRCodeProps) {
  const [downloading, setDownloading] = useState(false)

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileUrl)}&bgcolor=0E0E16&color=F2F2F4&margin=2&format=png`

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch(qrSrc)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `synqotap-${slug}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="bg-[#13131F] border border-[#22223A] rounded-2xl p-4 inline-flex">
        <img
          src={qrSrc}
          alt="QR code for your profile"
          width={120}
          height={120}
          className="rounded-lg"
        />
      </div>
      <p className="text-xs text-[#6B6B80]">Scan to open your profile</p>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="text-xs text-[#00E5FF] hover:opacity-75 transition-opacity disabled:opacity-50"
      >
        {downloading ? 'Downloading...' : '↓ Download PNG'}
      </button>
    </div>
  )
}
