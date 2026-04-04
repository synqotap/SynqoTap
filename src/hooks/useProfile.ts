'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Customer } from '@/types/app'
import { getCustomerByUserId } from '@/services/customers'
import { getProfileByCustomerId, updateProfile } from '@/services/profiles'

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) return
    load()
  }, [userId])

  async function load() {
    const cust = await getCustomerByUserId(supabase, userId!)
    if (!cust) { setLoading(false); return }
    const prof = await getProfileByCustomerId(supabase, cust.id)
    setCustomer(cust)
    setProfile(prof)
    setLoading(false)
  }

  async function save(updates: Partial<Profile>) {
    if (!profile) return
    setSaving(true)
    await updateProfile(supabase, profile.id, updates)
    setProfile({ ...profile, ...updates })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return { profile, setProfile, customer, loading, saving, saved, save, reload: load }
}
