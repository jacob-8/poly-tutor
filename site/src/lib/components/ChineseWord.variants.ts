import type { Variant, Viewport } from 'kitbook'
import type Component from './ChineseWord.svelte'
import { WordStatus } from '$lib/types'

export const viewports: Viewport[] = [
  { width: 320, height: 150}
]

const settings = {
  font_size_em: 1.5,
  show_definition: true,
  show_pronunciation: true,
}

const base_variants: Variant<Component>[] = [
  {
    name: 'Unknown, time to learn, script diff',
    props: {
      word: {
        text: '聽見',
        opposite_script: '听见',
        pinyin: 'tīng jiàn',
        definitions: 'heard with the ears and understood',
        status: WordStatus.unknown,
      },
      settings,
      study_words_object: {
        high_view_count: {'聽見': true},
        common_in_this_context: {},
        improve_pronunciation_or_tone: {},
      }
    },
  },
  {
    name: 'Unknown, neighbors known, notice',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎo de',
        definitions: 'good, everything is as it should be',
        status: WordStatus.unknown,
        neighbors_understood: true,
      },
      settings,
      study_words_object: {
        high_view_count: {},
        common_in_this_context: {'好的': true},
        improve_pronunciation_or_tone: {},
      }
    },
  },
  {
    name: 'meaning known, tone change',
    props: {
      word: {
        text: '你好',
        pinyin: 'nǐ hǎo',
        tone_change: true,
        definitions: 'hello',
        status: WordStatus.pronunciation,
      },
      settings,
      study_words_object: null,
    },
  },
  {
    name: 'pronuncation known, time to improve, tone change',
    props: {
      word: {
        text: '你好',
        pinyin: 'nǐ hǎo',
        tone_change: true,
        definitions: 'hello',
        status: WordStatus.tone,
      },
      settings,
      study_words_object: {
        high_view_count: {},
        common_in_this_context: {},
        improve_pronunciation_or_tone: {'你好': true},
      },
    },
  },
  {
    name: 'pronuncation known, no tone change, neutral tone in second word',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎo de',
        definitions: 'good',
        status: WordStatus.tone,
      },
      settings,
      study_words_object: null,
    },
  },
  {
    name: 'known',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎo de',
        definitions: 'good',
        status: WordStatus.known,
      },
      settings,
      study_words_object: null,
    },
  }
]

export const variants = [...base_variants]
