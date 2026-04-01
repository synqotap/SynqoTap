import Stripe from 'stripe'

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
  const lower = Math.random().toString(36).substring(2, 5)
  const nums = Math.floor(Math.random() * 900 + 100).toString()
  return `${upper}${lower}${nums}!`
}

export function getCardUnitPrice(cardType: string): number {
  return cardType === 'pvc' ? 39 : 79
}
