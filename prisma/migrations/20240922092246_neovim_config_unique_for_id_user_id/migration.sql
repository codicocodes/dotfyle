/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `NeovimConfig` will be added. If there are existing duplicate values, this will fail.

*/-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfig_id_userId_key"
  ON "NeovimConfig"("id", "userId");
