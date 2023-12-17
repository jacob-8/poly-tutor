import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database as DatabaseGenerated, Tables } from './generated.types'
import type { Merge } from 'type-fest'
import type { Section } from '$lib/types'


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

export type YouTube = Tables<'youtubes'>
export type Channel = Tables<'youtube_channels'>

export type Transcript = Tables<'youtube_transcripts'>
export type Transcript2 = Merge<Tables<'youtube_transcripts'>, {transcript: Section}>
export type Summary = Tables<'youtube_summaries'>
