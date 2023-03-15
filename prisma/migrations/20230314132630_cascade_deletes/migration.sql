-- DropForeignKey
ALTER TABLE "GithubToken" DROP CONSTRAINT "GithubToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "NeovimConfig" DROP CONSTRAINT "NeovimConfig_userId_fkey";

-- AddForeignKey
ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeovimConfig" ADD CONSTRAINT "NeovimConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
