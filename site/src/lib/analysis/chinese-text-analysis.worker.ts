import init from 'jieba-wasm/pkg/web/jieba_rs_wasm.js'
import { expose } from 'comlink'
import { jieba_cut } from './jieba-wasm'
import { analyze_chinese_sentence } from './analyze'
import type { ChineseEmphasisLimits, Sentence, UserVocabulary } from '$lib/types'
import { emphasize_chinese_sentences } from './emphasize'
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
  console.info('chinese-to-english dictionary loaded')
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

async function analyze_chinese_string(text: string, locale: 'zh-TW' | 'zh-CN') {
  const [dictionary] = await Promise.all([
    chinese_to_english_dictionary,
    jieba_ready,
    vocabulary_ready(),
  ])
  return analyze_chinese_sentence({text, locale, user_vocabulary, dictionary})
}

async function analyze_chinese_sentences(sentences: Sentence[], locale: 'zh-TW' | 'zh-CN'): Promise<Sentence[]> {
  const [dictionary] = await Promise.all([
    chinese_to_english_dictionary,
    jieba_ready,
    vocabulary_ready(),
  ])
  return sentences.map(sentence => {
    sentence.words = analyze_chinese_sentence({text: sentence.text, locale, user_vocabulary, dictionary})
    return sentence
  })
}

async function analyze_and_emphasize_chinese_sentences({sentences, locale, limits}: { sentences: Sentence[], locale: 'zh-TW' | 'zh-CN', limits?: ChineseEmphasisLimits}) {
  const analyzed_sentences = await analyze_chinese_sentences(sentences, locale)
  return emphasize_chinese_sentences({sentences: analyzed_sentences, limits, user_vocabulary})
}

export const api = {
  set_user_vocabulary,
  segment,
  analyze_chinese_string,
  analyze_chinese_sentences,
  analyze_and_emphasize_chinese_sentences,
}

expose(api)
