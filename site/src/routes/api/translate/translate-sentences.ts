import type { TranslateRequestBody, TranslateResponseBody } from '$api/translate/+server'
import type { LocaleCode } from '$lib/i18n/locales'
import type { Sentence } from '$lib/types'
import { post_request } from '$lib/utils/post-request'
import { merge_translations } from './merge-translations'

export async function translate_sentences({ sentences, mother, learning, _fetch}: {sentences: Sentence[], mother: LocaleCode, learning: LocaleCode, _fetch: typeof fetch}): Promise<Sentence[] | void> {
  // before joining array with newlines, remove the newlines with each line that Whisper added in which will skew alignment between sentences and translations
  const text = sentences.map(sentence => sentence.text.replace('\n', '，')).join('\n')
  const { data, error: translate_error } = await post_request<TranslateRequestBody, TranslateResponseBody>('/api/translate', { text, sourceLanguageCode: learning, targetLanguageCode: mother }, _fetch)
  if (translate_error) {
    console.error(translate_error.message)
    return sentences
  }
  return merge_translations({ line_separated_translations: data.line_separated_translations, sentences, locale: mother})
}
