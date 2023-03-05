type GetLevelResult = {
  lv: number,
  progress: [
    number,
    number,
  ]
}

const BASE_LEVEL = 50

 // get level recursive
export const getLevel = (score: number, level: number = 1): GetLevelResult => {
  const scoreToNextLv = Math.round(level*level*0.1) * BASE_LEVEL + BASE_LEVEL
  if (scoreToNextLv > score) {
    return {
      lv: level,
      progress: [
        score,
        scoreToNextLv,
      ]
    }
  }

  return getLevel(score - scoreToNextLv, ++level)
}
