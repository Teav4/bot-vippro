import { getUserRank as getUserRankQuery } from '../models/rank.model'

export const getUserRank = (facebookUserId: string) => {
  getUserRankQuery(facebookUserId)
}
