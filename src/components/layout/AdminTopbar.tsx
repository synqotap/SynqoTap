export default function AdminTopbar() {
  return (
    <header className="bg-[#0E0E16] border-b border-[#1C1C2E] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <a
          href="/"
          className="text-lg font-black tracking-tight text-[#F2F2F4] font-[family-name:var(--font-syne)]"
        >
          Synqo<span className="text-[#00E5FF]">Tap</span>
        </a>
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#F09595]">
          ADMIN
        </span>
      </div>
      <a
        href="/portal"
        className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
      >
        Customer portal
      </a>
    </header>
  )
}
