import { Route } from "../../@types/route";
import { replyController } from "../controllers";

export const handleDbAutoReplyCommand: Route.RouteMiddleware = async (msg, api, command, pgClient) => {
  const reply = new replyController(api, pgClient)

  reply.fromDb(msg)

  return true
}