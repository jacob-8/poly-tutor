import { CAPTIONS_URL } from '$env/static/private'
import type { Sentence } from '$lib/types'

interface YoutubeCaptionTrack {
  is_generated: boolean
  is_translatable: boolean
  language: string
  language_code: string
  video_id: string
}

interface YoutubeCaption {
  text: string
  start: number
  duration?: number
}

const code_preference = ['zh-Hant', 'zh-TW', 'zh', 'zh-CN', 'zh-Hans']

export async function get_captions_from_youtube(video_id: string): Promise<Sentence[]> {
  const tracks = await getTracks(video_id)
  if (!tracks.length) throw new Error('No caption tracks found')

  const track = find_track_by_order_preference(tracks, code_preference)
  const captions_from_youtube = await getCaptions(video_id, track.language_code)
  return convert_to_db_captions_format(captions_from_youtube)
}

async function getTracks(videoId: string): Promise<YoutubeCaptionTrack[]> {
  const response = await fetch(
    `${CAPTIONS_URL}?v=${videoId}&type=list`
  )
  return await response.json()
}

async function getCaptions(videoId: string, language_code: string): Promise<YoutubeCaption[]> {
  if (!CAPTIONS_URL) throw new Error('CAPTIONS_URL not configured')
  const url = `${CAPTIONS_URL}?v=${videoId}&lang=${language_code}&fmt=srv3`
  const response = await fetch(url)
  return await response.json() as YoutubeCaption[]
}

function find_track_by_order_preference(tracks: YoutubeCaptionTrack[], langCodes: string[]): YoutubeCaptionTrack {
  for (const code of langCodes) {
    const preferredTrack = tracks.find(({ language_code }) => language_code === code)
    if (preferredTrack)
      return preferredTrack
  }
  throw new Error('No Chinese caption track found')
}

function convert_to_db_captions_format(captions_from_youtube: YoutubeCaption[]): Sentence[] {
  return captions_from_youtube.map((
    {
      text,
      start: start_seconds,
      duration: duration_seconds,
    }: YoutubeCaption) =>
    ({
      text,
      start_ms: start_seconds * 1000,
      end_ms: (start_seconds + duration_seconds) * 1000,
    }))
}

if (import.meta.vitest) {
  const youtube_captions = [{ text: 'foo', start: 10.2, duration: 5.67 }]
  const db_captions = [{ text: 'foo', start_ms: 10200, end_ms: 15870 }]

  test('convert_to_db_captions_format', () => {
    expect(convert_to_db_captions_format(youtube_captions)).toEqual(db_captions)
  })
}
