'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrderWithRelations } from '@/types/app'
import { getAllOrdersWithRelations, updateOrderStatus } from '@/services/orders'
import { saveShipment } from '@/services/admin'
import { AdminTopbar } from '@/components/layout'
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
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected({ ...selected, status })
  }

  async function handleSaveTracking(orderId: string, carrier: string, tracking: string) {
    await saveShipment(supabase, orderId, carrier, tracking)
    await handleStatusChange(orderId, 'shipped')
    alert('Tracking saved and order marked as Shipped.')
    load()
  }

  const stats = [
    { value: orders.length, label: 'Total orders', color: '#F2F2F4' },
    { value: orders.filter(o => o.status === 'paid').length, label: 'Paid', color: '#00E5FF' },
    { value: orders.filter(o => o.status === 'shipped').length, label: 'Shipped', color: '#639922' },
    { value: orders.filter(o => o.status === 'delivered').length, label: 'Delivered', color: '#1D9E75' },
    {
      value: `$${orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + Number(o.total_amount), 0)}`,
      label: 'Revenue USD',
      color: '#EF9F27',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center text-sm text-[#6B6B80] font-[family-name:var(--font-dm-sans)]">
        Loading orders...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07070C] text-[#F2F2F4] font-[family-name:var(--font-dm-sans)]">
      <AdminTopbar />

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

        {/* Desktop sidebar */}
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
