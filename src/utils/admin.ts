const adminList = process.env.ADMIN_LIST?.trim().split(',') || []

export const isAdmin = (userId: string) => adminList.includes(userId)
