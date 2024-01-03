import { createPersistedStore } from 'svelte-pieces'
import { WordStatus, type UserVocabulary } from '$lib/types.js'
import type { Supabase } from '../supabase/database.types'
import type { AuthResponse } from '@supabase/supabase-js'
import { writable } from 'svelte/store'
import type { WordList } from './word-lists.interface'
import { browser } from '$app/environment'

export const word_lists = createPersistedStore<WordList[]>(
  'word_lists_01.03.24',
  ['時代華語1w', '時代華語2Aw', '時代華語2Bw', '時代華語3Aw', '時代華語3Bw', '時代華語4Aw'],
  true,
)

export function createVocabStore({ supabase, authResponse, log = false }: { supabase: Supabase, authResponse: AuthResponse, log?: boolean }) {
  const user_vocabulary: UserVocabulary = {
    '我': { status: WordStatus.known },
    '的': { views: 200 },
    '是': { views: 200 },
    '一下': { views: 200 },

  }

  const { subscribe, set } = writable<UserVocabulary>(user_vocabulary)
  if (!browser)
    return { subscribe }

  // const vocab_key = `vocabulary_${authResponse?.data?.user?.id || 'no_user'}`
  // const cached = localStorage.getItem(vocab_key)
  // if (cached)
  //   set(JSON.parse(cached))

  // TODO: fetch from supabase and cache if a response returned
  console.info({supabase, authResponse, log})

  word_lists.subscribe(async (lists) => {
    const { word_lists } = await import('./word-lists')
    lists
      .map(list => word_lists[list])
      .flat()
      .forEach((word) => {
        if (!user_vocabulary[word])
          user_vocabulary[word] = { status: WordStatus.wordlist }
      })
    set(user_vocabulary)
  })

  return { subscribe }
}

