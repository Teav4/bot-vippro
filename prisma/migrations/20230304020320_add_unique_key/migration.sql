/*
  Warnings:

  - A unique constraint covering the columns `[messenger_group_id]` on the table `Groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebook_id]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Groups_messenger_group_id_key" ON "Groups"("messenger_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_facebook_id_key" ON "Users"("facebook_id");
