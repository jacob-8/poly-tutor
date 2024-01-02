import { readable, writable, type Readable } from 'svelte/store'
import type { LayoutData } from '../../../routes/[mother=locale]/[learning=locale]/(app)/$types'
import type { BaseUser } from '$lib/supabase/user'

export const mockLayoutData: LayoutData = {
  mother: 'en',
  learning: 'zh-TW',
  t: null,
  supabase: null,
  authResponse: null,
  user: readable(null),
  user_vocabulary: writable({}),
}

export const mockBobUser = readable({ email: 'bob@gmail.com'}) as Readable<BaseUser>
