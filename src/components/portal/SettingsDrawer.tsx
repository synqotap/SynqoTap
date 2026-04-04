'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui'

type SettingsDrawerProps = {
  open: boolean
  onClose: () => void
  profileUrl: string
  slug: string
  isAdmin: boolean
  onOpenOrders: () => void
}

export function SettingsDrawer({
  open,
  onClose,
  profileUrl,
  slug,
  isAdmin,
  onOpenOrders,
}: SettingsDrawerProps) {
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const supabase = createClient()

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(profileUrl)}&bgcolor=0E0E16&color=F2F2F4&margin=2&format=png`

  function handleCopy() {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDownloadQR() {
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5 flex flex-col gap-1">

        {/* Profile URL + QR */}
        <div className="bg-[#13131F] border border-[#22223A] rounded-2xl p-4 mb-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-[#00E5FF] truncate flex-1">{profileUrl}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#0E0E16] border border-[#1C1C2E] rounded-xl p-2 shrink-0">
              <img
                src={qrSrc}
                alt="QR code"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#6B6B80]">Scan to open your profile</p>
              <button
                onClick={handleDownloadQR}
                disabled={downloading}
                className="text-xs text-[#00E5FF] font-medium hover:opacity-75 transition-opacity disabled:opacity-50 text-left"
              >
                {downloading ? 'Downloading...' : '↓ Download QR PNG'}
              </button>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <MenuItem
          icon="📦"
          label="My orders"
          onClick={() => { onClose(); onOpenOrders() }}
        />
        <MenuItem
          icon="🔗"
          label="View public profile"
          onClick={() => window.open(profileUrl, '_blank')}
          trailing="↗"
        />
        <MenuItem
          icon="🔑"
          label="Change password"
          onClick={() => { window.location.href = '/portal/settings' }}
        />
        {isAdmin && (
          <MenuItem
            icon="🔐"
            label="Admin panel"
            onClick={() => { window.location.href = '/admin' }}
          />
        )}

        {/* Sign out */}
        <div className="mt-2 pt-2 border-t border-[#1C1C2E]">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#E24B4A] hover:bg-[#E24B4A]/10 transition-colors text-sm font-medium"
          >
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </Modal>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  trailing,
}: {
  icon: string
  label: string
  onClick: () => void
  trailing?: string
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-[#13131F] transition-colors text-left group"
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="flex-1 text-sm font-medium text-[#F2F2F4]">{label}</span>
      <span className="text-[#6B6B80] text-sm">{trailing ?? '›'}</span>
    </button>
  )
}
