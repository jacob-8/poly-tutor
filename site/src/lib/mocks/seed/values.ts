import type { TablesInsert } from '$lib/supabase/generated.types'

// learn from others about seeding
// - https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
// - https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
// - https://www.youtube.com/watch?v=8mAITcNt710
// @snaplet/copycat for deterministic dummy values help

// More YouTube video options
// 9OkddyYQBec AI數學文化營
// Ukr40eBfeyg 農夫
// HRenI3LURNk 南橫公路全線通車
// lpyKfNjTZi8 Llama2

export const userString = `INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
VALUES ('00000000-0000-0000-0000-000000000000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'authenticated', 'authenticated', 'seeded@mock.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);`

export const youtube_channels: TablesInsert<'youtube_channels'>[] = [
  { // Chinese
    id: 'UC-7jKPgRmLBiB1ltbABubNA',
    title: '小白的奇幻旅行',
    thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s'
  },
  { // English
    id: 'UC8butISFwT-Wl7EV0hUK0BQ',
    title: 'freeCodeCamp.org',
    thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw'
  }
]

export const youtubes: TablesInsert<'youtubes'>[] = [
  { // no captions on YouTube
    language: 'zh',
    channel_id: 'UC-7jKPgRmLBiB1ltbABubNA',
    id: '9ruqSX_p_48',
    title: '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】',
    description: 'description here...',
    duration_seconds: 614 // write as 614.0 for clarity that this is a 'real' number
  },
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
  {
    youtube_id: '9ruqSX_p_48',
    transcript: {
      sentences: [
        { text: 'This is a fake transcript...' },
        { text: '在贵州的第一天，我们就遇到了一位非常热情的当地人。' },
        { text: '他推荐我们去尝试当地的特色美食，真是太美味了！' },
        { text: '今天我们参观了一个古老的苗族村落，那里的风俗真是独特。' },
        { text: '我被那里的手工艺品深深吸引，最后买了一个手织的挎包。' },
        { text: '我们在黔东南的山路上自驾，风景实在是太壮观了。' },
        { text: '下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。' },
        { text: '我尝试了一种当地的传统小吃，味道真是让人难忘。' },
        { text: '晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。' },
        { text: '村里的孩子们对我们的相机特别好奇，我们拍了很多照片。' },
        { text: '这次自驾游让我对贵州的自然风光和文化有了更深的了解。' }
      ]
    },
    transcript_source: 'spoofing',
    created_by: '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'
  },
  {
    youtube_id: 'UnlyETVcDzY',
    transcript: { sentences: [{ text: 'This is a fake transcript...' }] },
    transcript_source: 'spoofing',
    created_by: '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'
  }
]

export const youtube_summaries: TablesInsert<'youtube_summaries'>[] = [
  {
    youtube_id: '9ruqSX_p_48',
    summary: {
      sentences: [
        { text: 'This is a fake summary...' }
      ]
    },
    summary_source: 'spoofing',
    start_ms: 0,
    end_ms: 10000,
    created_by: '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'
  }
]



