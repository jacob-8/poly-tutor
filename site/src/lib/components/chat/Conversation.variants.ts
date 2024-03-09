import type { Variant, Viewport } from 'kitbook'
import type Component from './Conversation.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import { get } from 'svelte/store'
import { chat } from '$lib/mocks/data/streaming-chat'

export const viewports: Viewport[] = [
  { width: 600, height: 800 },
]

function promisify_value<T>(value: T) {
  return new Promise<T>(resolve => resolve(value))
}

export const variants: Variant<Component>[] = [
  {
    props: {
      language: 'zh',
      learning: 'en',
      settings: get(mockLayoutData.settings),
      chat,
      transcribe_audio: (audio) => promisify_value('hello ' + audio.name)
    },
  },
]
