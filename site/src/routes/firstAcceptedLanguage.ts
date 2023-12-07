export function firstAcceptedLanguage(acceptedLanguageHeader: string | null) {
  return acceptedLanguageHeader?.split(',')[0].trim()
}

if (import.meta.vitest) {
  describe(firstAcceptedLanguage, () => {
    const acceptedLanguageHeader = 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7'
    it('should return the first accepted language', () => {
      const actual = firstAcceptedLanguage(acceptedLanguageHeader)
      const expected = 'en-US'
      expect(actual).toEqual(expected)
    })

    it('handles null header', () => {
      const actual = firstAcceptedLanguage(null)
      expect(actual).toEqual(undefined)
    })
  })
}
