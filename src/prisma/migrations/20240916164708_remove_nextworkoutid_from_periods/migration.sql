/*
  Warnings:

  - You are about to drop the column `nextWorkoutId` on the `Periods` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Periods" DROP CONSTRAINT "Periods_nextWorkoutId_fkey";

-- AlterTable
ALTER TABLE "Periods" DROP COLUMN "nextWorkoutId";
