'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: customer } = await supabase
        .from('customers')
        .select('id, force_password_change')
        .eq('user_id', user.id)
        .single()

      if (customer?.force_password_change === true) {
        await supabase
          .from('customers')
          .update({ force_password_change: false })
          .eq('id', customer.id)
        window.location.href = '/portal/settings?first=true'
        return
      }

      setChecked(true)
    }
    check()
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center text-sm text-[#6B6B80] font-[family-name:var(--font-dm-sans)]">
        Loading your portal...
      </div>
    )
  }

  return <>{children}</>
}
