import { Client } from "pg";
import { Route } from "../../@types/route";
import Api from "../../lib/api";
import { OutgoingMessage } from "../../lib/types";
import { IncomingMessage } from "../../lib/types/incomingMessages";
import { EMOJI_0, EMOJI_1, EMOJI_2, EMOJI_3, EMOJI_4, EMOJI_5, EMOJI_6, EMOJI_7, EMOJI_8, EMOJI_9 } from "../constants/reply.constants"
import { isArray } from './validate'

interface CommandInitProps {
  commandIs(key: string|string[]): boolean;
  commandStartAt(key: string[]): boolean;
  getCommandArgs(prefix: string): string[];
  commandIsIncludes(key: string[]): boolean;
  include(api: Api, routes: Route.RouteMiddleware[], pgClient: Client): void
}

function commandStartAt(key: string[], from: string): boolean {
  for(let i=0; i<key.length; ++i) {
    if (from.indexOf(key[i]+' ') === 0) return true
  }

  return false
}

function commandIs(key: string|string[], message: string): boolean {
  if (isArray(key)) {
    return key.indexOf(message) > -1
  }

  return key === message.trim()
}

function commandIsIncludes(key: string[], text: string): boolean {
  const message = text.trim()
  const isInclude = (m: string) => key.some(e => m.includes(e+' ')) || key.some(e => m.includes(' '+e)) 

  return isInclude(message) || commandIs(key, message)
}

function getCommandArgs(prefix: string, message: string): string[] {
  return message.replace(prefix, '').trim().split(' ')
}

function reply(message: OutgoingMessage, api: Api, threadId: string, messageId: string) {
  api.sendMessage({
    ...message,
    replyToMessage: messageId,
  }, threadId)
}

function include (api: Api,routes: Route.RouteMiddleware[], message: IncomingMessage, pgClient: Client) {
  routes.every((route) => 
    route(
      message, 
      api, {
        is: (key) => commandIs(key, message.body),
        startAt: (key) => commandStartAt(key, message.body),
        args: (prefix) => getCommandArgs(prefix, message.body),
        includes: (key) => commandIsIncludes(key, message.body),
        reply: (msg) => reply(msg, api, message.threadId.toString(), message.messageId) 
      },
      pgClient,
    )
  )
}

export function commandInit(message: IncomingMessage): CommandInitProps {
  return {
    commandIs: (key) => commandIs(key, message.body),
    commandStartAt: (key) => commandStartAt(key, message.body),
    getCommandArgs: (prefix) => getCommandArgs(prefix, message.body),
    commandIsIncludes: (key) => commandIsIncludes(key, message.body),
    include: (api, routes, pgClient) => include(api, routes, message, pgClient)
  }
}


export function getEmojiByNumber(n: number): string {
  switch (n) {
    case 1: return EMOJI_1
    case 2: return EMOJI_2
    case 3: return EMOJI_3
    case 4: return EMOJI_4
    case 5: return EMOJI_5
    case 6: return EMOJI_6
    case 7: return EMOJI_7
    case 8: return EMOJI_8
    case 9: return EMOJI_9

    default: return EMOJI_0
  }
}
