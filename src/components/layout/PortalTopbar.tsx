'use client'
import { createClient } from '@/lib/supabase/client'

type PortalTopbarProps = {
  onPreview?: () => void
  isAdmin?: boolean
}

export default function PortalTopbar({ onPreview, isAdmin }: PortalTopbarProps) {
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-[#0E0E16] border-b border-[#1C1C2E] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
      <a
        href="/"
        className="text-lg font-black tracking-tight text-[#F2F2F4] font-[family-name:var(--font-syne)]"
      >
        Synqo<span className="text-[#00E5FF]">Tap</span>
      </a>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <a
            href="/admin"
            className="text-xs px-3 py-1.5 rounded-lg bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#F09595] font-medium"
          >
            Admin panel
          </a>
        )}
        {onPreview && (
          <button
            onClick={onPreview}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-[#00E5FF]"
          >
            Preview
          </button>
        )}
        <button
          onClick={handleSignOut}
          className="text-xs px-3 py-1.5 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
