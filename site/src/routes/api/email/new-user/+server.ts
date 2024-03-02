import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { send_email } from './send-email'
import { ResponseCodes } from '$lib/response-codes'

export interface NewUserEmailRequestBody {
    email: string
    name: string
}

export const POST: RequestHandler = async ({ locals: { getSession }, request, fetch}) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  try {
    const { name } = await request.json() as NewUserEmailRequestBody

    await send_email({
      from: { email: 'jacob@polylingual.dev', name: 'Jacob' },
      to: [{email: session_data.user.email, name}],
      subject: 'Welcome to Poly Tutor!',
      body: `Hi ${name},\n\nWelcome to Poly Tutor!`,
      type: 'text/plain',
    }, fetch)

    return json({ result: 'success'})
  } catch (err) {
    console.error(`Error with email send request: ${err.message}`)
    error(ResponseCodes.INTERNAL_SERVER_ERROR, `Error with email send request: ${err.message}`)
  }
}
