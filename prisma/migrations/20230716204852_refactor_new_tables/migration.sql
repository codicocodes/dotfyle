/*
  Warnings:

  - You are about to drop the column `nvimConfigId` on the `NeovimConfigPlugins` table. All the data in the column will be lost.
  - You are about to drop the column `nvimConfigId` on the `NeovimConfigSync` table. All the data in the column will be lost.
  - You are about to drop the column `nvimConfigId` on the `NeovimConfigToLanguageServer` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `ToolConfig` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NeovimConfigPlugins" DROP CONSTRAINT "NeovimConfigPlugins_nvimConfigId_fkey";

-- DropForeignKey
ALTER TABLE "NeovimConfigSync" DROP CONSTRAINT "NeovimConfigSync_nvimConfigId_fkey";

-- DropForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" DROP CONSTRAINT "NeovimConfigToLanguageServer_nvimConfigId_fkey";

-- DropIndex
DROP INDEX "NeovimConfigPlugins_nvimConfigId_pluginId_key";

-- DropIndex
DROP INDEX "NeovimConfigSync_nvimConfigId_sha_key";

-- DropIndex
DROP INDEX "NeovimConfigSync_sha_configId_key";

-- DropIndex
DROP INDEX "NeovimConfigToLanguageServer_languageServerName_nvimConfigI_key";

-- DropIndex
DROP INDEX "ToolConfig_repositoryId_slug_key";

-- AlterTable
ALTER TABLE "NeovimConfigPlugins" DROP COLUMN "nvimConfigId";

-- AlterTable
ALTER TABLE "NeovimConfigSync" DROP COLUMN "nvimConfigId";

-- AlterTable
ALTER TABLE "NeovimConfigToLanguageServer" DROP COLUMN "nvimConfigId";

-- AlterTable
ALTER TABLE "ToolConfig" DROP COLUMN "slug";

-- CreateTable
CREATE TABLE "NvimConfigToLanguageServer" (
    "id" SERIAL NOT NULL,
    "languageServerName" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,
    "sha" TEXT NOT NULL,

    CONSTRAINT "NvimConfigToLanguageServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NvimConfigPlugins" (
    "configId" INTEGER NOT NULL,
    "pluginId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sha" TEXT
);

-- CreateTable
CREATE TABLE "NvimConfigSync" (
    "id" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "NvimConfigSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NvimConfigToLanguageServer_languageServerName_configId_key" ON "NvimConfigToLanguageServer"("languageServerName", "configId");

-- CreateIndex
CREATE UNIQUE INDEX "NvimConfigPlugins_configId_pluginId_key" ON "NvimConfigPlugins"("configId", "pluginId");

-- CreateIndex
CREATE UNIQUE INDEX "NvimConfigSync_sha_configId_key" ON "NvimConfigSync"("sha", "configId");

-- AddForeignKey
ALTER TABLE "NvimConfigToLanguageServer" ADD CONSTRAINT "NvimConfigToLanguageServer_languageServerName_fkey" FOREIGN KEY ("languageServerName") REFERENCES "LanguageServer"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigToLanguageServer" ADD CONSTRAINT "NvimConfigToLanguageServer_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NvimConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigToLanguageServer" ADD CONSTRAINT "NvimConfigToLanguageServer_configId_sha_fkey" FOREIGN KEY ("configId", "sha") REFERENCES "NvimConfigSync"("configId", "sha") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigPlugins" ADD CONSTRAINT "NvimConfigPlugins_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NvimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigPlugins" ADD CONSTRAINT "NvimConfigPlugins_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "NeovimPlugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigPlugins" ADD CONSTRAINT "NvimConfigPlugins_sha_configId_fkey" FOREIGN KEY ("sha", "configId") REFERENCES "NvimConfigSync"("sha", "configId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NvimConfigSync" ADD CONSTRAINT "NvimConfigSync_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NvimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
