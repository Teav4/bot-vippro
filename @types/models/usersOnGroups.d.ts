module UsersOnGroups {
  
  type CheckIsExistInput = {
    facebookUserId: string
    messengerGroupId: string
  }

  type CreateUsersOnGroupsInput = {
    messengerGroupId: string
    facebookUserId: string
  }
}
