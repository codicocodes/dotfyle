-- CreateTable
CREATE TABLE "TwinPost" (
    "issue" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "TwinPost_pkey" PRIMARY KEY ("issue")
);

-- CreateIndex
CREATE UNIQUE INDEX "TwinPost_issue_key" ON "TwinPost"("issue");

-- CreateIndex
CREATE UNIQUE INDEX "TwinPost_postId_key" ON "TwinPost"("postId");

-- AddForeignKey
ALTER TABLE "TwinPost" ADD CONSTRAINT "TwinPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
