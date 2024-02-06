import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database as DatabaseGenerated, Tables, TablesInsert } from './generated.types'
import type { Merge } from 'type-fest'
import type { YoutubeChapter, Sentence, Translation } from '$lib/types'

// export type Database = MergeDeep<DatabaseGenerated, {
//   public: {
//     Tables: {
//       youtubes: {
//         Row: {
//           title: Sentence[],
//           description: Sentence[],
//           chapters: YoutubeChapter[],
//         }
//         Insert: {
//           title: Sentence[],
//           description?: Sentence[],
//           chapters: YoutubeChapter[],
//         }
//         Update: {
//           title?: Sentence[],
//           description?: Sentence[],
//           chapters?: YoutubeChapter[],
//         }
//       }
//     }
//   }
// }>

export type Database = DatabaseGenerated
export type Supabase = SupabaseClient<Database>

export type Channel = Tables<'youtube_channels'>
export type YouTube = Merge<Tables<'youtubes'>, { title: Sentence[], description: Sentence[], chapters: YoutubeChapter[] }>
export type Transcript = Merge<Tables<'youtube_transcripts'>, { sentences: Sentence[] }>
export type Summary = Merge<Tables<'youtube_summaries'>, { translations: Translation }>

export type YouTubeInsert = Merge<TablesInsert<'youtubes'>, { title: Sentence[], description: Sentence[], chapters: YoutubeChapter[] }>
export type TranscriptInsert = Merge<TablesInsert<'youtube_transcripts'>, { sentences: Sentence[] }>
export type SummaryInsert = Merge<TablesInsert<'youtube_summaries'>, { translations: Translation }>
