/*
  Warnings:

  - You are about to drop the column `hasDotfyleShield` on the `NeovimPlugin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NeovimPlugin" DROP COLUMN "hasDotfyleShield",
ADD COLUMN     "dotfyleShieldAddedAt" TIMESTAMP(3);
