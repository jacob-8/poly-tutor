import type { TablesInsert } from '$lib/supabase/generated.types'
import { seeded_user_id, seeded_youtubes } from './youtubes'

// learn from others about seeding
// - https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
// - https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
// - https://www.youtube.com/watch?v=8mAITcNt710
// @snaplet/copycat for deterministic dummy values help

export const userString = `INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
VALUES ('00000000-0000-0000-0000-000000000000', '${seeded_user_id}', 'authenticated', 'authenticated', 'seeded@mock.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);`

export const youtube_channels: TablesInsert<'youtube_channels'>[] =
  Array.from(new Set(Object.values(seeded_youtubes).map(({channel}) => channel)))

export const youtubes: TablesInsert<'youtubes'>[] = Object.values(seeded_youtubes)
  .map(({youtube}) => youtube)

export const youtube_transcripts: TablesInsert<'youtube_transcripts'>[] = Object.values(seeded_youtubes)
  .flatMap(({transcripts}) => transcripts ?? [])

export const youtube_summaries: TablesInsert<'youtube_summaries'>[] = Object.values(seeded_youtubes)
  .flatMap(({summaries}) => summaries ?? [])

export const word_updates: TablesInsert<'word_updates'>[] = [
  { word: 'hello', language: 'en', status: 0, views: 5, created_by: seeded_user_id },
  { word: 'world', language: 'en', status: 1, views: 2, created_by: seeded_user_id },
  { word: '你好', language: 'zh', status: 2, views: 3, created_by: seeded_user_id },
  { word: '世界', language: 'zh', status: 3, views: 4, created_by: seeded_user_id },
]
