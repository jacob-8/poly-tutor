import type { Variant, Viewport } from 'kitbook'
import type Component from './Sentence.svelte'
import { WordStatus } from './types'

export const viewports: Viewport[] = [
  { width: 400, height: 150 },
]

export const variants: Variant<Component>[] = [
  {
    props: {
      onClick: () => console.info('clicked'),
      onMouseover: () => console.info('mouseover'),
      sentence: {
        text: '我听见你说话了。',
        words: [
          {
            text: '我',
            pronunciation: 'wǒ',
            definitions_array: ['I, me, my'],
            status: WordStatus.known,
          },
          {
            text: '听见',
            pronunciation: 'tīngjiàn',
            definitions_array: ['heard with 22 ears and understood'],
            status: WordStatus.unknown,
            neighbors_understood: true,
          },
          {
            text: '你',
            pronunciation: 'nǐ',
            definitions_array: ['you'],
            status: WordStatus.known,
          },
          {
            text: '说话',
            pronunciation: 'shuōhuà',
            definitions_array: ['to speak, to say, to talk'],
            status: WordStatus.unknown,
            neighbors_understood: true,
            common_in_this_context: true,
          },
          {
            text: '了',
            pronunciation: 'le',
            definitions_array: ['(particle signifying the change of situation)'],
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

