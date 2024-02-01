/* eslint-disable no-magic-numbers */
import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import {  readable } from 'svelte/store'
import type { UserVocabulary } from '$lib/types'
import { zh_transcribed_summarized } from '$lib/mocks/seed/youtubes'
import { get_analysis_functions } from '$lib/analysis'
// import { curious, known, pronunciation, todo, tone } from '$lib/mocks/data/j-words'
import { known } from '$lib/mocks/data/j-words'
import { ResponseCodes } from '$lib/responseCodes'

const youtube: YouTube = {
  ...zh_transcribed_summarized.youtube,
  created_at: '2023-12-12T06:34:27.299482+00:00'
} as YouTube

const user_vocabulary = {
  ...readable<UserVocabulary>({
    // ...curious.reduce((acc, word) => ({...acc, [word]: {views: 1, status: 'unknown'}}), {}),
    // ...todo.reduce((acc, word) => ({...acc, [word]: {views: 3, status: 'unknown'}}), {}),
    // ...pronunciation.reduce((acc, word) => ({...acc, [word]: {views: 10, status: 'pronunciation'}}), {}),
    // ...tone.reduce((acc, word) => ({...acc, [word]: {views: 20, status: 'tone'}}), {}),
    ...known.splice(0,1000).reduce((acc, word) => ({...acc, [word]: {views: 30, status: 'known'}}), {}),
  }),
  change_word_status: null,
  add_seen_sentence: null,
  changed_words: readable<UserVocabulary>({})
}

const { analyze_sentences, split_sentences } = await get_analysis_functions({learning: 'zh-TW', user_vocabulary, emphasis_limits: readable({high_view_count_max: 10, common_in_this_context_max: 10, improve_pronunciation_or_tone_max: 2})})

function delay<T>(value: T, delay_ms = 1000): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay_ms))
}

const noop_page_functions = {
  load_transcript: () => delay(null, 2000),
  load_summaries: () => delay(null),
  analyze_sentences,
  split_sentences,
  transcribe: async () => {
    await delay(null)
    alert('Sign In')
    return null
  },
  summarize_chapter: async () => {
    await delay(null)
    alert('Sign In')
    return null
  },
  check_is_in_my_videos: () => delay(null),
  remove_from_my_videos: () => delay(null),
}

export const variants: Variant<Component>[] = [
  {
    name: 'youtube in db, transcript, summary',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        ...noop_page_functions,
        youtube_id: youtube.id,
        language: 'zh',
        youtube_promise: delay({ data: youtube}, 500),
        user: mockBobUser,
        load_transcript: () => delay(zh_transcribed_summarized.transcripts[0].sentences),
        load_summaries: () => delay(zh_transcribed_summarized.summaries),
      }
    },
  },
  {
    name: 'youtube in db, no transcript, no summary',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        ...noop_page_functions,
        youtube_id: youtube.id,
        language: 'zh',
        youtube_promise: delay({ data: youtube}, 500),
        user: mockBobUser,
        transcribe: () => delay(zh_transcribed_summarized.transcripts[0].sentences),
        summarize_chapter: () => delay(zh_transcribed_summarized.summaries[0].sentences),
      }
    },
  },
  {
    name: 'no user, youtube in db, no transcript',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        ...noop_page_functions,
        youtube_id: youtube.id,
        language: 'zh',
        youtube_promise: delay({ data: youtube}, 500),
      }
    },
  },
  {
    name: 'no user, youtube not in db',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        ...noop_page_functions,
        youtube_id: youtube.id,
        language: 'zh',
        youtube_promise: delay({ error: { status: ResponseCodes.UNAUTHORIZED, message: 'Unauthorized'}}),
      }
    },
  },
]

