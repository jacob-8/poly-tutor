import { WordStatus, type ChineseEmphasisLimits, type Sentence } from '$lib/types'

export function emphasize_chinese_sentences({ sentences, limits }: { sentences: Sentence[], limits?: ChineseEmphasisLimits}): Sentence[] {
  const {common_in_this_context_max, high_view_count_max, improve_pronunciation_or_tone_max} = limits || {
    common_in_this_context_max: 5,
    high_view_count_max: 5,
    improve_pronunciation_or_tone_max: 5,
  }
  const words = sentences.flatMap(sentence => sentence.words)

  const unknown_words_with_count = {} as Record<string, number>
  const learning_pronunciation_with_count = {} as Record<string, number>

  for (const {text, status} of words) {
    if (status === undefined) continue // weeds out non-Chinese words
    if (status === WordStatus.known || status === WordStatus.wordlist) continue

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

  // then add the user's prior view counts and find their top words
  const unique_words = words.filter((word, index, self) =>
    index === self.findIndex((w) => w.text === word.text)
  )
  for (const { text, user_views } of unique_words) {
    if (text in unknown_words_with_count)
      unknown_words_with_count[text] += user_views
  }

  const sorted_user_words = Object.entries(unknown_words_with_count).sort(([,a], [,b]) => b - a)

  const top_user_words = sorted_user_words.slice(0, high_view_count_max).map(([word]) => word)


  const sorted_improve_words = Object.entries(learning_pronunciation_with_count).sort(([,a], [,b]) => b - a)

  const top_improve_words = sorted_improve_words.slice(0, improve_pronunciation_or_tone_max).map(([word]) => word)


  const emphasized_sentences = sentences.map(sentence =>  {
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
    return sentence
  })

  return emphasized_sentences
}

if (import.meta.vitest) {
  describe(emphasize_chinese_sentences, () => {
    test('marks high_view_count based on user vocab + context, then marks words as common if not already high_view, and also denotes the most common words to improve', () => {
      const result = emphasize_chinese_sentences({ sentences: [
        { text: '你好嗎',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3 },
            { text: '嗎', status: WordStatus.tone, user_views: 10 },
          ]},
        { text: '你好，我老師！',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3 },
            { text: '，' },
            { text: '我', status: WordStatus.wordlist, user_views: 20 },
            { text: '老師', status: WordStatus.unknown, user_views: 4 },
            { text: '！' },
          ]},
        { text: '你好，大家！',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3 },
            { text: '，' },
            { text: '大家', status: WordStatus.unknown, user_views: 0 },
            { text: '！' },
          ]},
      ], limits: { high_view_count_max: 1, common_in_this_context_max: 2, improve_pronunciation_or_tone_max: 1 }})

      const expected: Sentence[] = [
        { text: '你好嗎',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true },
            { text: '嗎', status: WordStatus.tone, user_views: 10, improve_pronunciation_or_tone: true },
          ]},
        { text: '你好，我老師！',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true  },
            { text: '，' },
            { text: '我', status: WordStatus.wordlist, user_views: 20 },
            { text: '老師', status: WordStatus.unknown, user_views: 4, common_in_this_context: true },
            { text: '！' },
          ]},
        { text: '你好，大家！',
          words: [
            { text: '你好', status: WordStatus.unknown, user_views: 3, high_view_count: true  },
            { text: '，' },
            { text: '大家', status: WordStatus.unknown, user_views: 0 },
            { text: '！' },
          ]},
      ]
      expect(result).toEqual(expected)
    })
  })
}
