import type { ProfileButton, ButtonGroup } from '@/types/app'

export async function getButtonsByProfileId(
  supabase: any,
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
  supabase: any,
  profileId: string,
  button: Pick<ProfileButton, 'type' | 'value' | 'label' | 'position'>
): Promise<ProfileButton | null> {
  try {
    const { error } = await supabase
      .from('profile_buttons')
      .insert({ ...button, profile_id: profileId, is_active: true })

    if (error) return null

    // Separate SELECT — avoids RLS issues with inline post-insert selects
    const { data } = await supabase
      .from('profile_buttons')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return data ?? null
  } catch {
    return null
  }
}

export async function updateButton(
  supabase: any,
  buttonId: string,
  updates: Partial<ProfileButton>
): Promise<void> {
  const { error } = await supabase
    .from('profile_buttons')
    .update(updates)
    .eq('id', buttonId)
  if (error) console.error('[updateButton]', error.message)
}

export async function deleteButton(
  supabase: any,
  buttonId: string
): Promise<void> {
  await supabase
    .from('profile_buttons')
    .delete()
    .eq('id', buttonId)
}

export async function reorderButtons(
  supabase: any,
  updates: Array<{ id: string; position: number }>
): Promise<void> {
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('profile_buttons').update({ position }).eq('id', id)
    )
  )
}

// ── Button groups ────────────────────────────────────────────

export async function getGroupsByProfileId(
  supabase: any,
  profileId: string
): Promise<ButtonGroup[]> {
  const { data } = await supabase
    .from('button_groups')
    .select('*')
    .eq('profile_id', profileId)
    .order('position')
  return data || []
}

export async function addGroup(
  supabase: any,
  profileId: string,
  name: string,
  position: number
): Promise<ButtonGroup | null> {
  const { error } = await supabase
    .from('button_groups')
    .insert({ profile_id: profileId, name, position })
  if (error) return null
  const { data } = await supabase
    .from('button_groups')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data ?? null
}

export async function updateGroup(
  supabase: any,
  groupId: string,
  updates: { name?: string; position?: number }
): Promise<void> {
  await supabase.from('button_groups').update(updates).eq('id', groupId)
}

export async function deleteGroup(
  supabase: any,
  groupId: string
): Promise<void> {
  await supabase.from('button_groups').delete().eq('id', groupId)
}

export async function reorderGroups(
  supabase: any,
  updates: Array<{ id: string; position: number }>
): Promise<void> {
  await Promise.all(
    updates.map(({ id, position }) =>
      supabase.from('button_groups').update({ position }).eq('id', id)
    )
  )
}
