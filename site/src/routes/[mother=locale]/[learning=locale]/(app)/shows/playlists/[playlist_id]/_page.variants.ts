import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import youtube_api_playlistItems_bike_rider from '$lib/mocks/data/youtube_api_playlistItems_jian-xiao-bai-bike-rider.json'
import type { YoutubePlaylistAddResponseBody } from '$api/youtube/playlist/add/+server'

// export const viewports: Viewport[] = [
//   { width: 400, height: 200 },
// ]

export const variants: Variant<Component>[] = [
  {
    props: {
      data: {
        ...mockLayoutData,
        playlist_id: 'bob',
        playlist_promise: new Promise(resolve => resolve({data: youtube_api_playlistItems_bike_rider as YoutubePlaylistAddResponseBody, error: null}))
      }
    },
  },
]
