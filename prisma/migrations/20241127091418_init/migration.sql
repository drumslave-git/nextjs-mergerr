-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_url" TEXT,
    "api_key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Merge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "output" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "error" TEXT,
    "result" TEXT,
    "status" TEXT NOT NULL,
    "app_id" TEXT NOT NULL,
    CONSTRAINT "Merge_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Input" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "merge_id" TEXT NOT NULL,
    CONSTRAINT "Input_merge_id_fkey" FOREIGN KEY ("merge_id") REFERENCES "Merge" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TMDB" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "lastRequestAt" DATETIME,
    "requestesCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");

-- CreateIndex
CREATE UNIQUE INDEX "App_url_key" ON "App"("url");

-- CreateIndex
CREATE UNIQUE INDEX "App_public_url_key" ON "App"("public_url");

-- CreateIndex
CREATE UNIQUE INDEX "App_api_key_key" ON "App"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "Merge_output_key" ON "Merge"("output");
