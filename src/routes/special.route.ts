import { createReadStream } from "fs";
import { Route } from "../../@types/route";
import { isAdmin } from "../utils/admin";
import { randomOfList } from "../utils/random";

export const handleSpecialCommand: Route.RouteMiddleware = async (msg, api, command) => {

  async function addToGroup(userId: string, groupId: string) {

    // check user already in group
    const group = await api.getThreadInfo(groupId)
    if (group.participantIds.includes(userId)) {
      await api.sendMessageReaction(msg.threadId, msg.messageId, '❌')
      await command.reply({ body: '❌ Đã được thêm vào nhóm trước đó' })

      return
    }

    await api.sendMessageReaction(msg.threadId, msg.messageId, '✅')
    api.addUserToGroup(userId, groupId)
    command.reply({ body: 'Đã thêm vào nhóm! Nếu không thấy, hãy kiểm tra tin nhắn chờ :33' })

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
          id: userId,
          name: 'Chào mừng'
        }
      ]
    }, groupId)
  }
  
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

  if (command.startAt(['/add'])) {
    if (!isAdmin(msg.senderId.toString())) {
      command.reply({
        body: '❌ Bạn không có quyền thực hiện lệnh này.'
      })
      return
    }

    const args = command.args('/add')
    const id = args[0].trim()
    const groupdId = args[1].trim()

    if (!(id || groupdId)) {
      api.sendMessageReaction(msg.threadId, msg.messageId, '❌')
      return
    }

    if (groupdId === '1') {
      await addToGroup(id, '6005596069556213')

      return
    }
    if (groupdId === '2') {
      await addToGroup(id, '6252766894736244')

      return
    }

    api.sendMessageReaction(msg.threadId, msg.messageId, '❌')
    return
  }

  if (command.startAt(['/invite'])) {
    const args = command.args('/invite')

    if (args[0] === '1') {
      await addToGroup(msg.senderId.toString(), '6005596069556213')

      return
    }
    if (args[0] === '2') {
      await addToGroup(msg.senderId.toString(), '6252766894736244')

      return
    }
    
    api.sendMessageReaction(msg.threadId, msg.messageId, '❌')
    return
  }

  return true
}
