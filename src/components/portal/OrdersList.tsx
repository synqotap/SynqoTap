import type { OrderWithShipment } from '@/types/app'
import { ORDER_STATUS_CONFIG, type OrderStatus } from '@/types/app'
import { Badge } from '@/components/ui'

type OrdersListProps = {
  orders: OrderWithShipment[]
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-[#0E0E16] border border-[#22223A] rounded-2xl p-8 text-center">
        <p className="text-sm text-[#6B6B80]">No orders yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map(order => {
        const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus]
        const cardLabel =
          order.card_type === 'pvc' ? 'PVC Card'
          : order.card_type === 'metal' ? 'Metal Card'
          : order.card_type
        const shipment = order.shipments
        const showTracking = (order.status === 'shipped' || order.status === 'delivered') && shipment?.tracking_number
        return (
          <div key={order.id} className="bg-[#0E0E16] border border-[#22223A] rounded-2xl px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#F2F2F4] mb-0.5">
                  {order.quantity}× {cardLabel}
                </p>
                <p className="text-xs text-[#6B6B80]">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  label={statusConfig?.label || order.status}
                  variant="custom"
                  color={statusConfig?.color || '#6B6B80'}
                />
                <p className="text-xs text-[#6B6B80] font-mono">${order.total_amount}</p>
              </div>
            </div>

            {showTracking && (
              <div className="mt-3 pt-3 border-t border-[#1C1C2E]">
                <p className="text-xs text-[#6B6B80] mb-1">
                  {shipment!.carrier && <span className="font-medium text-[#F2F2F4]">{shipment!.carrier}</span>}
                  {shipment!.carrier && ' · '}
                  <span className="font-mono">{shipment!.tracking_number}</span>
                </p>
                {shipment!.tracking_url && (
                  <a
                    href={shipment!.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00E5FF] hover:opacity-75 transition-opacity"
                  >
                    Track package →
                  </a>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
