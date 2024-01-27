import { WordStatus, type Sentence } from '$lib/types'

export function combine_short_sentences(sentences: Sentence[], minimum_ms: number): Sentence[] {
  if (!sentences[0]?.translation?.en) return sentences

  const combined_sentences: Sentence[] = []
  let sentence_needing_buddy: Sentence

  for (const sentence of sentences) {
    if (sentence_needing_buddy) {
      const combined_sentence: Sentence = {
        text: sentence_needing_buddy.text + ' | ' + sentence.text,
        start_ms: sentence_needing_buddy.start_ms,
        end_ms: sentence.end_ms,
        translation: {},
        words: [...sentence_needing_buddy.words, {text: ' | '}, ...sentence.words],
      }
      if (sentence_needing_buddy.translation?.en && sentence.translation?.en)
        combined_sentence.translation.en = sentence_needing_buddy.translation.en + ' | ' + sentence.translation.en

      combined_sentences.push(combined_sentence)
      sentence_needing_buddy = null
    } else if (sentence.end_ms - sentence.start_ms < minimum_ms) {
      sentence_needing_buddy = sentence
    } else {
      combined_sentences.push(sentence)
    }
  }

  // orphaned last sentence
  if (sentence_needing_buddy)
    combined_sentences.push(sentence_needing_buddy)

  return combined_sentences
}

if (import.meta.vitest) {
  const sentence1: Sentence = {
    text: '我听见你说话了。',
    start_ms: 0,
    end_ms: 1000,
    translation: {
      en: 'I heard you speak.',
    },
    words: [
      {
        text: '我',
        pinyin: 'wǒ',
        definitions: ['I, me, my'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '听见',
        pinyin: 'tīng jiàn',
        definitions: ['heard with 22 ears and understood'].join('/'),
        status: WordStatus.unknown,
        neighbors_understood: true,
      },
      {
        text: '你',
        pinyin: 'nǐ',
        definitions: ['you'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '说话',
        pinyin: 'shuō huà',
        definitions: ['to speak, to say, to talk'].join('/'),
        status: WordStatus.unknown,
        neighbors_understood: true,
      },
      {
        text: '了',
        pinyin: 'le',
        definitions: ['(particle signifying the change of situation)'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '。',
      },
    ],
  }
  const sentence2: Sentence = {
    text: '你在做什么？',
    start_ms: 1000,
    end_ms: 2000,
    translation: {
      en: 'What are you doing?',
    },
    words: [
      {
        text: '你',
        pinyin: 'nǐ',
        definitions: ['you'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '在',
        pinyin: 'zài',
        definitions: ['at, in, on'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '做',
        pinyin: 'zuò',
        definitions: ['to do, to make'].join('/'),
        status: WordStatus.unknown,
      },
      {
        text: '什么',
        pinyin: 'shénme',
        definitions: ['what'].join('/'),
        status: WordStatus.known,
      },
      {
        text: '？',
      },
    ],
  }

  describe(combine_short_sentences, () => {
    test('combines sentences shorter than 2000ms', () => {
      const combined = combine_short_sentences([sentence1, sentence2], 2000)

      expect(combined).toHaveLength(1)
      expect(combined[0].text).toBe('我听见你说话了。 | 你在做什么？')
      expect(combined[0].start_ms).toBe(0)
      expect(combined[0].end_ms).toBe(2000)
      expect(combined[0].translation.en).toBe('I heard you speak. | What are you doing?')
      expect(combined[0].words).toHaveLength(sentence1.words.length + 1 + sentence2.words.length)
    })

    test('does not combine if no translation in first sentence', () => {
      const sentence1_without_translation = {...sentence1, translation: {}}
      const combined = combine_short_sentences([sentence1_without_translation, sentence2], 2000)

      expect(combined).toHaveLength(2)
      expect(combined[0].text).toBe('我听见你说话了。')
      expect(combined[1].text).toBe('你在做什么？')
    })

    // test('does not combine if there is a gap more than a second between sentences', () => {
    //   expect(combined).toHaveLength(2)
    //   expect(combined[0].text).toBe('我听见你说话了。')
    //   expect(combined[1].text).toBe('你在做什么？')
    // })
  })
}
