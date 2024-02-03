-- DropForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" DROP CONSTRAINT "NeovimConfigToLanguageServer_configId_fkey";

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_configId_fkey" FOREIGN KEY ("configId") REFERENCES "NeovimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
