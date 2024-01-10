export const DEFAULT_LOCALE = 'en'

export type LocaleCookieKey = 'mother-locale' | 'learning-locale'

export enum Locales {
  'en' = 'English',
  'zh-TW' = '繁體中文',
  'zh-CN' = '简体中文',
}

export type LocaleCode = keyof typeof Locales

export enum Languages {
  'en' = 'English',
  'zh' = '中文',
}

export type LanguageCode = keyof typeof Languages

export function findSupportedLocaleFromAcceptedLanguages(acceptedLanguageHeader: string | null) {
  const locales = acceptedLanguageHeader
    ?.split(',')
    ?.map(lang => lang.split(';')[0].trim()) ?? []
  for (const locale of locales) {
    const supportedLocale = getSupportedLocale(locale)
    if (supportedLocale)
      return supportedLocale
  }
}

if (import.meta.vitest) {
  describe(findSupportedLocaleFromAcceptedLanguages, () => {
    it('return shortened (acceptable) form of dialect', () => {
      const acceptedLanguageHeader = 'en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7'
      expect(findSupportedLocaleFromAcceptedLanguages(acceptedLanguageHeader)).toEqual('en')
    })

    it('returns 2nd accepted if 1st not supported', () => {
      expect(findSupportedLocaleFromAcceptedLanguages('foo,en-GB')).toEqual('en')
    })

    it('handles null header', () => {
      expect(findSupportedLocaleFromAcceptedLanguages(null)).toEqual(undefined)
    })
  })
}

export function getSupportedLocale(locale: string | null | undefined): LocaleCode | undefined {
  if (!locale) return
  if (Object.keys(Locales).includes(locale)) return locale as LocaleCode

  if (['en-US', 'en-GB'].includes(locale)) return 'en'
  if (['zh', 'zh-Hant', 'zh-HK', 'zh-MO'].includes(locale)) return 'zh-TW'
  if (['zh-Hans', 'zh-SG'].includes(locale)) return 'zh-CN'
}

if (import.meta.vitest) {
  describe(getSupportedLocale, () => {
    test('returns supported locales', () => {
      expect(getSupportedLocale('en')).toEqual('en')
      expect(getSupportedLocale('zh-CN')).toEqual('zh-CN')
    })

    test('maps accepted-language to logical match', () => {
      expect(getSupportedLocale('en-GB')).toEqual('en')
      expect(getSupportedLocale('zh')).toEqual('zh-TW')
      expect(getSupportedLocale('zh-Hant')).toEqual('zh-TW')
      expect(getSupportedLocale('zh-Hans')).toEqual('zh-CN')
    })

    test('returns undefined for unsupported locale', () => {
      expect(getSupportedLocale('xx')).toBe(undefined)
    })
  })
}
