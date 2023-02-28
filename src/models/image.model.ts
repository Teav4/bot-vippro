import { Client, QueryResultRow } from "pg"
import { logService } from "../services/log"

export default class imageModel {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  getRandomImage = async (): Promise<string|null> => {
    const result = await this.client.query(`SELECT id, url FROM image ORDER BY random() LIMIT 1;`)
    logService('[random image]', `${result.rows[0].id} - ${result.rows[0].url}`)
    
    return result.rowCount === 0 ? null : result.rows[0].url
  }

  insertImage = async (from: string, url: string, tags: string, metadata: string): Promise<QueryResultRow> => {
    const response = await this.client.query(`INSERT INTO image("from", "url", "tags", "metadata") VALUES($1, $2, $3, $4);`, [from, url, tags, metadata])
    return response
  }

  resetDB = async(): Promise<QueryResultRow> => {
    const response = await this.client.query(`DELETE FROM image WHERE true;`)
    return response
  }

}
