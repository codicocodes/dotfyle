/*
  Warnings:

  - The `pluginManager` column on the `NeovimConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NeovimPluginManager" AS ENUM ('Lazy', 'Packer');

-- AlterTable
ALTER TABLE "NeovimConfig" DROP COLUMN "pluginManager",
ADD COLUMN     "pluginManager" "NeovimPluginManager";

-- DropEnum
DROP TYPE "PluginManager";

-- CreateTable
CREATE TABLE "NeovimPlugin" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,

    CONSTRAINT "NeovimPlugin_pkey" PRIMARY KEY ("id")
);
