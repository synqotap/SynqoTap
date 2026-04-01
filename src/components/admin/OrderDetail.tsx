'use client'
import { useState } from 'react'
import { OrderWithRelations } from '@/types/app'
import { Button, Select } from '@/components/ui'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

type OrderDetailProps = {
  order: OrderWithRelations
  onStatusChange: (orderId: string, status: string) => void
  onSaveTracking: (orderId: string, carrier: string, tracking: string) => Promise<void>
}

export default function OrderDetail({ order, onStatusChange, onSaveTracking }: OrderDetailProps) {
  const [carrier, setCarrier] = useState(order.shipments?.carrier || '')
  const [tracking, setTracking] = useState(order.shipments?.tracking_number || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!tracking) return
    setSaving(true)
    await onSaveTracking(order.id, carrier, tracking)
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="text-lg font-black font-[family-name:var(--font-syne)] mb-0.5">
          {order.customers?.full_name || 'No name'}
        </div>
        <div className="text-sm text-[#6B6B80]">{order.customers?.email}</div>
      </div>

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-2">Public profile</div>
        <a
          href={`/c/${order.profiles?.slug}`}
          target="_blank"
          className="font-mono text-xs text-[#00E5FF] break-all hover:opacity-70 transition-opacity"
        >
          /c/{order.profiles?.slug}
        </a>
      </div>

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-2">Order</div>
        <div className="text-sm text-[#F2F2F4]">
          SynqoTap {order.card_type === 'pvc' ? 'PVC' : 'Metal'} × {order.quantity}
        </div>
        <div className="text-xs text-[#6B6B80] mt-0.5">
          ${order.total_amount} USD · {new Date(order.created_at).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="border-t border-[#1C1C2E]" />

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-2">Change status</div>
        <Select
          value={order.status}
          onChange={v => onStatusChange(order.id, v)}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="border-t border-[#1C1C2E]" />

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-3">Add tracking</div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Carrier</label>
            <input
              value={carrier}
              onChange={e => setCarrier(e.target.value)}
              placeholder="FedEx, UPS, DHL..."
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-3.5 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Tracking number</label>
            <input
              value={tracking}
              onChange={e => setTracking(e.target.value)}
              placeholder="1Z999AA10123456784"
              className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-3.5 py-3 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"
            />
          </div>
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!tracking}
            fullWidth
          >
            Save and mark as Shipped
          </Button>
        </div>
      </div>
    </div>
  )
}
