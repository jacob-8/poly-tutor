import type { ParamMatcher } from '@sveltejs/kit'
import { Locales, type LocaleCode } from '$lib/i18n/locales'

export const match = ((locale): locale is LocaleCode => {
  return Object.keys(Locales).includes(locale)
}) satisfies ParamMatcher
