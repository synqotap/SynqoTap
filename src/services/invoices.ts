import type { Invoice } from '@/types/app'

export async function getInvoicesByCustomerId(
  supabase: any,
  customerId: string
): Promise<Invoice[]> {
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getInvoiceById(
  supabase: any,
  invoiceId: string
): Promise<Invoice | null> {
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()
  return data
}

export async function getAllInvoices(
  supabase: any
): Promise<Invoice[]> {
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function createInvoice(
  supabase: any,
  invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
): Promise<Invoice | null> {
  const { data } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()
  return data
}

export async function updateInvoice(
  supabase: any,
  invoiceId: string,
  updates: Partial<Invoice>
): Promise<void> {
  await supabase
    .from('invoices')
    .update(updates)
    .eq('id', invoiceId)
}

export async function deleteInvoice(
  supabase: any,
  invoiceId: string
): Promise<void> {
  await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
}
