import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { chineseVideo, natureShow } from '$lib/mocks/shows'
import { mockLayoutData } from '$lib/mocks/data/page'

// export const viewports: Viewport[] = [
//   { name: 'Desktop', width: 800, height: 600 },
//   { name: 'Mobile', width: 320, height: 480}
// ]

const other_youtubes = [
  chineseVideo,
  chineseVideo,
  chineseVideo,
  chineseVideo,
  chineseVideo,
]

export const variants: Variant<Component>[] = [
  {
    name: 'new user',
    props: {
      data: {
        ...mockLayoutData,
        youtubes: [],
        other_youtubes,
      }
    },
  },
  {
    props: {
      data: {
        ...mockLayoutData,
        youtubes: [
          natureShow,
          natureShow,
          natureShow,
          natureShow,
          natureShow,
        ],
        other_youtubes,
      }
    },
  },
  {
    props: {
      data: {
        ...mockLayoutData,
        youtubes: [
          natureShow,
        ],
        other_youtubes,
      }
    },
  },
]
