/*
  Warnings:

  - You are about to drop the column `syncId` on the `NeovimConfigPlugins` table. All the data in the column will be lost.
  - The primary key for the `NeovimConfigSync` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `NeovimConfigSync` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NeovimConfigPlugins" DROP CONSTRAINT "NeovimConfigPlugins_syncId_fkey";

-- AlterTable
ALTER TABLE "NeovimConfigPlugins" DROP COLUMN "syncId",
ADD COLUMN     "sha" TEXT;

-- AlterTable
ALTER TABLE "NeovimConfigSync" DROP CONSTRAINT "NeovimConfigSync_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "NeovimConfigSync_pkey" PRIMARY KEY ("configId", "sha");

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_sha_configId_fkey" FOREIGN KEY ("sha", "configId") REFERENCES "NeovimConfigSync"("sha", "configId") ON DELETE CASCADE ON UPDATE CASCADE;
