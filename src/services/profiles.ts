import { SupabaseClient } from '@supabase/supabase-js'
import { Profile } from '@/types/app'

export async function getProfileByCustomerId(
  supabase: SupabaseClient,
  customerId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('customer_id', customerId)
    .single()
  return data
}

export async function getProfileBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*, profile_buttons(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function updateProfile(
  supabase: SupabaseClient,
  profileId: string,
  updates: Partial<Profile>
): Promise<void> {
  await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
}

export async function incrementProfileView(
  supabase: SupabaseClient,
  slug: string
): Promise<void> {
  await supabase.rpc('increment_view', { profile_slug: slug })
}
