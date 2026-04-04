import type { Customer } from '@/types/app'

export async function getCustomerByUserId(
  supabase: any,
  userId: string
): Promise<Customer | null> {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single()
  return data
}

export async function getCustomerByEmail(
  supabase: any,
  email: string
): Promise<Customer | null> {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single()
  return data
}

export async function getCustomerById(
  supabase: any,
  customerId: string
): Promise<Customer | null> {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single()
  return data
}

export async function getAllCustomers(
  supabase: any
): Promise<Customer[]> {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export async function updateCustomer(
  supabase: any,
  customerId: string,
  updates: Partial<Customer>
): Promise<void> {
  await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
}
