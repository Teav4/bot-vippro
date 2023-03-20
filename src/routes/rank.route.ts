import { createReadStream } from "fs";
import { Route } from "../../@types/route";
import { EMOJI_DONE, EMOJI_RELOAD } from "../constants/reply.constants";
import { getUserRank } from "../controllers/rank.controllers";
import { levelUp } from "../models/rank.model";
import { commandInit } from "../utils";
import { randomOfList } from "../utils/random";


export const handleRankCommand: Route.RouteMiddleware = async (msg, api, command) => {
  const { commandIs } = commandInit(msg)  

  if (commandIs(['/rank'])) {
    await api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_RELOAD)
    const image = await getUserRank(msg.senderId.toString(), msg.threadId.toString())
    const stream = createReadStream(image)

    await command.reply({
      attachment: stream
    })

    await api.sendMessageReaction(msg.threadId, msg.messageId, EMOJI_DONE)

    return
  }

  // LV UP
  await levelUp(msg.senderId.toString(), msg.threadId.toString(), async (level) => {

    if (!['6005596069556213', '6252766894736244'].includes(msg.threadId.toString())) {
      return
    }

    const image = randomOfList([
      './assets/levelUP/kokomi1.gif',
      './assets/levelUP/kokomi2.gif',
      './assets/levelUP/kokomi3.gif',
    ])
    const readStream = createReadStream(image)

    await api.sendMessage({
      body: `Chúc mừng bạn vừa lên cấp ${level} 🎉🎉`,
      attachment: [readStream],
      mentions: [
        {
          id: msg.senderId,
          name: 'Chúc mừng'
        }
      ]
    }, msg.threadId)
  })

  return true
}
