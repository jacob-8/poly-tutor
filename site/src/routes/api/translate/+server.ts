import { TranslationServiceClient } from '@google-cloud/translate'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { GOOGLE_TRANSLATE_NLP_CREDENTIALS } from '$env/static/private'
import { ResponseCodes } from '$lib/responseCodes'
import { dev } from '$app/environment'
import type { TranslateRequestBody } from '$lib/types'

const CREDENTIALS = JSON.parse(GOOGLE_TRANSLATE_NLP_CREDENTIALS)
const translationClient = new TranslationServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
})

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  if (!CREDENTIALS.project_id)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, 'GOOGLE_TRANSLATE_NLP_CREDENTIALS not configured')

  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  if (!dev && session_data.user.email !== 'jacob@polylingual.dev')
    throw error(ResponseCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  const { text, sourceLanguageCode, targetLanguageCode } = await request.json() as TranslateRequestBody
  const location = 'global'

  if (!text)
    throw error(ResponseCodes.BAD_REQUEST, 'No text property found in request body')

  console.info({ length: text.length })

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

    return json({line_separated_translations: textTranslations.join('\n')})
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
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
