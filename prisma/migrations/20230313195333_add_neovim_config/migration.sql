-- CreateTable
CREATE TABLE "NeovimConfig" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "root" TEXT NOT NULL,
    "initFile" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "NeovimConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfig_userId_key" ON "NeovimConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NeovimConfig_owner_repo_root_key" ON "NeovimConfig"("owner", "repo", "root");

-- AddForeignKey
ALTER TABLE "NeovimConfig" ADD CONSTRAINT "NeovimConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
