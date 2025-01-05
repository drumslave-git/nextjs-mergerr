-- CreateTable
CREATE TABLE "TPDB" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "lastRequestAt" DATETIME,
    "requestesCount" INTEGER NOT NULL DEFAULT 0
);
