import { browser } from '$app/environment'
import type { LocaleCode } from '$lib/i18n/locales'
import type { ChineseEmphasisLimits, Sentence, UserVocabulary } from '$lib/types'
import { get, type Readable } from 'svelte/store'

export async function get_analysis_functions({learning, mother, user_vocabulary, emphasis_limits}: { learning: LocaleCode, mother: LocaleCode, user_vocabulary: Readable<UserVocabulary>, emphasis_limits: Readable<ChineseEmphasisLimits>}) {
  if (!browser) {
    return {
      split_string: (text: string) => text,
      split_sentences: (sentences: Sentence[]) => sentences,
      analyze_sentences: (sentences: Sentence[]) => ({ sentences, study_words: null }),
    }
  }

  if (learning === 'en') {
    const { api } = await import('$lib/analysis/expose-english-analysis-worker')
    api.set_worker_dictionary(mother)
    user_vocabulary.subscribe(api.set_user_vocabulary)

    return {
      split_string: (text: string) => api.split_english_string(text),
      split_sentences: (sentences: Sentence[]) => api.split_english_sentences({sentences}),
      analyze_sentences: (sentences: Sentence[]) => api.analyze_english_sentences({sentences, emphasis_limits: get(emphasis_limits)}),
    }
  } else if (learning === 'zh-TW' || learning === 'zh-CN') {
    const { api } = await import('$lib/analysis/expose-chinese-analysis-worker')
    user_vocabulary.subscribe(api.set_user_vocabulary)

    return {
      split_string: (text: string) => api.split_chinese_string(text, learning),
      split_sentences: (sentences: Sentence[]) => api.split_chinese_sentences({sentences, locale: learning}),
      analyze_sentences: (sentences: Sentence[]) => api.analyze_chinese_sentences({sentences, locale: learning, emphasis_limits: get(emphasis_limits)}),
    }
  }

}
