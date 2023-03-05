import { Route } from "../../@types/route";

export const handleSpecialCommand: Route.RouteMiddleware = async (msg, api, command) => {
  

  if (command.includes(['loli'])) {
    api.sendMessageReaction(msg.threadId, msg.messageId, '🔨')
  }


  if (command.is('hello')) {
    command.reply({ body: 'Hi' })
    return
  }

  if (command.is('ko gaoga')) {
    command.reply({ body: 'ko triga' })    
    return
  }

  if (command.is('ko triga')) {
    command.reply({ body: 'triga qua non' })
    return
  }

  return true
}
