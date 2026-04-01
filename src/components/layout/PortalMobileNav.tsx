'use client'

type Tab = 'profile' | 'design' | 'buttons' | 'orders'

type PortalMobileNavProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS = [
  { tab: 'profile' as Tab,  label: 'Profile',  icon: '👤' },
  { tab: 'design' as Tab,   label: 'Design',   icon: '🎨' },
  { tab: 'buttons' as Tab,  label: 'Buttons',  icon: '🔘' },
  { tab: 'orders' as Tab,   label: 'Orders',   icon: '📦' },
]

export default function PortalMobileNav({ activeTab, onTabChange }: PortalMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-[#0E0E16] border-t border-[#1C1C2E] flex md:hidden">
      {TABS.map(item => (
        <button
          key={item.tab}
          onClick={() => onTabChange(item.tab)}
          className={`
            flex-1 flex flex-col items-center gap-1 py-3 text-xs
            transition-colors duration-200
            ${activeTab === item.tab ? 'text-[#00E5FF]' : 'text-[#6B6B80]'}
          `}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
