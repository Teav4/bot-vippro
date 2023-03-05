import { Route } from "../../@types/route";
import { replyController } from "../controllers";

export const handleYoutubeCommand: Route.RouteMiddleware = async (msg, api, command, pgClient) => {
  const reply = new replyController(api, pgClient)
  
  if (command.startAt(['yt'])) {
    const args = command.args('yt')
    reply.youtubeDl(msg, args)
    return
  }

  return true
}
