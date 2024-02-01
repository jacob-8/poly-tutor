import type { Sentence } from '$lib/types'
import type { YoutubeCaption } from './get-captions'

export function convert_to_db_captions_format(captions_from_youtube: YoutubeCaption[]): Sentence[] {
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
