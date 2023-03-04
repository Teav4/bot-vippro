/*
  Warnings:

  - You are about to alter the column `score` on the `Ranks` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Ranks" ALTER COLUMN "score" SET DATA TYPE INTEGER;
