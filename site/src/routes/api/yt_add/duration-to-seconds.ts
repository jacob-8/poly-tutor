/* eslint-disable no-magic-numbers */
export function youtube_pt_format_duration_to_seconds(duration: string): number {
  // eslint-disable-next-line prefer-named-capture-group
  const DAYS_HOURS_MINUTES_SECONDS = /P((?<days>\d+)D)?T((?<hours>\d+)H)?((?<minutes>\d+)M)?((?<seconds>\d+)S)?/
  const match = duration.match(DAYS_HOURS_MINUTES_SECONDS)

  if (!match?.groups)
    return null

  const { days, hours, minutes, seconds } = match.groups

  return (
    (parseInt(days || '0', 10) * 24*60*60) +
    (parseInt(hours || '0', 10) * 60*60) +
    (parseInt(minutes || '0', 10) * 60) +
    parseInt(seconds || '0', 10)
  )
}

if (import.meta.vitest) {
  describe(youtube_pt_format_duration_to_seconds, () => {
    test('parses seconds', () => {
      expect(youtube_pt_format_duration_to_seconds('PT49S')).toBe(49)
    })

    test('parses minutes and seconds', () => {
      expect(youtube_pt_format_duration_to_seconds('PT12M20S')).toBe(740)
    })

    test('parses hours, minutes, seconds', () => {
      expect(youtube_pt_format_duration_to_seconds('PT1H39M27S')).toBe(5967)
    })
  })

  test('parses days, minutes, seconds', () => {
    expect(youtube_pt_format_duration_to_seconds('P1DT51M37S')).toBe(89497)
  })

  test('returns null if cannot parse', () => {
    expect(youtube_pt_format_duration_to_seconds('foo')).toBeNull()
  })

}
