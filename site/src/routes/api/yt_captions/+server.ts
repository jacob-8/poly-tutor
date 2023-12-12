import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import { get_captions_from_youtube } from './get_captions_from_youtube'
import type { YtCaptionsRequestBody } from '$lib/types'

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  try {
    const { youtube_id } = await request.json() as YtCaptionsRequestBody

    if (!youtube_id)
      throw error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

    const sentences = await get_captions_from_youtube({youtube_id})
    return json(sentences)
  } catch (err) {
    console.error(err.message)
    throw error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
