/*
  Warnings:

  - You are about to drop the column `neovimConfigSyncConfigId` on the `LanguageServer` table. All the data in the column will be lost.
  - You are about to drop the column `neovimConfigSyncSha` on the `LanguageServer` table. All the data in the column will be lost.
  - Added the required column `sha` to the `NeovimConfigToLanguageServer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LanguageServer" DROP CONSTRAINT "LanguageServer_neovimConfigSyncConfigId_neovimConfigSyncSh_fkey";

-- AlterTable
ALTER TABLE "LanguageServer" DROP COLUMN "neovimConfigSyncConfigId",
DROP COLUMN "neovimConfigSyncSha";

-- AlterTable
ALTER TABLE "NeovimConfigToLanguageServer" ADD COLUMN     "sha" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_configId_sha_fkey" FOREIGN KEY ("configId", "sha") REFERENCES "NeovimConfigSync"("configId", "sha") ON DELETE RESTRICT ON UPDATE CASCADE;
