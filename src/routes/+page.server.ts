import { redirect } from '@sveltejs/kit'
import { getSupportedLocale } from '$lib/i18n/locales'
import { firstAcceptedLanguage } from './firstAcceptedLanguage'

const TEMPORARY_REDIRECT = 307

export const load = (({ cookies, request }) => {
  const chosenLocale = cookies.get('locale')
  const acceptedLanguageHeader = request.headers.get('accept-language')
  const acceptedLanguage = firstAcceptedLanguage(acceptedLanguageHeader)

  throw redirect(TEMPORARY_REDIRECT, `/${getSupportedLocale({chosenLocale, acceptedLanguage})}`)
})
