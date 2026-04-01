import { SupabaseClient } from '@supabase/supabase-js'
import { Order } from '@/types/app'

export async function getOrdersByCustomerId(
  supabase: SupabaseClient,
  customerId: string
): Promise<Order[]> {
  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getAllOrdersWithRelations(
  supabase: SupabaseClient
) {
  const { data } = await supabase
    .from('orders')
    .select(`
      id, card_type, quantity, total_amount, status, created_at,
      customers(email, full_name),
      profiles(slug),
      shipments(tracking_number, carrier, shipped_at)
    `)
    .order('created_at', { ascending: false })
  return data || []
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  status: string
): Promise<void> {
  await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
}
