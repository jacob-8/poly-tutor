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
  const words = jieba_cut(text, true)

  const analyzed_words: AnalyzedChineseWord[] = []
  for (const word of words) {
    if (!is_chinese(word)) {
      analyzed_words.push({ text: word })
      continue
    }

    const entry = dictionary[word]
    if (entry){
      analyzed_words.push(analyze_word(word, entry))
      continue
    }

    for (const character of word) {
      const entry = dictionary[character]
      if (entry) {
        analyzed_words.push(analyze_word(character, entry))
        continue
      }
      analyzed_words.push({ text: character })
    }
  }

  function analyze_word(word:string, entry: CEDictEntry) {
    const { traditional, simplified, pinyin, tones, definitions_array } = entry

    const text = simplified && locale === 'zh-CN' ? simplified : traditional
    const status = user_vocabulary[text]?.status ?? WordStatus.unknown

    const analyzed_word: AnalyzedChineseWord = {
      text,
      pinyin,
      pronunciation: pinyin.replace(' ', ''),
      definitions_array,
      status,
    }

    if (simplified)
      analyzed_word.opposite_script = locale === 'zh-CN' ? traditional : simplified

    if (status === WordStatus.tone) {
      analyzed_word.pronunciation = tones.map(number => {
        if (number === 1) return 'ˉ'
        if (number === 2) return 'ˊ'
        if (number === 3) return 'ˇ'
        if (number === 4) return 'ˋ'
        if (number === 5) return '˙'
      }).join('')
    }
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
        tones: [3, 3],
        definitions: 'hello',
        definitions_array: ['hello'],
      },
      '老師': {
        traditional: '老師',
        simplified: '老师',
        pinyin: 'lǎo shī',
        tones: [3, 1],
        definitions: 'teacher/instructor',
        definitions_array: ['teacher', 'instructor'],
      },
      '大': {
        traditional: '大',
        pinyin: 'dà',
        tones: [4],
        definitions: 'big/huge',
        definitions_array: ['big', 'huge'],
      },
      '家': {
        traditional: '家',
        pinyin: 'jiā',
        tones: [1],
        definitions: 'home/family',
        definitions_array: ['home', 'family'],
      },
    }

    const user_vocabulary: UserVocabulary = {
      '你好': {
        status: WordStatus.tone,
      },
    }

    test('basic', () => {
      const sentence = '你好老師！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      expect(result).toEqual([
        {
          'text': '你好',
          'pinyin': 'nǐ hǎo',
          'status': WordStatus.tone,
          'pronunciation': 'ˇˇ',
          definitions_array: ['hello'],
          // 'tone_change': true,
        },
        {
          'text': '老师',
          'opposite_script': '老師',
          'pinyin': 'lǎo shī',
          'status': WordStatus.unknown,
          'pronunciation': 'lǎoshī',
          definitions_array: ['teacher', 'instructor'],
        },
        {
          'text': '！',
        },
      ])
    })

    test('word not found in dictionary is split into characters', () => {
      const sentence = '你好，大家！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      expect(result).toEqual([
        {
          'text': '你好',
          definitions_array: ['hello'],
          'pinyin': 'nǐ hǎo',
          'pronunciation': 'ˇˇ',
          'status': WordStatus.tone,
        },
        {
          'text': '，',
        },
        {
          'text': '大',
          definitions_array: ['big', 'huge'],
          'pinyin': 'dà',
          'pronunciation': 'dà',
          'status': WordStatus.unknown,
        },
        {
          'text': '家',
          definitions_array: ['home', 'family'],
          'pinyin': 'jiā',
          'pronunciation': 'jiā',
          'status': WordStatus.unknown,
        },
        {
          'text': '！',
        },
      ])
    })

    test('English intermixed', () => {
      const sentence = '你好, John!'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      expect(result).toEqual([
        {
          definitions_array: ['hello'],
          'pinyin': 'nǐ hǎo',
          'pronunciation': 'ˇˇ',
          'status': 2,
          'text': '你好',
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
          'pronunciation': 'lǎoshī',
          definitions_array: ['teacher', 'instructor'],
        })
    })
  })
}



