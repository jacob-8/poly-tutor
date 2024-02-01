import { error, json, type Config } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { ExternalYoutubeTranscribeRequestBody, Sentence, ExtenralYoutubeTranscribeRequestResponse } from '$lib/types'
import { OPENAI_API_KEY, POLY_WHISPER_KEY } from '$env/static/private'
import { calculate_chunk_seconds } from './calculate-chunk-seconds'
import { post_request } from '$lib/utils/post-request'
import type { LanguageCode } from '$lib/i18n/locales'

export const config: Config = { maxDuration: 300 }

export interface YoutubeTranscribeRequestBody {
  language_code: LanguageCode
  openai_api_key: string
  duration_seconds: number
}

export type YoutubeTranscribeResponseBody = Sentence[]

export const POST: RequestHandler = async ({ locals: { getSession }, params: { youtube_id }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { openai_api_key, language_code, duration_seconds } = await request.json() as YoutubeTranscribeRequestBody
  console.info({ duration_seconds })

  let api_key = openai_api_key

  if (!api_key && session_data.user.email === 'jacob@polylingual.dev')
    api_key = OPENAI_API_KEY

  if (!api_key) error(ResponseCodes.BAD_REQUEST, 'No OPENAI_API_KEY found')

  if (!youtube_id)
    error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  console.info(`transcribing: ${youtube_id} in ${language_code}`)

  const prompt = '請使用繁體字。'
  // const puncPrompt = 'Whisper, as you transcribe speech into text, please ensure to include punctuation marks as accurately as possible. Additionally, when creating the timeline for the subtitles, try to split at the punctuation marks to ensure that sentences are not divided across different time segments. The goal is to have each sentence contained within a single time segment for clarity and coherence. 請使用繁體字。'
  //   const punc_prompt_ch = `請盡量準確地加上標點符號。

  // 在製作字幕的時間軸時，在標點符號處分割，以避免句子被分散在不同時間段。

  // 目標是讓每個句子都在一個時間段內，以保持清晰。`

  const { data, error: transcribe_error } = await post_request<ExternalYoutubeTranscribeRequestBody, ExtenralYoutubeTranscribeRequestResponse>('https://jacob-8--whisper-transcriber-fastapi-app.modal.run/transcribe/youtube', {
    youtube_id,
    openai_api_key,
    poly_key: POLY_WHISPER_KEY,
    language: language_code,
    prompt,
    seconds_per_chunk: calculate_chunk_seconds(duration_seconds),
  })

  if (transcribe_error) error(ResponseCodes.INTERNAL_SERVER_ERROR, transcribe_error.message)

  try {
    const sentences: Sentence[] = data.transcript.map(({ text, start_second, end_second }) => ({
      text,
      start_ms: start_second * 1000,
      end_ms: end_second * 1000,
    }))

    // TODO: save transcript to db

    return json(sentences satisfies YoutubeTranscribeResponseBody)
  } catch (err) {
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

