/*
  Warnings:

  - You are about to alter the column `message_count` on the `UsersOnGroups` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "UsersOnGroups" ALTER COLUMN "message_count" SET DATA TYPE INTEGER;
