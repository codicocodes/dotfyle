/*
  Warnings:

  - Made the column `readme` on table `NeovimPlugin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "NeovimPlugin" ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "readme" SET NOT NULL;
