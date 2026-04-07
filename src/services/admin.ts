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

// Customers
export async function getAllCustomers(supabase: any) {
  const { data } = await supabase
    .from('customers')
    .select('*, profiles(slug, display_name, is_published, is_active)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function updateCustomer(supabase: any, id: string, updates: any) {
  await supabase.from('customers').update(updates).eq('id', id)
}

export async function suspendCustomer(supabase: any, id: string) {
  await supabase.from('customers')
    .update({ is_active: false })
    .eq('id', id)
  await supabase.from('profiles')
    .update({ is_published: false, is_active: false })
    .eq('customer_id', id)
}

export async function activateCustomer(supabase: any, id: string) {
  await supabase.from('customers')
    .update({ is_active: true })
    .eq('id', id)
  await supabase.from('profiles')
    .update({ is_published: true, is_active: true })
    .eq('customer_id', id)
}

// Discounts
export async function getAllDiscounts(supabase: any) {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('[getAllDiscounts] Supabase error:', error)
  console.log('[getAllDiscounts] rows returned:', data?.length ?? 'null')
  return data ?? []
}

export async function createDiscount(supabase: any, discount: any) {
  const { data } = await supabase
    .from('discounts')
    .insert(discount)
    .select()
    .single()
  return data
}

export async function updateDiscount(supabase: any, id: string, updates: any) {
  await supabase.from('discounts').update(updates).eq('id', id)
}

export async function deleteDiscount(supabase: any, id: string) {
  await supabase.from('discounts').delete().eq('id', id)
}

// Prices
export async function getPrices(supabase: any) {
  const { data } = await supabase
    .from('prices')
    .select('*')
    .order('card_type')
  return data || []
}

export async function updatePrice(supabase: any, cardType: string, updates: any) {
  await supabase.from('prices').update({
    ...updates,
    updated_at: new Date().toISOString()
  }).eq('card_type', cardType)
}

// Activity log
function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export async function logActivity(supabase: any, action: string, targetType: string, targetId: string, metadata?: any) {
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('activity_log').insert({
    actor_id: user?.id,
    action,
    target_type: targetType,
    target_id: isValidUUID(targetId) ? targetId : null,
    metadata,
  })
}

export async function getActivityLog(supabase: any) {
  const { data } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return data || []
}

// Manual order creation
export async function createManualOrder(supabase: any, {
  customerEmail, customerName, cardType, quantity, unitPrice, notes, shipping_address
}: {
  customerEmail: string
  customerName: string
  cardType: string
  quantity: number
  unitPrice: number
  notes?: string
  shipping_address?: {
    name: string
    line1: string
    line2: string | null
    city: string
    state: string
    postal_code: string
    country: string
  }
}) {
  // Get or create customer
  let { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('email', customerEmail)
    .single()

  if (!customer) {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({ email: customerEmail, full_name: customerName, plan: cardType })
      .select('id')
      .single()
    if (customerError || !newCustomer) throw new Error(customerError?.message ?? 'Failed to create customer')
    customer = newCustomer
  }

  // Create profile
  const slug = `${customerName.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 6)}`
  const { data: profile } = await supabase
    .from('profiles')
    .insert({ customer_id: customer.id, slug, display_name: customerName, template: 'minimal', is_published: true })
    .select('id')
    .single()

  // Create order
  const { data: order } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      profile_id: profile?.id,
      card_type: cardType,
      quantity,
      unit_price: unitPrice,
      total_amount: unitPrice * quantity,
      status: 'paid',
      notes,
      shipping_address: shipping_address ?? null,
    })
    .select('id')
    .single()

  return order
}

// Export orders as CSV
export function exportOrdersCSV(orders: any[]) {
  const headers = ['Date', 'Customer', 'Email', 'Card Type', 'Quantity', 'Total', 'Status', 'Shipping Address']
  const rows = orders.map(o => [
    new Date(o.created_at).toLocaleDateString(),
    o.customers?.full_name || '',
    o.customers?.email || '',
    o.card_type,
    o.quantity,
    o.total_amount,
    o.status,
    o.shipping_address ? `${o.shipping_address.line1}, ${o.shipping_address.city}, ${o.shipping_address.state}` : '',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `synqotap-orders-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
