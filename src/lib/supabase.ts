import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          age: number | null
          gender: string | null
          daily_goal: number | null
          fitness_goal: string | null
          experience_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age?: number | null
          gender?: string | null
          daily_goal?: number | null
          fitness_goal?: string | null
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number | null
          gender?: string | null
          daily_goal?: number | null
          fitness_goal?: string | null
          experience_level?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string | null
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber: number
          sugar: number
          sodium: number
          image: string | null
          cuisine: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          fiber: number
          sugar: number
          sodium: number
          image?: string | null
          cuisine?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          fiber?: number
          sugar?: number
          sodium?: number
          image?: string | null
          cuisine?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
