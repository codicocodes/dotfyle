/*
  Warnings:

  - You are about to drop the column `nvimConfigConfigId` on the `NeovimConfigToLanguageServer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nvimConfigId,pluginId]` on the table `NeovimConfigPlugins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nvimConfigId,sha]` on the table `NeovimConfigSync` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[languageServerName,nvimConfigId]` on the table `NeovimConfigToLanguageServer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" DROP CONSTRAINT "NeovimConfigToLanguageServer_nvimConfigConfigId_fkey";

-- AlterTable
ALTER TABLE "NeovimConfigToLanguageServer" DROP COLUMN "nvimConfigConfigId",
ADD COLUMN     "nvimConfigId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfigPlugins_nvimConfigId_pluginId_key" ON "NeovimConfigPlugins"("nvimConfigId", "pluginId");

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfigSync_nvimConfigId_sha_key" ON "NeovimConfigSync"("nvimConfigId", "sha");

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfigToLanguageServer_languageServerName_nvimConfigI_key" ON "NeovimConfigToLanguageServer"("languageServerName", "nvimConfigId");

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_nvimConfigId_fkey" FOREIGN KEY ("nvimConfigId") REFERENCES "NvimConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
