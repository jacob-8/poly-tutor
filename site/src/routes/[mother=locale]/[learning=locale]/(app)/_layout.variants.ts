import type { Variant, Viewport } from 'kitbook'
import type Layout from './+layout.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'

export const viewports: Viewport[] = [
  { width: 300, height: 300},
  { width: 700, height: 300},
]

export const variants: Variant<Layout>[] = [
  {
    name: 'Signed Out',
    props: {
      data: {
        ...mockLayoutData,
      },
    },
  },
  {
    name: 'Signed In',
    props: {
      data: {
        ...mockLayoutData,
        user: mockBobUser,
      },
    },
  },
]
