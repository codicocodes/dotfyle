/*
  Warnings:

  - Added the required column `branch` to the `NeovimConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NeovimConfig" ADD COLUMN     "branch" TEXT NOT NULL;
