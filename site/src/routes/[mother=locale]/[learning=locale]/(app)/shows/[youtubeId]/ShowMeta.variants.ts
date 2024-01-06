import type { Variant, Viewport } from 'kitbook'
import type Component from './ShowMeta.svelte'
import { title_sentence } from '$lib/mocks/sentences'

export const viewports: Viewport[] = [{width: 400, height: 200}]

export const variants: Variant<Component>[] = [
  {
    name: 'not-analyzed',
    props: {
      label: 'Description',
      sentence: {text: 'This is just a plain text string.'},
      studySentence: (sentence) => console.info({sentence}),
      settings: {font_size_em: 1.5, show_definition: true, show_pronunciation: true},
      study_words_object: null,
    },
  },
  {
    name: 'analyzed',
    viewports: [{width: 700, height: 250}],
    props: {
      label: 'Description',
      sentence: title_sentence,
      studySentence: (sentence) => console.info({sentence}),
      settings: {font_size_em: 1.5, show_definition: true, show_pronunciation: true},
      study_words_object: null,
    },
  },
]

