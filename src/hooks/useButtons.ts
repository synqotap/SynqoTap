'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProfileButton } from '@/types/app'
import { getButtonsByProfileId, addButton, updateButton, deleteButton } from '@/services/buttons'

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
    const data = await addButton(supabase, profileId, {
      ...button,
      position: buttons.length
    })
    if (data) setButtons([...buttons, data])
  }

  async function toggle(id: string, is_active: boolean) {
    await updateButton(supabase, id, { is_active })
    setButtons(buttons.map(b => b.id === id ? { ...b, is_active } : b))
  }

  async function remove(id: string) {
    await deleteButton(supabase, id)
    setButtons(buttons.filter(b => b.id !== id))
  }

  return { buttons, loading, add, toggle, remove }
}
