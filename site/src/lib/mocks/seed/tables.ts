import type { SummaryInsert, TranscriptInsert, YouTubeInsert } from '$lib/supabase/database.types'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { seeded_user_id, seeded_youtubes } from './youtubes'

// learn from others about seeding
// - https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
// - https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
// - https://www.youtube.com/watch?v=8mAITcNt710
// @snaplet/copycat for deterministic dummy values help

export const users = [{
  instance_id: '00000000-0000-0000-0000-000000000000',
  id: seeded_user_id,
  aud: 'authenticated',
  role: 'authenticated',
  email: 'seeded@mock.com',
}]

export const youtube_channels: TablesInsert<'youtube_channels'>[] =
  Array.from(new Set(Object.values(seeded_youtubes).map(({channel}) => channel)))

export const youtubes: YouTubeInsert[] = Object.values(seeded_youtubes)
  .map(({youtube}) => youtube)

export const youtube_transcripts: TranscriptInsert[] = Object.values(seeded_youtubes)
  .flatMap(({transcripts}) => transcripts ?? [])

export const youtube_summaries: SummaryInsert[] = Object.values(seeded_youtubes)
  .flatMap(({summaries}) => summaries ?? [])

export const word_updates: TablesInsert<'word_updates'>[] = [
  { word: 'hello', language: 'en', status: 0, views: 5, created_by: seeded_user_id },
  { word: 'world', language: 'en', status: 1, views: 2, created_by: seeded_user_id },
  { word: '你好', language: 'zh', status: 2, views: 3, created_by: seeded_user_id },
  { word: '世界', language: 'zh', status: 3, views: 4, created_by: seeded_user_id },
]
