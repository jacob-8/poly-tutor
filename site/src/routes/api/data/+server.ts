import { ResponseCodes } from '$lib/responseCodes'
import type { RequestHandler } from './$types'
import { json, error } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals: { getSession, supabase } }) => {
  // const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  // const posts = await response.json()
  // return json(posts)

  const { data: session_data, error: _error } = await getSession()

  if (_error || !session_data?.user)
    throw error(ResponseCodes.UNAUTHORIZED, { message: _error?.message || 'Unauthorized' })

  const { data: table_data } = await supabase.from('test').select('*')

  return json({ table_data })
}
