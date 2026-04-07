'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OrderWithRelations } from '@/types/app'
import {
  getAllOrdersWithRelations, updateOrderStatus
} from '@/services/orders'
import {
  saveShipment, getAllCustomers, getAllDiscounts,
  getPrices, getActivityLog, exportOrdersCSV,
  logActivity, createManualOrder
} from '@/services/admin'
import {
  StatsGrid, OrdersTable, OrderDetail,
  TabNav, CustomersTab, DiscountsTab,
  PricesTab, ActivityTab, ManualOrderModal,
  BulkActionsBar
} from '@/components/admin'
import { Modal } from '@/components/ui'

type AdminTab = 'orders' | 'customers' | 'discounts' | 'prices' | 'activity'

export default function AdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<AdminTab>('orders')
  const [orders, setOrders] = useState<OrderWithRelations[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<any[]>([])
  const [prices, setPrices] = useState<any[]>([])
  const [activityLog, setActivityLog] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OrderWithRelations | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showManualOrder, setShowManualOrder] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [ordersData, customersData, discountsData, pricesData, logData] = await Promise.all([
        getAllOrdersWithRelations(supabase),
        getAllCustomers(supabase),
        getAllDiscounts(supabase),
        getPrices(supabase),
        getActivityLog(supabase),
      ])
      console.log('[loadAll] discountsData:', discountsData)
      setOrders(ordersData as OrderWithRelations[])
      setCustomers(customersData)
      setDiscounts(discountsData)
      setPrices(pricesData)
      setActivityLog(logData)
    } catch (err) {
      console.error('[loadAll] unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(order: OrderWithRelations) {
    setSelected(order)
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setDrawerOpen(true)
    }
  }

  async function handleStatusChange(orderId: string, status: string) {
    await updateOrderStatus(supabase, orderId, status)
    await logActivity(supabase, 'order_status_changed', 'order', orderId, { status })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null)
  }

  async function handleSaveTracking(orderId: string, carrier: string, tracking: string, trackingUrl?: string) {
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
    loadAll()
  }

  async function handleCreateManualOrder(data: any) {
    const order = await createManualOrder(supabase, data)
    await logActivity(supabase, 'manual_order_created', 'order', order.id, data)
    setShowManualOrder(false)
    loadAll()
  }

  async function handleBulkStatusChange(status: string) {
    await Promise.all(selectedIds.map(id => updateOrderStatus(supabase, id, status)))
    setOrders(prev => prev.map(o => selectedIds.includes(o.id) ? { ...o, status } : o))
    setSelectedIds([])
  }

  const stats = [
    { value: orders.length, label: 'Total orders', color: '#F2F2F4' },
    { value: orders.filter(o => o.status === 'paid').length, label: 'Paid', color: '#00E5FF' },
    { value: orders.filter(o => o.status === 'shipped').length, label: 'Shipped', color: '#639922' },
    { value: orders.filter(o => o.status === 'delivered').length, label: 'Delivered', color: '#1D9E75' },
    {
      value: `$${orders.filter(o => !['cancelled','refunded'].includes(o.status)).reduce((s,o) => s + Number(o.total_amount), 0)}`,
      label: 'Revenue USD',
      color: '#EF9F27',
    },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
    </div>
  )

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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowManualOrder(true)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] hover:border-[#00E5FF]/40 transition-colors"
          >
            + Manual order
          </button>
          <button
            onClick={() => exportOrdersCSV(orders)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#22223A] text-[#6B6B80] hover:text-[#F2F2F4] transition-colors"
          >
            Export CSV
          </button>
          <a href="/portal" className="text-sm text-[#6B6B80] hover:text-[#F2F2F4] transition-colors">
            Portal
          </a>
        </div>
      </header>

      {/* Stats — always visible */}
      <div className="px-5 sm:px-6 pt-5 pb-1 bg-[#07070C]">
        <StatsGrid stats={stats} />
      </div>

      {/* Tab navigation */}
      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orderCount={orders.filter(o => o.status === 'paid').length}
      />

      {/* Content */}
      <div className="flex" style={{ minHeight: 'calc(100vh - 112px)' }}>
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto">

          {activeTab === 'orders' && (
            <>
              <OrdersTable
                orders={orders}
                selectedId={selected?.id ?? null}
                selectedIds={selectedIds}
                search={search}
                filterStatus={filterStatus}
                onSelect={handleSelect}
                onSearchChange={setSearch}
                onStatusChange={setFilterStatus}
                onSelectionChange={setSelectedIds}
              />
            </>
          )}

          {activeTab === 'customers' && (
            <CustomersTab
              customers={customers}
              onSuspend={async (id) => {
                const { suspendCustomer } = await import('@/services/admin')
                await suspendCustomer(supabase, id)
                await logActivity(supabase, 'customer_suspended', 'customer', id)
                loadAll()
              }}
              onActivate={async (id) => {
                const { activateCustomer } = await import('@/services/admin')
                await activateCustomer(supabase, id)
                await logActivity(supabase, 'customer_activated', 'customer', id)
                loadAll()
              }}
              onEdit={async (id, updates) => {
                const { updateCustomer } = await import('@/services/admin')
                await updateCustomer(supabase, id, updates)
                loadAll()
              }}
            />
          )}

          {activeTab === 'discounts' && (
            <DiscountsTab
              discounts={discounts}
              onCreateDiscount={async (data) => {
                const { createDiscount } = await import('@/services/admin')
                await createDiscount(supabase, data)
                await logActivity(supabase, 'discount_created', 'discount', 'new', data)
                loadAll()
              }}
              onUpdateDiscount={async (id, updates) => {
                const { updateDiscount } = await import('@/services/admin')
                await updateDiscount(supabase, id, updates)
                loadAll()
              }}
              onDeleteDiscount={async (id) => {
                const { deleteDiscount } = await import('@/services/admin')
                await deleteDiscount(supabase, id)
                loadAll()
              }}
            />
          )}

          {activeTab === 'prices' && (
            <PricesTab
              prices={prices}
              onUpdatePrice={async (cardType, updates) => {
                const { updatePrice } = await import('@/services/admin')
                await updatePrice(supabase, cardType, { price: updates.price })
                await logActivity(supabase, 'price_updated', 'price', cardType, { price: updates.price })
                loadAll()
              }}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityTab activityLog={activityLog} />
          )}

        </div>

        {/* Desktop sidebar — only for orders tab */}
        {activeTab === 'orders' && (
          <div className="hidden lg:block w-95 border-l border-[#1C1C2E] bg-[#0E0E16] p-6 overflow-y-auto">
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
        )}
      </div>

      {/* Mobile drawer for order detail */}
      <Modal open={drawerOpen && !!selected && activeTab === 'orders'} onClose={() => setDrawerOpen(false)}>
        {selected && (
          <OrderDetail
            order={selected}
            onStatusChange={handleStatusChange}
            onSaveTracking={handleSaveTracking}
          />
        )}
      </Modal>

      {/* Manual order modal */}
      <Modal open={showManualOrder} onClose={() => setShowManualOrder(false)}>
        <ManualOrderModal
          customers={customers}
          prices={prices}
          onSubmit={handleCreateManualOrder}
          onClose={() => setShowManualOrder(false)}
        />
      </Modal>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedIds.length}
          onStatusChange={handleBulkStatusChange}
          onExport={() => exportOrdersCSV(orders.filter(o => selectedIds.includes(o.id)))}
          onClear={() => setSelectedIds([])}
        />
      )}
    </div>
  )
}
