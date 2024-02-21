import { readable, writable, type Readable } from 'svelte/store'
import type { LayoutData } from '../../../routes/[mother=locale]/[learning=locale]/(app)/$types'
import type { BaseUser } from '$lib/supabase/user'
import { WordStatus, type UserVocabulary } from '$lib/types'
import { chinese_word_lists } from '$lib/vocab/chinese-word-lists'

const user_vocabulary = {
  ...readable<UserVocabulary>({
    ...chinese_word_lists.時代華語2Bw.reduce((acc, word) => ({...acc, [word]: {views: 3, status: WordStatus.unknown}}), {}),
    ...chinese_word_lists.時代華語2Aw.slice(200).reduce((acc, word) => ({...acc, [word]: {views: 10, status: WordStatus.pronunciation}}), {}),
    ...chinese_word_lists.時代華語2Aw.slice(0,200).reduce((acc, word) => ({...acc, [word]: {views: 20, status: WordStatus.tone}}), {}),
    ...chinese_word_lists.時代華語1w.reduce((acc, word) => ({...acc, [word]: {views: 30, status: WordStatus.known}}), {}),
  }),
  change_word_status: (args) => console.info(args),
  add_seen_sentence: (args) => console.info(args),
  changed_words: readable<UserVocabulary>({})
}

export const mockLayoutData: LayoutData = {
  mother: 'en',
  learning: 'zh-TW',
  t: null,
  supabase: null,
  authResponse: null,
  user: readable(null),
  user_vocabulary,
  settings: writable({font_size_em: 1.5, show_definition: true, show_pronunciation: true}),
  split_string: null,
  split_sentences: null,
  analyze_sentences: null,
  emphasis_limits: null,
}

export const mockBobUser = readable({ email: 'bob@gmail.com', user_metadata: {}}) as Readable<BaseUser>
