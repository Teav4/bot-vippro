import { Route } from "../../@types/route";
import { replyController } from "../controllers";
import { randomOfList } from "../utils/random";

export const handleBACommand: Route.RouteMiddleware =  async (msg, api, command, pgClient) => {
  const reply = new replyController(api, pgClient)

  if (command.is(['💸','🦹<200d>♂️', '@Arona', '😭'])) {
    api.sendMessageReaction(msg.threadId, msg.messageId, '👀')
    const random = randomOfList([reply.randomImage])
    await random(msg)
    return
  }

  if (command.is('fetch')) {
    reply.update(msg)
    return
  }

  if (command.is('updateBA')) {
    reply.update(msg, ['blue_archive'])
    return
  }

  if (command.is('updateALL')) {
    reply.update(msg, [])
    return
  }

  if (command.is('fetch2')) {
    reply.updateB2(msg)
    return
  }

  return true
}
