/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { commandInit } from '../utils'
import { IncomingMessage } from '../../lib/types/incomingMessages'
import { replyController } from '../controllers/ReplyController'
import Api from '../../lib/api'
import { connectPostgres } from '../database/connect'
import config from '../../config/index.config'
import { logService } from '../services/log'
import { randomOfList } from '../utils/random'

const client = connectPostgres({
  dbHost: config.POSTGRES_HOST as string,
  dbName: config.POSTGRES_DB as string,
  dbUser: config.POSTGRES_USER as string,
  dbPassword: config.POSTGRES_PASSWORD as string,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes = async (message: any, api: Api): Promise<void> => {

  const reply = new replyController(api, client)

  if (typeof message.body === 'string') {
    const msg: IncomingMessage = message
    const { commandIs, commandStartAt, getCommandArgs, commandIsIncludes } = commandInit(msg.body)
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

    if (commandIs('💸') || commandIs('🦹‍♂️')) {
      api.sendMessageReaction(msg.threadId, msg.messageId, '👀')
      const random = randomOfList([reply.randomImage, reply.randomB2])
      await random(msg)
      return
    }

    if (commandIs('fetch')) {
      reply.update(msg)
      return
    }

    if (commandIs('fetch2')) {
      reply.updateB2(msg)
      return
    }

    if (commandStartAt(['tts'])) {
      const args = getCommandArgs('tts')
      reply.textToSpeed(msg, args)
      return
    }

    if (commandStartAt(['yt'])) {
      const args = getCommandArgs('yt')
      reply.youtubeDl(msg, args)
      return
    }

    if(commandIsIncludes(['loli'])) {
      api.sendMessageReaction(msg.threadId, msg.messageId, '🔨')
      return
    }

    reply.fromDb(message)
  }
}

export default routes
