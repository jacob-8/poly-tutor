import type { Sentence } from '$lib/types'

export function merge_syntax(syntax: Sentence['syntax'], sentences: Sentence[]): Sentence[] {
  let tokenIndex = 0
  const mergedSentences = sentences.map(sentence => {
    const sentenceTokens: Sentence['syntax']['tokens'] = []

    let textNeedingMatched = sentence.text

    while (tokenIndex < syntax.tokens.length && textNeedingMatched.length > 0) {
      const token = syntax.tokens[tokenIndex]
      const contentWithoutPrecedingLineStuff = token.text.content.replace(/.+\n/, '')
      if (textNeedingMatched.startsWith(contentWithoutPrecedingLineStuff)) {
        sentenceTokens.push({
          ...token,
          text: {
            ...token.text,
            content: contentWithoutPrecedingLineStuff,
          }
        })
        textNeedingMatched = textNeedingMatched.substring(contentWithoutPrecedingLineStuff.length).trim()
        tokenIndex++
      } else {
        break
      }
    }

    if (!sentenceTokens.length) return sentence
    return {
      ...sentence,
      syntax: { tokens: sentenceTokens }
    }
  })

  return mergedSentences
}

if (import.meta.vitest) {
  describe(merge_syntax, () => {
    test('does not add syntax property if no syntax results', () => {
      const sentences: Sentence[] = [{ text: 'Hi Bob'}]
      expect(merge_syntax({tokens: []}, sentences)).toEqual(sentences)
    })

    test('trims off remnant of previous line if brought forward by syntax analysis', () => {
      const syntax: Sentence['syntax'] = {
        tokens: [
          { text: { content: '下\n越' } },
          { text: { content: '下面' } },
          { text: { content: '的' } },
          { text: { content: '模型' } },
          { text: { content: '呢' } },
        ]
      }
      const sentences: Sentence[] = [{ text: '越下面的模型呢'}]
      const expected: Sentence[] = [{
        text: '越下面的模型呢',
        syntax: {
          tokens: [
            { text: { content: '越' } },
            { text: { content: '下面' } },
            { text: { content: '的' } },
            { text: { content: '模型' } },
            { text: { content: '呢' } },
          ]
        },
      }]
      expect(merge_syntax(syntax, sentences)).toEqual(expected)
    })

    test('adds on syntax without taking tokens from next sentence', () => {
      const syntax: Sentence['syntax'] = {
        tokens: [
          { text: { content: '今天' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: '我的' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: '導師' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: 'is' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: 'tall' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: '今天' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: '他的' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: '導師' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: 'is' }, partOfSpeech: { tag: 'NOUN' } },
          { text: { content: 'tall' }, partOfSpeech: { tag: 'NOUN' } },
        ]
      }

      const sentences: Sentence[] = [{
        text: '今天我的導師is tall',
        translation: {
          en: 'My tutor is tall today',
        }
      },
      {
        text: '今天他的導師is tall',
        translation: {
          en: 'His tutor is tall today',
        }
      }]

      const expected: Sentence[] = [{
        text: '今天我的導師is tall',
        syntax: {
          tokens: [
            { text: { content: '今天' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: '我的' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: '導師' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: 'is' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: 'tall' }, partOfSpeech: { tag: 'NOUN' } },
          ]
        },
        translation: {
          en: 'My tutor is tall today',
        }
      },
      {
        text: '今天他的導師is tall',
        syntax: {
          tokens: [
            { text: { content: '今天' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: '他的' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: '導師' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: 'is' }, partOfSpeech: { tag: 'NOUN' } },
            { text: { content: 'tall' }, partOfSpeech: { tag: 'NOUN' } },
          ]
        },
        translation: {
          en: 'His tutor is tall today',
        }
      }]
      expect(merge_syntax(syntax, sentences)).toEqual(expected)
    })
  })
}
