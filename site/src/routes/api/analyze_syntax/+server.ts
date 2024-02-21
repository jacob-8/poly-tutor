import { LanguageServiceClient } from '@google-cloud/language'
import type { google } from '@google-cloud/language/build/protos/protos'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { GOOGLE_TRANSLATE_NLP_CREDENTIALS } from '$env/static/private'
import { ResponseCodes } from '$lib/response-codes'
import { dev } from '$app/environment'

const CREDENTIALS = JSON.parse(GOOGLE_TRANSLATE_NLP_CREDENTIALS)
const languageServiceClient = new LanguageServiceClient({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id,
})

export interface AnalyzeSyntaxRequestBody {
  text: string
  sourceLanguageCode: string
}

export type AnalyzeSyntaxResponseBody = google.cloud.language.v1.IAnalyzeSyntaxResponse

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  if (!CREDENTIALS.project_id)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, 'GOOGLE_TRANSLATE_NLP_CREDENTIALS not configured')

  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  if (!dev && session_data.user.email !== 'jacob@polylingual.dev')
    error(ResponseCodes.UNAUTHORIZED, { message: 'Unauthorized' })

  try {
    const { text, sourceLanguageCode } = await request.json() as AnalyzeSyntaxRequestBody

    if (!text)
      error(ResponseCodes.BAD_REQUEST, 'No text property found in request body')

    console.info(`analyzing syntax: ${text}`)

    const completionRequest: google.cloud.language.v1.IAnalyzeSyntaxRequest = {
      document: {
        language: sourceLanguageCode, // 'en' | 'zh' | 'zh-Hant'
        content: text,
        type: 'PLAIN_TEXT',
      },
      encodingType: 'UTF8', // needed to receive word offsets
    }
    const [syntax] = await languageServiceClient.analyzeSyntax(completionRequest)

    // REST method, requires complicated key generation: https://sourabhsjain.medium.com/generating-access-token-for-google-cloud-platform-api-access-using-service-accounts-94fa16a73416
    // const response = await fetch('https://language.googleapis.com/v1/documents:analyzeSyntax', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=utf-8',
    //     Authorization: `Bearer ${GOOGLE_TRANSLATE_NLP_CREDENTIALS}`,
    //   },
    //   body: JSON.stringify(completionRequest),
    // })
    // const syntax = await response.json()  as Sentence['syntax']

    return json(syntax)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}

// learn more at https://cloud.google.com/natural-language/docs/analyzing-syntax


// If using, move into an endpoint to allow for analyzing others's captions
// async function analyze_syntax(sentences: Sentence[]) {
//   const text = sentences.map(sentence => sentence.text).join('\n')
//   const { data, error } = await post_request<AnalyzeSyntaxRequestBody, Sentence['syntax']>('/api/analyze_syntax', { text, sourceLanguageCode: learning_language }, fetch)
//   if (error) {
//     console.error(error.message)
//     return alert(error.message)
//   }

//   const sentencesWithSyntax = merge_syntax(data, sentences)
//   const { error: savingError } = await updateTranscript(sentencesWithSyntax)
//   if (savingError) {
//     console.error(savingError.message)
//     return alert(savingError.message)
//   }
//   invalidateAll()
// }
