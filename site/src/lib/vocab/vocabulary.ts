import { createPersistedStore } from '$lib/utils/persisted-store'
import { WordStatus, type UserVocabulary, type VocabularyWordStats } from '$lib/types.js'
import type { Supabase } from '../supabase/database.types'
import type { AuthResponse } from '@supabase/supabase-js'
import { derived, get, readable, type Readable } from 'svelte/store'
import type { ChineseWordList, EnglishWordList } from './word-lists.interface'
import { browser } from '$app/environment'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { navigating } from '$app/stores'
import type { LanguageCode } from '$lib/i18n/locales'
import { open_auth } from '$lib/client/UserInfo.svelte'
import { VOCAB_KEY_PATH, VOCAB_STORE_NAME, createIndexedDBStore } from '$lib/utils/indexed-db-store'

type VocabItem = VocabularyWordStats & { updated_at?: string }

const DEFAULT_ZH_LISTS: ChineseWordList[] = [] // ['時代華語1w', '時代華語2Aw', '時代華語2Bw', '時代華語3Aw', '時代華語3Bw', '時代華語4Aw']
const DEFAULT_EN_LISTS: EnglishWordList[] = ['tw_7000']

export function createVocabStore({ supabase, authResponse, language, log = false }: { supabase: Supabase, authResponse: AuthResponse, language: LanguageCode, log?: boolean }) {
  if (!browser)
    return { ...readable<UserVocabulary>({}), change_word_status: null, add_seen_sentence: null, changed_words: readable<UserVocabulary>({})}

  if (log) console.info(`created vocab store in: ${language}`)

  const user_id = authResponse?.data?.user?.id
  const user_with_language_key = `${user_id || 'no_user'}_${language}`
  const user_vocabulary = createIndexedDBStore<UserVocabulary>({store_name: VOCAB_STORE_NAME, key_path: VOCAB_KEY_PATH, key: user_with_language_key, initial_value: {}, log})
  const seen_sentences_this_route = createPersistedStore<Record<string, string[]>>(`seen_sentences_this_route_${user_with_language_key}`, {}, { syncTabs: true })
  const word_lists = createPersistedStore<(ChineseWordList | EnglishWordList)[]>(`word_lists_${user_with_language_key}`, language === 'en' ? DEFAULT_EN_LISTS : DEFAULT_ZH_LISTS, { syncTabs: true })

  if (user_id) {
    supabase
      .from('user_vocabulary')
      .select('vocabulary')
      .eq('language', language)
      .then(({ data, error }) => {
        if (error) return console.error(error)
        if (!data?.length) return
        const [{vocabulary}] = data as unknown as { vocabulary: Record<string, VocabItem> }[]
        if (log) console.info({db_user_vocabulary: vocabulary})
        user_vocabulary.set(vocabulary)
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
    // seen_sentences_this_route.set(current_sentences)
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
    if (log) console.info(`process_seen_sentences in ${language}`)

    const current_sentences = get(seen_sentences_this_route)
    if (!Object.keys(current_sentences).length) return

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
    if (!Object.keys(word_counts).length) return

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

  const vocab_with_word_lists = derived<[Readable<UserVocabulary>, Readable<(ChineseWordList | EnglishWordList)[]>], UserVocabulary>([user_vocabulary, word_lists], ([$user_vocabulary, $word_lists], set) => {
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

  return { subscribe: vocab_with_word_lists.subscribe, change_word_status, add_seen_sentence, changed_words, word_lists }
}

function filter_object<T>(obj: Record<string, T>, callback: (value) => boolean): Record<string, T> {
  const asArray = Object.entries(obj)
  const filtered = asArray.filter(([_, value]) => callback(value))
  return Object.fromEntries(filtered)
}

