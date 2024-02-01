import { convert_to_db_captions_format } from './convert-to-db-captions-format'
import { get_request } from '$lib/utils/post-request'
import { CAPTIONS_URL } from '$env/static/private'
import { find_track_by_preference } from './find-track-by-preference'
import type { LocaleCode } from '$lib/i18n/locales'
import type { Supabase } from '$lib/supabase/database.types'

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

export async function save_youtube_captions_as_transcript_if_exists({ youtube_id, locale, supabase }: { youtube_id: string, locale: LocaleCode, supabase: Supabase}) {
  if (!CAPTIONS_URL) throw new Error('CAPTIONS_URL not configured')

  const { data: tracks, error: tracks_error } = await get_request<YoutubeCaptionTrack[]>(`${CAPTIONS_URL}?v=${youtube_id}&type=list`)
  if (tracks_error) {
    console.warn({tracks_error})
    return
  }

  if (!tracks.length)  {
    console.info('no caption tracks found')
    return
  }

  const track = find_track_by_preference(tracks, locale)

  const { data: captions_from_youtube, error: captions_error } = await get_request<YoutubeCaption[]>(`${CAPTIONS_URL}?v=${youtube_id}&lang=${track.language_code}&fmt=srv3`)
  if (captions_error) {
    console.warn({captions_error})
    return
  }

  const sentences = convert_to_db_captions_format(captions_from_youtube)
  if (!sentences) return null

  const { data: transcript, error: savingError } = await supabase
    .from('youtube_transcripts')
    .insert({
      youtube_id,
      sentences,
      source: 'youtube',
    })
    .select()
    .single()
  if (savingError)
    throw new Error(savingError.message)
  return transcript
}
