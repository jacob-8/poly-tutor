import { error, json, type Config } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { ExternalYoutubeTranscribeRequestBody, Sentence, ExtenralYoutubeTranscribeRequestResponse } from '$lib/types'
import { POLY_WHISPER_KEY } from '$env/static/private'
import { calculate_chunk_seconds } from './calculate-chunk-seconds'
import { post_request } from '$lib/utils/post-request'
import type { LanguageCode, LocaleCode } from '$lib/i18n/locales'
import { translate_sentences } from '$api/translate/translate-sentences'

export const config: Config = { maxDuration: 300 }

export interface YoutubeTranscribeRequestBody {
  language_code: LanguageCode
  mother: LocaleCode
  learning: LocaleCode
  openai_api_key: string
  duration_seconds: number
  prompt: string
}

export type YoutubeTranscribeResponseBody = Sentence[]

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request, fetch }) => {
  const { data: session_data, error: _error, supabase } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { openai_api_key, mother, learning, language_code, duration_seconds, prompt } = await request.json() as YoutubeTranscribeRequestBody

  if (!openai_api_key) error(ResponseCodes.BAD_REQUEST, 'No openai_api_key found')
  if (!youtube_id) error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  console.info(`transcribing: ${youtube_id} in ${language_code}`)

  const { data, error: transcribe_error } = await post_request<ExternalYoutubeTranscribeRequestBody, ExtenralYoutubeTranscribeRequestResponse>('https://jacob-8--whisper-transcriber-fastapi-app.modal.run/transcribe/youtube', {
    youtube_id,
    openai_api_key,
    poly_key: POLY_WHISPER_KEY,
    language: language_code,
    prompt,
    seconds_per_chunk: calculate_chunk_seconds(duration_seconds),
  })

  if (transcribe_error)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, transcribe_error.message)

  try {
    const sentences: Sentence[] = data.transcript.map(({ text, start_second, end_second }) => ({
      text,
      start_ms: start_second * 1000,
      end_ms: end_second * 1000,
    }))

    const sentences_with_translation = await translate_sentences({ sentences, mother, learning, _fetch: fetch })

    const { error: saving_error } = await supabase
      .from('youtube_transcripts')
      .insert({
        youtube_id,
        sentences: sentences_with_translation,
        source: 'whisper',
      })
      .select()
      .single()
    if (saving_error) throw new Error(saving_error.message)

    return json(sentences_with_translation satisfies YoutubeTranscribeResponseBody)
  } catch (err) {
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

