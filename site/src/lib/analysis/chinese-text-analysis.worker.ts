import init from 'jieba-wasm/pkg/web/jieba_rs_wasm.js'
import { expose } from 'comlink'
import { jieba_cut } from './jieba-wasm'
import { analyze_chinese_sentence } from './analyze-chinese-sentence'
import { analyze_chinese_sentences } from './analyze-chinese-sentences'
import type { CEDictEntry, ChineseEmphasisLimits, Sentence, UserVocabulary } from '$lib/types'
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
  if (vocabulary)
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

async function worker_ready(): Promise<Record<string, CEDictEntry>> {
  const [dictionary] = await Promise.all([
    chinese_to_english_dictionary,
    jieba_ready,
    vocabulary_ready(),
  ])
  return dictionary
}

async function split_chinese_string(text: string, locale: 'zh-TW' | 'zh-CN') {
  const dictionary = await worker_ready()
  return analyze_chinese_sentence({text, locale, user_vocabulary, dictionary})
}

async function split_chinese_sentences({sentences, locale}: { sentences: Sentence[], locale: 'zh-TW' | 'zh-CN' }): Promise<Sentence[]> {
  const dictionary = await worker_ready()
  return sentences.map(sentence => ({
    ...sentence,
    words: analyze_chinese_sentence({text: sentence.text, locale, user_vocabulary, dictionary})
  }))
}

async function _analyze_chinese_sentences({sentences, locale, emphasis_limits}: { sentences: Sentence[], locale: 'zh-TW' | 'zh-CN', emphasis_limits: ChineseEmphasisLimits}) {
  const dictionary = await worker_ready()
  return analyze_chinese_sentences({sentences, locale, user_vocabulary, dictionary, emphasis_limits})
}

export const api = {
  set_user_vocabulary,
  segment,
  split_chinese_string,
  split_chinese_sentences,
  analyze_chinese_sentences: _analyze_chinese_sentences,
}

expose(api)
