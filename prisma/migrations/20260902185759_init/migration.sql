/*
  Warnings:

  - The `genre` column on the `Media` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `mediaId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "genre",
ADD COLUMN     "genre" TEXT[];

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "mediaId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
