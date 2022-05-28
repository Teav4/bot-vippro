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
