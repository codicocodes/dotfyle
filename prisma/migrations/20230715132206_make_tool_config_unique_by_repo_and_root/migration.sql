/*
  Warnings:

  - A unique constraint covering the columns `[repositoryId,root]` on the table `ToolConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ToolConfig_repositoryId_root_key" ON "ToolConfig"("repositoryId", "root");
