/*
  Warnings:

  - You are about to drop the column `neovimConfigId` on the `NeovimConfigToLanguageServer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" DROP CONSTRAINT "NeovimConfigToLanguageServer_neovimConfigId_fkey";

-- AlterTable
ALTER TABLE "NeovimConfigToLanguageServer" DROP COLUMN "neovimConfigId";

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NeovimConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
