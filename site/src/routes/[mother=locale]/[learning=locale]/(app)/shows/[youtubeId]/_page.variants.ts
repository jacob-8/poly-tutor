/* eslint-disable no-magic-numbers */
import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import { writable } from 'svelte/store'
import { WordStatus, type Sentence } from '$lib/types'
import { zh_non_seeded, zh_transcribed_summarized } from '$lib/mocks/seed/youtubes'

const youtube: YouTube = {
  ...zh_transcribed_summarized.youtube,
  description: zh_non_seeded.youtube.description,
  created_at: '2023-12-12T06:34:27.299482+00:00'
} as YouTube

// const addSummary = async ({sentences}: {sentences: Sentence[]}) => {
//   await new Promise((resolve) => setTimeout(resolve, 30))
//   alert(`Would summarize ${sentences.length} sentences`)
// }

const translate = async (sentences: Sentence[]) => {
  await new Promise((resolve) => setTimeout(resolve, 30))
  alert(`Would translate ${sentences.length} sentences`)
}

const streamed: Variant<Component>['props']['data']['streamed'] = {
  title: new Promise((resolve) => { setTimeout(() => resolve([{text: zh_transcribed_summarized.youtube.title}]), 500) }),
  description: new Promise((resolve) => { setTimeout(() => resolve([{text: zh_transcribed_summarized.youtube.description}]), 500) }),
  // @ts-ignore
  content: new Promise((resolve) => { setTimeout(() => resolve({transcript: zh_transcribed_summarized.transcripts[0], emphasized_sentences: [], emphasized_words: []}), 500) }),
}

export const variants: Variant<Component>[] = [
  {
    name: 'no user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube,
        error: null,
        summary: writable(zh_transcribed_summarized.summaries[0].summary.sentences),
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
        user_vocabulary: writable({'你好': {status: WordStatus.known, views: 1}}),
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

