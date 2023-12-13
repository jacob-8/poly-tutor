import { test as setup } from '@playwright/test'
// @ts-expect-error
import { execSync } from 'child_process'

setup('reset db', async () => {
  await startSupabase()
  reseedDb()
})

async function startSupabase() {
  try {
    await fetch('http://127.0.0.1:54321/') // will throw error if db port not listening
    console.info('Supabase is running')
  } catch {
    console.warn('Supabase not detected - Starting it now')
    execSync('pnpx supabase start')
  }
}

// requires installing psql locally and setting password to postgres
function reseedDb() {
  // Windows version when running from e2e tests
  execSync(
    'SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/clear-db-data.sql',
    { stdio: 'ignore' }
  )
  // PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql // in Bash from project root

  execSync(
    'SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/seed.sql'
  )
}
