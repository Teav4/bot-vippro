import { Client } from "pg"

export default class replyModel {
  client: Client

  constructor (client: Client) {
    this.client = client
  }

  resolveMessage = async (message: string): Promise<string|null> => {
    const result = await this.client.query(`SELECT reply FROM commands WHERE commands.msg = $1 LIMIT 1;`, [message])
    
    return result.rowCount === 0 ? null : result.rows[0].reply
  }
}