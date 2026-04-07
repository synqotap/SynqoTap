'use client'
import { OrderWithRelations, ORDER_STATUS_CONFIG, OrderStatus } from '@/types/app'
import { Badge } from '@/components/ui'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

type OrdersTableProps = {
  orders: OrderWithRelations[]
  selectedId: string | null
  selectedIds: string[]
  search: string
  filterStatus: string
  onSelect: (order: OrderWithRelations) => void
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
  onSelectionChange: (ids: string[]) => void
}

export default function OrdersTable({
  orders, selectedId, selectedIds, search, filterStatus,
  onSelect, onSearchChange, onStatusChange, onSelectionChange
}: OrdersTableProps) {
  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !search
      || o.customers?.email?.toLowerCase().includes(q)
      || o.customers?.full_name?.toLowerCase().includes(q)
      || o.profiles?.slug?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  const allFilteredIds = filtered.map(o => o.id)
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id))

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(selectedIds.filter(id => !allFilteredIds.includes(id)))
    } else {
      const newIds = [...new Set([...selectedIds, ...allFilteredIds])]
      onSelectionChange(newIds)
    }
  }

  function toggleOne(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by email, name or slug..."
          className="flex-1 min-w-[200px] bg-[#0E0E16] border border-[#22223A] rounded-xl px-4 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
        />
        <select
          value={filterStatus}
          onChange={e => onStatusChange(e.target.value)}
          className="bg-[#0E0E16] border border-[#22223A] rounded-xl px-3 py-2.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#6B6B80]">No orders match.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-3 py-2.5 border-b border-[#1C1C2E] w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-[#00E5FF] cursor-pointer"
                  />
                </th>
                {['Customer', 'Type', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-[#6B6B80] uppercase tracking-wide px-3 py-2.5 border-b border-[#1C1C2E]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const status = ORDER_STATUS_CONFIG[order.status as OrderStatus]
                const isChecked = selectedIds.includes(order.id)
                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelect(order)}
                    className={`cursor-pointer transition-colors ${
                      selectedId === order.id
                        ? 'bg-[#00E5FF]/[0.05]'
                        : 'hover:bg-[#0E0E16]'
                    }`}
                  >
                    <td className="px-3 py-3 border-b border-[#1C1C2E]" onClick={e => { e.stopPropagation(); toggleOne(order.id) }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleOne(order.id)}
                        className="w-3.5 h-3.5 rounded accent-[#00E5FF] cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E]">
                      <div className="text-sm font-medium">{order.customers?.full_name || '—'}</div>
                      <div className="text-xs text-[#6B6B80]">{order.customers?.email}</div>
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E] text-xs font-medium uppercase">
                      {order.card_type}
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E] text-sm">
                      ${order.total_amount}
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E]">
                      <Badge
                        label={status?.label || order.status}
                        variant="custom"
                        color={status?.color || '#6B6B80'}
                      />
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E] text-xs text-[#6B6B80]">
                      {new Date(order.created_at).toLocaleDateString('en', {
                        day: 'numeric', month: 'short'
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
