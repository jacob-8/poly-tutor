import { browser, dev } from '$app/environment'
import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'
import type { UserVocabulary } from '$lib/types.js'
import { createPersistedStore } from 'svelte-pieces'

export const load = async ({data: { access_token, refresh_token }}) => {
  if (browser && dev)
    await enableMocking()

  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })
  const user = createUserStore({ supabase, authResponse })
  const user_vocabulary = createPersistedStore<UserVocabulary>(`vocabulary_${authResponse?.data?.user?.id || 'no_user'}`, {}, true)
  return { supabase, authResponse, user, user_vocabulary }
}

async function enableMocking() {
  // TODO: only enable for actual dev, not for playwright tests
  // const { worker } = await import('$lib/mocks/msw/browser')
  // return worker.start({onUnhandledRequest: 'bypass'})
}
