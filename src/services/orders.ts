import type { Order, OrderWithRelations, OrderWithShipment } from '@/types/app'

export async function getOrdersByCustomerId(
  supabase: any,
  customerId: string
): Promise<Order[]> {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getOrderById(
  supabase: any,
  orderId: string
): Promise<Order | null> {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  return data
}

export async function getAllOrdersWithRelations(
  supabase: any
): Promise<OrderWithRelations[]> {
  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      customers(email, full_name),
      profiles(slug),
      shipments(tracking_number, carrier, tracking_url)
    `)
    .order('created_at', { ascending: false })
  return (data as OrderWithRelations[]) || []
}

export async function createOrder(
  supabase: any,
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>
): Promise<Order | null> {
  const { data } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  return data
}

export async function updateOrderStatus(
  supabase: any,
  orderId: string,
  status: string
): Promise<void> {
  await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
}

export async function getOrdersWithShipmentsByCustomerId(
  supabase: any,
  customerId: string
): Promise<OrderWithShipment[]> {
  const { data } = await supabase
    .from('orders')
    .select('*, shipments(tracking_number, carrier, tracking_url)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  return (data as OrderWithShipment[]) || []
}
