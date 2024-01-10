import PG from 'pg'
// import { Client } from 'pg' // breaks because library is not written for ESM yet

export default class DB {
  async executeQuery(query: string) {
    const client = new PG.Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'postgres',
      password: 'postgres',
      port: 54322,
    })
    try {
      await client.connect()
      await client.query(query)
    } catch (error) {
      console.error('Error in connection/executing query:', error)
    } finally {
      await client.end().catch((error) => {
        console.error('Error ending client connection:', error)
      })
    }
  }
}

// this alternate option requires installing psql locally (set password to postgres) - which is a little bit of trouble and harder in CI so using node-postgres method above instead

// function reseedDbWindows() {
//   execSync(
//     'SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/clear-db-data.sql',
//     { stdio: 'ignore' }
//   )
//   execSync(
//     'SET PGPASSWORD=postgres&&psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/seed.sql'
//   )
// }

// function reseedDbLinux() {
//   execSync(
//     'PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/clear-db-data.sql',
//     { stdio: 'ignore' }
//   )
//   execSync(
//     'PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f ../supabase/seed.sql'
//   )
// }

// PGPASSWORD=postgres psql -U postgres -h 127.0.0.1 -p 54322 -f supabase/clear-db-data.sql // in Bash from project root
