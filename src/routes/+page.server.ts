import { redirect } from '@sveltejs/kit'
import { DEFAULT_LOCALE, findSupportedLocaleFromAcceptedLanguages, getSupportedLocale } from '$lib/i18n/locales'
import { ResponseCodes } from '$lib/responseCodes'

export const load = (({ cookies, request }) => {
  const chosenMotherLocale = cookies.get('mother-locale')
  const acceptedLanguage = findSupportedLocaleFromAcceptedLanguages(request.headers.get('accept-language'))
  const motherLocale = getSupportedLocale(chosenMotherLocale || acceptedLanguage) || DEFAULT_LOCALE
  const chosenLearningLocale = cookies.get('learning-locale')
  const learningLocale = chosenLearningLocale || motherLocale === 'en' ? 'zh-TW' : 'en'

  throw redirect(ResponseCodes.TEMPORARY_REDIRECT, `/${motherLocale}/${learningLocale}`)
})
