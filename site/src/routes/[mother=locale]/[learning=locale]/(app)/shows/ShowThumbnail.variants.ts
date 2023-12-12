import type { Variant, Viewport } from 'kitbook'
import type Component from './ShowThumbnail.svelte'
import { natureShow } from '$lib/mocks/shows'

export const languages = []
export const viewports: Viewport[] = [
  { width: 300, height: 300}
]

export const variants: Variant<Component>[] = [
  {
    props: {
      youtube: natureShow,
      channel: natureShow.channel,
    },
  },
]
