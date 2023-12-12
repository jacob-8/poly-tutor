import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { natureShow } from '$lib/mocks/shows'

// export const viewports: Viewport[] = [
//   { name: 'Desktop', width: 800, height: 600 },
//   { name: 'Mobile', width: 320, height: 480}
// ]

export const variants: Variant<Component>[] = [
  {
    props: {
      data: {
        youtubes: [
          natureShow,
          natureShow,
          natureShow,
          natureShow,
          natureShow,
          natureShow,
        ],
        mother: undefined,
        learning: undefined,
        t: undefined,
        supabase: undefined,
        authResponse: undefined,
        user: undefined
      }
    },
  },
  {
    props: {
      data: {
        youtubes: [
          natureShow,
        ],
        mother: undefined,
        learning: undefined,
        t: undefined,
        supabase: undefined,
        authResponse: undefined,
        user: undefined
      }
    },
  },
]
