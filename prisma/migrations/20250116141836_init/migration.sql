/*
  Warnings:

  - You are about to drop the `CheckItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CheckItemToEvaluation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CheckItemToSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CheckItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CheckItemToEvaluation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CheckItemToSetting";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Checkitem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "expectedTarget" TEXT NOT NULL,
    "testCaseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Checkitem_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "Testcase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CheckitemToSetting" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CheckitemToSetting_A_fkey" FOREIGN KEY ("A") REFERENCES "Checkitem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CheckitemToSetting_B_fkey" FOREIGN KEY ("B") REFERENCES "Setting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CheckitemToEvaluation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CheckitemToEvaluation_A_fkey" FOREIGN KEY ("A") REFERENCES "Checkitem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CheckitemToEvaluation_B_fkey" FOREIGN KEY ("B") REFERENCES "Evaluation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_CheckitemToSetting_AB_unique" ON "_CheckitemToSetting"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckitemToSetting_B_index" ON "_CheckitemToSetting"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CheckitemToEvaluation_AB_unique" ON "_CheckitemToEvaluation"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckitemToEvaluation_B_index" ON "_CheckitemToEvaluation"("B");
