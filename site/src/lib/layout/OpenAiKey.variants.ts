import type { Variant, Viewport } from 'kitbook'
import type Component from './OpenAiKey.svelte'

export const viewports: Viewport[] = [
  { width: 320, height: 400 },
  { width: 800, height: 400 },
]

export const variants: Variant<Component>[] = [
  {
    name: 'has key',
    props: {
      key: 'sk-45678901234567890',
      set_key: (key) => alert(`set key to ${key}`),
      close: () => alert('close')
    }
  },
  {
    name: 'no key',
    props: {
      key: null,
      set_key: (key) => alert(`set key to ${key}`),
      close: () => alert('close')
    }
  },
]

