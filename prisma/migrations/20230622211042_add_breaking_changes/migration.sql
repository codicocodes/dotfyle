-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakingChange" (
    "id" SERIAL NOT NULL,
    "postId" TEXT NOT NULL,
    "pluginId" INTEGER NOT NULL,
    "external_url" TEXT NOT NULL,

    CONSTRAINT "BreakingChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BreakingChange_postId_key" ON "BreakingChange"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "BreakingChange_pluginId_key" ON "BreakingChange"("pluginId");

-- CreateIndex
CREATE UNIQUE INDEX "BreakingChange_external_url_key" ON "BreakingChange"("external_url");

-- AddForeignKey
ALTER TABLE "BreakingChange" ADD CONSTRAINT "BreakingChange_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakingChange" ADD CONSTRAINT "BreakingChange_pluginId_fkey" FOREIGN KEY ("pluginId") REFERENCES "NeovimPlugin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
