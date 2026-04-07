import type { Database } from './database'

// ── Database row types ──────────────────────────────────────
export type Customer = Database['public']['Tables']['customers']['Row']
export type Price = Database['public']['Tables']['prices']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileButton = Database['public']['Tables']['profile_buttons']['Row']
export type ButtonGroup = Database['public']['Tables']['button_groups']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type Card = Database['public']['Tables']['cards']['Row']
export type Shipment = Database['public']['Tables']['shipments']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type Discount = Database['public']['Tables']['discounts']['Row']

// ── Enums ───────────────────────────────────────────────────
export type CardType = 'pvc' | 'metal' | 'custom_pvc' | 'custom_metal'

export type OrderStatus =
  | 'pending' | 'paid' | 'in_production'
  | 'programmed' | 'shipped' | 'delivered'
  | 'cancelled' | 'refunded'

export type ButtonType =
  | 'phone' | 'whatsapp' | 'sms' | 'email'
  | 'instagram' | 'linkedin' | 'facebook'
  | 'tiktok' | 'twitter' | 'snapchat' | 'youtube'
  | 'website' | 'calendly' | 'telegram'
  | 'zelle' | 'cashapp' | 'venmo' | 'paypal'
  | 'maps' | 'custom'

// Types that support a default pre-filled message
export const MESSAGING_TYPES = new Set<ButtonType>(['whatsapp', 'sms', 'email'])

export type ProfileTemplate = 'minimal' | 'bold' | 'soft' | 'card'
export type CustomerRole = 'customer' | 'business_admin' | 'reseller'
export type CustomerPlan = 'free' | 'pvc' | 'metal' | 'business'

// ── Composite types ─────────────────────────────────────────
export type OrderWithRelations = Order & {
  customers: Pick<Customer, 'email' | 'full_name'> | null
  profiles: Pick<Profile, 'slug'> | null
  shipments: Pick<Shipment, 'tracking_number' | 'carrier' | 'tracking_url'> | null
}

export type OrderWithShipment = Order & {
  shipments: Pick<Shipment, 'tracking_number' | 'carrier' | 'tracking_url'> | null
}

export type ProfileWithButtons = Profile & {
  profile_buttons: ProfileButton[]
}

// ── Config maps ─────────────────────────────────────────────
export const ADMIN_EMAIL = 'synqotap@gmail.com'

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:       { label: 'Pending',       color: '#EF9F27' },
  paid:          { label: 'Paid',          color: '#00E5FF' },
  in_production: { label: 'In production', color: '#7B61FF' },
  programmed:    { label: 'Programmed',    color: '#7B61FF' },
  shipped:       { label: 'Shipped',       color: '#639922' },
  delivered:     { label: 'Delivered',     color: '#1D9E75' },
  cancelled:     { label: 'Cancelled',     color: '#E24B4A' },
  refunded:      { label: 'Refunded',      color: '#6B6B80' },
}

