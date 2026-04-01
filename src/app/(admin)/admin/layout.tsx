'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ADMIN_EMAIL } from '@/types/app'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = '/login'
        return
      }
      setChecked(true)
    }
    check()
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center text-[#6B6B80] text-sm font-[family-name:var(--font-dm-sans)]">
        Verifying access...
      </div>
    )
  }

  return <>{children}</>
}
