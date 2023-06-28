/*
  Warnings:

  - Added the required column `title` to the `TwinPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TwinPost" ADD COLUMN     "title" TEXT NOT NULL;
