/*
  Warnings:

  - Added the required column `fork` to the `NeovimConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NeovimConfig" ADD COLUMN     "fork" BOOLEAN NOT NULL;
