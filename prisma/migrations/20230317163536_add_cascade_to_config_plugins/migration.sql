-- DropForeignKey
ALTER TABLE "NeovimConfigPlugins" DROP CONSTRAINT "NeovimConfigPlugins_configId_fkey";

-- DropForeignKey
ALTER TABLE "NeovimConfigPlugins" DROP CONSTRAINT "NeovimConfigPlugins_pluginId_fkey";

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NeovimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "NeovimPlugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
