import type { Variant, Viewport } from 'kitbook'
import type Component from './UnknownInCurrentSentence.svelte'
import { WordStatus, type Sentence } from '$lib/types'

export const viewports: Viewport[] = [
  { width: 400, height: 300 },
]

const sentence: Sentence = {
  words: [
    {
      text: '大家',
      definitions: 'everyone/influential family/great expert',
    },
    {
      text: '好',
      definitions: 'good/well/proper/good to/easy to/very/so/(suffix indicating completion or readiness)/(of two people) close/on intimate terms/(after a personal pronoun) hello',
      pinyin: 'hǎo',
      status: WordStatus.unknown,
      views: 4,
    },
    {
      text: '，',
    },
    {
      text: '歡迎',
      definitions: 'to welcome/to greet/to state',
      pinyin: 'huān yíng',
      status: WordStatus.unknown,
      views: 3,
    },
    {
      text: '來到',
      definitions: 'to arrive/to come to/to get to',
    },
    {
      text: '這個',
      definitions: 'this/this one/here/this',
      status: WordStatus.unknown,
      views: 2,
    },
    {
      text: '視頻',
      definitions: 'video',
      pinyin: 'shì pín',
      status: WordStatus.unknown,
      views: 5,
    },
    {
      text: '，',
    },
  ]
}

export const variants: Variant<Component>[] = [
  {
    props: {
      sentence,
    },
  },
  {
    props: {
      sentence,
      black: true,
    },
  },
]

