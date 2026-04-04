import type { Shipment } from '@/types/app'

export async function saveShipment(
  supabase: any,
  orderId: string,
  carrier: string,
  trackingNumber: string,
  trackingUrl?: string
): Promise<void> {
  const { data: existing } = await supabase
    .from('shipments')
    .select('id')
    .eq('order_id', orderId)
    .single()

  const payload: Partial<Shipment> = {
    carrier,
    tracking_number: trackingNumber,
    tracking_url: trackingUrl ?? null,
    shipped_at: new Date().toISOString(),
  }

  if (existing) {
    await supabase
      .from('shipments')
      .update(payload)
      .eq('order_id', orderId)
  } else {
    await supabase
      .from('shipments')
      .insert({ ...payload, order_id: orderId })
  }
}

export async function getAdminStats(supabase: any): Promise<{
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  totalCustomers: number
}> {
  const [ordersRes, customersRes] = await Promise.all([
    supabase.from('orders').select('total_amount, status'),
    supabase.from('customers').select('id', { count: 'exact', head: true }),
  ])

  const orders: Array<{ total_amount: number; status: string }> = ordersRes.data || []
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum: number, o) => sum + (o.total_amount ?? 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'paid').length
  const totalCustomers = customersRes.count ?? 0

  return { totalOrders, totalRevenue, pendingOrders, totalCustomers }
}
