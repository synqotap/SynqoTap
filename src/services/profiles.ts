import type { Profile, ProfileWithButtons } from '@/types/app'

export async function getProfileByCustomerId(
  supabase: any,
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
  supabase: any,
  slug: string
): Promise<ProfileWithButtons | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*, profile_buttons(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data
}

export async function createProfile(
  supabase: any,
  customerId: string,
  slug: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .insert({ customer_id: customerId, slug })
    .select()
    .single()
  return data
}

export async function updateProfile(
  supabase: any,
  profileId: string,
  updates: Partial<Profile>
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
  if (error) console.error('[updateProfile] error:', error.message, error.details ?? '')
}

export async function deleteProfile(
  supabase: any,
  profileId: string
): Promise<void> {
  await supabase
    .from('profiles')
    .delete()
    .eq('id', profileId)
}

export async function incrementProfileView(
  supabase: any,
  slug: string
): Promise<void> {
  await supabase.rpc('increment_view', { profile_slug: slug })
}
