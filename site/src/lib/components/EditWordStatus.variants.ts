import type { Variant, Viewport } from 'kitbook'
import type Component from './EditWordStatus.svelte'
import {variants as variants_from_chinese_word_component} from './ChineseWord.variants'

export const viewports: Viewport[] = [
  { width: 320, height: 150}
]

export const variants: Variant<Component>[] = [
  ...variants_from_chinese_word_component,
]

