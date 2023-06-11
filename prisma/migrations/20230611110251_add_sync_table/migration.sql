-- AlterTable
ALTER TABLE "NeovimConfigPlugins" ADD COLUMN     "syncId" INTEGER;

-- CreateTable
CREATE TABLE "NeovimConfigSync" (
    "id" SERIAL NOT NULL,
    "sha" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "configId" INTEGER NOT NULL,

    CONSTRAINT "NeovimConfigSync_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_syncId_fkey" FOREIGN KEY ("syncId") REFERENCES "NeovimConfigSync"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigSync" ADD CONSTRAINT "NeovimConfigSync_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NeovimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
