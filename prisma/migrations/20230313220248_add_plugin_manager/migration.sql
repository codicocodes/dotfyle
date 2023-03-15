-- CreateEnum
CREATE TYPE "PluginManager" AS ENUM ('Lazy', 'Packer');

-- AlterTable
ALTER TABLE "NeovimConfig" ADD COLUMN     "pluginManager" "PluginManager";
