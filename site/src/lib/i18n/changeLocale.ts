// import { goto } from '$app/navigation'
import type { LocaleCode, LocaleCookieKey } from './locales'
import { page } from '$app/stores'
import { get } from 'svelte/store'

export function changeLocale(mother: LocaleCode, learning: LocaleCode) {
  const { url } = get(page)

  setLocaleCookie(mother, 'mother-locale')
  setLocaleCookie(learning, 'learning-locale')

  const newUrl = url.href.replace(url.origin, '')
    .replace(/^\/[^/]+\/[^/]+/, `/${mother}/${learning}`)
  // goto(newUrl, { invalidateAll: true }) // SvelteKit method - invalidateAll required to force layout loads to re-run if using switches from language A to B and back to A
  location.assign(newUrl)
}

function setLocaleCookie(locale: LocaleCode, key: LocaleCookieKey) {
  const HUNDRED_YEARS = 60 * 60 * 24 * 365 * 100 // seconds * minutes * hours * days * years
  document.cookie = `${key}=${locale}; max-age=${HUNDRED_YEARS}; path=/; samesite=strict`
}
