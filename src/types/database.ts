// src/types/database.ts
// Placeholder — este archivo se reemplaza automáticamente
// cuando conectes Supabase con: npm run types

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          user_id: string | null
          email: string
          full_name: string | null
          phone: string | null
          plan: string
          created_at: string
          updated_at: string
          force_password_change: boolean | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          full_name?: string | null
          phone?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          full_name?: string | null
          phone?: string | null
          plan?: string
          updated_at?: string
          force_password_change?: boolean | null
        }
      }
      profiles: {
        Row: {
          id: string
          customer_id: string | null
          slug: string
          display_name: string | null
          company_name: string | null
          job_title: string | null
          bio: string | null
          logo_url: string | null
          avatar_url: string | null
          template: string
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          slug: string
          display_name?: string | null
          company_name?: string | null
          job_title?: string | null
          bio?: string | null
          logo_url?: string | null
          avatar_url?: string | null
          template?: string
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          display_name?: string | null
          company_name?: string | null
          job_title?: string | null
          bio?: string | null
          logo_url?: string | null
          avatar_url?: string | null
          template?: string
          is_published?: boolean
          updated_at?: string
        }
      }
      profile_buttons: {
        Row: {
          id: string
          profile_id: string | null
          type: string
          label: string | null
          value: string
          position: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          type: string
          label?: string | null
          value: string
          position?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          type?: string
          label?: string | null
          value?: string
          position?: number
          is_active?: boolean
        }
      }
      orders: {
        Row: {
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
        Insert: {
          id?: string
          customer_id?: string | null
          profile_id?: string | null
          card_type: string
          quantity?: number
          unit_price: number
          total_amount: number
          stripe_payment_id?: string | null
          stripe_session_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          updated_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          order_id: string | null
          profile_id: string | null
          serial_number: string | null
          nfc_status: string
          is_active: boolean
          programmed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          profile_id?: string | null
          serial_number?: string | null
          nfc_status?: string
          is_active?: boolean
          programmed_at?: string | null
          created_at?: string
        }
        Update: {
          nfc_status?: string
          is_active?: boolean
          programmed_at?: string | null
        }
      }
      shipments: {
        Row: {
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
        Insert: {
          id?: string
          order_id?: string | null
          carrier?: string | null
          tracking_number?: string | null
          label_url?: string | null
          shipped_at?: string | null
          estimated_delivery?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          tracking_number?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_view: {
        Args: { profile_slug: string }
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
