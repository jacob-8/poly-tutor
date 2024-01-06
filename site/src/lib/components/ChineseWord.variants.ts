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
        pinyin: 'tīngjiàn',
        pronunciation: 'tīngjiàn',
        definitions: 'heard with the ears and understood',
        status: WordStatus.unknown,
        high_view_count: true,
      },
      settings
    },
  },
  {
    name: 'Unknown, neighbors known, notice',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎode',
        pronunciation: 'hǎode',
        definitions: 'good, everything is as it should be',
        status: WordStatus.unknown,
        common_in_this_context: true,
        neighbors_understood: true,
      },
      settings
    },
  },
  {
    name: 'meaning known, tone change',
    props: {
      word: {
        text: '你好',
        pinyin: 'nǐhǎo',
        pronunciation: 'nǐhǎo',
        tone_change: true,
        definitions: 'hello',
        status: WordStatus.pronunciation,
      },
      settings
    },
  },
  {
    name: 'pronuncation known, time to improve, tone change',
    props: {
      word: {
        text: '你好',
        pinyin: 'nǐhǎo',
        pronunciation: 'ˇˇ',
        tone_change: true,
        definitions: 'hello',
        status: WordStatus.tone,
        improve_pronunciation_or_tone: true,
      },
      settings
    },
  },
  {
    name: 'pronuncation known, no tone change, neutral tone in second word',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎode',
        pronunciation: 'ˇ˙',
        definitions: 'good',
        status: WordStatus.tone,
      },
      settings
    },
  },
  {
    name: 'known',
    props: {
      word: {
        text: '好的',
        pinyin: 'hǎode',
        definitions: 'good',
        status: WordStatus.known,
      },
      settings
    },
  }
]

export const variants = [...base_variants]
