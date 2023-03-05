import { PrismaClient, Avatar } from '@prisma/client'

const prisma = new PrismaClient()

export const getRandomAvatar = async (): Promise<Avatar> => {
  const avatarCount = await prisma.avatar.count()
  const skip =  Math.floor(Math.random() * avatarCount)

  const result = await prisma.avatar.findFirst({
    skip,
  })

  // retry if null
  if (result === null) {
    return getRandomAvatar()
  }

  return result
}
