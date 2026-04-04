'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrderWithRelations } from '@/types/app'
import { getAllOrdersWithRelations, updateOrderStatus } from '@/services/orders'
import { saveShipment } from '@/services/admin'
import { StatsGrid, OrdersTable, OrderDetail } from '@/components/admin'
import { Modal } from '@/components/ui'

export default function AdminPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OrderWithRelations | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    const data = await getAllOrdersWithRelations(supabase) as OrderWithRelations[]
    setOrders(data)
    setLoading(false)
  }

  function handleSelect(order: OrderWithRelations) {
    setSelected(order)
    setDrawerOpen(true)
  }

  async function handleStatusChange(orderId: string, status: string) {
    await updateOrderStatus(supabase, orderId, status)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null)
  }

  async function handleSaveTracking(
    orderId: string,
    carrier: string,
    tracking: string,
    trackingUrl?: string
  ) {
    await saveShipment(supabase, orderId, carrier, tracking, trackingUrl)
    await handleStatusChange(orderId, 'shipped')

    const order = orders.find(o => o.id === orderId)
    if (order?.customers?.email && order?.profiles?.slug) {
      try {
        await fetch('/api/admin/send-shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: order.customers.email,
            name: order.customers.full_name || 'Customer',
            trackingNumber: tracking,
            trackingUrl,
            carrier,
            slug: order.profiles.slug,
          }),
        })
      } catch (err) {
        console.error('Failed to send shipping email:', err)
      }
    }

    alert('Tracking saved and order marked as Shipped.')
    load()
  }

  const stats = [
    { value: orders.length, label: 'Total orders', color: '#F2F2F4' },
    { value: orders.filter(o => o.status === 'paid').length, label: 'Paid', color: '#00E5FF' },
    { value: orders.filter(o => o.status === 'shipped').length, label: 'Shipped', color: '#639922' },
    { value: orders.filter(o => o.status === 'delivered').length, label: 'Delivered', color: '#1D9E75' },
    {
      value: `$${orders
        .filter(o => !['cancelled', 'refunded'].includes(o.status))
        .reduce((s, o) => s + Number(o.total_amount), 0)}`,
      label: 'Revenue USD',
      color: '#EF9F27',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-dm-sans">
      {/* Topbar */}
      <header className="bg-[#0E0E16] border-b border-[#1C1C2E] px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <a href="/" className="font-syne font-black text-lg">
            Synqo<span className="text-[#00E5FF]">Tap</span>
          </a>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#F09595]">
            ADMIN
          </span>
        </div>
        <a href="/portal" className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">
          Customer portal
        </a>
      </header>

      <div className="flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Main */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
          <StatsGrid stats={stats} />
          <OrdersTable
            orders={orders}
            selectedId={selected?.id ?? null}
            search={search}
            filterStatus={filterStatus}
            onSelect={handleSelect}
            onSearchChange={setSearch}
            onStatusChange={setFilterStatus}
          />
        </div>

        {/* Desktop sidebar detail */}
        <div className="hidden lg:block w-[380px] border-l border-[#1C1C2E] bg-[#0E0E16] p-6 overflow-y-auto">
          {selected ? (
            <OrderDetail
              order={selected}
              onStatusChange={handleStatusChange}
              onSaveTracking={handleSaveTracking}
            />
          ) : (
            <div className="text-center pt-16 text-sm text-[#6B6B80]">
              Select an order to view details
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <Modal open={drawerOpen && !!selected} onClose={() => setDrawerOpen(false)}>
        {selected && (
          <OrderDetail
            order={selected}
            onStatusChange={handleStatusChange}
            onSaveTracking={handleSaveTracking}
          />
        )}
      </Modal>
    </div>
  )
}
