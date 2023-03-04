import { PrismaClient, Groups } from '@prisma/client'

const prisma = new PrismaClient()

export const updateGroup = async (createGroupInput: Groups) => {
  return await prisma.groups.upsert({
    where: {
      messenger_group_id: createGroupInput.messenger_group_id
    },
    update: createGroupInput,
    create: createGroupInput,
  })
}

export const isExist = async (messengerGroupId: string): Promise<boolean> => {
  const count = await prisma.groups.count({
    where: {
      messenger_group_id: messengerGroupId,
    }
  })

  return count !== 0
}
