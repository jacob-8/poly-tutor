import type { LocaleCode } from '$lib/i18n/locales'

export function speakPromise({text, rate, locale}: { text: string, rate: number, locale: LocaleCode}): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale
    utterance.rate = rate
    utterance.onend = () => {
      resolve()
    }
    speechSynthesis.speak(utterance)
  })
}
