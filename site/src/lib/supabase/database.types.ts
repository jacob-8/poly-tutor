import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database as DatabaseGenerated } from './generated.types'
// import type { MergeDeep } from 'type-fest'
// import type { Section } from '$lib/types'


export type Database = DatabaseGenerated
// breaks types and does not work as Supabase describes
// export type Database = MergeDeep<DatabaseGenerated,  SpecificyJsonValues>

// interface SpecificyJsonValues {
//   public: {
//     Tables: {
//       youtube_transcripts: {
//         Row: {
//           transcript: Section
//         }
//         Insert: {
//           transcript: Section
//         }
//         Update: {
//           transcript: Section
//         }
//       }
//     }
//   }
// }

export type Supabase = SupabaseClient<Database>

export type YouTube = Database['public']['Tables']['youtubes']['Row']
export type Channel = Database['public']['Tables']['youtube_channels']['Row']

export type Transcript = Database['public']['Tables']['youtube_transcripts']['Row']
export type Summary = Database['public']['Tables']['youtube_summaries']['Row']
