-- CreateTable
CREATE TABLE "NeovimPluginInstallInstructions" (
    "id" SERIAL NOT NULL,
    "pluginId" INTEGER NOT NULL,
    "pluginManager" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "NeovimPluginInstallInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NeovimPluginInstallInstructions_pluginId_pluginManager_key" ON "NeovimPluginInstallInstructions"("pluginId", "pluginManager");

-- AddForeignKey
ALTER TABLE "NeovimPluginInstallInstructions" ADD CONSTRAINT "NeovimPluginInstallInstructions_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "NeovimPlugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
