-- AlterTable
ALTER TABLE "NeovimConfigPlugins" ADD COLUMN     "nvimConfigId" INTEGER;

-- AlterTable
ALTER TABLE "NeovimConfigSync" ADD COLUMN     "nvimConfigId" INTEGER;

-- AlterTable
ALTER TABLE "NeovimConfigToLanguageServer" ADD COLUMN     "nvimConfigConfigId" INTEGER;

-- CreateTable
CREATE TABLE "GithubRepository" (
    "id" SERIAL NOT NULL,
    "githubId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "readme" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stars" INTEGER NOT NULL,
    "fork" BOOLEAN NOT NULL,
    "mainBranch" TEXT NOT NULL,

    CONSTRAINT "GithubRepository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "ToolConfig" (
    "id" SERIAL NOT NULL,
    "toolName" TEXT NOT NULL,
    "repositoryId" INTEGER NOT NULL,
    "root" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NvimConfig" (
    "id" SERIAL NOT NULL,
    "initFile" TEXT NOT NULL,
    "pluginManager" "NeovimPluginManager",
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NvimConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tool_name_key" ON "Tool"("name");

-- AddForeignKey
ALTER TABLE "NeovimConfigToLanguageServer" ADD CONSTRAINT "NeovimConfigToLanguageServer_nvimConfigConfigId_fkey" FOREIGN KEY ("nvimConfigConfigId") REFERENCES "NvimConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigPlugins" ADD CONSTRAINT "NeovimConfigPlugins_nvimConfigId_fkey" FOREIGN KEY ("nvimConfigId") REFERENCES "NvimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfigSync" ADD CONSTRAINT "NeovimConfigSync_nvimConfigId_fkey" FOREIGN KEY ("nvimConfigId") REFERENCES "NvimConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubRepository" ADD CONSTRAINT "GithubRepository_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolConfig" ADD CONSTRAINT "ToolConfig_toolName_fkey" FOREIGN KEY ("toolName") REFERENCES "Tool"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolConfig" ADD CONSTRAINT "ToolConfig_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "GithubRepository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
