'use client'
import { OrderWithRelations, ORDER_STATUS_CONFIG, OrderStatus } from '@/types/app'
import { Badge, Input, Select } from '@/components/ui'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

type OrdersTableProps = {
  orders: OrderWithRelations[]
  selectedId: string | null
  search: string
  filterStatus: string
  onSelect: (order: OrderWithRelations) => void
  onSearchChange: (v: string) => void
  onStatusChange: (v: string) => void
}

export default function OrdersTable({
  orders, selectedId, search, filterStatus,
  onSelect, onSearchChange, onStatusChange
}: OrdersTableProps) {
  const filtered = orders.filter(o => {
    const matchSearch = !search
      || o.customers?.email?.includes(search)
      || o.customers?.full_name?.toLowerCase().includes(search.toLowerCase())
      || o.profiles?.slug?.includes(search)
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <Input
            value={search}
            onChange={onSearchChange}
            placeholder="Search by email, name or slug..."
          />
        </div>
        <div className="w-44">
          <Select
            value={filterStatus}
            onChange={onStatusChange}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#6B6B80]">No orders match.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
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
                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelect(order)}
                    className={`cursor-pointer transition-colors ${selectedId === order.id ? 'bg-[#00E5FF]/[0.05]' : 'hover:bg-[#0E0E16]'}`}
                  >
                    <td className="px-3 py-3 border-b border-[#1C1C2E]">
                      <div className="text-sm font-medium text-[#F2F2F4]">{order.customers?.full_name || '—'}</div>
                      <div className="text-xs text-[#6B6B80]">{order.customers?.email}</div>
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E] text-xs font-medium uppercase text-[#F2F2F4]">
                      {order.card_type}
                    </td>
                    <td className="px-3 py-3 border-b border-[#1C1C2E] text-sm text-[#F2F2F4]">
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
                      {new Date(order.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
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
