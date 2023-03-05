module UsersOnGroups {
  
  type CheckIsExistInput = {
    facebookUserId: string
    messengerGroupId: string
  }

  type CreateUsersOnGroupsInput = {
    messengerGroupId: string
    facebookUserId: string
  }

  type UpdateChatActivityInput = {
    messengerGroupId: string
    facebookUserId: string
  }

}
