/*
  Warnings:

  - Added the required column `sha` to the `BreakingChange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BreakingChange" ADD COLUMN     "sha" TEXT NOT NULL;
