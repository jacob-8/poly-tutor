import { WordStatus, type AnalyzedWord, type ECDictEntry, type UserVocabulary } from '$lib/types'

export function analyze_english_sentence({text, user_vocabulary, dictionary}:
  {
    text: string,
    user_vocabulary: UserVocabulary,
    dictionary: Record<string, ECDictEntry>,
  }): AnalyzedWord[] {
  if (!text) return []

  const analyzed_words: AnalyzedWord[] = []

  for (const word of text.split(' ')) {
    const entry = dictionary[word]
    if (entry)
      analyzed_words.push(analyze_word(entry))
    else
      analyzed_words.push({ text: word })
  }

  function analyze_word(entry: ECDictEntry): AnalyzedWord {
    const { word, phonetic, translation } = entry

    const status = user_vocabulary[text]?.status ?? WordStatus.unknown
    const views = user_vocabulary[text]?.views || 0

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
