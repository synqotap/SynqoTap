'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProfileButton } from '@/types/app'
import { getButtonsByProfileId, addButton, updateButton, deleteButton, reorderButtons } from '@/services/buttons'

export function useButtons(profileId: string | null) {
  const [buttons, setButtons] = useState<ProfileButton[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!profileId) return
    load()
  }, [profileId])

  async function load() {
    const data = await getButtonsByProfileId(supabase, profileId!)
    setButtons(data)
    setLoading(false)
  }

  async function add(button: Pick<ProfileButton, 'type' | 'value' | 'label'>) {
    if (!profileId) return
    const optimistic: ProfileButton = {
      id: `optimistic-${Date.now()}`,
      profile_id: profileId,
      position: buttons.length,
      is_active: true,
      created_at: new Date().toISOString(),
      ...button,
    }
    setButtons(prev => [...prev, optimistic])
    const data = await addButton(supabase, profileId, { ...button, position: buttons.length })
    if (data) {
      setButtons(prev => prev.map(b => b.id === optimistic.id ? data : b))
    } else {
      setButtons(prev => prev.filter(b => b.id !== optimistic.id))
    }
  }

  async function toggle(id: string, is_active: boolean) {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, is_active } : b))
    await updateButton(supabase, id, { is_active })
  }

  async function update(id: string, updates: Partial<ProfileButton>) {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    await updateButton(supabase, id, updates)
  }

  async function remove(id: string) {
    setButtons(prev => prev.filter(b => b.id !== id))
    await deleteButton(supabase, id)
  }

  async function reorder(reordered: ProfileButton[]) {
    setButtons(reordered)
    await reorderButtons(supabase, reordered.map((b, i) => ({ id: b.id, position: i })))
  }

  async function reorderWithPositions(updates: Array<{ id: string; position: number }>) {
    await reorderButtons(supabase, updates)
  }

  function setButtonsDirectly(updated: ProfileButton[]) {
    setButtons(updated)
  }

  return { buttons, loading, add, toggle, update, remove, reorder, reorderWithPositions, setButtonsDirectly }
}
