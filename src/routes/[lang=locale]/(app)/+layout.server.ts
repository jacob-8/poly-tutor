import type { LayoutServerLoad } from './$types'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '$lib/supabase/constants'

export const load = (({ cookies }) => {
  const access_token = cookies.get(ACCESS_TOKEN_COOKIE_NAME)
  const refresh_token = cookies.get(REFRESH_TOKEN_COOKIE_NAME)
  return { access_token, refresh_token }
}) satisfies LayoutServerLoad
