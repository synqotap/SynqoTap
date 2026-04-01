import { SupabaseClient } from '@supabase/supabase-js'
import { ProfileButton } from '@/types/app'

export async function getButtonsByProfileId(
  supabase: SupabaseClient,
  profileId: string
): Promise<ProfileButton[]> {
  const { data } = await supabase
    .from('profile_buttons')
    .select('*')
    .eq('profile_id', profileId)
    .order('position')
  return data || []
}

export async function addButton(
  supabase: SupabaseClient,
  profileId: string,
  button: Pick<ProfileButton, 'type' | 'value' | 'label' | 'position'>
): Promise<ProfileButton | null> {
  const { data } = await supabase
    .from('profile_buttons')
    .insert({ ...button, profile_id: profileId, is_active: true })
    .select()
    .single()
  return data
}

export async function updateButton(
  supabase: SupabaseClient,
  buttonId: string,
  updates: Partial<ProfileButton>
): Promise<void> {
  await supabase
    .from('profile_buttons')
    .update(updates)
    .eq('id', buttonId)
}

export async function deleteButton(
  supabase: SupabaseClient,
  buttonId: string
): Promise<void> {
  await supabase
    .from('profile_buttons')
    .delete()
    .eq('id', buttonId)
}
