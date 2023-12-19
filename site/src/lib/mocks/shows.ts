import type { Channel, YouTube } from '$lib/supabase/database.types'

export const youtube_ids = {
  has_captions_in_db: '9ruqSX_p_48',
  has_captions_on_youtube__llama: 'lpyKfNjTZi8', // has_captions_in_youtube https://www.youtube.com/watch?v=lpyKfNjTZi8
  has_no_captions__ai_camp: '9OkddyYQBec', // https://www.youtube.com/watch?v=9OkddyYQBec
}

export type YoutubeWithChannel = Partial<YouTube> & { channel: Partial<Channel> }

export const natureShow: YoutubeWithChannel = {
  id: '-CTlz5PJRZs',
  title: '4K Nature Treasures of Hawaii Botanical Garden - Jungle Forest Cinematic Virtual Walk (Slow Motion)',
  description: 'hello',
  duration_seconds: 122.521 * 60,
  created_at: new Date().toISOString(),
  language: 'en',
  channel: {
    id: 'UC8butISFwT-Wl7EV0hUK0BQ',
    title: 'freeCodeCamp.org',
    description: 'hello',
    thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s',
  }
}

export const chineseVideo: YoutubeWithChannel = {
  id: youtube_ids.has_captions_in_db,
  title: '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】',
  description: 'description here...',
  language: 'zh',
  duration_seconds: 614,
  created_at: '2023-12-13T10:21:03.459834+00:00',
  channel: {
    id: 'UC-7jKPgRmLBiB1ltbABubNA',
    title: '小白的奇幻旅行',
    description: null,
    thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s'
  }
}
