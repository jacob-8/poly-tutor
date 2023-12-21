import type { Variant, Viewport } from 'kitbook'
import type Component from './User.svelte'
import { mockBobUser } from '$lib/mocks/data/page'

export const viewports: Viewport[] = [
  { width: 700, height: 300}
]

export const variants: Variant<Component>[] = [
  {
    name: 'Signed Out',
    props: {
      user: null,
      sign_out: null,
    },
  },
  {
    name: 'Signed In',
    props: {
      user: mockBobUser,
      // @ts-expect-error
      sign_out: () => alert('signed out')
    },
  },
]
