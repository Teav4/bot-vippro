import { QueryResultRow } from "pg"
import imageModel from "./image.model"

export default class b2ArtModel extends imageModel  {

  getRandomImage = async (): Promise<string|null> => {
    const result = await this.client.query(`SELECT url FROM b2_art ORDER BY random() LIMIT 1;`)
    
    return result.rowCount === 0 ? null : result.rows[0].url
  }

  insertImage = async (name: string, url: string): Promise<QueryResultRow> => {
    const response = await this.client.query(`INSERT INTO b2_art("name", "url") VALUES($1, $2);`, [name, url])
    return response
  }
  
  resetDB = async(): Promise<QueryResultRow> => {
    const response = await this.client.query(`DELETE FROM b2_art WHERE true;`)
    return response
  }

}
