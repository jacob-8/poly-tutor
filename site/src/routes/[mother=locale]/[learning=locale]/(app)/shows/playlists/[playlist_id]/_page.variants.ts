import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import youtube_api_playlistItems_bike_rider from '$lib/mocks/data/youtube_api_playlistItems_jian-xiao-bai-bike-rider.json'
import type { Playlist } from '$lib/supabase/database.types'

// export const viewports: Viewport[] = [
//   { width: 400, height: 200 },
// ]

const playlist: Playlist = {
  id: 'PL3ZQ5CpNulQlKzGxJc5n5J1l8H3QeHjwH',
  language: 'en',
  title: [{text: 'Bike Rider'}],
  description: [{text: 'Jian Xiao Bai'}],
  youtubes: youtube_api_playlistItems_bike_rider.items.map(({snippet}) => ({
    channel_id: snippet.channelId,
    channel_title: snippet.channelTitle,
    description: snippet.description,
    id: snippet.resourceId.videoId,
    published_at: snippet.publishedAt,
    title: snippet.title,
  })),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  public: null,
}

export const variants: Variant<Component>[] = [
  {
    props: {
      data: {
        ...mockLayoutData,
        check_is_in_my_playlists: null,
        playlist_promise: new Promise(resolve => resolve({data: playlist, error: null}))
      }
    },
  },
]
