import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './generated.types'

export type YouTube = Database['public']['Tables']['youtubes']['Row']
export type Channel = Database['public']['Tables']['youtube_channels']['Row']

export type Supabase = SupabaseClient<Database>
