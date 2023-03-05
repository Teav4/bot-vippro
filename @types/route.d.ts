import Api from "../lib/api";
import { OutgoingMessage } from "../lib/types";
import type { IncomingMessage } from "../lib/types/incomingMessages";
import type { Client } from 'pg'

module Route {

  type RouteMiddleware = (
    msg: IncomingMessage, 
    api: Api, 
    command: {
      is: (key: string|string[]) => boolean
      startAt: (key: string[]) => boolean
      args: (prefix: string) => string[]
      includes: (key: string[]) => boolean
      reply: (msg: OutgoingMessage) => Promise<void>
    },
    pgClient: Client,
  ) => Promise<boolean|undefined>

}
