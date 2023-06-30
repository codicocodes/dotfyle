-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "neovimPluginId" INTEGER,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_neovimPluginId_fkey" FOREIGN KEY ("neovimPluginId") REFERENCES "NeovimPlugin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
