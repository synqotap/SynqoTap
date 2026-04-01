import { SupabaseClient } from '@supabase/supabase-js'

export async function saveShipment(
  supabase: SupabaseClient,
  orderId: string,
  carrier: string,
  trackingNumber: string
): Promise<void> {
  const { data: existing } = await supabase
    .from('shipments')
    .select('id')
    .eq('order_id', orderId)
    .single()

  if (existing) {
    await supabase
      .from('shipments')
      .update({
        carrier,
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString()
      })
      .eq('order_id', orderId)
  } else {
    await supabase
      .from('shipments')
      .insert({
        order_id: orderId,
        carrier,
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString()
      })
  }
}
