import type { Variant, Viewport } from 'kitbook'
import type Component from './EditWordStatus.svelte'
// import { variants as variants_from_chinese_word_component } from './ChineseWord.variants'

export const viewports: Viewport[] = [
  { width: 400, height: 100 },
]

export const variants: Variant<Component>[] = [
  // {
  //   name: 'English',
  //   props: {
  //     word: {
  //       text: 'math',
  //       phonetic: 'mæθ',
  //       definitions: 'n. 数学',
  //       views: 4,
  //     }
  //   },
  // },
  // {
  //   name: 'Chinese',
  //   props: {
  //     word: variants_from_chinese_word_component[0].props.word,
  //   }
  // }
]
