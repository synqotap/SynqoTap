import type { SupabaseClient } from '@supabase/supabase-js'

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 40)
  return `${base}-${Math.random().toString(36).substring(2, 6)}`
}

export function generateTempPassword(): string {
  const upper = Math.random().toString(36).substring(2, 6).toUpperCase()
  const special = '!'
  const lower = Math.random().toString(36).substring(2, 5)
  const nums = Math.floor(Math.random() * 900 + 100).toString()
  return `${upper}${special}${lower}${nums}`
}

export function getCardUnitPrice(cardType: string): number {
  const prices: Record<string, number> = {
    pvc: 39,
    metal: 79,
    custom_pvc: 59,
    custom_metal: 99,
  }
  return prices[cardType] ?? 39
}

export async function generateInvoiceNumber(supabase: SupabaseClient): Promise<string> {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
  const num = String((count || 0) + 1).padStart(4, '0')
  return `SYNQO-${year}-${num}`
}
