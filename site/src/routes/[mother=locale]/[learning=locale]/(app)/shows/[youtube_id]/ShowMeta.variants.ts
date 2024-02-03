import type { Variant, Viewport } from 'kitbook'
import type Component from './ShowMeta.svelte'
import { title_sentence } from '$lib/mocks/sentences'

export const viewports: Viewport[] = [{width: 400, height: 200}]

export const variants: Variant<Component>[] = [
  {
    viewports: [{width: 700, height: 250}],
    props: {
      language: 'zh',
      label: 'Description',
      sentences: [title_sentence],
      mother: 'en',
      split_sentences: (sentences) => sentences,
      studySentence: (sentence) => console.info({sentence}),
      settings: {font_size_em: 1.5, show_definition: true, show_pronunciation: true},
      study_words_object: null,
    },
  },
]

