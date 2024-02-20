import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { POST, type YoutubeTranscribeRequestBody } from './+server'
import { authenticatedLocal, unAuthenticatedLocal } from '$lib/mocks/locals'
import { ResponseCodes } from '$lib/response-codes'
import { unseeded_youtubes } from '$lib/mocks/seed/youtubes'
import type { Sentence } from '$lib/types'

vi.mock('$env/static/private', () => {
  return {
    OPENAI_API_KEY: 'test-key',
    POLY_WHISPER_KEY: 'test-key',
  }
})

vi.mock('$api/translate/translate-sentences', () => {
  return {
    translate_sentences: ({sentences}: {sentences: Sentence[]}) => sentences.map(sentence => ({ ...sentence, translation: { en: `translated-${sentence.text}` }}))
  }
})

describe(POST, () => {
  test('throws error if unauthenticated ', async () => {
    await expect(() => request(POST, { locals: unAuthenticatedLocal })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "Unauthorized",
        },
        "status": 401,
      }
    `)
  })

  test('throws error if no openai_api_key', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: {} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "No openai_api_key found",
        },
        "status": 400,
      }
    `)
  })

  test('properly passes on error from transcriber', async () => {
    const body: YoutubeTranscribeRequestBody = {
      mother: 'zh-CN',
      learning: 'en',
      language_code: 'fr' as 'en',
      duration_seconds: 100,
      openai_api_key: 'foo',
      prompt: 'foo',
    }
    await expect(() => request(POST, { locals: authenticatedLocal, params: { youtube_id: unseeded_youtubes.zh_no_captions__ai_camp.id }, body })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "French language not supported",
        },
        "status": 500,
      }
    `)
  })

  test('returns proper sentences after successful transcription', async () => {
    const body: YoutubeTranscribeRequestBody = {
      mother: 'en',
      learning: 'zh-TW',
      language_code: 'zh',
      duration_seconds: 100,
      openai_api_key: 'fee',
      prompt: 'fee',
    }
    const response = await request(POST, { locals: authenticatedLocal, params: { youtube_id: unseeded_youtubes.zh_captions_on_youtube__llama.id }, body })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await response.json()).toMatchFileSnapshot('./result.snap.json5')
  })
})
