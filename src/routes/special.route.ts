import { createReadStream } from "fs";
import { Route } from "../../@types/route";
import { EMOJI_DONE } from "../constants/reply.constants";
import { isAdmin } from "../utils/admin";
import { randomOfList } from "../utils/random";

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

  if (command.startAt(['/invite'])) {
    const args = command.args('/invite')

    async function addToGroup(groupId: string) {
      api.addUserToGroup(msg.senderId, groupId)

      const image = randomOfList([
        './assets/levelUP/kokomi1.gif',
        './assets/levelUP/kokomi2.gif',
        './assets/levelUP/kokomi3.gif',
      ])
      const readStream = createReadStream(image)
  
      await api.sendMessage({
        body: `Chào mừng đến với nhóm chat Blue Archive 🎉🎉`,
        attachment: [readStream],
        mentions: [
          {
            id: msg.senderId,
            name: 'Chào mừng'
          }
        ]
      }, groupId)
    }

    if (args[0] === '1') {
      addToGroup('6005596069556213')
      await api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)

      return
    }
    if (args[0] === '2') {
      addToGroup('6252766894736244')
      await api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)

      return
    }
    
    api.sendMessageReaction(msg.threadId, msg.messageId, '❌')
    return
  }

  return true
}
