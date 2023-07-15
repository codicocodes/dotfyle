/*
  Warnings:

  - A unique constraint covering the columns `[toolConfigId]` on the table `NvimConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `toolConfigId` to the `NvimConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NvimConfig" ADD COLUMN     "toolConfigId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NvimConfig_toolConfigId_key" ON "NvimConfig"("toolConfigId");

-- AddForeignKey
ALTER TABLE "NvimConfig" ADD CONSTRAINT "NvimConfig_toolConfigId_fkey" FOREIGN KEY ("toolConfigId") REFERENCES "ToolConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
