import type { StudyWords, StudyWordsObject } from '$lib/types'

export function get_study_words_object(words: StudyWords): StudyWordsObject {
  if (!words) return

  const study_words_object: StudyWordsObject = {
    high_view_count: {},
    common_in_this_context: {},
  }

  for (const {text} of words.high_view_count)
    study_words_object.high_view_count[text] = true

  for (const {text} of words.common_in_this_context)
    study_words_object.common_in_this_context[text] = true

  if (words.improve_pronunciation_or_tone) {
    study_words_object.improve_pronunciation_or_tone = {}
    for (const {text} of words.improve_pronunciation_or_tone)
      study_words_object.improve_pronunciation_or_tone![text] = true
  }
  return study_words_object
}
