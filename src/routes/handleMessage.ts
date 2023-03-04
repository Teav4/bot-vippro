import Api from '../../lib/api'
import type { Client } from 'pg'
import { commandInit } from '../utils'
import { IncomingMessage } from '../../lib/types/incomingMessages'
import { replyController } from '../controllers/ReplyController'
import { logService } from '../services/log'
import { randomOfList } from '../utils/random'
import { addScore } from '../models/rank.model'

export const handleMessage = async (msg: IncomingMessage, api: Api, pgClient: Client) => {
  const reply = new replyController(api, pgClient)
  
  if (typeof msg.body === 'string') {
    
    // ADD SCORE
    addScore(msg.senderId.toString(), msg.threadId.toString())
    
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

    if (commandIs(['💸','🦹<200d>♂️', '@Arona', '😭'])) {
      api.sendMessageReaction(msg.threadId, msg.messageId, '👀')
      const random = randomOfList([reply.randomImage])
      await random(msg)
      return
    }

    if (commandIs('fetch')) {
      reply.update(msg)
      return
    }

    if (commandIs('updateBA')) {
      reply.update(msg, ['blue_archive'])
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

    reply.fromDb(msg)
  }
}
