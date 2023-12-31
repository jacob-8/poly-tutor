import { dev } from '$app/environment'
import { getSession, getSupabase } from '$lib/supabase'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '$lib/supabase/constants'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (dev)
    await import('$lib/mocks/serverForHooks')

  // only useful for things that are guaranteed to run server-side but not for passing to the client
  const supabase = getSupabase()
  event.locals.supabase = supabase
  event.locals.getSession = () => {
    const access_token = event.cookies.get(ACCESS_TOKEN_COOKIE_NAME)
    const refresh_token = event.cookies.get(REFRESH_TOKEN_COOKIE_NAME)
    return getSession({ supabase, access_token, refresh_token })
  }

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%unocss-svelte-scoped.global%', 'unocss_svelte_scoped_global_styles'),
    // filterSerializedResponseHeaders(name) {
    //   return name === 'content-range' // Supabase needs the content-range header to properly paginate (as in the case of a GraphQL query, e.g. content-range: items 0-9/100)
    // },
  })
  return response
}
