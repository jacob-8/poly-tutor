import { ResponseCodes } from '$lib/responseCodes'
import type { RequestHandler } from './$types'
import { json, error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals: { getSession } }) => {
  const { data: session_data, error: _error } = await getSession()

  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error?.message || 'Unauthorized' })

  // getSession must be changed into a function that returns both supabase and session if we want to run normal supabase on the server - so far we are just using full supabase (admin) on the server
  // const { data: table_data } = await supabase.from('test').select('*')

  const response = await fetch('https://jsonplaceholder.typicode.com/todos/2')
  return json({ data: await response.json() })
}
