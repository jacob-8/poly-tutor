import { dev } from '$app/environment'
import { getSession, getSupabase } from '$lib/supabase'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '$lib/supabase/constants'
// import fs from 'fs'

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (dev) {
    // const logFile = fs.createWriteStream(`./logs/${Date.now()}.txt`, { flags: 'a' }) // 'a' to append, 'w' to truncate the file every time the process starts.
    // console.warn = function (data: any) {
    //   logFile.write(JSON.stringify(data) + '\n')
    //   process.stdout.write(JSON.stringify(data) + '\n')
    // }

    await import('$lib/mocks/msw/hooks-server')
  }

  // only useful for things that are guaranteed to run server-side but not for passing to the client
  event.locals.getSession = () => {
    const supabase = getSupabase()
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
