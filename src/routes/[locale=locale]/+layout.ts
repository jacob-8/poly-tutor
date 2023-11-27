import type { LocaleCode } from '$lib/i18n/locales'
import { getTranslator } from '$lib/i18n'

export const load = (async ({ params: { locale } }) => {
  const t = await getTranslator((locale as LocaleCode))
  return { locale, t }
})
