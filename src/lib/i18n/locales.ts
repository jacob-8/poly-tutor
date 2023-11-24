export const DEFAULT_LOCALE = 'en'
export enum Locales {
  en = 'English',
  'zh-TW' = '繁體中文',
  'zh-CN' = '简体中文',
}

export type LocaleCode = keyof typeof Locales

export function getSupportedLocale({ chosenLocale, acceptedLanguage }: { chosenLocale?: string | null, acceptedLanguage?: string | null }) {
  return isSupportedLocale(chosenLocale)
    || isSupportedLocale(acceptedLanguage)
    || DEFAULT_LOCALE
}

function isSupportedLocale(locale: string | null | undefined) {
  if (!locale) return false
  if (Object.keys(Locales).includes(locale)) return locale

  if (['en-US', 'en-GB'].includes(locale)) return 'en'
  if (['zh', 'zh-Hant', 'zh-HK', 'zh-MO'].includes(locale)) return 'zh-TW'
  if (['zh-Hans', 'zh-SG'].includes(locale)) return 'zh-CN'
}

if (import.meta.vitest) {
  describe(getSupportedLocale, () => {
    test('returns supported chosen locales', () => {
      expect(getSupportedLocale({chosenLocale: 'en'})).toEqual('en')
      expect(getSupportedLocale({chosenLocale: 'zh-CN'})).toEqual('zh-CN')
    })

    test('maps accepted-language to logical match', () => {
      expect(getSupportedLocale({acceptedLanguage: 'en-GB'})).toEqual('en')
      expect(getSupportedLocale({acceptedLanguage: 'zh'})).toEqual('zh-TW')
      expect(getSupportedLocale({acceptedLanguage: 'zh-Hant'})).toEqual('zh-TW')
      expect(getSupportedLocale({acceptedLanguage: 'zh-Hans'})).toEqual('zh-CN')
    })

    test('unsupported returns en', () => {
      expect(getSupportedLocale({acceptedLanguage: 'de'})).toEqual('en')
    })

    test('chosen wins out over accepted', () => {
      expect(getSupportedLocale({chosenLocale: 'zh-TW', acceptedLanguage: 'en'})).toEqual('zh-TW')
    })
  })
}
