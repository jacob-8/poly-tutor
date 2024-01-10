/* eslint-disable no-magic-numbers */

export function tone_marker(tone: number): string {
  if (tone === 1) return 'ˉ'
  if (tone === 2) return 'ˊ'
  if (tone === 3) return 'ˇ'
  if (tone === 4) return 'ˋ'
  if (tone === 5) return '˙'
}

export function find_tone(word: string): number {
  const normalized = word.normalize('NFD')
  for (const letter of normalized) {
    switch (letter) {
    case '\u0304':
      return 1
    case '\u0301':
      return 2
    case '\u030C':
      return 3
    case '\u0300':
      return 4
    }
  }
  return 5
}

if (import.meta.vitest) {
  test('findTone returns 1 from hēi', () => {
    expect(find_tone('hēi')).toBe(1)
  })

  test('findTone returns 2 from píng', () => {
    expect(find_tone('píng')).toBe(2)
  })

  test('findTone returns 3 from wǒ', () => {
    expect(find_tone('wǒ')).toBe(3)
  })
  test('findTone returns 4 from yòu', () => {
    expect(find_tone('yòu')).toBe(4)
  })

  test('findTone returns 5 from de (no tone)', () => {
    expect(find_tone('de')).toBe(5)
  })

}
