import { browser } from '$app/environment'
import type { LocaleCode } from '$lib/i18n/locales'
import { get, writable } from 'svelte/store'

export const current_voices = writable<Record<LocaleCode, SpeechSynthesisVoice>>({
  en: null,
  'zh-CN': null,
  'zh-TW': null,
})
let available_voices: SpeechSynthesisVoice[] = []

const default_en_voices = [
  // Windows
  'Google UK English Male',
  'Google UK English Female',
  'Google US English',
  'Microsoft Mark - English (United States)',

  // Android
  'English United Kingdom',
  'English United States',
]

const default_zh_CN_voices = [
  'Google 普通话（中国大陆）',
  'Chinese China',
]

const default_zh_TW_voices = [
  'Google 國語（臺灣）',
  'Chinese Taiwan',
]

const default_voices: Record<LocaleCode, string[]> = {
  en: default_en_voices,
  'zh-CN': default_zh_CN_voices,
  'zh-TW': default_zh_TW_voices,
}

const PREFERRED_VOICE_KEY = 'preferred_voice_name'

if (browser) load_preferred_voices()

function load_preferred_voices() {
  window.speechSynthesis.getVoices() // warm things up on mobile
  window.speechSynthesis.onvoiceschanged = function() {
    available_voices = window.speechSynthesis.getVoices()
    if (!available_voices.length) return

    set_language_voices('en', available_voices)
    set_language_voices('zh-CN', available_voices)
    set_language_voices('zh-TW', available_voices)
  }
}

function set_language_voices(locale: LocaleCode, available_voices: SpeechSynthesisVoice[]) {
  const stored_voice_name = localStorage.getItem(`${locale}_${PREFERRED_VOICE_KEY}`)

  const preferred_voice = available_voices.find(voice => voice.name === stored_voice_name)
  if (preferred_voice)
    return current_voices.update(v => ({...v, [locale]: preferred_voice}))

  for (const voice_name of default_voices[locale]) {
    const default_voice = available_voices.find(voice => voice.name === voice_name)
    if (default_voice)
      return current_voices.update(v => ({...v, [locale]: default_voice}))
  }

  current_voices.update(v => ({...v, [locale]: available_voices[0]}))
}

export function get_voices() {
  return available_voices
}

export function set_preferred_voice(locale: LocaleCode, voice_name: string) {
  localStorage.setItem(`${locale}_${PREFERRED_VOICE_KEY}`, voice_name)
  const selected_voice = available_voices.find(voice => voice.name === voice_name)
  if (selected_voice)
    current_voices.update(v => ({...v, [locale]: selected_voice}))
}

export function speech({text, rate, locale, volume }: { text: string, rate: number, locale: LocaleCode, volume?: number}): {stop: () => void, speak: () => Promise<void>} {
  let resolve: () => void
  let reject: (reason?: string) => void

  const speak = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = locale
  utterance.rate = rate
  const voices = get(current_voices)
  if (voices) utterance.voice = voices[locale]
  utterance.volume = volume || 1
  speechSynthesis.speak(utterance)

  utterance.onend = () => {
    resolve()
  }

  return {
    speak: () => speak,
    stop: () => {
      speechSynthesis.cancel()
      reject('canceled')
    }
  }
}
