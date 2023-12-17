import type { Variant, Viewport } from 'kitbook'
import type Component from './Description.svelte'

export const viewports: Viewport[] = [{width: 400, height: 500}]

export const variants: Variant<Component>[] = [
  {
    name: 'description',
    props: {
      description: 'Add optional information about this variant',
    },
  },
  {
    name: 'no description',
    props: {
      description: null,
    },
  },
]

