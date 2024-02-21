import { TranslationServiceClient } from '@google-cloud/translate'
import { error, json, type Config } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { GOOGLE_TRANSLATE_NLP_CREDENTIALS } from '$env/static/private'
import { ResponseCodes } from '$lib/response-codes'
import { dev } from '$app/environment'
import { mocked_prefix } from '$lib/mocks/seed/youtubes'
import type { LocaleCode } from '$lib/i18n/locales'

const CREDENTIALS = JSON.parse(GOOGLE_TRANSLATE_NLP_CREDENTIALS)
const translationClient = new TranslationServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
})

export const config: Config = { maxDuration: 300 }

export interface TranslateRequestBody {
  text: string
  sourceLanguageCode: LocaleCode // https://cloud.google.com/translate/docs/languages
  targetLanguageCode: LocaleCode
}

export interface TranslateResponseBody {
  line_separated_translations: string
}

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  if (!CREDENTIALS.project_id)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, 'GOOGLE_TRANSLATE_NLP_CREDENTIALS not configured')

  console.info('translating')

  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user) {
    console.info({ get_session_error: JSON.stringify(_error) })
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })
  }

  console.info('getting text')

  const { text, sourceLanguageCode, targetLanguageCode } = await request.json() as TranslateRequestBody
  const location = 'global'

  if (!text)
    error(ResponseCodes.BAD_REQUEST, 'No text property found in request body')

  // Mock for E2E
  if (dev && text.startsWith(mocked_prefix)) {
    console.info(`Mocked translation for ${text.length} characters`)
    return json({ line_separated_translations: text.split('\n').map(t => 'Mocked translation: ' + t).join('\n') } satisfies TranslateResponseBody)
  }

  console.info({ translate_text_request_length: text.length })

  try {
    const textSections = splitText(text)
    const textTranslations = await Promise.all(textSections.map(async (text) => {
      const [response] = await translationClient.translateText({
        parent: `projects/${CREDENTIALS.project_id}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // also can be text/html
        sourceLanguageCode,
        targetLanguageCode,
      })
      const translation = response.translations.map(translation => translation.translatedText).join('\n')
      return translation
    }))

    return json({line_separated_translations: textTranslations.join('\n')} satisfies TranslateResponseBody)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

const MAX_ALLOWED_LENGTH = 5000
const BUFFER_LENGTH = 100

function splitText(text: string, maxLength = MAX_ALLOWED_LENGTH - BUFFER_LENGTH): string[] {
  const lines = text.split('\n')
  const sections: string[] = []
  let currentSection = ''

  for (const line of lines) {
    if (currentSection.length > maxLength) {
      sections.push(currentSection.trim())
      currentSection = ''
    }
    currentSection += line + '\n'
  }

  if (currentSection)
    sections.push(currentSection.trim())

  return sections
}
