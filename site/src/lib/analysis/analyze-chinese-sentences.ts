import { WordStatus, type AnalyzedChineseWord, type CEDictEntry, type ChineseEmphasisLimits, type Sentence, type UserVocabulary, type StudyWords } from '$lib/types'
import { analyze_chinese_sentence } from './analyze-chinese-sentence'

export function analyze_chinese_sentences({ sentences, user_vocabulary, dictionary, locale, emphasis_limits }: { sentences: Sentence[], user_vocabulary: UserVocabulary, dictionary: Record<string, CEDictEntry>, locale: 'zh-TW' | 'zh-CN', emphasis_limits: ChineseEmphasisLimits }): { sentences: Sentence[], study_words: StudyWords } {
  const { common_in_this_context_max, high_view_count_max, improve_pronunciation_or_tone_max } = emphasis_limits
  // benchmark do views add just when first placing in a count object instead of in analyzing chinese sentences?

  const learning_pronunciation_with_count = {} as Record<string, AnalyzedChineseWord>
  const unknown_words_with_count = {} as Record<string, AnalyzedChineseWord>

  const analyzed_sentences = sentences.map((sentence, index) => {
    const words = analyze_chinese_sentence({text: sentence.text, locale, user_vocabulary, dictionary})
    for (const word of words)
      add_to_counts(word, index)
    return { ...sentence, words }
  })

  function add_to_counts(word: AnalyzedChineseWord, sentence_index: number) {
    if (word.status === undefined || word.status === WordStatus.known || word.status === WordStatus.wordlist) return // skip non-Chinese word and known words

    if (word.status === WordStatus.tone || word.status === WordStatus.pronunciation) {
      if (word.text in learning_pronunciation_with_count)
        learning_pronunciation_with_count[word.text].context_sentence_indexes.push(sentence_index)
      else
        learning_pronunciation_with_count[word.text] = { ...word, context_sentence_indexes: [sentence_index] }
      return
    }

    if (word.text in unknown_words_with_count)
      unknown_words_with_count[word.text].context_sentence_indexes.push(sentence_index)
    else
      unknown_words_with_count[word.text] = { ...word, context_sentence_indexes: [sentence_index] }
  }

  const unknown_more_than_once = Object.values(unknown_words_with_count)
    .filter((word) => word.context_sentence_indexes.length > 1 || word.views > 1)

  const unknown_sorted_by_user_views = unknown_more_than_once.sort((a, b) => b.views - a.views)

  const high_view_count = unknown_sorted_by_user_views
    .slice(0, high_view_count_max)
    .filter((word) => word.views > 1)

  const common_in_this_context = unknown_sorted_by_user_views
    .slice(high_view_count.length)
    .sort((a, b) => b.context_sentence_indexes.length - a.context_sentence_indexes.length)
    .slice(0, common_in_this_context_max)

  const improve_pronunciation_or_tone = Object.values(learning_pronunciation_with_count)
    .filter((word) => word.context_sentence_indexes.length > 1)
    .sort((a ,b) => b.views - a.views)
    .slice(0, improve_pronunciation_or_tone_max)

  return { sentences: analyzed_sentences, study_words: { high_view_count, common_in_this_context, improve_pronunciation_or_tone }}
}

// .reduce<Record<string, AnalyzedChineseWord>>((acc, [key, value]) => {
//   acc[key] = { ...value, high_view_count: true }
//   return acc
// }, {})

if (import.meta.vitest) {
  describe(analyze_chinese_sentences, () => {
    const dictionary: Record<string, CEDictEntry> = {
      '你好': {
        traditional: '你好',
        pinyin: 'nǐ hǎo',
        definitions: 'hello',
      },
      '老師': {
        traditional: '老師',
        simplified: '老师',
        pinyin: 'lǎo shī',
        definitions: 'teacher/instructor',
      },
      '大家': {
        traditional: '大家',
        pinyin: 'dà jiā',
        definitions: 'everyone',
      },
      '嗎': {
        traditional: '嗎',
        simplified: '吗',
        pinyin: 'ma',
        definitions: 'question tag',
      },
      '我': {
        traditional: '我',
        pinyin: 'wǒ',
        definitions: 'I/me',
      },
    }

    const user_vocabulary: UserVocabulary = {
      '你好': {
        status: WordStatus.unknown,
        views: 3,
      },
      '老師': {
        status: WordStatus.unknown,
        views: 4,
      },
      '大家': {
        status: WordStatus.unknown,
        views: 0,
      },
      '我': {
        status: WordStatus.wordlist,
        views: 20,
      },
      '嗎': {
        status: WordStatus.tone,
        views: 10,
      },
    }
    test('words are only placed into high view count if they have previously been seen at least twice', () => {
      const result = analyze_chinese_sentences({ sentences: [
        { text: '大家！'},
        { text: '大家！'},
      ], emphasis_limits: { high_view_count_max: 1, common_in_this_context_max: 1, improve_pronunciation_or_tone_max: 1 },
      dictionary, user_vocabulary, locale: 'zh-TW'
      })

      expect(result.study_words.high_view_count).toHaveLength(0)
      expect(result.study_words.common_in_this_context).toHaveLength(1)

      // expect(result.study_words).toMatchInlineSnapshot(`
      //   {
      //     "common_in_this_context": [],
      //     "high_view_count": [
      //       {
      //         "context_sentence_indexes": [
      //           0,
      //           1,
      //         ],
      //         "definitions": "everyone",
      //         "pinyin": "dà jiā",
      //         "status": 0,
      //         "text": "大家",
      //         "views": 0,
      //       },
      //     ],
      //     "improve_pronunciation_or_tone": [],
      //   }
      // `)
    })

    test('high view count from previous user views, common in this context next, and then improve pronunciation', () => {
      const result = analyze_chinese_sentences({ sentences: [
        { text: '你好嗎'},
        { text: '你好嗎'},
        { text: '你好，我老師！'},
        { text: '你好，老師！'},
        { text: '你好，大家！'},
        { text: '你好，大家！'},
      ], emphasis_limits: { high_view_count_max: 1, common_in_this_context_max: 2, improve_pronunciation_or_tone_max: 1 },
      dictionary, user_vocabulary, locale: 'zh-TW'
      })

      expect(result.study_words).toMatchInlineSnapshot(`
        {
          "common_in_this_context": [
            {
              "context_sentence_indexes": [
                0,
                1,
                2,
                3,
                4,
                5,
              ],
              "definitions": "hello",
              "pinyin": "nǐ hǎo",
              "status": 0,
              "text": "你好",
              "views": 3,
            },
            {
              "context_sentence_indexes": [
                4,
                5,
              ],
              "definitions": "everyone",
              "pinyin": "dà jiā",
              "status": 0,
              "text": "大家",
              "views": 0,
            },
          ],
          "high_view_count": [
            {
              "context_sentence_indexes": [
                2,
                3,
              ],
              "definitions": "teacher/instructor",
              "opposite_script": "老师",
              "pinyin": "lǎo shī",
              "status": 0,
              "text": "老師",
              "views": 4,
            },
          ],
          "improve_pronunciation_or_tone": [
            {
              "context_sentence_indexes": [
                0,
                1,
              ],
              "definitions": "question tag",
              "opposite_script": "吗",
              "pinyin": "ma",
              "status": 2,
              "text": "嗎",
              "views": 10,
            },
          ],
        }
      `)
    })
  })
}
