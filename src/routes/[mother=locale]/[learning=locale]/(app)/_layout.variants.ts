import type { Variant, Viewport } from 'kitbook'
import type Layout from './+layout.svelte'
import { readable, type Readable } from 'svelte/store'
import type { BaseUser } from '$lib/supabase/user'
import { mockLayoutData } from '$lib/mocks/data/page'

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
        user: readable({session: {user: {email: 'bob@gmail.com'}}}) as Readable<BaseUser>,
      },
    },
  },
]
