'use client'

type PortalTopbarProps = {
  isEditMode: boolean
  isAdmin: boolean
  onMenuOpen: () => void
  saveContactSlot?: React.ReactNode
}

export function PortalTopbar({ isEditMode, isAdmin: _isAdmin, onMenuOpen, saveContactSlot }: PortalTopbarProps) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4"
      style={{
        height: 44,
        background: 'rgba(7,7,12,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Left — logo */}
      <span className="font-syne font-black text-base leading-none">
        Synqo<span className="text-[#00E5FF]">Tap</span>
      </span>

      {/* Center — edit indicator */}
      <div className="absolute left-1/2 -translate-x-1/2">
        {isEditMode && (
          <span className="flex items-center gap-1.5 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
            Editing
          </span>
        )}
      </div>

      {/* Right — save contact + menu */}
      <div className="flex items-center gap-2">
        {!isEditMode && saveContactSlot}
        <button
          onClick={onMenuOpen}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>
    </header>
  )
}
