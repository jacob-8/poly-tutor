import { redirect } from '@sveltejs/kit'
import { getSupportedLocale } from '$lib/i18n/locales'
import { firstAcceptedLanguage } from './firstAcceptedLanguage'
import { ResponseCodes } from '$lib/responseCodes'

export const load = (({ cookies, request }) => {
  const chosenLocale = cookies.get('locale')
  const acceptedLanguageHeader = request.headers.get('accept-language')
  const acceptedLanguage = firstAcceptedLanguage(acceptedLanguageHeader)

  throw redirect(ResponseCodes.TEMPORARY_REDIRECT, `/${getSupportedLocale({chosenLocale, acceptedLanguage})}`)
})
