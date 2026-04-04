type Tab = 'profile' | 'design' | 'buttons' | 'orders'

type PortalSidebarProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  profileSlug: string
}

const NAV_ITEMS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'profile', label: 'Profile', icon: '👤' },
  { tab: 'design',  label: 'Design',  icon: '🎨' },
  { tab: 'buttons', label: 'Buttons', icon: '🔗' },
  { tab: 'orders',  label: 'Orders',  icon: '📦' },
]

export function PortalSidebar({ activeTab, onTabChange, profileSlug }: PortalSidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col border-r border-[#1C1C2E] bg-[#0E0E16]"
      style={{ width: '220px', flexShrink: 0 }}
    >
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ tab, label, icon }) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left w-full ${
              activeTab === tab
                ? 'bg-[#00E5FF]/[0.08] text-[#00E5FF]'
                : 'text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F]'
            }`}
          >
            <span className="text-base">{icon}</span>
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-[#1C1C2E] flex flex-col gap-1">
        <a
          href={`/c/${profileSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
        >
          <span>↗</span> View public profile
        </a>
        <a
          href="/portal/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
        >
          <span>🔑</span> Change password
        </a>
      </div>
    </aside>
  )
}
