/* eslint-disable no-magic-numbers */
const MINUTE = 60
const DEFAULT_CHUNK_SECONDS = MINUTE * 2
const MAX_CHUNK_SECONDS = MINUTE * 7

export function calculate_chunk_seconds(total_seconds: number, start_chunk_seconds = DEFAULT_CHUNK_SECONDS) {
  const total_minutes = total_seconds / 60
  let chunk_seconds = start_chunk_seconds

  // For every additional 60 minutes, increase chunk size by 60 seconds (1 minute)
  if (total_minutes > 60) {
    // Calculate the number of 60-minute intervals beyond the initial 60 minutes
    const additional_intervals = Math.floor((total_minutes - 60) / 60)

    chunk_seconds += additional_intervals * start_chunk_seconds
  }

  return Math.min(chunk_seconds, MAX_CHUNK_SECONDS)
}

if (import.meta.vitest) {
  describe(calculate_chunk_seconds, () => {
    const SIXTY_MINUTES = 3600

    test('returns default chunk seconds for less than 60 minutes', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES - 1)).toBe(DEFAULT_CHUNK_SECONDS)
    })

    test('handles exactly 60 minutes correctly', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES)).toBe(DEFAULT_CHUNK_SECONDS)
    })

    test('return default chunk second as long as time is not at least twice the threshold', () => {
      expect(calculate_chunk_seconds((SIXTY_MINUTES * 2) - 1)).toBe(DEFAULT_CHUNK_SECONDS)
    })

    test('increases chunk size beyond 120 minutes (default threshold)', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 2)).toBe(DEFAULT_CHUNK_SECONDS * 2)
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 3)).toBe(DEFAULT_CHUNK_SECONDS * 3)
    })

    test('handles custom start chunk seconds', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES, 150)).toBe(150)
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 2, 150)).toBe(300)
    })

    test.skip('maxes out chunk size at 7 minutes to avoid Whisper transcription errors', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 10)).toBe(MAX_CHUNK_SECONDS)
    })
  })
}
