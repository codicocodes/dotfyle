/*
  Warnings:

  - You are about to drop the column `neovimConfigId` on the `LanguageServer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LanguageServer" DROP CONSTRAINT "LanguageServer_neovimConfigId_fkey";

-- AlterTable
ALTER TABLE "LanguageServer" DROP COLUMN "neovimConfigId",
ADD CONSTRAINT "LanguageServer_pkey" PRIMARY KEY ("name");

-- CreateTable
CREATE TABLE "_LanguageServerToNeovimConfig" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageServerToNeovimConfig_AB_unique" ON "_LanguageServerToNeovimConfig"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageServerToNeovimConfig_B_index" ON "_LanguageServerToNeovimConfig"("B");

-- AddForeignKey
ALTER TABLE "_LanguageServerToNeovimConfig" ADD CONSTRAINT "_LanguageServerToNeovimConfig_A_fkey" FOREIGN KEY ("A") REFERENCES "LanguageServer"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageServerToNeovimConfig" ADD CONSTRAINT "_LanguageServerToNeovimConfig_B_fkey" FOREIGN KEY ("B") REFERENCES "NeovimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
