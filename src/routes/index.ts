/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { commandInit } from '../utils'
import { IncomingMessage } from '../../lib/types/incomingMessages'
import { replyController } from '../controllers/ReplyController'
import Api from '../../dist/lib/api'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes = (message: any, api: Api): void => {

  const reply = new replyController(api)

  if (typeof message.body === 'string') {
    const msg: IncomingMessage = message
    const { commandIs } = commandInit(msg.body)
  
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
  
  }
}

export default routes
