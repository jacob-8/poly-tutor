import { readable, writable, type Readable } from 'svelte/store'
import type { LayoutData } from '../../../routes/[mother=locale]/[learning=locale]/(app)/$types'
import type { BaseUser } from '$lib/supabase/user'
import { WordStatus } from '$lib/types'

export const mockLayoutData: LayoutData = {
  mother: 'en',
  learning: 'zh-TW',
  t: null,
  supabase: null,
  authResponse: null,
  user: readable(null),
  user_vocabulary: { ...readable({'你好': {status: WordStatus.known, views: 1}}), change_word_status: (args) => console.info(args), add_seen_sentence: (args) => console.info(args), changed_words: null},
  settings: writable({font_size_em: 1.5, show_definition: true, show_pronunciation: true}),
  split_string: null,
  split_sentences: null,
  analyze_sentences: null,
}

export const mockBobUser = readable({ email: 'bob@gmail.com', user_metadata: {}}) as Readable<BaseUser>
