'use client'
import { Modal } from '@/components/ui'
import { OrdersList } from '@/components/portal/OrdersList'
import type { OrderWithShipment } from '@/types/app'

type OrdersDrawerProps = {
  open: boolean
  onClose: () => void
  orders: OrderWithShipment[]
  loading: boolean
}

export function OrdersDrawer({ open, onClose, orders, loading }: OrdersDrawerProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-black text-base">My orders</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B6B80] hover:text-[#F2F2F4] hover:bg-[#13131F] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </Modal>
  )
}
