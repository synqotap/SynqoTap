'use client'

type Tab = 'orders' | 'customers' | 'discounts' | 'prices' | 'activity'

type TabNavProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  orderCount: number
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'orders',
    label: 'Orders',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'discounts',
    label: 'Discounts',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8.5L7.5 2H14v6.5L8.5 14H2V8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="11" cy="5" r="1" fill="currentColor"/>
        <path d="M5 11l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'prices',
    label: 'Prices',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 4.5v1M8 10.5v1M5.75 7c0-.828.784-1.5 2.25-1.5s2.25.672 2.25 1.5c0 1.5-4.5 1-4.5 2.5 0 .828.784 1.5 2.25 1.5s2.25-.672 2.25-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8h3l2-5 2 10 2-7 1.5 4.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function TabNav({ activeTab, onTabChange, orderCount }: TabNavProps) {
  return (
    <div className="bg-[#0E0E16] border-b border-[#1C1C2E] sticky top-14 z-10">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors relative
                ${isActive
                  ? 'text-[#00E5FF] border-[#00E5FF]'
                  : 'text-[#6B6B80] border-transparent hover:text-[#F2F2F4]'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'orders' && orderCount > 0 && (
                <span className="ml-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF]">
                  {orderCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
