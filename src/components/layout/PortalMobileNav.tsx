type Tab = 'profile' | 'design' | 'buttons' | 'orders'

type PortalMobileNavProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const NAV_ITEMS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'profile', label: 'Profile', icon: '👤' },
  { tab: 'design',  label: 'Design',  icon: '🎨' },
  { tab: 'buttons', label: 'Buttons', icon: '🔗' },
  { tab: 'orders',  label: 'Orders',  icon: '📦' },
]

export function PortalMobileNav({ activeTab, onTabChange }: PortalMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex md:hidden bg-[#0E0E16] border-t border-[#1C1C2E]">
      {NAV_ITEMS.map(({ tab, label, icon }) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
            activeTab === tab ? 'text-[#00E5FF]' : 'text-[#6B6B80]'
          }`}
        >
          <span className="text-lg">{icon}</span>
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  )
}
