/*
  Warnings:

  - A unique constraint covering the columns `[owner,name]` on the table `NeovimPlugin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "NeovimPlugin_owner_name_key" ON "NeovimPlugin"("owner", "name");
