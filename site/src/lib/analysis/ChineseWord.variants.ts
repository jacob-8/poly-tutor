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
        pronunciation: 'tīngjiàn',
        definition: 'heard',
        status: WordStatus.unknown,
        high_view_count: true,
      },
      settings
    },
  },
  {
    name: 'Unknown, notice',
    props: {
      word: {
        text: '好的',
        pronunciation: 'hǎode',
        definition: 'good',
        status: WordStatus.unknown,
        common_in_this_context: true,
      },
      settings
    },
  },
  {
    name: 'meaning known, tone change',
    props: {
      word: {
        text: '你好',
        pronunciation: 'nǐhǎo',
        tone_change: true,
        definition: 'hello',
        status: WordStatus.pronunciation,
        neighbor_shows_definition: true,
      },
      settings
    },
  },
  {
    name: 'pronuncation known, time to improve, tone change',
    props: {
      word: {
        text: '你好',
        pronunciation: 'ˇˇ',
        tone_change: true,
        definition: 'hello',
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
        pronunciation: 'ˇ˙',
        definition: 'good',
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
        definition: 'good',
        status: WordStatus.known,
      },
      settings
    },
  }
]

export const variants = [...base_variants]
