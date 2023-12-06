import type { ParamMatcher } from '@sveltejs/kit'
import { Locales } from '$lib/i18n/locales'

export const match = ((param) => {
  return Object.keys(Locales).includes(param)
}) satisfies ParamMatcher
