import { CAPTIONS_URL } from '$env/static/private'
import type { Sentence } from '$lib/types'
import { convert_to_db_captions_format } from './convert-to-db-captions-format'

interface YoutubeCaptionTrack {
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

const code_preference = ['zh-Hant', 'zh-TW', 'zh', 'zh-CN', 'zh-Hans']

export async function get_captions_from_youtube({ youtube_id }: { youtube_id: string }): Promise<Sentence[]> {
  const tracks = await getTracks(youtube_id)
  if (!tracks.length) throw new Error('No caption tracks found')

  const track = find_track_by_order_preference(tracks, code_preference)
  const captions_from_youtube = await getCaptions(youtube_id, track.language_code)
  return convert_to_db_captions_format(captions_from_youtube)
}

async function getTracks(youtube_id: string): Promise<YoutubeCaptionTrack[]> {
  try {
    const url = `${CAPTIONS_URL}?v=${youtube_id}&type=list`
    const response = await fetch(url)
    return await response.json()
  } catch (err) {
    console.warn({err})
    throw new Error('Error getting caption tracks')
  }
}

async function getCaptions(youtube_id: string, language_code: string): Promise<YoutubeCaption[]> {
  if (!CAPTIONS_URL) throw new Error('CAPTIONS_URL not configured')
  const url = `${CAPTIONS_URL}?v=${youtube_id}&lang=${language_code}&fmt=srv3`
  const response = await fetch(url)
  return await response.json() as YoutubeCaption[]
}

function find_track_by_order_preference(tracks: YoutubeCaptionTrack[], language_codes: string[]): YoutubeCaptionTrack {
  for (const code of language_codes) {
    const preferredTrack = tracks.find(({ language_code }) => language_code === code)
    if (preferredTrack)
      return preferredTrack
  }
  throw new Error('No Chinese caption track found')
}


