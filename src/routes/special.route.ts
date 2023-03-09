import { Route } from "../../@types/route";
import { isAdmin } from "../utils/admin";

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

  if (command.is('/sys GIVE ADMIN')) {
      if (isAdmin(msg.senderId.toString())) {
        api.changeAdminStatus(msg.threadId, msg.senderId, true)
        api.sendMessageReaction(msg.threadId, msg.messageId, '👍') 
      }
      else {
        command.reply({
          body: '❌ Bạn không có quyền thực hiện lệnh này.'
        })
      }

      return
  }

  return true
}
