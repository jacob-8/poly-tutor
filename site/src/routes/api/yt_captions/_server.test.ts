import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { POST } from './+server'
import { authenticatedLocal, unAuthenticatedLocal } from '$lib/mocks/locals'
import { ResponseCodes } from '$lib/responseCodes'
import type { YtCaptionsRequestBody } from '$lib/types'
import { unseeded_youtubes } from '$lib/mocks/seed/youtubes'

// vi.mock('$env/static/private', () => import.meta.env);
vi.mock('$env/static/private', () => {
  // const { TEST_CAPTIONS_URL } = await import('$lib/mocks/env')
  return {
    CAPTIONS_URL: 'https://mocked.captions.url',
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

  test('throws error if no youtube_id', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: {} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "No youtube_id found in request body",
        },
        "status": 400,
      }
    `)
  })

  test('handles network error', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: { youtube_id: 'throw-network-error'} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "Failed to fetch",
        },
        "status": 500,
      }
    `)
  })

  test('returns null when no captions', async () => {
    const body: YtCaptionsRequestBody = {
      youtube_id: unseeded_youtubes.zh_no_captions__ai_camp.id,
      locale: 'zh-TW',
    }
    const response = await request(POST, { locals: authenticatedLocal, body })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await response.json()).toBeNull()
  })

  test('parses and returns captions when they exist', async () => {
    const body: YtCaptionsRequestBody = {
      youtube_id: unseeded_youtubes.zh_captions_on_youtube__llama.id,
      locale: 'zh-TW',
    }
    const response = await request(POST, { locals: authenticatedLocal, body })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await response.json()).toMatchFileSnapshot('./return-captions.snap.json5')
  })
})
