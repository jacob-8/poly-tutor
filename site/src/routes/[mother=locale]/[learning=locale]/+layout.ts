import type { LocaleCode } from '$lib/i18n/locales'
import { getTranslator } from '$lib/i18n'

export const load = (async ({ params: { mother, learning } }) => {
  const t = await getTranslator((mother as LocaleCode))
  return { mother, learning, t }
})
