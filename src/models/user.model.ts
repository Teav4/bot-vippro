import { PrismaClient, Users } from '@prisma/client'

const prisma = new PrismaClient()

export const createUserIfNotExist = async (createUserInput: Users) => {
  return await prisma.users.upsert({
    where: {
      facebook_id: createUserInput.facebook_id
    },
    update: createUserInput,
    create: createUserInput,
  })
}

export const isExist = async (checkIsExistInput: User.CheckIsExistInputProps): Promise<boolean> => {
  const { facebookId } = checkIsExistInput
  
  const count = await prisma.users.count({
    where: {
      facebook_id: facebookId,
    }
  })

  return count !== 0
}

export const updateLastActive = async (facebook_id: string) => {
  return prisma.users.update({
    where: {
      facebook_id: facebook_id,
    },
    data: {
      last_active: new Date(),
    }
  })
}
