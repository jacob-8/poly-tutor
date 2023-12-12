import type { Variant } from 'kitbook'
import type Component from './+page.svelte'

export const variants: Variant<Component>[] = [
  {
    props: {
      data: {
        youtube_id: 'AdNJ3fydeao',
        // @ts-expect-error
        youtube: {
          description: 'description here',
        },
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 3000) }),
        }
      }
    },
  },
]

