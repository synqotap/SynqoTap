export type Customer = {
  id: string
  user_id: string | null
  email: string
  full_name: string | null
  phone: string | null
  plan: string
  force_password_change: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  customer_id: string | null
  slug: string
  display_name: string | null
  company_name: string | null
  job_title: string | null
  bio: string | null
  logo_url: string | null
  avatar_url: string | null
  cover_url: string | null
  accent_color: string | null
  template: string
  is_published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export type ProfileButton = {
  id: string
  profile_id: string | null
  type: string
  label: string | null
  value: string
  position: number
  is_active: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_id: string | null
  profile_id: string | null
  card_type: string
  quantity: number
  unit_price: number
  total_amount: number
  stripe_payment_id: string | null
  stripe_session_id: string | null
  status: string
  created_at: string
  updated_at: string
}

export type Card = {
  id: string
  order_id: string | null
  profile_id: string | null
  serial_number: string | null
  nfc_status: string
  is_active: boolean
  programmed_at: string | null
  created_at: string
}

export type Shipment = {
  id: string
  order_id: string | null
  carrier: string | null
  tracking_number: string | null
  label_url: string | null
  shipped_at: string | null
  estimated_delivery: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

export type OrderWithRelations = Order & {
  customers: Pick<Customer, 'email' | 'full_name'> | null
  profiles: Pick<Profile, 'slug'> | null
  shipments: Pick<Shipment, 'tracking_number' | 'carrier'> | null
}

export type ButtonType =
  | 'phone' | 'whatsapp' | 'email' | 'instagram'
  | 'linkedin' | 'facebook' | 'tiktok' | 'website' | 'calendly'

export type CardType = 'pvc' | 'metal'

export type OrderStatus =
  | 'pending' | 'paid' | 'in_production'
  | 'programmed' | 'shipped' | 'delivered' | 'cancelled'

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending:       { label: 'Pending',       color: '#EF9F27' },
  paid:          { label: 'Paid',          color: '#00E5FF' },
  in_production: { label: 'In production', color: '#7B61FF' },
  programmed:    { label: 'Programmed',    color: '#7B61FF' },
  shipped:       { label: 'Shipped',       color: '#639922' },
  delivered:     { label: 'Delivered',     color: '#1D9E75' },
  cancelled:     { label: 'Cancelled',     color: '#E24B4A' },
}

export const BUTTON_TYPE_CONFIG: Record<ButtonType, { label: string; placeholder: string }> = {
  phone:     { label: 'Phone',        placeholder: '+1 555 0000' },
  whatsapp:  { label: 'WhatsApp',     placeholder: '+1 555 0000' },
  email:     { label: 'Email',        placeholder: 'your@email.com' },
  instagram: { label: 'Instagram',    placeholder: '@username' },
  linkedin:  { label: 'LinkedIn',     placeholder: 'username' },
  facebook:  { label: 'Facebook',     placeholder: 'username' },
  tiktok:    { label: 'TikTok',       placeholder: '@username' },
  website:   { label: 'Website',      placeholder: 'https://yoursite.com' },
  calendly:  { label: 'Book meeting', placeholder: 'your-username or full URL' },
}

export const ACCENT_COLORS = [
  '#00E5FF', '#7B61FF', '#FF6B6B', '#FFD93D',
  '#6BCB77', '#FF922B', '#F06595', '#4DABF7'
] as const

export const ADMIN_EMAIL = 'synqotap@gmail.com'
