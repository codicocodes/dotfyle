/*
  Warnings:

  - You are about to drop the `_NeovimConfigToNeovimPlugin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_NeovimConfigToNeovimPlugin" DROP CONSTRAINT "_NeovimConfigToNeovimPlugin_A_fkey";

-- DropForeignKey
ALTER TABLE "_NeovimConfigToNeovimPlugin" DROP CONSTRAINT "_NeovimConfigToNeovimPlugin_B_fkey";

-- DropTable
DROP TABLE "_NeovimConfigToNeovimPlugin";
