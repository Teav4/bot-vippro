/*
  Warnings:

  - The primary key for the `UsersOnGroups` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "UsersOnGroups" DROP CONSTRAINT "UsersOnGroups_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "UsersOnGroups_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UsersOnGroups_id_seq";
