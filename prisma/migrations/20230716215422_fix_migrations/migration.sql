/*
  Warnings:

  - You are about to drop the column `sha` on the `NvimConfigToLanguageServer` table. All the data in the column will be lost.
  - Added the required column `syncId` to the `NvimConfigToLanguageServer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "NvimConfigToLanguageServer" DROP CONSTRAINT "NvimConfigToLanguageServer_configId_sha_fkey";

-- AlterTable
ALTER TABLE "NvimConfigToLanguageServer" DROP COLUMN "sha",
ADD COLUMN     "syncId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "NvimConfigToLanguageServer" ADD CONSTRAINT "NvimConfigToLanguageServer_syncId_fkey" FOREIGN KEY ("syncId") REFERENCES "NvimConfigSync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
