import { Route } from "../../@types/route";

export const handleTestCommand: Route.RouteMiddleware = async (msg, api, command) => {
  
  if (command.is('test')) {
    const info = await api.getMUserInfo([msg.senderId])
    console.log({ info })
    return
  }

  return true
}
