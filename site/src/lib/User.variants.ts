import type { Variant, Viewport } from 'kitbook'
import type Component from './User.svelte'
import { mockBobUser } from './mocks/data/page'

export const viewports: Viewport[] = [
  { width: 700, height: 300}
]

export const variants: Variant<Component>[] = [
  {
    name: 'Signed Out',
    props: {
      user: null,
      signOut: null,
    },
  },
  {
    name: 'Signed In',
    props: {
      user: mockBobUser,
      // @ts-expect-error
      signOut: () => alert('signed out')
    },
  },
]
