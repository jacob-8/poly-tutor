import type { YoutubeChapter } from '$lib/types'

const FIVE_MINUTES_MS = 5 * 60 * 1000
const TWO_MINUTES_MS = 2 * 60 * 1000

export function auto_calculate_chapters(duration_seconds: number): YoutubeChapter[] {
  const duration_ms = duration_seconds * 1000
  const desired_length_ms = FIVE_MINUTES_MS
  const chapters: YoutubeChapter[] = []

  for (let start_ms = 0; start_ms < duration_ms; start_ms += desired_length_ms) {
    let end_ms = start_ms + desired_length_ms

    const less_than_two_minutes_for_next_block = end_ms + TWO_MINUTES_MS > duration_ms
    if (less_than_two_minutes_for_next_block) {
      chapters.push({ start_ms, end_ms: duration_ms })
      break
    }
    else {
      end_ms = Math.min(end_ms, duration_ms)
      chapters.push({ start_ms, end_ms })
    }
  }

  return chapters
}

if (import.meta.vitest) {
  describe(auto_calculate_chapters, () => {
    test('last chapter a bit shorter than five minutes', () => {
      expect(auto_calculate_chapters(8 * 60)).toEqual([
        {
          'start_ms': 0,
          'end_ms': 300000,
        },
        {
          'start_ms': 300000,
          'end_ms': 8 * 60 * 1000,
        },
      ])
    })

    test('five minutes exactly', () => {
      expect(auto_calculate_chapters(5 * 60)).toEqual([
        {
          'start_ms': 0,
          'end_ms': 300000,
        },
      ])
    })

    test('less than two minutes', () => {
      expect(auto_calculate_chapters(1 * 60)).toEqual([
        {
          'start_ms': 0,
          'end_ms': 60000,
        },
      ])
    })

    test('merges next section under two minutes with prior', () => {
      expect(auto_calculate_chapters(20.25 * 60)).toEqual([
        {
          'start_ms': 0,
          'end_ms': 300000,
        },
        {
          'start_ms': 300000,
          'end_ms': 600000,
        },
        {
          'start_ms': 600000,
          'end_ms': 900000,
        },
        {
          'start_ms': 900000,
          'end_ms': 1215000,
        },
      ])
    })
  })

}
