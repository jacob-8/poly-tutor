import { WordStatus, type AnalyzedWord, type ECDictEntry, type EmphasisLimits, type Sentence, type StudyWords, type UserVocabulary } from '$lib/types'
import { analyze_english_sentence } from './analyze-english-sentence'

export function analyze_english_sentences({ sentences, user_vocabulary, dictionary, emphasis_limits }: { sentences: Sentence[], user_vocabulary: UserVocabulary, dictionary: Record<string, ECDictEntry>, emphasis_limits: EmphasisLimits }): { sentences: Sentence[], study_words: StudyWords } {
  const { common_in_this_context_max, high_view_count_max } = emphasis_limits
  const unknown_words_with_count = {} as Record<string, AnalyzedWord>

  const analyzed_sentences = sentences.map((sentence, index) => {
    const words = analyze_english_sentence({text: sentence.text, user_vocabulary, dictionary})
    for (const word of words)
      add_to_counts(word, index)
    return { ...sentence, words }
  })

  function add_to_counts(word: AnalyzedWord, sentence_index: number) {
    if (word.status === undefined || word.status === WordStatus.known || word.status === WordStatus.wordlist) return // skip words not in dictionary and known words

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

  return { sentences: analyzed_sentences, study_words: { high_view_count, common_in_this_context }}
}
