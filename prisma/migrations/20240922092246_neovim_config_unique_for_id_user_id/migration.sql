/*
  Warnings:

  - You are about to drop the column `markedForDeletion` on the `NeovimConfig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,userId]` on the table `NeovimConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "NeovimConfig" DROP COLUMN "markedForDeletion";

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfig_id_userId_key" ON "NeovimConfig"("id", "userId");
