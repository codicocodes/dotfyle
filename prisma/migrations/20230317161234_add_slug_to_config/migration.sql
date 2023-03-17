/*
  Warnings:

  - A unique constraint covering the columns `[owner,slug]` on the table `NeovimConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `NeovimConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NeovimConfig" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfig_owner_slug_key" ON "NeovimConfig"("owner", "slug");
