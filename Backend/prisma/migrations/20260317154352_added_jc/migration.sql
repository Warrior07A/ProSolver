-- CreateTable
CREATE TABLE "ProblemTags" (
    "id" TEXT NOT NULL,
    "Tag_id" TEXT NOT NULL,
    "Pro_id" TEXT NOT NULL,

    CONSTRAINT "ProblemTags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProblemTags" ADD CONSTRAINT "ProblemTags_Pro_id_fkey" FOREIGN KEY ("Pro_id") REFERENCES "Problems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTags" ADD CONSTRAINT "ProblemTags_Tag_id_fkey" FOREIGN KEY ("Tag_id") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
