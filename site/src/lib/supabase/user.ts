import { writable } from 'svelte/store'
import type { AuthResponse, Session, SupabaseClient } from '@supabase/supabase-js'
import { setCookie } from '$lib/utils/cookies'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './constants'
const browser = typeof window !== 'undefined'

export interface BaseUser {
  session: Session,
  // TODO profile:  // custom name, etc...
}

/** Subscribes to current user, caches it to local storage, NOT YET: as well as sets a cookie to allow for server-side rendering. */
export function createUserStore({ supabase, authResponse, userKey = 'supabase_user', log = false }: { supabase: SupabaseClient, authResponse: AuthResponse, userKey?: string, log?: boolean }) {

  const { subscribe, set } = writable<BaseUser>(authResponse?.data)

  if (!browser)
    return { subscribe }

  const cached = localStorage.getItem(userKey)
  if (cached)
    set(JSON.parse(cached))

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (log) console.info({authStateChangeEvent: event})
    if (session) {
      // if (_session?.expires_at !== session?.expires_at)
      const user = { session }
      set(user)
      if (browser) {
        const century = 100 * 365 * 24 * 60 * 60
        cacheUser(user, userKey)
        setCookie(ACCESS_TOKEN_COOKIE_NAME, session.access_token, { maxAge: century, path: '/', sameSite: 'lax' })
        setCookie(REFRESH_TOKEN_COOKIE_NAME, session.refresh_token, { maxAge: century, path: '/', sameSite: 'lax' })
      }
    } else {
      set(null)
      if (log) console.info('set user to null')
      removeCachedUser(userKey)
      const yearsAgo = new Date(0)
      setCookie(ACCESS_TOKEN_COOKIE_NAME, '', { expires: yearsAgo, path: '/', sameSite: 'lax' })
      setCookie(REFRESH_TOKEN_COOKIE_NAME, '', { expires: yearsAgo, path: '/', sameSite: 'lax' })
    }
  })

  return {
    subscribe,
  }
}

function cacheUser(user: BaseUser, userKey: string) {
  localStorage.setItem(userKey, JSON.stringify(user))
  // const minimalUser: Partial<BaseUser> = {
  //   uid: user.uid,
  //   displayName: user.displayName,
  //   email: user.email,
  //   photoURL: user.photoURL || null,
  // } // Cookies are limited to 4kb, about 1,000-4000 characters
  // setCookie('user', JSON.stringify(minimalUser), { maxAge: 31536000 })
}

function removeCachedUser(userKey: string) {
  localStorage.removeItem(userKey)
  // setCookie('user', null, { expires: new Date(0) })
}

// import { type Unsubscriber } from 'svelte/store'
// import { setCookie } from '../helpers/cookies'

// const denoteVisitOnce = (() => {
//   let denoted = false
//   return async function (user: IBaseUser) {
//     if (!denoted) {
//       denoted = true
//       try {
//         const db = getFirestore()
//         await updateDoc(doc(db, 'users', user.uid), { lastVisit: serverTimestamp() })
//       } catch (err) {
//         console.error(err)
//       }
//       return true
//     }
//     return true

//   }
// })()
