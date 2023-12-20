import type { Variant, Viewport } from 'kitbook'
import type Component from './ShowThumbnail.svelte'
import { seeded_youtubes } from '$lib/mocks/seed/youtubes'

export const languages = []
export const viewports: Viewport[] = [
  { width: 300, height: 300}
]

export const variants: Variant<Component>[] = [
  {
    props: {
      youtube: seeded_youtubes.zh_transcribed_summarized.youtube,
      channel: seeded_youtubes.zh_transcribed_summarized.channel,
    },
  },
]
