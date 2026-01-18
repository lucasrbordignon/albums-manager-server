/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `photos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "hash" TEXT,
ADD COLUMN     "thumbnail_path" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "photos_hash_key" ON "photos"("hash");
