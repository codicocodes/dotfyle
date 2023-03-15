-- AlterTable
ALTER TABLE "GithubToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NeovimConfig" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "NeovimPlugin" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "NeovimConfigPlugins" (
    "configId" INTEGER NOT NULL,
    "pluginId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NeovimConfigPlugins_pkey" PRIMARY KEY ("configId","pluginId")
);

-- CreateTable
CREATE TABLE "_NeovimConfigToNeovimPlugin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_NeovimConfigToNeovimPlugin_AB_unique" ON "_NeovimConfigToNeovimPlugin"("A", "B");

-- CreateIndex
CREATE INDEX "_NeovimConfigToNeovimPlugin_B_index" ON "_NeovimConfigToNeovimPlugin"("B");

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NeovimConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "NeovimPlugin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NeovimConfigToNeovimPlugin" ADD CONSTRAINT "_NeovimConfigToNeovimPlugin_A_fkey" FOREIGN KEY ("A") REFERENCES "NeovimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NeovimConfigToNeovimPlugin" ADD CONSTRAINT "_NeovimConfigToNeovimPlugin_B_fkey" FOREIGN KEY ("B") REFERENCES "NeovimPlugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
