/*
  Warnings:

  - You are about to drop the column `postId` on the `TwinPost` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TwinPost" DROP CONSTRAINT "TwinPost_postId_fkey";

-- DropIndex
DROP INDEX "TwinPost_postId_key";

-- AlterTable
ALTER TABLE "TwinPost" DROP COLUMN "postId";
