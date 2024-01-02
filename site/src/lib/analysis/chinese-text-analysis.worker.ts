import init from 'jieba-wasm/pkg/web/jieba_rs_wasm.js'
import { expose } from 'comlink'
import { jieba_cut } from './jieba-wasm'
import { analyze_chinese_sentence } from './analyze'
import type { Section, UserVocabulary } from '$lib/types'
import { emphasize_chinese_words } from './emphasize'
import { get_chinese_to_english_dictionary } from './get-chinese-to-english-dictionary'

const jieba_ready = init('/jieba_rs_wasm_bg.wasm')

jieba_ready.then(() => {
  console.info('jieba-wasm loaded')
})

async function segment(text: string) {
  await jieba_ready
  return jieba_cut(text, true)
}

const chinese_to_english_dictionary = get_chinese_to_english_dictionary()
chinese_to_english_dictionary.then(() => {
  console.info('chinese to english dictionary loaded')
})

let user_vocabulary: UserVocabulary

function set_user_vocabulary(vocabulary: UserVocabulary) {
  user_vocabulary = vocabulary
}

function vocabulary_ready(): Promise<boolean> {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (user_vocabulary) {
        clearInterval(interval)
        resolve(true)
      }
    }, 50)
  })
}

async function analyze_chinese(text: string, locale: 'zh-TW' | 'zh-CN') {
  const [dictionary] = await Promise.all([
    chinese_to_english_dictionary,
    jieba_ready,
    vocabulary_ready(),
  ])
  return analyze_chinese_sentence({text, locale, user_vocabulary, dictionary})
}

function emphasize_chinese(args: { section: Section, high_view_count_max: number, common_in_this_context_max: number, improve_pronunciation_or_tone_max: number}) {
  return emphasize_chinese_words({...args, user_vocabulary})
}

export const api = {
  set_user_vocabulary,
  segment, // probably won't use but easy to expose
  analyze_chinese,
  emphasize_chinese,
}

expose(api)
