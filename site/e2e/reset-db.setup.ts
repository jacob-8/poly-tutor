import { test as setup } from '@playwright/test'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import DB from './db'

setup('reseed db', async () => {
  await startSupabase()
  const dataBase = new DB()
  await dataBase.executeQuery(`truncate table youtube_channels cascade;`)
  await dataBase.executeQuery(`truncate table auth.users cascade;`)
  const seedFilePath = '../supabase/seed.sql'
  const seedSql = readFileSync(seedFilePath, 'utf8')
  await dataBase.executeQuery(seedSql)
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
