/*
  Warnings:

  - You are about to drop the column `output` on the `Merge` table. All the data in the column will be lost.
  - Added the required column `movieId` to the `Merge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbId` to the `Merge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progress" INTEGER NOT NULL,
    "error" TEXT,
    "result" TEXT,
    "status" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    CONSTRAINT "Merge_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Merge" ("app_id", "error", "id", "progress", "result", "status") SELECT "app_id", "error", "id", "progress", "result", "status" FROM "Merge";
DROP TABLE "Merge";
ALTER TABLE "new_Merge" RENAME TO "Merge";
CREATE UNIQUE INDEX "Merge_movieId_key" ON "Merge"("movieId");
CREATE UNIQUE INDEX "Merge_tmdbId_key" ON "Merge"("tmdbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
