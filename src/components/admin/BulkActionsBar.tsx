'use client'
import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

type BulkActionsBarProps = {
  selectedCount: number
  onStatusChange: (status: string) => Promise<void>
  onExport: () => void
  onClear: () => void
}

export default function BulkActionsBar({ selectedCount, onStatusChange, onExport, onClear }: BulkActionsBarProps) {
  const [applying, setApplying] = useState(false)

  async function handleStatus(status: string) {
    setApplying(true)
    await onStatusChange(status)
    setApplying(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-[#0E0E16] border-t border-[#22223A] shadow-2xl animate-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-[#F2F2F4]">
          {selectedCount} {selectedCount === 1 ? 'order' : 'orders'} selected
        </span>
        <div className="flex items-center gap-2">
          <select
            onChange={e => { if (e.target.value) handleStatus(e.target.value) }}
            disabled={applying}
            value=""
            className="bg-[#13131F] border border-[#22223A] rounded-lg px-3 py-1.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors disabled:opacity-50"
          >
            <option value="" disabled>Change status...</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={onExport}
            className="text-sm px-3 py-1.5 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
          >
            Export
          </button>
        </div>
      </div>
      <button
        onClick={onClear}
        className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
      >
        ✕ Clear
      </button>
    </div>
  )
}
