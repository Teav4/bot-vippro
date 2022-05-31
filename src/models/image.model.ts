import { Client } from "pg"

export default class imageModel {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  getRandomImage = async (): Promise<string|null> => {
    const result = await this.client.query(`SELECT url FROM image ORDER BY random() LIMIT 1;`)
    
    return result.rowCount === 0 ? null : result.rows[0].url
  }
}
