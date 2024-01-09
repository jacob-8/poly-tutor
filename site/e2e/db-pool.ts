// https://medium.com/@Amr.sa/managing-database-integration-with-playwright-4b7484e98615
import PG from 'pg' // import all because library is not written for ESM yet

export default class DB {
  private pool: PG.Pool

  private DBConfig = {
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'postgres',
    port: 54322,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: false,
  }

  async getDBConnection(): Promise<PG.PoolClient> {
    if (!this.pool) {
      this.pool = new PG.Pool(this.DBConfig)
      const client = await this.pool.connect()
      console.info(`---------> √ DB connection has been established! <---------`)
      return client
    }
    return this.pool.connect()

  }

  async executeQuery(query: string): Promise<void> {
    try {
      const client: PG.PoolClient = await this.getDBConnection()
      const result: PG.QueryResult = await client.query(query)
      console.info(result.rows)
    } catch (error) {
      console.error('Error executing query:', error)
    }
  }
}
