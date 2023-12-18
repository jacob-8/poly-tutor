import { ResponseCodes } from '$lib/responseCodes'
import { AuthError, type User } from '@supabase/supabase-js'

const user: User = {
  id: '1',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'vitest@mock.com',
  app_metadata: null,
  user_metadata: null,
  created_at: '2021-08-11T09:16:36.000Z',
}

export const authenticatedLocal: App.Locals = {
  getSession: async () => ({
    data: {user, session: null},
    error: null
  })
}

const error = new AuthError('Unauthorized', ResponseCodes.UNAUTHORIZED)

export const unAuthenticatedLocal: App.Locals = {
  getSession: async () => ({
    data: {
      user: null,
      session: null,
    },
    error
  })
}
