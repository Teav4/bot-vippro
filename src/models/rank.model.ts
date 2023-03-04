import { PrismaClient, Ranks } from '@prisma/client'

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
