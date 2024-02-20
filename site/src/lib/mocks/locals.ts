import { ResponseCodes } from '$lib/response-codes'
import type { Supabase } from '$lib/supabase/database.types'
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

class FakeSupabase {
  private table = ''

  from(table: string): this {
    this.table = table
    console.info(`Table set to: ${table}`)
    return this
  }

  insert(data): this {
    console.info(`Inserted data into ${this.table}:`, data)
    return this
  }

  select(): this {
    console.info(`Selecting from ${this.table}`)
    return this
  }

  async single(): Promise<any> {
    console.info(`Fetching single record from ${this.table}`)
    return { data: 'Mocked single data', error: null }
  }
}

const supabase = new FakeSupabase() as unknown as Supabase

export const authenticatedLocal: App.Locals = {
  getSession: async () => ({
    data: { user, session: null },
    error: null,
    supabase,
  })
}

const error = new AuthError('Unauthorized', ResponseCodes.UNAUTHORIZED)

export const unAuthenticatedLocal: App.Locals = {
  getSession: async () => ({
    data: {
      user: null,
      session: null,
    },
    error,
    supabase,
  })
}
