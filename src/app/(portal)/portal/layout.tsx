'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { updateCustomer } from '@/services/customers'

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
      const { data: rawCustomer } = await supabase
        .from('customers')
        .select('id, force_password_change')
        .eq('user_id', user.id)
        .single()

      const customer = rawCustomer as { id: string; force_password_change: boolean | null } | null

      if (customer?.force_password_change === true) {
        await updateCustomer(supabase, customer.id, { force_password_change: false })
        window.location.href = '/portal/settings?first=true'
        return
      }
      setChecked(true)
    }
    check()
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/20 border-t-[#00E5FF] animate-spin" />
          <p className="text-sm text-[#6B6B80] font-dm-sans">Loading your portal...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
