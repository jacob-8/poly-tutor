import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'
import type { PlaylistYoutubeMetadata } from '$lib/types'
import type { ComponentProps } from 'svelte'

// export const viewports: Viewport[] = [
//   { width: 800, height: 600 },
// ]

const playlist_youtube: PlaylistYoutubeMetadata = {
  title: seeded_youtubes.zh_transcribed.youtube.title[0].text,
  description: 'Public YouTube Description',
  channel_id: seeded_youtubes.zh_transcribed.youtube.channel_id,
  channel_title: 'Public Channel',
  id: seeded_youtubes.zh_transcribed.youtube.id,
  published_at: new Date().toISOString(),
}

const public_playlists: ComponentProps<Component>['data']['public_playlists'] = [{
  id: 'public-playlist',
  description: [],
  title: [{text: 'Picking Apples'}],
  youtubes: [playlist_youtube, playlist_youtube],
  language: 'zh',
  public: new Date().toISOString(),
  updated_at: new Date().toISOString(),
},
{
  id: 'public-playlist',
  description: [],
  title: [{text: 'And Bananas'}],
  youtubes: [playlist_youtube, playlist_youtube],
  language: 'zh',
  public: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}]


export const variants: Variant<Component>[] = [
  {
    name: 'new user',
    viewports: [
      { width: 320, height: 500 },
      { width: 1024, height: 500 },
    ],
    props: {
      data: {
        ...mockLayoutData,
        user_channels: [],
        user_playlists: [],
        user_youtubes: [],
        public_playlists,
      }
    },
  },
  {
    name: 'user with youtubes',
    props: {
      data: {
        ...mockLayoutData,
        user_youtubes: [
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
        ],
        user_channels: [],
        user_playlists: [],
        public_playlists,
      }
    },
  },
  {
    props: {
      data: {
        ...mockLayoutData,
        user_channels: [],
        user_playlists: [],
        user_youtubes: [
          seeded_youtubes.zh_transcribed_summarized,
        ],
        public_playlists,
      }
    },
  },
]
