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
      <div className="min-h-screen bg-[#07070C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E24B4A]/20 border-t-[#E24B4A] animate-spin" />
          <p className="text-sm text-[#6B6B80] font-dm-sans">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
