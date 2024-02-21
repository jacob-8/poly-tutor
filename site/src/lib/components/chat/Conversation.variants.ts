import type { Variant, Viewport } from 'kitbook'
import type Component from './Conversation.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'
import { get } from 'svelte/store'
import { chat } from '$lib/mocks/data/streaming-chat'

export const viewports: Viewport[] = [
  { width: 600, height: 800 },
]

export const variants: Variant<Component>[] = [
  {
    props: {
      language: 'zh',
      settings: get(mockLayoutData.settings),
      chat,
    },
  },
]
