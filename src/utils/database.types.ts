
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          amount: number
          unit: string
          current_price: number
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          amount: number
          unit: string
          current_price: number
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          amount?: number
          unit?: string
          current_price?: number
          created_at?: string
          updated_at?: string | null
        }
      }
      debts: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          creditor: string
          deadline: string
          is_long_term: boolean
          status: 'pending' | 'paid'
          currency: 'USD' | 'TRY'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          creditor: string
          deadline: string
          is_long_term?: boolean
          status: 'pending' | 'paid'
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          creditor?: string
          deadline?: string
          is_long_term?: boolean
          status?: 'pending' | 'paid'
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
      }
      exchange_rates: {
        Row: {
          id: string
          from_currency: string
          to_currency: string
          rate: number
          updated_at: string
        }
        Insert: {
          id?: string
          from_currency: string
          to_currency: string
          rate: number
          updated_at?: string
        }
        Update: {
          id?: string
          from_currency?: string
          to_currency?: string
          rate?: number
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          date: string
          type: 'recurring' | 'one-time'
          category: string | null
          currency: 'USD' | 'TRY'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          date: string
          type: 'recurring' | 'one-time'
          category?: string | null
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          date?: string
          type?: 'recurring' | 'one-time'
          category?: string | null
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
      }
      incomes: {
        Row: {
          id: string
          user_id: string
          title: string
          amount: number
          category: 'freelance' | 'student' | 'rent' | 'videography' | 'other'
          date: string
          status: 'received' | 'expected'
          currency: 'USD' | 'TRY'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          amount: number
          category: 'freelance' | 'student' | 'rent' | 'videography' | 'other'
          date: string
          status: 'received' | 'expected'
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          amount?: number
          category?: 'freelance' | 'student' | 'rent' | 'videography' | 'other'
          date?: string
          status?: 'received' | 'expected'
          currency?: 'USD' | 'TRY'
          created_at?: string
          updated_at?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          default_currency: 'USD' | 'TRY'
          include_long_term_debt: boolean
          exchange_rate_last_updated: string | null
          exchange_rate_value: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          default_currency?: 'USD' | 'TRY'
          include_long_term_debt?: boolean
          exchange_rate_last_updated?: string | null
          exchange_rate_value?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          default_currency?: 'USD' | 'TRY'
          include_long_term_debt?: boolean
          exchange_rate_last_updated?: string | null
          exchange_rate_value?: number | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
