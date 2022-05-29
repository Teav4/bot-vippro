/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { commandInit } from '../utils'
import { IncomingMessage } from '../../lib/types/incomingMessages'
import { replyController } from '../controllers/ReplyController'
import { sankakuController } from '../controllers/sankakuController'
import Api from '../../dist/lib/api'
import { connectPostgres } from '../database/connect'
import config from '../../config/index.config'
import { logService } from '../services/log'
import { SankakuClient } from '../services/sankakuClient'

const client = connectPostgres({
  dbHost: config.POSTGRES_HOST as string,
  dbName: config.POSTGRES_DB as string,
  dbUser: config.POSTGRES_USER as string,
  dbPassword: config.POSTGRES_PASSWORD as string,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes = async (message: any, api: Api): Promise<void> => {

  const reply = new replyController(api, client)
  const sankakuClient = new SankakuClient({})
  await sankakuClient.login({ username: config.SANKAKU_USERNAME as string, password: config.SANKAKU_PASSWORD as string })
  const sankaku = new sankakuController(api, sankakuClient)

  if (typeof message.body === 'string') {
    const msg: IncomingMessage = message
    const { commandIs } = commandInit(msg.body)
    logService('message:'+msg.threadId, msg.body)
  
    if (commandIs('hello')) {
      reply.sayHello(msg)
      return
    }

    if (commandIs('ko gaoga')) {
      api.sendMessage({ body: 'ko triga' }, msg.threadId)
      return
    }

    if (commandIs('ko triga')) {
      api.sendMessage({ body: 'triga qua non' }, msg.threadId)
      return
    }

    if (commandIs('daily') || commandIs('💸') || commandIs('🦹‍♂️')) {
      sankaku.dailyGenshin(msg)
      return
    }

    reply.fromDb(message)
  }
}

export default routes
