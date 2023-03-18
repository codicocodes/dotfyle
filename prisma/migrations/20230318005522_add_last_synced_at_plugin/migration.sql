/*
  Warnings:

  - You are about to drop the column `lastSyncedAt` on the `NeovimConfigPlugins` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NeovimConfigPlugins" DROP COLUMN "lastSyncedAt";

-- AlterTable
ALTER TABLE "NeovimPlugin" ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);
