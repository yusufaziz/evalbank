/*
  Warnings:

  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TestCase";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Testcase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "procedures" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CheckItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expectedTarget" TEXT NOT NULL,
    "testCaseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CheckItem_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "Testcase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CheckItem" ("createdAt", "expectedTarget", "id", "testCaseId", "updatedAt") SELECT "createdAt", "expectedTarget", "id", "testCaseId", "updatedAt" FROM "CheckItem";
DROP TABLE "CheckItem";
ALTER TABLE "new_CheckItem" RENAME TO "CheckItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
