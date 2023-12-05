import { Locales } from '$lib/i18n/locales'
import type { ChatCompletionRequestMessage } from 'openai-edge'
import type { EntryGenerator } from './$types'

export const entries = (() => {
  return Object.keys(Locales).map(locale => ({ locale }))
}) satisfies EntryGenerator

export const prerender = true

export const load = (() => {
  const savedMessages: ChatCompletionRequestMessage[] = []
  return { savedMessages }
})
