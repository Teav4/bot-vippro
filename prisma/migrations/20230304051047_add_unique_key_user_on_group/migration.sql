/*
  Warnings:

  - A unique constraint covering the columns `[rank_id]` on the table `UsersOnGroups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `UsersOnGroups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id]` on the table `UsersOnGroups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsersOnGroups_rank_id_key" ON "UsersOnGroups"("rank_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnGroups_user_id_key" ON "UsersOnGroups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnGroups_group_id_key" ON "UsersOnGroups"("group_id");
