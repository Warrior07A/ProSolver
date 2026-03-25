-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "Pro_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProblemsToTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProblemsToTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProblemsToTags_B_index" ON "_ProblemsToTags"("B");

-- AddForeignKey
ALTER TABLE "_ProblemsToTags" ADD CONSTRAINT "_ProblemsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Problems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProblemsToTags" ADD CONSTRAINT "_ProblemsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
