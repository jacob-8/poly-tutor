import type { Variant, Viewport } from 'kitbook'
import type Component from './EnglishWord.svelte'

export const viewports: Viewport[] = [
  { width: 320, height: 150}
]

export const variants: Variant<Component>[] = [
  {
    name: 'Situation A',
    props: {},
  },
]
