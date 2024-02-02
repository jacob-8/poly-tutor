import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { POST, type ChatRequestBody } from './+server'
import { authenticatedLocal, unAuthenticatedLocal } from '$lib/mocks/locals'
import { ResponseCodes } from '$lib/responseCodes'
import { createChunkDecoder } from '$lib/client/chunkDecoder'
import { OpenAiChatModels } from '$lib/types/models'

vi.mock('$env/static/private', () => {
  return {
    OPENAI_API_KEY: 'test-key',
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

  test('throws error if no messages', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: { openai_api_key: 'mock'} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "No messages found",
        },
        "status": 400,
      }
    `)
  })

  test('streams back mocked response', async () => {
    const body: ChatRequestBody = {
      model: OpenAiChatModels.GPT4,
      openai_api_key: 'bam',
      max_tokens: 1000,
      messages: [{
        role: 'system',
        content: 'Testing'
      },
      {
        role: 'user',
        content: 'hi, I am just a mock'
      }],
    }
    const response = await request(POST, { locals: authenticatedLocal, body })
    expect(response.status).toBe(ResponseCodes.OK)
    expect(await get_stream_result(response)).toMatchFileSnapshot('./result.snap.json5')
  })
})

async function get_stream_result(response: Response) {
  const reader = response.body.getReader()
  const decoder = createChunkDecoder()

  let result = ''

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder(value)
    result += chunk
  }

  return result
}