export const BUTTON_CONFIG: Record<ButtonType, {
  label: string
  placeholder: string
  group: 'contact' | 'social' | 'web' | 'payment' | 'other'
  href: (value: string, message?: string | null) => string
  bgColor: string
  iconColor: string
}> = {
  phone:     { label: 'Call',          placeholder: '+1 555 0000',           group: 'contact', href: v => `tel:${v}`,                                    bgColor: 'rgba(34,197,94,0.15)',   iconColor: '#22C55E' },
  whatsapp:  { label: 'WhatsApp',      placeholder: '+1 555 0000',           group: 'contact', href: (v, msg) => { const num = v.replace(/\D/g,''); return msg ? `https://wa.me/${num}?text=${encodeURIComponent(msg)}` : `https://wa.me/${num}` }, bgColor: 'rgba(37,211,102,0.15)', iconColor: '#25D366' },
  sms:       { label: 'SMS',           placeholder: '+1 555 0000',           group: 'contact', href: (v, msg) => { const num = v.replace(/\D/g,''); return msg ? `sms:+${num}?body=${encodeURIComponent(msg)}` : `sms:+${num}` }, bgColor: 'rgba(34,197,94,0.15)', iconColor: '#22C55E' },
  email:     { label: 'Email',         placeholder: 'your@email.com',        group: 'contact', href: (v, msg) => msg ? `mailto:${v}?body=${encodeURIComponent(msg)}` : `mailto:${v}`, bgColor: 'rgba(99,179,237,0.15)', iconColor: '#63B3ED' },
  telegram:  { label: 'Telegram',      placeholder: '@username',             group: 'contact', href: v => `https://t.me/${v.replace('@','')}`,           bgColor: 'rgba(0,136,204,0.15)',   iconColor: '#0088CC' },
  instagram: { label: 'Instagram',     placeholder: '@username',             group: 'social',  href: v => `https://instagram.com/${v.replace('@','')}`,  bgColor: 'rgba(225,48,108,0.15)',  iconColor: '#E1306C' },
  linkedin:  { label: 'LinkedIn',      placeholder: 'username',              group: 'social',  href: v => `https://linkedin.com/in/${v}`,                bgColor: 'rgba(10,102,194,0.15)',  iconColor: '#0A66C2' },
  facebook:  { label: 'Facebook',      placeholder: 'username',              group: 'social',  href: v => `https://facebook.com/${v}`,                   bgColor: 'rgba(24,119,242,0.15)',  iconColor: '#1877F2' },
  tiktok:    { label: 'TikTok',        placeholder: '@username',             group: 'social',  href: v => `https://tiktok.com/@${v.replace('@','')}`,    bgColor: 'rgba(255,0,80,0.15)',    iconColor: '#FF0050' },
  twitter:   { label: 'Twitter / X',   placeholder: '@username',             group: 'social',  href: v => `https://x.com/${v.replace('@','')}`,          bgColor: 'rgba(255,255,255,0.10)', iconColor: '#F2F2F4' },
  snapchat:  { label: 'Snapchat',      placeholder: '@username',             group: 'social',  href: v => `https://snapchat.com/add/${v.replace('@','')}`, bgColor: 'rgba(255,252,0,0.15)', iconColor: '#FFFC00' },
  youtube:   { label: 'YouTube',       placeholder: '@channel or full URL',  group: 'social',  href: v => v.startsWith('http') ? v : `https://youtube.com/@${v}`, bgColor: 'rgba(255,0,0,0.15)', iconColor: '#FF0000' },
  website:   { label: 'Website',       placeholder: 'https://yoursite.com', group: 'web',     href: v => v.startsWith('http') ? v : `https://${v}`,     bgColor: 'rgba(139,92,246,0.15)', iconColor: '#8B5CF6' },
  calendly:  { label: 'Book meeting',  placeholder: 'username or full URL',  group: 'web',     href: v => v.startsWith('http') ? v : `https://calendly.com/${v}`, bgColor: 'rgba(0,107,255,0.15)', iconColor: '#006BFF' },
  zelle:     { label: 'Zelle',         placeholder: 'Phone or email',        group: 'payment', href: v => `https://enroll.zellepay.com/qr-codes?data=${encodeURIComponent(v)}`, bgColor: 'rgba(111,37,246,0.15)', iconColor: '#6F25F6' },
  cashapp:   { label: 'Cash App',      placeholder: '$cashtag',              group: 'payment', href: v => `https://cash.app/${v.startsWith('$')?v:'$'+v}`, bgColor: 'rgba(0,212,110,0.15)', iconColor: '#00D46E' },
  venmo:     { label: 'Venmo',         placeholder: '@username',             group: 'payment', href: v => `https://venmo.com/${v.replace('@','')}`,      bgColor: 'rgba(61,149,255,0.15)', iconColor: '#3D95FF' },
  paypal:    { label: 'PayPal',        placeholder: 'username or email',     group: 'payment', href: v => `https://paypal.me/${v}`,                      bgColor: 'rgba(0,48,135,0.15)',   iconColor: '#003087' },
  maps:      { label: 'Location',      placeholder: 'Address or Google Maps URL', group: 'other', href: v => v.startsWith('http') ? v : `https://maps.google.com/?q=${encodeURIComponent(v)}`, bgColor: 'rgba(234,67,53,0.15)', iconColor: '#EA4335' },
  custom:    { label: 'Custom link',   placeholder: 'https://',              group: 'other',   href: v => v.startsWith('http') ? v : `https://${v}`,     bgColor: 'rgba(107,107,128,0.15)', iconColor: '#6B6B80' },
}

export const BUTTON_GROUPS_CONFIG = {
  contact: 'Contact',
  social:  'Social',
  web:     'Web',
  payment: 'Payments',
  other:   'Other',
} as const

export const TEMPLATES: Record<ProfileTemplate, { label: string; description: string }> = {
  minimal: { label: 'Minimal', description: 'Clean and simple. Let your content speak.' },
  bold:    { label: 'Bold',    description: 'Strong typography and high contrast.' },
  soft:    { label: 'Soft',    description: 'Rounded corners and gentle gradients.' },
  card:    { label: 'Card',    description: 'All buttons displayed as a compact icon grid.' },
}

export const ACCENT_COLORS = [
  '#00E5FF', '#7B61FF', '#FF6B6B', '#FFD93D',
  '#6BCB77', '#FF922B', '#F06595', '#4DABF7',
] as const

// ── Design tokens ───────────────────────────────────────────
export const COLORS = {
  bg:      '#07070C',
  bg2:     '#0E0E16',
  bg3:     '#13131F',
  border:  '#1C1C2E',
  border2: '#22223A',
  muted:   '#6B6B80',
  subtle:  '#3A3A50',
  white:   '#F2F2F4',
  accent:  '#00E5FF',
} as const
