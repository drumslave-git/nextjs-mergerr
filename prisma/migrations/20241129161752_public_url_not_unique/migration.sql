-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_url" TEXT DEFAULT '',
    "api_key" TEXT NOT NULL
);
INSERT INTO "new_App" ("api_key", "id", "name", "public_url", "type", "url") SELECT "api_key", "id", "name", "public_url", "type", "url" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");
CREATE UNIQUE INDEX "App_url_key" ON "App"("url");
CREATE UNIQUE INDEX "App_api_key_key" ON "App"("api_key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
