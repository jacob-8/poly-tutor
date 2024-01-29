import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { YtCaptionsRequestBody } from '$lib/types'
import { convert_to_db_captions_format } from './convert-to-db-captions-format'
import { get_request } from '$lib/utils/post-request'
import { CAPTIONS_URL } from '$env/static/private'
import { find_track_by_preference } from './find-track-by-preference'

export interface YoutubeCaptionTrack {
  is_generated: boolean
  is_translatable: boolean
  language: string
  language_code: string
  video_id: string
}

export interface YoutubeCaption {
  text: string
  start: number
  duration?: number
}

export const POST: RequestHandler = async ({ locals: { getSession }, request }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { youtube_id, locale } = await request.json() as YtCaptionsRequestBody

  if (!youtube_id)
    error(ResponseCodes.BAD_REQUEST, 'No youtube_id found in request body')

  try {
    if (!CAPTIONS_URL) throw new Error('CAPTIONS_URL not configured')

    const { data: tracks, error: tracks_error } = await get_request<YoutubeCaptionTrack[]>(`${CAPTIONS_URL}?v=${youtube_id}&type=list`)
    if (tracks_error) {
      console.warn({tracks_error})
      return json(null)
    }

    if (!tracks.length) throw new Error('No caption tracks found')
    const track = find_track_by_preference(tracks, locale)

    const { data: captions_from_youtube, error: captions_error } = await get_request<YoutubeCaption[]>(`${CAPTIONS_URL}?v=${youtube_id}&lang=${track.language_code}&fmt=srv3`)
    if (captions_error) {
      console.warn({captions_error})
      throw new Error('Error getting captions')
    }

    const sentences = convert_to_db_captions_format(captions_from_youtube)
    return json(sentences)
  } catch (err) {
    console.error(err.message)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, err.message)
  }
}
