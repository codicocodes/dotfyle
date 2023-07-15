/*
  Warnings:

  - The `pluginManager` column on the `NvimConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "NvimConfig" DROP COLUMN "pluginManager",
ADD COLUMN     "pluginManager" TEXT NOT NULL DEFAULT 'unknown';
