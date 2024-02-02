import { convert_to_db_captions_format } from './convert-to-db-captions-format'
import { get_request } from '$lib/utils/post-request'
import { CAPTIONS_URL } from '$env/static/private'
import { find_track_by_preference } from './find-track-by-preference'
import type { LocaleCode } from '$lib/i18n/locales'
import type { Supabase } from '$lib/supabase/database.types'
import { translate_sentences } from '$api/translate/translate-sentences'

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

export async function save_youtube_captions_as_transcript_if_exists({ youtube_id, mother, learning, _fetch, supabase }: { youtube_id: string, mother: LocaleCode, learning: LocaleCode, _fetch: typeof fetch, supabase: Supabase}) {
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

  const track = find_track_by_preference(tracks, learning)

  const { data: captions_from_youtube, error: captions_error } = await get_request<YoutubeCaption[]>(`${CAPTIONS_URL}?v=${youtube_id}&lang=${track.language_code}&fmt=srv3`)
  if (captions_error) {
    console.warn({captions_error})
    return
  }

  if (!captions_from_youtube) return
  const sentences = convert_to_db_captions_format(captions_from_youtube)
  const sentences_with_translation = await translate_sentences({ sentences, mother, learning, _fetch })

  const { error: saving_error } = await supabase
    .from('youtube_transcripts')
    .insert({
      youtube_id,
      sentences: sentences_with_translation,
      source: 'youtube',
    })
    .select()
    .single()
  if (saving_error)
    throw new Error(saving_error.message)
}
