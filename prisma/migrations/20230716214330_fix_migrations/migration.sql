/*
  Warnings:

  - You are about to drop the column `sha` on the `NvimConfigPlugins` table. All the data in the column will be lost.
  - The primary key for the `NvimConfigSync` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `NvimConfigSync` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "NvimConfigPlugins" DROP CONSTRAINT "NvimConfigPlugins_sha_configId_fkey";

-- AlterTable
ALTER TABLE "NvimConfigPlugins" DROP COLUMN "sha",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "syncId" INTEGER,
ADD CONSTRAINT "NvimConfigPlugins_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "NvimConfigSync" DROP CONSTRAINT "NvimConfigSync_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "NvimConfigSync_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "NvimConfigPlugins" ADD CONSTRAINT "NvimConfigPlugins_syncId_fkey" FOREIGN KEY ("syncId") REFERENCES "NvimConfigSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;
