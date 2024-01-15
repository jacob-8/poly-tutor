import { writable } from 'svelte/store'
import type { AuthResponse, Session, User } from '@supabase/supabase-js'
import type { Supabase } from './database.types'
import { setCookie } from '$lib/utils/cookies'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './constants'
import type { GoogleAuthUserMetaData } from '$lib/types'
const browser = typeof window !== 'undefined'

export type BaseUser = User & {
  user_metadata: GoogleAuthUserMetaData
}

/** Subscribes to current user, caches it to local storage, and sets cookie for server-side rendering. */
export function createUserStore({ supabase, authResponse, log = false }: { supabase: Supabase, authResponse: AuthResponse, log?: boolean }) {
  const { subscribe, set } = writable<BaseUser>(authResponse?.data.user)

  if (!browser)
    return { subscribe }

  const user_key = `tutor_user_${authResponse?.data?.user?.id || 'no_user'}`

  const cached = localStorage.getItem(user_key)
  if (cached)
    set(JSON.parse(cached))

  supabase.auth.onAuthStateChange((event, session) => {
    if (log) console.info({authStateChangeEvent: event})
    if (session) {
      // if (_session?.expires_at !== session?.expires_at)
      const { user } = session
      set(user)
      if (browser)
        cacheUser({user, session, user_key})
    } else {
      set(null)
      if (log) console.info('set user to null')
      removeCachedUser(user_key)
    }
  })

  return {
    subscribe,
  }
}

function cacheUser({ user, session, user_key }: { user: BaseUser, session: Session, user_key: string}) {
  localStorage.setItem(user_key, JSON.stringify(user))

  const century = 100 * 365 * 24 * 60 * 60
  setCookie(ACCESS_TOKEN_COOKIE_NAME, session.access_token, { maxAge: century, path: '/', sameSite: 'lax' })
  setCookie(REFRESH_TOKEN_COOKIE_NAME, session.refresh_token, { maxAge: century, path: '/', sameSite: 'lax' })

  // Cookies are limited to 4kb, about 1,000-4000 characters
  // const minimalUser: Partial<BaseUser> = {
  //   uid: user.uid,
  //   displayName: user.displayName,
  //   email: user.email,
  //   photoURL: user.photoURL || null,
  // }
}

function removeCachedUser(user_key: string) {
  localStorage.removeItem(user_key)

  const yearsAgo = new Date(0)
  setCookie(ACCESS_TOKEN_COOKIE_NAME, '', { expires: yearsAgo, path: '/', sameSite: 'lax' })
  setCookie(REFRESH_TOKEN_COOKIE_NAME, '', { expires: yearsAgo, path: '/', sameSite: 'lax' })
}
