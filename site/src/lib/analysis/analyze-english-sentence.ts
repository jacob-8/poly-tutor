import { WordStatus, type AnalyzedEnglishWord, type ECDictEntry, type UserVocabulary } from '$lib/types'

export function analyze_english_sentence({text, user_vocabulary, dictionary}:
  {
    text: string,
    user_vocabulary: UserVocabulary,
    dictionary: Record<string, ECDictEntry>,
  }): AnalyzedEnglishWord[] {
  if (!text) return []

  const analyzed_words: AnalyzedEnglishWord[] = []

  for (const word_to_analyze of text.split(/[\s\n]+/)) {
    const [word] = get_root_form(word_to_analyze)

    const entry = dictionary[word]
    if (entry) {
      analyzed_words.push({
        ...analyze_word(entry),
        inflected: word_to_analyze,
      })

      continue
    }

    const singular_word = word.replace(/s$/, '')
    const singular_entry = dictionary[singular_word]
    if (singular_entry) {
      analyzed_words.push({
        ...analyze_word(singular_entry),
        inflected: word_to_analyze,
      })

      continue
    }
    analyzed_words.push({ text: word_to_analyze })
  }

  function analyze_word(entry: ECDictEntry): AnalyzedEnglishWord {
    const { word, phonetic, translation } = entry

    const status = user_vocabulary[word]?.status ?? WordStatus.unknown
    const views = user_vocabulary[word]?.views || 0

    return {
      text: word,
      phonetic,
      definitions: translation,
      status,
      views,
    }
  }

  return analyzed_words
}

function get_root_form(word: string): [string, string] {
  let punctuation = ''
  let root = word.toLowerCase()

  if (/[.,!;:=]/g.test(root.charAt(root.length - 1))) {
    punctuation = root.charAt(root.length - 1)
    root = root.slice(0, -1)
  }

  return [root, punctuation]
}

if (import.meta.vitest) {
  describe(get_root_form, () => {
    test('lowercases', () => {
      expect(get_root_form('Word')).toEqual(['word', ''])
    })

    test('removes punctuation', () => {
      expect(get_root_form('word,')).toEqual(['word', ','])
    })
  })
}
