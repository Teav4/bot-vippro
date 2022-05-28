import { Client } from 'pg'

interface dbProps {
  dbUser: string;
  dbPassword: string;
  dbName: string;
  dbHost: string;
}

export function connectPostgres(config: dbProps): Client {
  const { dbHost, dbName, dbPassword, dbUser } = config

  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: 5432,
  })

  client.connect()

  return client

}
