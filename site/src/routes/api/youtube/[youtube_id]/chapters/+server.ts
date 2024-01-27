import { ResponseCodes } from '$lib/responseCodes'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { CORS_PROXY_URL } from '$env/static/private'
import { extract_chapters_from_youtube_initial_data, parse_data_from_html } from './get-chapters'

export const GET: RequestHandler = async ({params: {youtube_id}, locals: { getSession }, fetch}) => {
  if (!CORS_PROXY_URL)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, 'CORS_PROXY_URL not configured')

  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  try {
    const response = await fetch(`${CORS_PROXY_URL}/?https://www.youtube.com/watch?v=${youtube_id}`)
    const html = await response.text()
    const data = parse_data_from_html(html)
    const chapters = extract_chapters_from_youtube_initial_data(data)

    // TODO: save chapters to DB

    return json(chapters)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
