'use client'

type Tab = 'profile' | 'design' | 'buttons' | 'orders' | 'settings'

type NavItem = {
  tab: Tab
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { tab: 'profile',  label: 'My profile',     icon: '👤' },
  { tab: 'design',   label: 'Design',          icon: '🎨' },
  { tab: 'buttons',  label: 'Buttons',         icon: '🔘' },
  { tab: 'orders',   label: 'My orders',       icon: '📦' },
]

type PortalSidebarProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  profileSlug?: string
}

export default function PortalSidebar({ activeTab, onTabChange, profileSlug }: PortalSidebarProps) {
  return (
    <aside className="bg-[#0E0E16] border-r border-[#1C1C2E] w-[220px] min-h-full p-4 flex-col hidden md:flex">
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className={`
              flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left w-full
              transition-all duration-200 font-[family-name:var(--font-dm-sans)]
              ${activeTab === item.tab
                ? 'bg-[#00E5FF]/[0.08] text-[#00E5FF]'
                : 'text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F]'
              }
            `}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="flex flex-col gap-2 pt-4 border-t border-[#1C1C2E]">
        {profileSlug && (
          <a
            href={`/c/${profileSlug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#6B6B80] border border-[#22223A] hover:text-[#F2F2F4] transition-colors"
          >
            🔗 View public profile
          </a>
        )}
        <a
          href="/portal/settings"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
        >
          ⚙️ Change password
        </a>
      </div>
    </aside>
  )
}
