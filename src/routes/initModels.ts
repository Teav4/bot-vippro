import { IncomingMessage } from "../../lib/types/incomingMessages"
import { generate as generateId } from 'shortid'
import { logService } from "../services/log"
import Api from "../../lib/api"
import { 
  createUserIfNotExist, 
  isExist as isUserExist, 
} from "../models/user.model"
import {
  updateGroup,
  isExist as isGroupExist
} from "../models/group.model"
import {
  isExist as isUsersOnGroupsExist,
  createUsersOnGroups,
} from "../models/usersOnGroups.model"

export const initModels = async (message: IncomingMessage, api: Api) => {

  // USER
  const _isUserExist = await isUserExist({
    facebookId: message.senderId.toString()
  })

  if (!_isUserExist) {
    logService('CREATE NEW USER', `fid: ${message.senderId}`)
    const user = await api.getUserInfo([message.senderId])
    
    const avatar = user[message.senderId].thumbSrc
    const first_name = user[message.senderId].firstName
    const full_name = user[message.senderId].fullName
    const last_name = full_name.replace(first_name, '').trim()

    createUserIfNotExist({
      last_active: new Date(message.timestamp),
      id: generateId(),
      avatar,
      facebook_id: message.senderId.toString(),
      banned: false,
      first_name,
      last_name,
      full_name,
    })
  }
  
  // GROUP
  const _isGroupExist = await isGroupExist(message.threadId.toString())
  if (!_isGroupExist) {
    logService('CREATE NEW GROUP', `gid: ${message.threadId}`)

    updateGroup({
      id: generateId(),
      messenger_group_id: message.threadId.toString(),
      last_active: new Date(),
    })
  }

  // USERS ON GROUPS
  const _isUsersOnGroupsExist = await isUsersOnGroupsExist({
    messengerGroupId: message.threadId.toString(),
    facebookUserId: message.senderId.toString(),
  })
  if (!_isUsersOnGroupsExist) {
    createUsersOnGroups({
      facebookUserId: message.senderId.toString(),
      messengerGroupId: message.threadId.toString(),
    })
  }
  
}
