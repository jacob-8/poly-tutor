import type { Variant, Viewport } from 'kitbook'
import type Component from './User.svelte'
import { mockBobUser } from '$lib/mocks/data/page'
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
  {
    name: 'Has Avatar',
    props: {
      user: readable({ email: 'bob@gmail.com', user_metadata: { avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocKc48pYcKBODl6nfPUT1C-cHIn5gjJ1LJKvzHtPLs-ohIyd=s96-c', full_name: 'Robert Someone'}}) as Readable<BaseUser>,
      // @ts-expect-error
      sign_out: () => alert('signed out')
    },
  },
  {
    name: 'Broken Avatar',
    props: {
      user: readable({ email: 'bob@gmail.com', user_metadata: { avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocKc48pYcKB', full_name: 'Robert Someone'}}) as Readable<BaseUser>,
      // @ts-expect-error
      sign_out: () => alert('signed out')
    },
  },
]
