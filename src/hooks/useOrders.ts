'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OrderWithShipment } from '@/types/app'
import { getOrdersWithShipmentsByCustomerId } from '@/services/orders'

export function useOrders(customerId: string | null) {
  const [orders, setOrders] = useState<OrderWithShipment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!customerId) return
    load()
  }, [customerId])

  async function load() {
    const data = await getOrdersWithShipmentsByCustomerId(supabase, customerId!)
    setOrders(data)
    setLoading(false)
  }

  return { orders, loading, reload: load }
}
