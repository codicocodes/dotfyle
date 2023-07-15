/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `GithubRepository` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GithubRepository_githubId_key" ON "GithubRepository"("githubId");
