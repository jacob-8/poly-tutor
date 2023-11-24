import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import { dev } from '$app/environment'
import { get_captions_from_youtube } from './get_captions_from_youtube'
import type { YtCaptionsRequestBody } from '$lib/types'

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  if (!dev && session_data.user.email !== 'jacob@polylingual.dev')
    throw error(ResponseCodes.UNAUTHORIZED, { message: 'Sorry, the tool is not ready yet. Thank you for your interest. I will use your email address to notify you when it is ready.' })

  try {
    const { youtubeId } = await request.json() as YtCaptionsRequestBody

    if (!youtubeId)
      throw error(ResponseCodes.BAD_REQUEST, 'No youtubeId found in request body')

    const sentences = await get_captions_from_youtube(youtubeId)

    // TODO: if no captions, use Whisper API to generate captions

    return json(sentences)
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
