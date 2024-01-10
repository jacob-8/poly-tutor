import { createPersistedStore } from '$lib/utils/persisted-store'
import { WordStatus, type UserVocabulary, type VocabularyWordStats } from '$lib/types.js'
import type { Supabase } from '../supabase/database.types'
import type { AuthResponse } from '@supabase/supabase-js'
import { derived, get, readable, type Readable } from 'svelte/store'
import type { WordList } from './word-lists.interface'
import { browser } from '$app/environment'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { navigating } from '$app/stores'
import type { LanguageCode } from '$lib/i18n/locales'
import { open_auth } from '$lib/client/UserInfo.svelte'

type VocabItem = VocabularyWordStats & { updated_at?: string }

export const word_lists = createPersistedStore<WordList[]>(
  'word_lists_01.03.24',
  [],
  // ['時代華語1w', '時代華語2Aw', '時代華語2Bw', '時代華語3Aw', '時代華語3Bw', '時代華語4Aw'],
  { syncTabs: true },
)

export function createVocabStore({ supabase, authResponse, language, log = false }: { supabase: Supabase, authResponse: AuthResponse, language: LanguageCode, log?: boolean }) {
  if (!browser)
    return { ...readable<UserVocabulary>({}), change_word_status: null, add_seen_sentence: null, changed_words: readable<UserVocabulary>({})}

  const user_id = authResponse?.data?.user?.id
  const user_key = user_id || 'no_user'
  const user_vocabulary = createPersistedStore<UserVocabulary>(`vocabulary_${user_key}`, {}, { syncTabs: true })
  const seen_sentences_this_route = createPersistedStore<Record<string, string[]>>(`seen_sentences_this_route_${user_key}`, {}, { syncTabs: true })

  if (user_id) {
    supabase
      .from('user_vocabulary')
      .select('vocabulary')
      .eq('language', language)
      .then(({ data, error }) => {
        if (error) return console.error(error)
        if (!data?.length) return
        const [{vocabulary}] = data as unknown as { vocabulary: Record<string, VocabItem> }[]
        user_vocabulary.set(vocabulary)
        console.info('user vocab loaded from db')
      })
  }

  function change_word_status(word: string, status: WordStatus) {
    if (!user_id) return open_auth()
    if (log) console.info({word, status})

    const vocabulary = get(user_vocabulary)
    const views = vocabulary[word]?.views || 0

    const word_update: TablesInsert<'word_updates'> = {
      word,
      status,
      language,
      views,
    }

    user_vocabulary.set({
      ...vocabulary,
      [word]: word_update
    })

    add_word_updates_to_db([word_update])
  }

  function add_seen_sentence(words: string[]) {
    if (log) console.info(`add_seen_sentence: ${words.join(' ')}`)
    const current_sentences = get(seen_sentences_this_route)
    const key = words.join('_')
    current_sentences[key] = words
    seen_sentences_this_route.set(current_sentences)
  }

  let last_process_seen_sentences: Date

  navigating.subscribe((nav) => {
    if (!nav || !user_id) return
    if (log) console.info('navigated')
    process_seen_sentences()
  })

  async function process_seen_sentences() {
    const FIVE_SECONDS = 1000 * 5
    if (last_process_seen_sentences && last_process_seen_sentences > new Date(Date.now() - FIVE_SECONDS)) {
      if (log) console.info('process_seen_sentences called in last 5 seconds, skipping')
      return
    }
    last_process_seen_sentences = new Date()
    if (log) console.info('process_seen_sentences')

    const current_sentences = get(seen_sentences_this_route)
    const vocabulary = get(user_vocabulary)
    const word_counts: Record<string, number> = {}

    for (const words of Object.values(current_sentences)) {
      for (const word of words) {
        if (vocabulary[word]?.status === WordStatus.known)
          continue

        if (!word_counts[word])
          word_counts[word] = 1
        else
          word_counts[word]++
      }
    }

    const word_updates: Record<string, TablesInsert<'word_updates'>> = {}

    for (const [word, views] of Object.entries(word_counts)) {
      word_updates[word] = {
        word,
        status: vocabulary[word]?.status || WordStatus.unknown,
        language,
        views: vocabulary[word]?.views + views || views,
      }
    }

    user_vocabulary.set({
      ...vocabulary,
      ...word_updates,
    })

    try {
      const updates = Object.values(word_updates)
      if (!updates.length) return
      if (log) console.info({updates_going_to_db: updates, length: updates.length})
      await add_word_updates_to_db(updates)
      seen_sentences_this_route.set({})
    } catch (error) {
      console.error(error)
    }
  }

  async function add_word_updates_to_db(updates: TablesInsert<'word_updates'>[]) {
    const { data, error } = await supabase.from('word_updates').insert(updates).select()
    console.info({ data, error })
    if (error) throw error
  }

  const vocab_with_word_lists = derived<[Readable<UserVocabulary>, Readable<WordList[]>], UserVocabulary>([user_vocabulary, word_lists], ([$user_vocabulary, $word_lists], set) => {
    if ($word_lists.length) {
      const words = { ...$user_vocabulary }
      import('./word-lists').then(({ word_lists }) => {
        $word_lists
          .map(list => word_lists[list])
          .flat()
          .forEach((word) => {
            if (!words[word])
              words[word] = { status: WordStatus.wordlist }
          })
        set(words)
      })
    } else {
      set($user_vocabulary)
    }
  }, {})

  const changed_words = derived<Readable<UserVocabulary>, UserVocabulary>(user_vocabulary, ($user_vocabulary, set) => {
    set(filter_object($user_vocabulary, ({ language }) => !!language))
  }, {})

  return { subscribe: vocab_with_word_lists.subscribe, change_word_status, add_seen_sentence, changed_words }
}

function filter_object<T>(obj: Record<string, T>, callback: (value) => boolean): Record<string, T> {
  const asArray = Object.entries(obj)
  const filtered = asArray.filter(([_, value]) => callback(value))
  return Object.fromEntries(filtered)
}

