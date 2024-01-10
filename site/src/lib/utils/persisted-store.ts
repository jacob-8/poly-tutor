import { writable } from 'svelte/store'

export function createPersistedStore<T>(key: string, initialValue: T, { syncTabs } = { syncTabs: false }) {
  if (typeof window === 'undefined') {
    const { subscribe, set } = writable<T>(initialValue)
    return { subscribe, set }
  }

  const getCached = () => {
    const cachedValue = localStorage.getItem(key)
    if (cachedValue && cachedValue !== 'undefined')
      set(JSON.parse(cachedValue))
  }

  const start = () => {
    getCached()

    if (syncTabs) {
      window.addEventListener('storage', getCached)

      return () => {
        window.removeEventListener('storage', getCached)
      }
    }
  }

  const { subscribe, set } = writable<T>(initialValue, start)

  const setStoreValue = (updatedValue: T) => {
    set(updatedValue)
    localStorage.setItem(key, JSON.stringify(updatedValue))
  }

  return { subscribe, set: setStoreValue }
}
