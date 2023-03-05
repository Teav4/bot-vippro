import { PrismaClient, Ranks } from '@prisma/client'
import { getLevel } from '../services/profile/level'

const prisma = new PrismaClient()

export const createRankIfNotExist = async (createRankInput: Ranks) => {
  
  return await prisma.ranks.upsert({
    where: {
      id: createRankInput.id,
    },
    update: createRankInput,
    create: createRankInput,
  })
}

export const isExist = async (rankId: string): Promise<boolean> => {
  const count = await prisma.ranks.count({
    where: {
      id: rankId,
    }
  })

  return count !== 0
}

export const getUserRank = async (facebookUserId: string, messengerGroupId: string): Promise<Rank.GetUserRankResult> => {
  const queryResult = await prisma.usersOnGroups.findFirst({
    where: {
      user: {
        facebook_id: facebookUserId,
      },
      group: {
        messenger_group_id: messengerGroupId,
      }
    },
    include: {
      rank: {
        select: {
          score: true
        }
      },
      user: {
        select: {
          id: true,
          facebook_id: true,
          full_name: true,
          avatar: true,
        }
      }
    }
  })

  const globalMaxRank = await prisma.ranks.findFirst({
    where: {
      id: queryResult?.rank_id,
    },
    orderBy: {
      score: 'desc'
    }
  })

  const result: Rank.GetUserRankResult = {
    score: queryResult?.rank.score || 0,
    userId: queryResult?.user.id || '',
    userName: queryResult?.user.full_name || '',
    facebookId: queryResult?.user.facebook_id || '',
    description: queryResult?.quote || '',
    chatActivity: queryResult?.message_count || 0,
    maxGlobalScore: globalMaxRank?.score || 0,
    avatar: queryResult?.user.avatar || '',
  }

  return result
}

export const addScore = async (facebookUserId: string, messengerGroupId: string) => {
  const userOnGroups = await prisma.usersOnGroups.findFirst({
    where: {
      AND: [
        {
          group: {
            messenger_group_id: messengerGroupId,
          },
          user: {
            facebook_id: facebookUserId,
          }
        }
      ]
    },
  })
  
  if (userOnGroups) {
    await prisma.ranks.update({
      where: {
        id: userOnGroups.rank_id,    
      },
      data: {
        score: {
          increment: 1,
        }
      }
    })
  }
}

export const levelUp = async (facebookUserId: string, messengerGroupId: string, onLevelUp: (currentLv: number) => Promise<void>) => {
  const queryResult = await prisma.usersOnGroups.findFirst({
    where: {
      group: {
        messenger_group_id: messengerGroupId,
      },
      user: {
        facebook_id: facebookUserId,
      }
    },
    include: {
      rank: {
        select: {
          level: true,
          score: true,
        }
      }
    }
  })

  const currentLv = getLevel(queryResult?.rank.score || 1).lv
  const lv = queryResult?.rank.level || 0

  if (currentLv > lv && queryResult) {
    await prisma.ranks.update({
      where: {
        id: queryResult.rank_id
      },
      data: {
        level: {
          increment: 1
        }
      }
    })
    await onLevelUp(currentLv)
  }

}
