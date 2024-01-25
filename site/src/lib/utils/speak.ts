import { browser } from '$app/environment'
import type { LocaleCode } from '$lib/i18n/locales'
import { get, writable } from 'svelte/store'

export const current_voice = writable<SpeechSynthesisVoice>(null)
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

// const default_zh_CN_voices = [
//   'Google 普通话（中国大陆）',
//   'Chinese China',
// ]

// const default_zh_TW_voices = [
//   'Google 國語（臺灣）',
//   'Chinese Taiwan',
// ]

const PREFERRED_VOICE_KEY = 'preferred_voice_name'

if (browser) load_preferred_voice()

function load_preferred_voice() {
  const stored_voice_name = localStorage.getItem(PREFERRED_VOICE_KEY)

  window.speechSynthesis.getVoices() // warm things up on mobile
  window.speechSynthesis.onvoiceschanged = function() {
    available_voices = window.speechSynthesis.getVoices()
    if (!available_voices.length) return
    console.info({voices: available_voices.map(({name}) => name)})

    const preferred_voice = available_voices.find(voice => voice.name === stored_voice_name)
    if (preferred_voice)
      return current_voice.set(preferred_voice)

    for (const voice_name of default_en_voices) {
      const default_voice = available_voices.find(voice => voice.name === voice_name)
      if (default_voice) {
        current_voice.set(default_voice)
        return
      }
    }
    current_voice.set(available_voices[0])
  }
}

export function get_voices() {
  return available_voices
}

export function set_preferred_voice(voice_name: string) {
  localStorage.setItem(PREFERRED_VOICE_KEY, voice_name)
  const selected_voice = available_voices.find(voice => voice.name === voice_name)
  if (selected_voice)
    current_voice.set(selected_voice)
}

export function speakPromise({text, rate, locale, volume }: { text: string, rate: number, locale: LocaleCode, volume?: number}): Promise<void> {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = locale
    utterance.rate = rate
    const voice = get(current_voice)
    if (voice) utterance.voice = voice
    utterance.volume = volume || 1
    utterance.onend = () => {
      resolve()
    }
    speechSynthesis.speak(utterance)
  })
}
