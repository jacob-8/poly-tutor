import { WordStatus, type Section, type UserVocabulary } from '$lib/types'

export function emphasize_chinese_words({ section, user_vocabulary, common_in_this_context_max, high_view_count_max, improve_pronunciation_or_tone_max}: { section: Section, user_vocabulary: UserVocabulary, high_view_count_max: number, common_in_this_context_max: number, improve_pronunciation_or_tone_max: number}): Section {
  const words = section.sentences.flatMap(sentence => sentence.words)

  const unknown_words_with_count = {} as Record<string, number>
  const learning_pronunciation_with_count = {} as Record<string, number>

  for (const {text, status} of words) {
    if (status === undefined) continue // weeds out non-Chinese words
    if (status === WordStatus.known) continue

    if (status === WordStatus.tone || status === WordStatus.pronunciation) {
      if (text in learning_pronunciation_with_count)
        learning_pronunciation_with_count[text]++
      else
        learning_pronunciation_with_count[text] = 1
      continue
    }

    if (text in unknown_words_with_count)
      unknown_words_with_count[text]++
    else
      unknown_words_with_count[text] = 1
  }

  // find the top words in this context
  const sorted_context_words = Object.entries(unknown_words_with_count).sort(([,a], [,b]) => b - a)

  const top_context_words = sorted_context_words.slice(0, common_in_this_context_max).map(([word]) => word)

  // then add user's view counts and find their top words
  for (const [word, {views}] of Object.entries(user_vocabulary)) {
    if (word in unknown_words_with_count && views)
      unknown_words_with_count[word] += views
  }

  const sorted_user_words = Object.entries(unknown_words_with_count).sort(([,a], [,b]) => b - a)

  const top_user_words = sorted_user_words.slice(0, high_view_count_max).map(([word]) => word)


  const sorted_improve_words = Object.entries(learning_pronunciation_with_count).sort(([,a], [,b]) => b - a)

  const top_improve_words = sorted_improve_words.slice(0, improve_pronunciation_or_tone_max).map(([word]) => word)


  for (const sentence of section.sentences) {
    for (const word of sentence.words) {
      if (top_user_words.includes(word.text)) {
        word.high_view_count = true
        continue
      }
      if (top_context_words.includes(word.text)) {
        word.common_in_this_context = true
        continue
      }
      if (top_improve_words.includes(word.text))
        // @ts-ignore
        word.improve_pronunciation_or_tone = true
    }
  }

  return section
}

if (import.meta.vitest) {
  describe(emphasize_chinese_words, () => {
    const user_vocabulary: UserVocabulary = {
      '你好': {
        // status: WordStatus.unknown,
        views: 3,
      },
      '嗎': {
        status: WordStatus.tone,
        views: 10,
      },
      '老師': {
        status: WordStatus.unknown,
        views: 4,
      },
      '大家': {
        status: WordStatus.unknown,
        // views: 1,
      },
    }

    test('marks high_view_count based on user vocab + context, then marks words as common if not already high_view, and also denotes the most common words to improve', () => {
      const result = emphasize_chinese_words({ section: {
        sentences: [
          { text: '你好嗎',
            words: [
              { text: '你好', status: WordStatus.unknown },
              { text: '嗎', status: WordStatus.tone },
            ]},
          { text: '你好，老師！',
            words: [
              { text: '你好', status: WordStatus.unknown },
              { text: '，' },
              { text: '老師', status: WordStatus.unknown },
              { text: '！' },
            ]},
          { text: '你好，大家！',
            words: [
              { text: '你好', status: WordStatus.unknown },
              { text: '，' },
              { text: '大家', status: WordStatus.unknown },
              { text: '！' },
            ]},
        ]
      }, user_vocabulary, high_view_count_max: 1, common_in_this_context_max: 2, improve_pronunciation_or_tone_max: 1 })

      const expected: Section = {
        sentences: [
          { text: '你好嗎',
            words: [
              { text: '你好', status: WordStatus.unknown, high_view_count: true },
              { text: '嗎', status: WordStatus.tone, improve_pronunciation_or_tone: true },
            ]},
          { text: '你好，老師！',
            words: [
              { text: '你好', status: WordStatus.unknown, high_view_count: true  },
              { text: '，' },
              { text: '老師', status: WordStatus.unknown, common_in_this_context: true },
              { text: '！' },
            ]},
          { text: '你好，大家！',
            words: [
              { text: '你好', status: WordStatus.unknown, high_view_count: true  },
              { text: '，' },
              { text: '大家', status: WordStatus.unknown },
              { text: '！' },
            ]},
        ]
      }
      expect(result).toEqual(expected)
    })
  })
}
