import type { TablesInsert } from '$lib/supabase/generated.types'
import { freeCodeCamp_channel, seeded_user_id, xiao_bai_channel, youtubes_with_data } from './youtubes'

// learn from others about seeding
// - https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
// - https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
// - https://www.youtube.com/watch?v=8mAITcNt710
// @snaplet/copycat for deterministic dummy values help

export const userString = `INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
VALUES ('00000000-0000-0000-0000-000000000000', '${seeded_user_id}', 'authenticated', 'authenticated', 'seeded@mock.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);`

export const youtube_channels: TablesInsert<'youtube_channels'>[] = [
  xiao_bai_channel,
  freeCodeCamp_channel,
]

export const youtubes: TablesInsert<'youtubes'>[] = [
  youtubes_with_data.zh_transcribed_summarized.youtube,
  { // no captions on YouTube
    language: 'zh',
    channel_id: 'UC-7jKPgRmLBiB1ltbABubNA',
    id: 'UnlyETVcDzY',
    title: 'An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!',
    description: 'description here...',
    duration_seconds: 534
  },
  { // no captions on YouTube
    language: 'zh',
    channel_id: 'UC-7jKPgRmLBiB1ltbABubNA',
    id: 'GlctfUFhbaM',
    title: '在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】',
    description: 'description here...',
    duration_seconds: 631
  },
  {
    language: 'en',
    channel_id: 'UC8butISFwT-Wl7EV0hUK0BQ',
    id: '8mAITcNt710',
    title: 'Harvard CS50 – Full Computer Science University Course',
    description: 'description here...',
    duration_seconds: 2058
  }
]

export const youtube_transcripts: TablesInsert<'youtube_transcripts'>[] = [
  youtubes_with_data.zh_transcribed_summarized.transcripts[0],
  {
    youtube_id: 'UnlyETVcDzY',
    transcript: { sentences: [{ text: 'This is a fake transcript...' }] },
    transcript_source: 'spoofing',
    created_by: seeded_user_id
  }
]

export const youtube_summaries: TablesInsert<'youtube_summaries'>[] = [
  youtubes_with_data.zh_transcribed_summarized.summaries[0],
]



