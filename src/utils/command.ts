import { EMOJI_0, EMOJI_1, EMOJI_2, EMOJI_3, EMOJI_4, EMOJI_5, EMOJI_6, EMOJI_7, EMOJI_8, EMOJI_9 } from "../constants/reply.constants"
import { isArray } from './validate'

interface CommandInitProps {
  commandIs(key: string|string[]): boolean;
  commandStartAt(key: string[]): boolean;
  getCommandArgs(prefix: string): string[];
  commandIsIncludes(key: string[]): boolean;
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

function commandIsIncludes(key: string[], message: string): boolean {
  const isInclude = (m: string) => key.some(e => m.includes(e))

  return isInclude(message+' ') || isInclude(' '+message) || commandIs(message, message)
}

function getCommandArgs(prefix: string, message: string): string[] {
  return message.replace(prefix, '').trim().split(' ')
}

export function commandInit(message: string): CommandInitProps {
  return {
    commandIs: (key) => commandIs(key, message),
    commandStartAt: (key) => commandStartAt(key, message),
    getCommandArgs: (prefix) => getCommandArgs(prefix, message),
    commandIsIncludes: (key) => commandIsIncludes(key, message)
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
