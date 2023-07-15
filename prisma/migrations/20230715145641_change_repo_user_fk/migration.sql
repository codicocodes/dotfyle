-- DropForeignKey
ALTER TABLE "GithubRepository" DROP CONSTRAINT "GithubRepository_owner_fkey";

-- AlterTable
ALTER TABLE "GithubRepository" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "GithubRepository" ADD CONSTRAINT "GithubRepository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
