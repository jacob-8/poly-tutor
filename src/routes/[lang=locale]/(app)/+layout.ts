import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'

export const load = async ({data: { access_token, refresh_token }}) => {
  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })
  const user = createUserStore({ supabase, authResponse, userKey: 'tutor_user', log: true })
  return { supabase, authResponse, user }
}
