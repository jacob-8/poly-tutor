/* eslint-disable no-magic-numbers */
const TWO_MINUTES = 120

export function calculate_chunk_seconds(total_seconds: number, start_chunk_seconds = TWO_MINUTES) {
  const total_minutes = total_seconds / 60
  let chunk_seconds = start_chunk_seconds

  // For every additional 60 minutes, increase chunk size by 60 seconds (1 minute)
  if (total_minutes > 60) {
    // Calculate the number of 60-minute intervals beyond the initial 60 minutes
    const additional_intervals = Math.floor((total_minutes - 60) / 60)

    chunk_seconds += additional_intervals * start_chunk_seconds
  }

  return chunk_seconds
}

if (import.meta.vitest) {
  describe(calculate_chunk_seconds, () => {
    const SIXTY_MINUTES = 3600

    it('should return default chunk seconds for less than 60 minutes', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES - 1)).toBe(TWO_MINUTES)
    })

    it('should increase chunk size correctly beyond 60 minutes', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 2)).toBe(TWO_MINUTES * 2)
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 3)).toBe(TWO_MINUTES * 3)
    })

    it('should handle custom start chunk seconds', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES, 150)).toBe(150)
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 2, 150)).toBe(300)
    })

    it('should scale correctly for large total seconds', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES * 10)).toBe(TWO_MINUTES * 10)
    })

    it('should handle exactly 60 minutes correctly', () => {
      expect(calculate_chunk_seconds(SIXTY_MINUTES)).toBe(TWO_MINUTES)
    })
  })
}
