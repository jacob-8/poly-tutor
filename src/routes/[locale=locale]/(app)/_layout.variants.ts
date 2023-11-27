import type { Variant } from 'kitbook'
import type Layout from './+layout.svelte'
import { readable, type Readable } from 'svelte/store'
import type { BaseUser } from '$lib/supabase/user'
import { mockLayoutData } from '$lib/mocks/data/page'

export const variants: Variant<Layout>[] = [
  {
    name: 'Signed Out',
    props: {
      data: {
        ...mockLayoutData,

      },
    },
    slots: [
      {
        content: 'Page content goes here'
      }
    ]
  },
  {
    name: 'Signed In',
    props: {
      data: {
        ...mockLayoutData,
        user: readable({session: {user: {email: 'test@gmail.com'}}}) as Readable<BaseUser>,
      },
    },
  },
]
