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
  const ninetySevenPercentChance = Math.random() < 0.93
  let pronunciation = ''
  if (isChinese) {
    if (dictionary[text])
      pronunciation = dictionary[text].pinyin
    else
      pronunciation = text.split('').map(c => dictionary[c]?.pinyin || '').join(' ')
  }
  return {
    text,
    known: !isChinese || ninetySevenPercentChance,
    language: isChinese ? 'zh' : 'other',
    pronunciation,
  }
}
