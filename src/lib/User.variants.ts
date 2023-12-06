import type { Variant, Viewport } from 'kitbook'
import type Component from './User.svelte'
import { readable, type Readable } from 'svelte/store'
import type { BaseUser } from '$lib/supabase/user'

export const viewports: Viewport[] = [
  { width: 700, height: 300}
]

export const variants: Variant<Component>[] = [
  {
    name: 'Signed Out',
    props: {
      user: null,
    },
  },
  {
    name: 'Signed In',
    props: {
      user: readable({session: {user: {email: 'bob@gmail.com'}}}) as Readable<BaseUser>,
    },
  },
]
