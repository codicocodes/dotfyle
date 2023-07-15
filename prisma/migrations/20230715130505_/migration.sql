/*
  Warnings:

  - A unique constraint covering the columns `[owner,name]` on the table `GithubRepository` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ToolConfig" ALTER COLUMN "root" SET DEFAULT '/';

-- CreateIndex
CREATE UNIQUE INDEX "GithubRepository_owner_name_key" ON "GithubRepository"("owner", "name");
