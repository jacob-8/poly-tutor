/* eslint-disable no-magic-numbers */
export function format_time(seconds: number): string {
  const inputSeconds = Math.round(seconds ?? 0)

  const hours = Math.floor(inputSeconds / 3600)
  const minutes = Math.floor((inputSeconds % 3600) / 60)
  const remainingSeconds = inputSeconds % 60

  let result = ''

  if (hours)
    result += `${hours}:`

  result += `${minutes.toString().padStart(hours ? 2 : 1, '0')}:${remainingSeconds.toString().padStart(2, '0')}`

  return result
}

if (import.meta.vitest) {
  describe('format_time', () => {
    test('converts seconds to readable format without hours', () => {
      expect(format_time(345)).toBe('5:45')
    })

    test('converts seconds to readable format with hours', () => {
      expect(format_time(3804)).toBe('1:03:24')
    })

    test('does not show leading zero for single-digit minutes', () => {
      expect(format_time(9 * 60 + 5)).toBe('9:05')
    })

    test('shows leading zero for single-digit seconds', () => {
      expect(format_time(1 * 60 + 9)).toBe('1:09')
    })

    test('shows hours only when needed', () => {
      expect(format_time(3600)).toBe('1:00:00')
      expect(format_time(3599)).toBe('59:59')
    })

    test('handles edge cases', () => {
      expect(format_time(0)).toBe('0:00')
      expect(format_time(1)).toBe('0:01')
      expect(format_time(60)).toBe('1:00')
    })

    test('handles undefined', () => {
      expect(format_time(undefined)).toBe('0:00')
    })
  })
}
