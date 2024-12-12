-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Merge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "progress" INTEGER DEFAULT 0,
    "error" TEXT,
    "result" TEXT,
    "status" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "queueId" INTEGER NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    CONSTRAINT "Merge_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Merge" ("app_id", "error", "id", "movieId", "progress", "queueId", "result", "status", "tmdbId") SELECT "app_id", "error", "id", "movieId", "progress", "queueId", "result", "status", "tmdbId" FROM "Merge";
DROP TABLE "Merge";
ALTER TABLE "new_Merge" RENAME TO "Merge";
CREATE UNIQUE INDEX "Merge_movieId_key" ON "Merge"("movieId");
CREATE UNIQUE INDEX "Merge_queueId_key" ON "Merge"("queueId");
CREATE UNIQUE INDEX "Merge_tmdbId_key" ON "Merge"("tmdbId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
