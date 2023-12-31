import { error, json, type Config } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { Sentence, YtTranscribeRequestBody } from '$lib/types'
import { OPENAI_API_KEY, POLY_WHISPER_KEY } from '$env/static/private'
import { calculate_chunk_seconds } from './calculate-chunk-seconds'

export const config: Config = {
  runtime: 'edge',
}

interface ExternalYoutubeTranscribeRequestBody {
  youtube_id: string
  openai_api_key: string
  poly_key: string
  language?: string
  prompt?: string
  seconds_per_chunk?: number
}

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { youtube_id, openai_api_key, language_code, duration_seconds } = await request.json() as YtTranscribeRequestBody
  console.info({duration_seconds})

  let api_key = openai_api_key

  if (!api_key && session_data.user.email === 'jacob@polylingual.dev')
    api_key = OPENAI_API_KEY

  if (!api_key) throw error(ResponseCodes.BAD_REQUEST, 'No OPENAI_API_KEY found')

  if (!youtube_id)
    throw error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  try {
    console.info(`transcribing: ${youtube_id} in ${language_code}`)

    // const simplePrompt = '請使用繁體字。'
    // const puncPrompt = 'Whisper, as you transcribe speech into text, please ensure to include punctuation marks as accurately as possible. Additionally, when creating the timeline for the subtitles, try to split at the punctuation marks to ensure that sentences are not divided across different time segments. The goal is to have each sentence contained within a single time segment for clarity and coherence. 請使用繁體字。'
    const prompt = `請盡量準確地加上標點符號。

在製作字幕的時間軸時，在標點符號處分割，以避免句子被分散在不同時間段。

目標是讓每個句子都在一個時間段內，以保持清晰。`

    const requestBody: ExternalYoutubeTranscribeRequestBody = {
      youtube_id,
      openai_api_key,
      poly_key: POLY_WHISPER_KEY,
      language: language_code,
      prompt,
      seconds_per_chunk: calculate_chunk_seconds(duration_seconds),
    }
    console.info({ requestBody })

    const response = await fetch('https://jacob-8--whisper-transcriber-fastapi-app.modal.run/transcribe/youtube', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json',
      },
    })
    const body = await response.json()

    if (response.status !== ResponseCodes.OK)
      throw new Error(`Status: ${response.status}, Error: ${body.message}`)

    const { transcript } = body as { transcript: {
        text: string,
        start_second: number,
        end_second: number,
       }[] }

    const sentences: Sentence[] = transcript.map(({ text, start_second, end_second }) => ({
      text,
      start_ms: start_second * 1000,
      end_ms: end_second * 1000,
    }))

    return json(sentences)
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

