import { request } from '$lib/mocks/sveltekit-endpoint-helper'
import { POST, type TranslateRequestBody } from './+server'
import { authenticatedLocal, unAuthenticatedLocal } from '$lib/mocks/locals'
import { ResponseCodes } from '$lib/response-codes'

vi.mock('$app/environment', () => {
  return {
    dev: true,
  }
})
vi.mock('$env/static/private', () => {
  return {
    GOOGLE_TRANSLATE_NLP_CREDENTIALS: '{"project_id":"test-project-id"}',
  }
})

vi.mock('@google-cloud/translate', () => {
  class TranslationServiceClient {
    // constructor(opts) {
    // console.log({ opts })
    // }
    translateText(request) {
      const line_separated_text_to_translate = request.contents[0] as string
      const translatedText = line_separated_text_to_translate.split('\n').map(text => 'Mocked translation: ' + text).join('\n')
      const response = { translations: [{translatedText}] }
      return [response]
    }
  }
  return {
    TranslationServiceClient,
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

  test('throws error if no text', async () => {
    await expect(() => request(POST, { locals: authenticatedLocal, body: {} })).rejects.toThrowErrorMatchingInlineSnapshot(`
      HttpError {
        "body": {
          "message": "No text property found in request body",
        },
        "status": 400,
      }
    `)
  })

  test('returns translations', async () => {
    const body: TranslateRequestBody = {
      text: 'Translate me!\nTranslate me again.',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'zh-TW',
    }
    const response = await request(POST, { locals: authenticatedLocal, body })
    expect(response.status).toBe(ResponseCodes.OK)
    const { line_separated_translations } = await response.json()
    expect(line_separated_translations).toMatchInlineSnapshot(`
      "Mocked translation: Translate me!
      Mocked translation: Translate me again."
    `)
  })
})
