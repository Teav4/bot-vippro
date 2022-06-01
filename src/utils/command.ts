import { EMOJI_0, EMOJI_1, EMOJI_2, EMOJI_3, EMOJI_4, EMOJI_5, EMOJI_6, EMOJI_7, EMOJI_8, EMOJI_9 } from "../constants/reply.constants"

interface CommandInitProps {
  commandIs(key: string): boolean;
  commandStartAt(key: string[]): boolean;
}

function commandStartAt(key: string[], from: string): boolean {
  for(let i=0; i<key.length; ++i) {
    if (from.indexOf(key[i]) === 0) return true
  }

  return false
}

function commandIs(key: string, string: string): boolean {
  return key.trim() === string.trim()
}

export function commandInit(message: string): CommandInitProps {
  return {
    commandIs: (key) => commandIs(key, message),
    commandStartAt: (key) => commandStartAt(key, message)
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
