'use client'
import { useState } from 'react'
import { OrderWithRelations } from '@/types/app'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'in_production', label: 'In production' },
  { value: 'programmed', label: 'Programmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

type OrderDetailProps = {
  order: OrderWithRelations
  onStatusChange: (orderId: string, status: string) => void
  onSaveTracking: (orderId: string, carrier: string, tracking: string, trackingUrl?: string) => Promise<void>
}

export default function OrderDetail({ order, onStatusChange, onSaveTracking }: OrderDetailProps) {
  const [carrier, setCarrier] = useState(order.shipments?.carrier || '')
  const [tracking, setTracking] = useState(order.shipments?.tracking_number || '')
  const [trackingUrl, setTrackingUrl] = useState(order.shipments?.tracking_url || '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!tracking) return
    setSaving(true)
    await onSaveTracking(order.id, carrier, tracking, trackingUrl || undefined)
    setSaving(false)
  }

  const inputClass = "w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] placeholder:text-[#3A3A50] focus:outline-none focus:border-[#00E5FF] transition-colors"

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="font-syne font-black text-lg mb-0.5">
          {order.customers?.full_name || 'No name'}
        </div>
        <div className="text-sm text-[#6B6B80]">{order.customers?.email}</div>
      </div>

      {order.shipping_address && (() => {
        const addr = order.shipping_address as {
          name?: string | null
          line1?: string | null
          line2?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
        }
        return (
          <div className="bg-[#13131F] border border-[#22223A] rounded-xl p-4">
            <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-2">Ship to</div>
            {addr.name && <div className="text-sm font-medium text-[#F2F2F4]">{addr.name}</div>}
            {addr.line1 && <div className="text-sm text-[#F2F2F4] mt-0.5">{addr.line1}</div>}
            {addr.line2 && <div className="text-sm text-[#F2F2F4]">{addr.line2}</div>}
            <div className="text-sm text-[#F2F2F4]">
              {[addr.city, addr.state, addr.postal_code].filter(Boolean).join(', ')}
            </div>
            {addr.country && <div className="text-xs text-[#6B6B80] mt-0.5">{addr.country}</div>}
          </div>
        )
      })()}

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
        <div className="text-sm">
          SynqoTap {order.card_type === 'pvc' ? 'PVC' : 'Metal'} × {order.quantity}
        </div>
        <div className="text-xs text-[#6B6B80] mt-0.5">
          ${order.total_amount} USD · {new Date(order.created_at).toLocaleDateString('en', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </div>
      </div>

      <div className="border-t border-[#1C1C2E]" />

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-2">Change status</div>
        <select
          value={order.status}
          onChange={e => onStatusChange(order.id, e.target.value)}
          className="w-full bg-[#0E0E16] border border-[#22223A] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F4] focus:outline-none focus:border-[#00E5FF] transition-colors"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="border-t border-[#1C1C2E]" />

      <div>
        <div className="text-xs text-[#6B6B80] uppercase tracking-wide mb-3">Add tracking</div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Carrier</label>
            <input value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="FedEx, UPS, DHL..." className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Tracking number</label>
            <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="1Z999AA10123456784" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-[#6B6B80] mb-1.5 block">Tracking URL (optional)</label>
            <input value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} placeholder="https://www.fedex.com/tracking/..." className={inputClass} />
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !tracking}
            className="w-full bg-[#00E5FF] text-[#07070C] font-syne font-bold py-3 rounded-full hover:opacity-85 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-[#07070C]/20 border-t-[#07070C] animate-spin" />
                Saving...
              </>
            ) : 'Save and mark as Shipped'}
          </button>
        </div>
      </div>
    </div>
  )
}
