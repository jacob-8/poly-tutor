/* eslint-disable require-atomic-updates */
import en from './locales/en.json'
import type { LocaleCode } from './locales'
import { merge } from './merge'

const loadedTranslations: Record<string, typeof en> = {
  en,
}

export async function getTranslator(locale: LocaleCode) {
  if (locale === 'en')
    return en

  if (!loadedTranslations[locale])
    loadedTranslations[locale] = await import(`./locales/${locale}.json`)

  return merge({ fallback: en, translation: loadedTranslations[locale]})
}
