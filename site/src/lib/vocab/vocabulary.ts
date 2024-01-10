import { createPersistedStore } from '$lib/utils/persisted-store'
import { WordStatus, type UserVocabulary, type VocabularyWordStats } from '$lib/types.js'
import type { Supabase } from '../supabase/database.types'
import type { AuthResponse } from '@supabase/supabase-js'
import { derived, get, readable, type Readable } from 'svelte/store'
import type { WordList } from './word-lists.interface'
import { browser, dev } from '$app/environment'
import { jacob_known } from './word-lists'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { navigating } from '$app/stores'
import type { LanguageCode } from '$lib/i18n/locales'

type VocabItem = VocabularyWordStats & { updated_at?: string }

export const word_lists = createPersistedStore<WordList[]>(
  'word_lists_01.03.24',
  ['時代華語1w', '時代華語2Aw', '時代華語2Bw', '時代華語3Aw', '時代華語3Bw', '時代華語4Aw'],
  { syncTabs: true },
)

// first pulled from localstorage, then calculated as a combo of the user_vocabulary view from the db and any word_status_updates not yet synced to db
export function createVocabStore({ supabase, authResponse, language, log = false }: { supabase: Supabase, authResponse: AuthResponse, language: LanguageCode, log?: boolean }) {
  if (!browser)
    return readable<UserVocabulary>({})

  const user_id = authResponse?.data?.user?.id || 'no_user'
  const user_vocabulary = createPersistedStore<UserVocabulary>(`vocabulary_${user_id}`, {}, { syncTabs: true })
  const word_updates = createPersistedStore<Record<string, TablesInsert<'word_updates'>>>(`word_updates_${user_id}`, {}, { syncTabs: true })

  supabase
    .from('user_vocabulary')
    .select('vocabulary')
    .eq('language', language)
    .then(({ data, error }) => {
      console.info({ data, error })
      if (error) return console.error(error)
      if (!data?.length) return

      const [{vocabulary}] = data as unknown as { vocabulary: Record<string, VocabItem> }[]

      const current_word_updates = get(word_updates)
      const not_saved_word_updates = filter_object(current_word_updates, ({word, views}) => views > vocabulary[word].views)
      if (log) console.info({current_word_updates, not_saved_word_updates}) // should be the same but if there is a lag in the db not yet having updated, this will catch the discrepancy
      word_updates.set(not_saved_word_updates)

      user_vocabulary.set({
        ...vocabulary,
        ...not_saved_word_updates,
      })
    })


  function change_word_status(word: string, status: WordStatus) {
    if (log) console.info({word, status})
    const current_word_updates = get(word_updates)

    if (current_word_updates[word]) {
      current_word_updates[word] = {
        ...current_word_updates[word],
        status,
      }
      word_updates.set(current_word_updates)
      return
    }

    const word_update: TablesInsert<'word_updates'> = {
      word,
      status,
      language,
      views: get(user_vocabulary)[word]?.views || 0,
      id: window.crypto.randomUUID(),
    }
    word_updates.set({...current_word_updates, word: word_update})
  }

  const seen_sentences_this_route = createPersistedStore<Record<string, string[]>>('seen_sentences_this_route_01.03.24', {}, { syncTabs: true })

  function add_seen_sentence(words: string[]) {
    if (log) console.info({add_seen_sentence: words})
    const current_sentences = get(seen_sentences_this_route)
    const key = words.join('_')
    current_sentences[key] = words
    seen_sentences_this_route.set(current_sentences)
  }

  navigating.subscribe((nav) => {
    if (!nav) return
    if (log) console.info('navigated so going to process word updates')
    process_word_updates()
  })

  async function process_word_updates() {
    const current_sentences = get(seen_sentences_this_route)
    const vocabulary = get(user_vocabulary)
    const word_counts: Record<string, number> = {}

    for (const words in Object.values(current_sentences)) {
      for (const word of words) {
        if (vocabulary[word]?.status === WordStatus.known)
          continue

        if (!word_counts[word])
          word_counts[word] = 1
        else
          word_counts[word]++
      }
    }

    const current_word_updates = get(word_updates)
    const new_word_updates: Record<string, TablesInsert<'word_updates'>> = {}

    for (const [word, views] of Object.entries(word_counts)) {
      if (current_word_updates[word]) {
        current_word_updates[word] = {
          ...current_word_updates[word],
          views: current_word_updates[word].views + views,
        }
      } else {
        new_word_updates[word] = {
          word,
          status: vocabulary[word]?.status || WordStatus.unknown,
          language,
          views,
          id: window.crypto.randomUUID(),
        }
      }
    }

    const all_word_updates_to_send_to_db = {...current_word_updates, ...new_word_updates}
    word_updates.set(all_word_updates_to_send_to_db)
    user_vocabulary.set({
      ...vocabulary,
      ...all_word_updates_to_send_to_db,
    })
    try {
      if (log) console.info({all_word_updates_to_send_to_db})
      await add_word_updates_to_db(Object.values(all_word_updates_to_send_to_db))
      const fresh_check_of_word_updates = get(word_updates)
      if (log) console.info({fresh_check_of_word_updates})
      word_updates.set(filter_object(fresh_check_of_word_updates, ({id}) => !all_word_updates_to_send_to_db[id]))
    } catch (error) {
      console.error(error)
    }
  }

  async function add_word_updates_to_db(updates: TablesInsert<'word_updates'>[]) {
    const { data, error } = await supabase.from('word_updates').insert(updates).select('created_at')
    console.info({ data, error })
    if (error) throw error
    // TODO: don't throw on errors resulting from a word update with same id being saved again as these are ok, this can happen if the user saves and closes the tab before the network request is complete and the updates get removed from local storage
  }

  const vocab_with_word_lists = derived<[Readable<UserVocabulary>, Readable<WordList[]>], UserVocabulary>([user_vocabulary, word_lists], ([$user_vocabulary, $word_lists], set) => {
    const words = $user_vocabulary

    if (dev || authResponse?.data?.user?.email === 'jacob@polylingual.dev') {
      jacob_known.forEach((word) => {
        if (!words[word])
          words[word] = { status: WordStatus.known }
      })
      set(words)
    } else {
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
    }
  }, {})

  return { subscribe: vocab_with_word_lists.subscribe, change_word_status, add_seen_sentence }
}



function filter_object<T>(obj: Record<string, T>, callback: (value) => boolean): Record<string, T> {
  const asArray = Object.entries(obj)
  const filtered = asArray.filter(([_, value]) => callback(value))
  return Object.fromEntries(filtered)
}
