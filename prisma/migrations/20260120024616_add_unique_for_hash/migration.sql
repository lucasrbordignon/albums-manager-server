/*
  Warnings:

  - A unique constraint covering the columns `[id,hash,deletedAt]` on the table `photos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "photos_hash_deletedAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "photos_id_hash_deletedAt_key" ON "photos"("id", "hash", "deletedAt");
