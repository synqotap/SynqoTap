'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Order } from '@/types/app'
import { getOrdersByCustomerId } from '@/services/orders'

export function useOrders(customerId: string | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!customerId) return
    load()
  }, [customerId])

  async function load() {
    const data = await getOrdersByCustomerId(supabase, customerId!)
    setOrders(data)
    setLoading(false)
  }

  return { orders, loading }
}
