import { WordStatus, type AnalyzedChineseWord, type CEDictEntry, type UserVocabulary } from '$lib/types'
import { is_chinese } from '$lib/utils/is-chinese'
import { jieba_cut } from './jieba-wasm'

export function analyze_chinese_sentence({text, locale, user_vocabulary, dictionary}:
  {
    text: string,
    locale: 'zh-TW' | 'zh-CN',
    user_vocabulary: UserVocabulary,
    dictionary: Record<string, CEDictEntry>,
  }): AnalyzedChineseWord[] {
  if (!text) return []

  const words = jieba_cut(text, true)

  const analyzed_words: AnalyzedChineseWord[] = []
  for (const word of words) {
    if (!is_chinese(word)) {
      analyzed_words.push({ text: word })
      continue
    }

    const entry = dictionary[word]
    if (entry){
      analyzed_words.push(analyze_word(entry))
      continue
    }

    for (const character of word) {
      const entry = dictionary[character]
      if (entry) {
        analyzed_words.push(analyze_word(entry))
        continue
      }
      analyzed_words.push({ text: character })
    }
  }

  function analyze_word(entry: CEDictEntry) {
    const { traditional, simplified, pinyin, definitions } = entry

    const text = simplified && locale === 'zh-CN' ? simplified : traditional
    const status = user_vocabulary[text]?.status ?? WordStatus.unknown
    const views = user_vocabulary[text]?.views || 0

    const analyzed_word: AnalyzedChineseWord = {
      text,
      pinyin,
      definitions,
      status,
      views,
    }

    if (simplified)
      analyzed_word.opposite_script = locale === 'zh-CN' ? traditional : simplified

    return analyzed_word
  }


  return analyzed_words
  // TODO: add neighbor_shows_definition boolean
}

if (import.meta.vitest) {
  describe(analyze_chinese_sentence, () => {
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
      '大': {
        traditional: '大',
        pinyin: 'dà',
        definitions: 'big/huge',
      },
      '家': {
        traditional: '家',
        pinyin: 'jiā',
        definitions: 'home/family',
      },
    }

    const user_vocabulary: UserVocabulary = {
      '你好': {
        status: WordStatus.tone,
        views: 3,
      },
    }

    test('basic', () => {
      const sentence = '你好老師！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      const expected: AnalyzedChineseWord[] = [
        {
          'text': '你好',
          'pinyin': 'nǐ hǎo',
          'status': WordStatus.tone,
          definitions: 'hello',
          // 'tone_change': true,
          views: 3,
        },
        {
          'text': '老师',
          'opposite_script': '老師',
          'pinyin': 'lǎo shī',
          'status': WordStatus.unknown,
          definitions: 'teacher/instructor',
          views: 0,
        },
        {
          'text': '！',
        },
      ]
      expect(result).toEqual(expected)
    })

    test('word not found in dictionary is split into characters', () => {
      const sentence = '你好，大家！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      const expected: AnalyzedChineseWord[] = [
        {
          'text': '你好',
          definitions: 'hello',
          'pinyin': 'nǐ hǎo',
          'status': WordStatus.tone,
          views: 3,
        },
        {
          'text': '，',
        },
        {
          'text': '大',
          definitions: 'big/huge',
          'pinyin': 'dà',
          'status': WordStatus.unknown,
          views: 0,
        },
        {
          'text': '家',
          definitions: 'home/family',
          'pinyin': 'jiā',
          'status': WordStatus.unknown,
          views: 0,
        },
        {
          'text': '！',
        },
      ]
      expect(result).toEqual(expected)
    })

    test('English intermixed', () => {
      const sentence = '你好, John!'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      expect(result).toEqual([
        {
          definitions: 'hello',
          'pinyin': 'nǐ hǎo',
          'status': 2,
          'text': '你好',
          views: 3,
        },
        {
          'text': ',',
        },
        {
          'text': ' ',
        },
        {
          'text': 'John',
        },
        {
          'text': '!',
        },
      ])
    })

    test('Handles words/characters not in dictionary', () => {
      const sentence = '大家好'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary: {}})
      expect(result).toEqual([
        { 'text': '大' },
        { 'text': '家' },
        { 'text': '好' },
      ])
    })

    test('status based off script being shown, not underlying word', () => {
      const sentence = '你好老師！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary: { 老师: { status: WordStatus.known } }, dictionary})
      expect(result[1]).toEqual(
        {
          'text': '老师',
          'opposite_script': '老師',
          'pinyin': 'lǎo shī',
          'status': WordStatus.known,
          definitions: 'teacher/instructor',
          views: 0,
        })
    })
  })
}



