import { Route } from "../../@types/route";
import Api from "../../lib/api";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import { getUserRank } from "../controllers/rank.controllers";
import { commandInit } from "../utils";

export const handleRankCommand: Route.RouteMiddleware = async (msg: IncomingMessage, api: Api) => {
  const { commandIs } = commandInit(msg)  

  if (commandIs(['/rank'])) {
    getUserRank(msg.senderId.toString())

    return
  }

  return true
}
