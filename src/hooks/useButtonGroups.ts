'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ButtonGroup } from '@/types/app'
import { getGroupsByProfileId, addGroup, updateGroup, deleteGroup, reorderGroups } from '@/services/buttons'

export function useButtonGroups(profileId: string | null) {
  const [groups, setGroups] = useState<ButtonGroup[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!profileId) { setLoading(false); return }
    load()
  }, [profileId])

  async function load() {
    const data = await getGroupsByProfileId(supabase, profileId!)
    setGroups(data)
    setLoading(false)
  }

  async function add(name: string, position: number) {
    if (!profileId) return
    const optimistic: ButtonGroup = {
      id: `optimistic-${Date.now()}`,
      profile_id: profileId,
      name,
      position,
      created_at: new Date().toISOString(),
    }
    setGroups(prev => [...prev, optimistic])
    const data = await addGroup(supabase, profileId, name, position)
    if (data) {
      setGroups(prev => prev.map(g => g.id === optimistic.id ? data : g))
    } else {
      setGroups(prev => prev.filter(g => g.id !== optimistic.id))
    }
  }

  async function rename(id: string, name: string) {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, name } : g))
    await updateGroup(supabase, id, { name })
  }

  async function remove(id: string) {
    setGroups(prev => prev.filter(g => g.id !== id))
    await deleteGroup(supabase, id)
  }

  async function reorderAll(updates: Array<{ id: string; position: number }>) {
    await reorderGroups(supabase, updates)
  }

  function setGroupsDirectly(updated: ButtonGroup[]) {
    setGroups(updated)
  }

  return { groups, loading, add, rename, remove, reorderAll, setGroupsDirectly }
}
