import Api from '../../lib/api'
import type { Client } from 'pg'
import { handleMessage } from './handleMessage'
import { initModels } from './initModels'
import { IncomingMessage } from '../../lib/types/incomingMessages'

const routes = async (message: IncomingMessage, api: Api, pgClient: Client): Promise<void> => {

  await initModels(message, api)
  await handleMessage(message, api, pgClient)
}

export default routes
