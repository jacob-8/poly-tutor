/* eslint-disable no-magic-numbers */
import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import { writable } from 'svelte/store'
import type { Sentence } from '$lib/types'
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

export const variants: Variant<Component>[] = [
  {
    name: 'no user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube,
        error: null,
        summary: writable(zh_transcribed_summarized.summaries[0].summary),
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 3000) }),
          // @ts-ignore
          transcript: new Promise((resolve) => { setTimeout(() => resolve( zh_transcribed_summarized.transcripts[0]), 1000) }),
        },
        translate,
        // addSummary,
      }
    },
  },
  {
    name: 'user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        user: mockBobUser,
        user_vocabulary: writable(['你好']),
        youtube,
        summary: writable(zh_transcribed_summarized.summaries[0].summary),
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 1000) }),
          // @ts-ignore
          transcript: new Promise((resolve) => { setTimeout(() => resolve( zh_transcribed_summarized.transcripts[0]), 1000) }),
        },
        translate,
        // @ts-ignore
        check_is_in_my_videos: (youtube_id) => { console.info(`check_is_in_my_videos(${youtube_id})`)},
        // @ts-ignore
        remove_from_my_videos: (youtube_id) => { alert(`remove_from_my_videos(${youtube_id})`)},
      }
    },
  },
]

