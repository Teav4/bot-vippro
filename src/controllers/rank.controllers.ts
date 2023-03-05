import { getUserRank as getUserRankQuery } from '../models/rank.model'
import { generateProfileCard } from '../services/profile/generateProfileCard'
import { getLevel } from '../services/profile/level'
import { getBufferFromURL } from '../utils/http'

export const getUserRank = async (facebookUserId: string, messengerGroupId: string) => {
  const rank = await getUserRankQuery(facebookUserId, messengerGroupId)
  const level = getLevel(rank.score)
  const globalLevel = getLevel(rank.maxGlobalScore)
  const avatarBuffer = await getBufferFromURL(rank.avatar)

  const card = await generateProfileCard({
    score: `${level.progress[0]}/${level.progress[1]}`,
    userLv: level.lv.toString(),
    userName: rank.userName,
    userDesc: `${rank.description}`,
    chatActivity: `Chat Activity: ${rank.chatActivity}`,
    maxGlobalLv: `Max Global Lv: ${globalLevel.lv}`,
    facebookId: rank.facebookId,
    progress: level.progress,
    avatar: avatarBuffer,
  })

  return card
}
