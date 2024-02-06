import { chinese_word_lists } from './chinese-word-lists'
import { english_word_lists } from './english-word-lists'
import type { ChineseWordList, EnglishWordList } from './word-lists.interface'

export const word_lists: Record<ChineseWordList | EnglishWordList, string[]> = {
  ...chinese_word_lists,
  ...english_word_lists,
}
