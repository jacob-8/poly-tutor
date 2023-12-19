import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { POST } from './+server'
import { authenticatedLocal, unAuthenticatedLocal } from '$lib/mocks/locals'
import { ResponseCodes } from '$lib/responseCodes'
import type { YtTranscribeRequestBody } from '$lib/types'
import { youtube_ids } from '$lib/mocks/shows'

vi.mock('$env/static/private', () => {
  return {
    OPENAI_API_KEY: 'test-key',
    POLY_WHISPER_KEY: 'test-key',
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

  test('throws error if no OPENAI_API_KEY', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: {} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "No OPENAI_API_KEY found",
        },
        "status": 400,
      }
    `)
  })

  test('properly passes on error from transcriber', async () => {
    const body: YtTranscribeRequestBody = {
      youtube_id: youtube_ids.has_no_captions__ai_camp,
      language_code: 'fr' as 'en',
      duration_seconds: 100,
      openai_api_key: 'foo',
    }
    await expect(() => request(POST, { locals: authenticatedLocal, body })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "French language not supported",
        },
        "status": 500,
      }
    `)
  })

  test('returns proper sentences after successful transcription', async () => {
    const body: YtTranscribeRequestBody = {
      youtube_id: youtube_ids.has_captions_on_youtube__llama,
      language_code: 'zh',
      duration_seconds: 100,
      openai_api_key: 'fee',
    }
    const response = await request(POST, { locals: authenticatedLocal, body })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await response.json()).toMatchFileSnapshot('./result.snap.json5')
  })
})
