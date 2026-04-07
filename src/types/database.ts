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
          is_active: boolean
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
          force_password_change?: boolean | null
          is_active?: boolean
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
          is_active?: boolean
        }
        Relationships: []
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
          cover_url: string | null
          accent_color: string | null
          is_active: boolean
          qr_code_url: string | null
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
          cover_url?: string | null
          accent_color?: string | null
          is_active?: boolean
          qr_code_url?: string | null
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
          cover_url?: string | null
          accent_color?: string | null
          is_active?: boolean
          qr_code_url?: string | null
          template?: string
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profile_buttons: {
        Row: {
          id: string
          profile_id: string | null
          type: string
          label: string | null
          value: string
          message: string | null
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
          message?: string | null
          position?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          type?: string
          label?: string | null
          value?: string
          message?: string | null
          position?: number
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profile_buttons_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
          shipping_address: Record<string, unknown> | null
          notes: string | null
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
          shipping_address?: Record<string, unknown> | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: string
          shipping_address?: Record<string, unknown> | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          id: string
          order_id: string | null
          profile_id: string | null
          serial_number: string | null
          nfc_url: string | null
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
          nfc_url?: string | null
          nfc_status?: string
          is_active?: boolean
          programmed_at?: string | null
          created_at?: string
        }
        Update: {
          nfc_url?: string | null
          nfc_status?: string
          is_active?: boolean
          programmed_at?: string | null
        }
        Relationships: []
      }
      shipments: {
        Row: {
          id: string
          order_id: string | null
          carrier: string | null
          tracking_number: string | null
          tracking_url: string | null
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
          tracking_url?: string | null
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
          tracking_url?: string | null
          shipped_at?: string | null
          delivered_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      button_groups: {
        Row: {
          id: string
          profile_id: string | null
          name: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          name: string
          position?: number
          created_at?: string
        }
        Update: {
          name?: string
          position?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          id: string
          order_id: string | null
          customer_id: string | null
          invoice_number: string | null
          amount: number
          currency: string
          status: string
          stripe_invoice_id: string | null
          pdf_url: string | null
          due_date: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          customer_id?: string | null
          invoice_number?: string | null
          amount: number
          currency?: string
          status?: string
          stripe_invoice_id?: string | null
          pdf_url?: string | null
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          invoice_number?: string | null
          status?: string
          pdf_url?: string | null
          paid_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          id: string
          customer_id: string | null
          admin_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          admin_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          metadata?: Record<string, unknown> | null
        }
        Relationships: []
      }
      discounts: {
        Row: {
          id: string
          code: string
          type: string
          value: number
          max_uses: number | null
          uses_count: number
          expires_at: string | null
          is_active: boolean
          show_on_home: boolean
          description: string | null
          stripe_coupon_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          type: string
          value: number
          max_uses?: number | null
          uses_count?: number
          expires_at?: string | null
          is_active?: boolean
          show_on_home?: boolean
          description?: string | null
          stripe_coupon_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          code?: string
          type?: string
          value?: number
          max_uses?: number | null
          uses_count?: number
          expires_at?: string | null
          is_active?: boolean
          show_on_home?: boolean
          description?: string | null
          stripe_coupon_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          id: string
          card_type: string
          price: number
          original_price: number | null
          is_on_sale: boolean
          sale_label: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          card_type: string
          price: number
          original_price?: number | null
          is_on_sale?: boolean
          sale_label?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          card_type?: string
          price?: number
          original_price?: number | null
          is_on_sale?: boolean
          sale_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      increment_view: {
        Args: { profile_slug: string }
        Returns: void
      }
    }
    Enums: { [_ in never]: never }
  }
}
