import { Order, ORDER_STATUS_CONFIG, OrderStatus } from '@/types/app'
import { Badge } from '@/components/ui'

type OrdersListProps = {
  orders: Order[]
}

export default function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8 text-center text-sm text-[#6B6B80]">
        No orders yet.
      </div>
    )
  }

  return (
    <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl divide-y divide-[#1C1C2E]">
      {orders.map(order => {
        const status = ORDER_STATUS_CONFIG[order.status as OrderStatus] || { label: order.status, color: '#6B6B80' }
        return (
          <div key={order.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <div className="text-sm font-bold font-[family-name:var(--font-syne)]">
                SynqoTap {order.card_type === 'pvc' ? 'PVC' : 'Metal'} × {order.quantity}
              </div>
              <div className="text-xs text-[#6B6B80] mt-0.5">
                {new Date(order.created_at).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })} · ${order.total_amount} USD
              </div>
            </div>
            <Badge label={status.label} variant="custom" color={status.color} />
          </div>
        )
      })}
    </div>
  )
}
