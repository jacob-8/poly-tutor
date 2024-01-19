/* eslint-disable no-magic-numbers */
import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import { readable, writable } from 'svelte/store'
import type { Sentence, UserVocabulary } from '$lib/types'
import { zh_transcribed_summarized } from '$lib/mocks/seed/youtubes'
import { get_analysis_functions } from '$lib/analysis'
// import { curious, known, pronunciation, todo, tone } from '$lib/mocks/data/j-words'
import { known } from '$lib/mocks/data/j-words'

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

const translate = async (sentences: Sentence[]) => {
  await new Promise((resolve) => setTimeout(resolve, 30))
  alert(`Would translate ${sentences.length} sentences`)
}

function like_network_promise<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 500))
}
const streamed: Variant<Component>['props']['data']['streamed'] = {
  title: like_network_promise(await split_sentences([{text: youtube.title}])),
  description: like_network_promise(await split_sentences([{text: youtube.description}])),
  content: like_network_promise(await analyze_sentences(zh_transcribed_summarized.transcripts[0].transcript.sentences)),
}

const summary = writable(zh_transcribed_summarized.summaries[0].summary.sentences)
summary.set(await split_sentences(zh_transcribed_summarized.summaries[0].summary.sentences))

export const variants: Variant<Component>[] = [
  {
    name: 'no user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube,
        error: null,
        summary,
        streamed,
        translate,
        check_is_in_my_videos: null,
        remove_from_my_videos: null,
        addSummary: null,
        analyze_syntax: null,
        transcribe_captions: null,
      }
    },
  },
  {
    name: 'user',
    // languages: [],
    props: {
      data: {
        ...mockLayoutData,
        user: mockBobUser,
        youtube,
        summary: writable(zh_transcribed_summarized.summaries[0].summary.sentences),
        streamed,
        translate,
        // @ts-ignore
        check_is_in_my_videos: (youtube_id) => { console.info(`check_is_in_my_videos(${youtube_id})`)},
        // @ts-ignore
        remove_from_my_videos: (youtube_id) => { alert(`remove_from_my_videos(${youtube_id})`)},
      }
    },
  },
]

