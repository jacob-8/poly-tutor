import type { Variant, Viewport } from 'kitbook'
import type Component from './SideMenuContent.svelte'

export const viewports: Viewport[] = [
  { width: 280, height: 480}
]

export const variants: Variant<Component>[] = [
  {
    name: 'Situation A',
    props: {
      //@ts-expect-error
      sign_out: () => alert('signed out')
    },
  },
]

