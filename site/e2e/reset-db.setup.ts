import { test as setup } from '@playwright/test'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import DB from './db'
import { exportToSql } from '$lib/mocks/seed/write-seed'

setup('reseed db', async () => {
  await startSupabase()
  const dataBase = new DB()

  await dataBase.executeQuery(`truncate table youtube_channels cascade;`)
  await dataBase.executeQuery(`truncate table auth.users cascade;`)

  const seedSql = exportToSql()
  await dataBase.executeQuery(seedSql)
  const seedFilePath = '../supabase/seed.sql'
  writeFileSync(seedFilePath, seedSql)
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
