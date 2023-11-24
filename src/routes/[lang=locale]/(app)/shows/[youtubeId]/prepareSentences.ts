import { myKnown } from '$lib/mocks/knownWords'
import type { CEDictEntry, Sentence } from '$lib/types'

function is中文(text: string): boolean {
  const 中文 = /[\u4E00-\u9FA5]+/
  return 中文.test(text)
}

export function prepareSentences(sentences: Sentence[], dictionary: Record<string, CEDictEntry>): Sentence[] {
  return sentences.map(sentence => {
    if (sentence.syntax) {
      return {
        ...sentence,
        words: sentence.syntax.tokens?.map(token => {
          return {
            partOfSpeechTag: token.partOfSpeech?.tag as string,
            ...prepareWord(token.text?.content, dictionary)
          }
        })
      }
    }

    return {
      ...sentence,
      words: sentence.text.split('').map(w => prepareWord(w, dictionary))
    }
  })
}

function prepareWord(text: string, dictionary: Record<string, CEDictEntry>): Sentence['words'][0] {
  const isChinese = is中文(text)
  // const highChance = Math.random() < 0.90
  let pronunciation = ''
  if (isChinese) {
    if (dictionary[text])
      pronunciation = dictionary[text].pinyin
    else
      pronunciation = text.split('').map(c => dictionary[c]?.pinyin || '').join(' ')
  }
  return {
    text,
    known: !isChinese || myKnown.has(text),
    language: isChinese ? 'zh' : 'other',
    pronunciation,
  }
}
