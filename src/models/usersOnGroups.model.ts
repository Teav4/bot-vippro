import { PrismaClient } from '@prisma/client'
import { generate as generateId } from 'shortid'
import { logService } from '../services/log'

const prisma = new PrismaClient()

export const createUsersOnGroups = async (createUsersOnGroupsInput: UsersOnGroups.CreateUsersOnGroupsInput) => {
  
  const rank = await prisma.ranks.create({
    data: {
      id: generateId(),
      score: 0,
    }
  })

  const groups = await prisma.groups.findUnique({
    where: {
      messenger_group_id: createUsersOnGroupsInput.messengerGroupId,
    }
  })

  const user = await prisma.users.findUnique({
    where: {
      facebook_id: createUsersOnGroupsInput.facebookUserId,
    }
  })

  if (rank && groups && user) {
    logService('CREATE USERS-ON-GROUPS', `uid: ${createUsersOnGroupsInput.facebookUserId}, gid: ${createUsersOnGroupsInput.messengerGroupId}`)

    await prisma.usersOnGroups.create({
      data: {
        id: generateId(),
        rank_id: rank.id,
        user_id: user.id,
        group_id: groups.id
      }
    })
  } 
  else {
    logService(
      'CREATE USERS-ON-GROUPS', 
      `FAILED, uid: ${createUsersOnGroupsInput.facebookUserId}, gid: ${createUsersOnGroupsInput.messengerGroupId}`
    )
  } 
  
}

export const isExist = async (input: UsersOnGroups.CheckIsExistInput): Promise<boolean> => {
  const count = await prisma.usersOnGroups.count({
    where: {
      user: {
        facebook_id: input.facebookUserId
      },
      group: {
        messenger_group_id: input.messengerGroupId
      },
    },
  })

  return count !== 0
}

export const updateChatActivity = async (input: UsersOnGroups.UpdateChatActivityInput) => {
  await prisma.usersOnGroups.updateMany({
    where: {
      group: {
        messenger_group_id: input.messengerGroupId,
      },
      user: {
        facebook_id: input.facebookUserId,
      }
    },
    data: {
      message_count: {
        increment: 1,
      },
    }
  })

  await prisma.users.update({
    where: {
      facebook_id: input.facebookUserId,
    },
    data: {
      last_active: new Date()
    }
  })

  await prisma.groups.update({
    where: {
      messenger_group_id: input.messengerGroupId,
    },
    data: {
      last_active: new Date()
    }
  })
}
