import { expose } from 'comlink'
import { get_english_to_chinese_dictionary } from './get-english-to-chinese-dictionary'
import { analyze_english_sentence } from './analyze-english-sentence'
import { analyze_english_sentences } from './analyze-english-sentences'
import type { ECDictEntry, EmphasisLimits, Sentence, UserVocabulary } from '$lib/types'
import type { LocaleCode } from '$lib/i18n/locales'

let dictionary: Record<string, ECDictEntry>
let user_vocabulary: UserVocabulary

async function set_worker_dictionary(mother: LocaleCode) {
  dictionary = await get_english_to_chinese_dictionary(mother)
  console.info('english-to-chinese dictionary loaded')
}

function set_user_vocabulary(vocabulary: UserVocabulary) {
  user_vocabulary = vocabulary
}

function resolve_when_ready(): Promise<boolean> {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (user_vocabulary && dictionary) {
        clearInterval(interval)
        resolve(true)
      }
    }, 50)
  })
}

const ready = resolve_when_ready()

async function split_english_string(text: string) {
  await ready
  return analyze_english_sentence({text, user_vocabulary, dictionary})
}

async function split_english_sentences({sentences}: { sentences: Sentence[] }): Promise<Sentence[]> {
  await ready
  return sentences.map(sentence => ({
    ...sentence,
    words: analyze_english_sentence({text: sentence.text, user_vocabulary, dictionary})
  }))
}

async function _analyze_english_sentences({sentences, emphasis_limits}: { sentences: Sentence[], emphasis_limits: EmphasisLimits}) {
  await ready
  return analyze_english_sentences({sentences, user_vocabulary, dictionary, emphasis_limits})
}

export const api = {
  set_user_vocabulary,
  set_worker_dictionary,
  split_english_string,
  split_english_sentences,
  analyze_english_sentences: _analyze_english_sentences,
}

expose(api)
