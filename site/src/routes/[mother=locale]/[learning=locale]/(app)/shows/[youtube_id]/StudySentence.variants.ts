import type { Variant, Viewport } from 'kitbook'
import type Component from './StudySentence.svelte'
import { title_sentence } from '$lib/mocks/sentences'

export const viewports: Viewport[] = [
  { width: 300, height: 600 },
  { width: 500, height: 600 },
]

export const variants: Variant<Component>[] = [
  {
    props: {
      language: 'zh',
      sentence: title_sentence,
      study_words_object: null,
      change_word_status: (args) => console.info(args),
    },
  },
]

