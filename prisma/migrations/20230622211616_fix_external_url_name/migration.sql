/*
  Warnings:

  - You are about to drop the column `external_url` on the `BreakingChange` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalUrl]` on the table `BreakingChange` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `externalUrl` to the `BreakingChange` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BreakingChange_external_url_key";

-- AlterTable
ALTER TABLE "BreakingChange" DROP COLUMN "external_url",
ADD COLUMN     "externalUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BreakingChange_externalUrl_key" ON "BreakingChange"("externalUrl");
