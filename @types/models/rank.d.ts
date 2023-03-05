module Rank {
  type GetUserRankResult = {
    score: number
    userId: string
    userName: string
    facebookId: string
    description: string
    chatActivity: number
    maxGlobalScore: number
    avatar: string
  }
}
