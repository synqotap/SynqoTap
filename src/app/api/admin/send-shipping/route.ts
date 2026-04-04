import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendShippingNotification } from '@/lib/resend/emails'
import { ADMIN_EMAIL } from '@/types/app'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { email, name, trackingNumber, trackingUrl, carrier, slug } = body

  await sendShippingNotification({ email, name, trackingNumber, trackingUrl, carrier, slug })

  return NextResponse.json({ ok: true })
}
