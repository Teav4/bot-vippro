import { Route } from "../../@types/route";
import { replyController } from "../controllers";

export const handleTextToSpeechCommand: Route.RouteMiddleware = async (msg, api, command, pgClient) => {
  const reply = new replyController(api, pgClient)

  if (command.startAt(['tts'])) {
    const args = command.args('tts')
    reply.textToSpeed(msg, args)
    return
  }

  return true
}
