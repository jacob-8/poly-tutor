import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { TranslateRequestBody, YtTranslateRequestBody } from '$lib/types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'
import { merge_translations } from './merge_translations'
import { post_request } from '$lib/utils/post-request'

export const POST: RequestHandler = async ({ locals: { getSession }, request, fetch }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { youtube_id, learning, mother, sentences } = await request.json() as YtTranslateRequestBody

  if (!youtube_id)
    error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  try {
    // before joining array with newlines, remove the newlines with each line that Whisper added in which will skew alignment between sentences and translations
    const text = sentences.map(sentence => sentence.text.replace('\n', '，')).join('\n')

    const { data, error: translate_error } = await post_request<TranslateRequestBody, {line_separated_translations: string}>('/api/translate', { text, sourceLanguageCode: learning, targetLanguageCode: mother }, fetch)
    if (translate_error)
      throw new Error(translate_error.message)

    const sentences_with_translation = merge_translations({ line_separated_translations: data.line_separated_translations, sentences, locale: mother})

    const adminSupabase = getAdminSupabaseClient()

    const { error: saving_error } = await adminSupabase
      .from('youtube_transcripts')
      .update({
        transcript: { sentences: sentences_with_translation },
      })
      .eq('youtube_id', youtube_id)
      .select()
      .single()

    if (saving_error)
      throw new Error(saving_error.message)

    return json(sentences_with_translation)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
