import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'admin' | 'teacher' | 'parent' | 'student'

export interface Profile {
    id: string
    role: UserRole
    full_name: string
    phone?: string
    avatar_url?: string
}
