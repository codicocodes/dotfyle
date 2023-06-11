/*
  Warnings:

  - You are about to drop the `_LanguageServerToNeovimConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LanguageServerToNeovimConfig" DROP CONSTRAINT "_LanguageServerToNeovimConfig_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageServerToNeovimConfig" DROP CONSTRAINT "_LanguageServerToNeovimConfig_B_fkey";

-- AlterTable
ALTER TABLE "LanguageServer" ADD COLUMN     "neovimConfigSyncConfigId" INTEGER,
ADD COLUMN     "neovimConfigSyncSha" TEXT;

-- DropTable
DROP TABLE "_LanguageServerToNeovimConfig";

-- CreateTable
CREATE TABLE "NeovimConfigToLanguageServer" (
    "languageServerName" TEXT NOT NULL,
    "configId" INTEGER NOT NULL,
    "neovimConfigId" INTEGER NOT NULL,

    CONSTRAINT "NeovimConfigToLanguageServer_pkey" PRIMARY KEY ("languageServerName","configId")
);

-- AddForeignKey
ALTER TABLE "LanguageServer" ADD CONSTRAINT "LanguageServer_neovimConfigSyncConfigId_neovimConfigSyncSh_fkey" FOREIGN KEY ("neovimConfigSyncConfigId", "neovimConfigSyncSha") REFERENCES "NeovimConfigSync"("configId", "sha") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_languageServerName_fkey" FOREIGN KEY ("languageServerName") REFERENCES "LanguageServer"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_neovimConfigId_fkey" FOREIGN KEY ("neovimConfigId") REFERENCES "NeovimConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
