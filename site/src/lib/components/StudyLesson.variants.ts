import type { Variant } from 'kitbook'
import type Component from './StudyLesson.svelte'
// import { title_sentence } from '$lib/mocks/sentences'
// optionally override your kitbook viewports for all variants in this file
// export const viewports: Viewport[] = [
//   { name: 'Desktop', width: 800, height: 600 },
//   { name: 'Mobile', width: 320, height: 480}
// ]

export const variants: Variant<Component>[] = [
  {
    props: {
      study_words: null,// title_sentence.words,
      change_word_status: (args) => console.info(args),
    },
  },
]

