-- CreateTable
CREATE TABLE "GithubToken" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "GithubToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubToken_userId_key" ON "GithubToken"("userId");

-- AddForeignKey
ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
