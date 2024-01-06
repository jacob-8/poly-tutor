import type { Variant, Viewport } from 'kitbook'
import type Component from './Sentence.svelte'
import { WordStatus } from '$lib/types'

export const viewports: Viewport[] = [
  { width: 400, height: 150 },
]

export const variants: Variant<Component>[] = [
  {
    props: {
      onClick: () => console.info('clicked'),
      settings: { font_size_em: 1.5, show_definition: true, show_pronunciation: true },
      sentence: {
        text: '我听见你说话了。',
        words: [
          {
            text: '我',
            pronunciation: 'wǒ',
            definitions: ['I, me, my'].join('/'),
            status: WordStatus.known,
          },
          {
            text: '听见',
            pronunciation: 'tīngjiàn',
            definitions: ['heard with 22 ears and understood'].join('/'),
            status: WordStatus.unknown,
            neighbors_understood: true,
          },
          {
            text: '你',
            pronunciation: 'nǐ',
            definitions: ['you'].join('/'),
            status: WordStatus.known,
          },
          {
            text: '说话',
            pronunciation: 'shuōhuà',
            definitions: ['to speak, to say, to talk'].join('/'),
            status: WordStatus.unknown,
            neighbors_understood: true,
            common_in_this_context: true,
          },
          {
            text: '了',
            pronunciation: 'le',
            definitions: ['(particle signifying the change of situation)'].join('/'),
            status: WordStatus.known,
          },
          {
            text: '。',
          },
        ],
      }
    },
  },
]

