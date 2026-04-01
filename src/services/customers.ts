import { SupabaseClient } from '@supabase/supabase-js'
import { Customer } from '@/types/app'

export async function getCustomerByUserId(
  supabase: SupabaseClient,
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
  supabase: SupabaseClient,
  email: string
): Promise<Customer | null> {
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .single()
  return data
}
