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
      analyzed_words.push({
        text: word,
      })
      continue
    }

    const entry = dictionary[word]
    if (!entry){
      for (const character of word)
        analyzed_words.push(analyze_word(character, dictionary[character]))

      continue
    }

    analyzed_words.push(analyze_word(word, entry))
  }

  function analyze_word(word:string, entry: CEDictEntry) {
    const { traditional, simplified, pinyin, tones, definitions_array } = entry
    const status = user_vocabulary[word]?.status ?? WordStatus.unknown

    const analyzed_word: AnalyzedChineseWord = {
      text: simplified && locale === 'zh-CN' ? simplified : traditional,
      pinyin,
      pronunciation: pinyin,
      definition: definitions_array.join(' • '),
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
        pinyin: 'nǐhǎo',
        tones: [3, 3],
        definitions: 'hello',
        definitions_array: ['hello'],
      },
      '老師': {
        traditional: '老師',
        simplified: '老师',
        pinyin: 'lǎoshī',
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

    test('你好老師！', () => {
      const sentence = '你好老師！'
      const result = analyze_chinese_sentence({text: sentence, locale: 'zh-CN', user_vocabulary, dictionary})
      expect(result).toEqual([
        {
          'text': '你好',
          'pinyin': 'nǐhǎo',
          'status': WordStatus.tone,
          'pronunciation': 'ˇˇ',
          'definition': 'hello',
          // 'tone_change': true,
        },
        {
          'text': '老师',
          'opposite_script': '老師',
          'pinyin': 'lǎoshī',
          'status': WordStatus.unknown,
          'pronunciation': 'lǎoshī',
          'definition': 'teacher • instructor',
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
          'definition': 'hello',
          'pinyin': 'nǐhǎo',
          'pronunciation': 'ˇˇ',
          'status': WordStatus.tone,
        },
        {
          'text': '，',
        },
        {
          'text': '大',
          'definition': 'big • huge',
          'pinyin': 'dà',
          'pronunciation': 'dà',
          'status': WordStatus.unknown,
        },
        {
          'text': '家',
          'definition': 'home • family',
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
          'definition': 'hello',
          'pinyin': 'nǐhǎo',
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
  })
}



