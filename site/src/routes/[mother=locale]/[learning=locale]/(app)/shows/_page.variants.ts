import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

// export const viewports: Viewport[] = [
//   { width: 800, height: 600 },
// ]

export const variants: Variant<Component>[] = [
  {
    name: 'new user',
    props: {
      data: {
        ...mockLayoutData,
        user_channels: [],
        user_playlists: [],
        user_youtubes: [],
        other_youtubes: [
          seeded_youtubes.zh_transcribed,
        ],
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
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
          seeded_youtubes.zh_transcribed_summarized,
        ],
        other_youtubes: [
          seeded_youtubes.zh_transcribed,
        ],
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
        other_youtubes: [
          seeded_youtubes.zh_transcribed,
        ],
      }
    },
  },
]
