import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'
import { createPersistedStore } from 'svelte-pieces'

export const load = async ({data: { access_token, refresh_token }}) => {
  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })
  const user = createUserStore({ supabase, authResponse, log: true })
  const user_vocabulary = createPersistedStore<string[]>(`vocabulary_${authResponse?.data?.user?.id || 'no_user'}`, [], true)
  return { supabase, authResponse, user, user_vocabulary }
}
