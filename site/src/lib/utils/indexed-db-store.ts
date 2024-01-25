import { openDB, type IDBPDatabase } from 'idb'
import { writable } from 'svelte/store'
import { createPersistedStore } from './persisted-store'

export const VOCAB_STORE_NAME = 'vocabulary'
export const VOCAB_KEY_PATH = 'user_id_with_language'

const db_name = 'poly-tutor'
const version = 1

let db: IDBPDatabase<unknown>

async function get_db() {
  if (!db) {
    // eslint-disable-next-line require-atomic-updates
    db = await openDB(db_name, version, {
      upgrade (db) {
        if (!db.objectStoreNames.contains(VOCAB_STORE_NAME))
          db.createObjectStore(VOCAB_STORE_NAME, { keyPath: VOCAB_KEY_PATH })
      }
    })
  }

  return db
}

export function createIndexedDBStore<T>({ store_name, key_path, key, initial_value, log}: {
  store_name: string
  key_path: string,
  key: string,
  initial_value: T,
  log: boolean
}) {
  if (typeof window === 'undefined') {
    const { subscribe, set } = writable<T>(initial_value)
    return { subscribe, set }
  }

  if (!('indexedDB' in window))
    return createPersistedStore<T>(`${store_name}_${key}`, initial_value, { syncTabs: true })

  const { subscribe, set } = writable<T>(initial_value, start)

  function start() {
    get_cached()
  }

  async function get_cached() {
    const db = await get_db()
    if (log) console.info(`getting ${key} row from ${store_name} table in ${db_name}`)
    const row = await db.get(store_name, key)
    if (log) console.info({row})
    if (row)
      set(row.data)
  }

  async function set_store_value(value: T) {
    set(value)
    const db = await get_db()
    if (log) console.info({putting_to_indexed_db: key, value})
    await db.put(store_name, { [key_path]: key, data: value })
  }

  return { subscribe, set: set_store_value }
}
