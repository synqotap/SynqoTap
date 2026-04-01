'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/types/app'

type AuthState = {
  userId: string | null
  email: string | null
  isAdmin: boolean
  isLoading: boolean
}

export function useAuth(options?: {
  requireAuth?: boolean
  requireAdmin?: boolean
}) {
  const [state, setState] = useState<AuthState>({
    userId: null,
    email: null,
    isAdmin: false,
    isLoading: true,
  })
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        if (options?.requireAuth || options?.requireAdmin) {
          window.location.href = '/login'
          return
        }
        setState({ userId: null, email: null, isAdmin: false, isLoading: false })
        return
      }

      const isAdmin = user.email === ADMIN_EMAIL

      if (options?.requireAdmin && !isAdmin) {
        window.location.href = '/login'
        return
      }

      setState({
        userId: user.id,
        email: user.email ?? null,
        isAdmin,
        isLoading: false,
      })
    }
    check()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return { ...state, signOut }
}
