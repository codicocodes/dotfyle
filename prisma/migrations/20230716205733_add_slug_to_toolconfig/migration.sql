/*
  Warnings:

  - A unique constraint covering the columns `[repositoryId,slug]` on the table `ToolConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `ToolConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ToolConfig" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ToolConfig_repositoryId_slug_key" ON "ToolConfig"("repositoryId", "slug");
