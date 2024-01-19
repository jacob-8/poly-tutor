import { expose } from 'comlink'
import { get_english_to_chinese_dictionary } from './get-english-to-chinese-dictionary'
import { analyze_english_sentence } from './analyze-english-sentence'
import { analyze_english_sentences } from './analyze-english-sentences'
import type { ECDictEntry, EmphasisLimits, Sentence, UserVocabulary } from '$lib/types'

const english_to_chinese_dictionary = get_english_to_chinese_dictionary()
english_to_chinese_dictionary.then(() => {
  console.info('english-to-chinese dictionary loaded')
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

async function worker_ready(): Promise<Record<string, ECDictEntry>> {
  const [dictionary] = await Promise.all([
    english_to_chinese_dictionary,
    vocabulary_ready(),
  ])
  return dictionary
}

async function split_english_string(text: string) {
  const dictionary = await worker_ready()
  return analyze_english_sentence({text, user_vocabulary, dictionary})
}

async function split_english_sentences({sentences}: { sentences: Sentence[] }): Promise<Sentence[]> {
  const dictionary = await worker_ready()
  return sentences.map(sentence => ({
    ...sentence,
    words: analyze_english_sentence({text: sentence.text, user_vocabulary, dictionary})
  }))
}

async function _analyze_english_sentences({sentences, emphasis_limits}: { sentences: Sentence[], emphasis_limits: EmphasisLimits}) {
  const dictionary = await worker_ready()
  return analyze_english_sentences({sentences, user_vocabulary, dictionary, emphasis_limits})
}

export const api = {
  set_user_vocabulary,
  split_english_string,
  split_english_sentences,
  analyze_english_sentences: _analyze_english_sentences,
}

expose(api)
