/*
  Warnings:

  - A unique constraint covering the columns `[sha,configId]` on the table `NeovimConfigSync` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "LanguageServer" (
    "name" TEXT NOT NULL,
    "neovimConfigId" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "LanguageServer_name_key" ON "LanguageServer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfigSync_sha_configId_key" ON "NeovimConfigSync"("sha", "configId");

-- AddForeignKey
ALTER TABLE "LanguageServer" ADD CONSTRAINT "LanguageServer_neovimConfigId_fkey" FOREIGN KEY ("neovimConfigId") REFERENCES "NeovimConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;
