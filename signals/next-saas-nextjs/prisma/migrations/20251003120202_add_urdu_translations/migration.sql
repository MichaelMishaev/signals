-- AlterTable
ALTER TABLE "public"."drills" ADD COLUMN     "content_ur" TEXT,
ADD COLUMN     "description_ur" TEXT,
ADD COLUMN     "title_ur" TEXT;

-- AlterTable
ALTER TABLE "public"."signals" ADD COLUMN     "author_ur" TEXT,
ADD COLUMN     "content_ur" TEXT,
ADD COLUMN     "title_ur" TEXT;
