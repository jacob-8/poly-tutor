import { test as setup } from '@playwright/test'
import { execSync } from 'child_process'
import { write_seed_and_reset_db } from '$lib/mocks/seed/write-seed-and-reset-db'

setup('reseed db', async () => {
  await startSupabase()
  await write_seed_and_reset_db()
})

async function startSupabase() {
  try {
    await fetch('http://127.0.0.1:54321/') // will throw error if db port not listening
    console.info('Supabase is running')
  } catch {
    console.warn('Supabase not detected - Starting it now')
    execSync('pnpx supabase start')
    console.warn('Supabase started')
  }
}
