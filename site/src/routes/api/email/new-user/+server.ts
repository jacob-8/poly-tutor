import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { send_email } from '../send-email'
import { ResponseCodes } from '$lib/response-codes'
import { render_component_to_html } from '../render-component-to-html'
import NewUserWelcome from './NewUserWelcome.svelte'
import type { LanguageCode } from '$lib/i18n/locales'

export interface NewUserEmailRequestBody {
    language: LanguageCode
}

export const POST: RequestHandler = async ({ locals: { getSession }, request, fetch}) => {
  const { data: session_data, error: _error, supabase } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  try {
    const { language } = await request.json() as NewUserEmailRequestBody

    const html = render_component_to_html({
      component: NewUserWelcome,
      props: {
        language
      },
    })

    await send_email({
      from: { email: 'jacob@polylingual.dev', name: 'Jacob' },
      to: [{email: session_data.user.email}],
      subject: 'Welcome to Poly Tutor!',
      body: html,
      type: 'text/html',
    }, fetch)

    const { error: updating_welcome_email_error } = await supabase.from('profiles').update({ welcome_email_sent: new Date().toISOString() }).eq('id', session_data.user.id)
    if (updating_welcome_email_error)
      console.error({updating_welcome_email_error})

    return json({ result: 'success'})
  } catch (err) {
    console.error(`Error with email send request: ${err.message}`)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, `Error with email send request: ${err.message}`)
  }
}
