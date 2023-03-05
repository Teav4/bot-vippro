import Api from '../../lib/api'
import type { Client } from 'pg'
import { commandInit } from '../utils'
import { IncomingMessage } from '../../lib/types/incomingMessages'
import { logService } from '../services/log'
import { addScore } from '../models/rank.model'
import { handleSpecialCommand } from './special.route'
import { handleBACommand } from './ba.route'
import { handleRankCommand } from './rank.route'
import { handleTextToSpeechCommand } from './textToSpeech.route'
import { handleYoutubeCommand } from './youtube.route'
import { handleDbAutoReplyCommand } from './dbAutoReply.route'
import { handleTestCommand } from './test.route'

export const handleMessage = async (msg: IncomingMessage, api: Api, pgClient: Client) => {
  if (typeof msg.body === 'string') {
    commandInit(msg)
      .include(
        api, 
        [
          handleSpecialCommand,
          handleBACommand,
          handleRankCommand,
          handleTextToSpeechCommand,
          handleYoutubeCommand,
          handleTestCommand,
          handleDbAutoReplyCommand,
        ],
        pgClient,
      )

    // ADD SCORE
    addScore(msg.senderId.toString(), msg.threadId.toString())
    logService('message:'+msg.threadId, msg.body)
  }
}
