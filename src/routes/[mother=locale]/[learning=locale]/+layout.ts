import type { LocaleCode } from '$lib/i18n/locales'
import { getTranslator } from '$lib/i18n'

export const load = (async ({ params: { mother } }) => {
  const t = await getTranslator((mother as LocaleCode))
  return { locale: mother, t }
})
