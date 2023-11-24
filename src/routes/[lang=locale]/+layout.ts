import type { LocaleCode } from '$lib/i18n/locales'
import { getTranslator } from '$lib/i18n'

export const load = (async ({ params: { lang } }) => {
  const locale = lang as LocaleCode
  const t = await getTranslator(locale)
  return { locale, t }
})
