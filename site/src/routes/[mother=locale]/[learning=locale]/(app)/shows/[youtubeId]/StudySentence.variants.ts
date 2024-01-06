import type { Variant, Viewport } from 'kitbook'
import type Component from './StudySentence.svelte'
import { title_sentence } from '$lib/mocks/sentences'

export const viewports: Viewport[] = [
  { width: 300, height: 600 },
  { width: 500, height: 600 },
]

export const variants: Variant<Component>[] = [
  {
    props: {
      sentence: title_sentence,
    },
  },
]

