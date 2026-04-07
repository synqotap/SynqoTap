'use client'
import { useState } from 'react'

type ActivityEntry = {
  id: string
  admin_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

type ActivityTabProps = {
  activityLog: ActivityEntry[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const ACTION_CONFIG: Record<string, { label: (meta: any, entityId: string | null) => string; icon: React.ReactNode; color: string }> = {
  order_status_changed: {
    label: (meta, entityId) => `Changed order status to ${meta?.status || 'unknown'}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M4 6h6M4 8.5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: '#00E5FF',
  },
  customer_suspended: {
    label: (_, entityId) => `Suspended customer ${entityId || ''}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 13c0-2.761 2.239-4.5 5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10 10l3 3M13 10l-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: '#E24B4A',
  },
  customer_activated: {
    label: (_, entityId) => `Activated customer ${entityId || ''}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 13c0-2.761 2.239-4.5 5-4.5s5 1.739 5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: '#1D9E75',
  },
  discount_created: {
    label: (meta) => `Created discount ${meta?.code || ''}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1.5 7.5L6.5 1.5H13v6.5L7.5 13.5H1.5V7.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <circle cx="10" cy="4.5" r="0.875" fill="currentColor"/>
      </svg>
    ),
    color: '#7B61FF',
  },
  price_updated: {
    label: (meta, entityId) => `Updated ${entityId || ''} price to $${meta?.price || ''}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 4v0.875M7 9.125V10M5.25 6.125c0-.724.784-1.3 1.75-1.3s1.75.576 1.75 1.3c0 1.3-3.5.875-3.5 2.175 0 .724.784 1.3 1.75 1.3s1.75-.576 1.75-1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: '#EF9F27',
  },
  manual_order_created: {
    label: (meta) => `Created manual order for ${meta?.customerEmail || ''}`,
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 5.5v3M5.5 7h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: '#00E5FF',
  },
}

export default function ActivityTab({ activityLog }: ActivityTabProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (activityLog.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-[#6B6B80]">No activity yet.</div>
    )
  }

  return (
    <div>
      <h2 className="font-syne font-black text-lg mb-5">Activity log</h2>
      <div className="flex flex-col gap-1 max-w-2xl">
        {activityLog.map(entry => {
          const config = ACTION_CONFIG[entry.action]
          const label = config
            ? config.label(entry.metadata, entry.entity_id)
            : entry.action.replace(/_/g, ' ')
          const color = config?.color || '#6B6B80'
          const icon = config?.icon || (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          )
          const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0
          const isExpanded = expanded === entry.id

          return (
            <div key={entry.id} className="bg-[#0E0E16] border border-[#1C1C2E] rounded-xl px-4 py-3">
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#F2F2F4]">{label}</div>
                  {entry.entity_id && entry.entity_type && (
                    <div className="text-xs text-[#3A3A50] mt-0.5 font-mono truncate">
                      {entry.entity_type}/{entry.entity_id}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[#3A3A50]">{timeAgo(entry.created_at)}</span>
                  {hasMetadata && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : entry.id)}
                      className="text-xs text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                  )}
                </div>
              </div>
              {isExpanded && hasMetadata && (
                <pre className="mt-3 ml-9 text-xs text-[#6B6B80] bg-[#07070C] rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(entry.metadata, null, 2)}
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
