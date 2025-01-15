/*
  Warnings:

  - You are about to drop the column `status` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to alter the column `judgement` on the `Evaluation` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `modelFY` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `constraints` on the `Setting` table. All the data in the column will be lost.
  - Added the required column `modelSeries` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judgement" INTEGER NOT NULL,
    "remarks" TEXT,
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Evaluation" ("createdAt", "id", "judgement", "projectId", "remarks", "updatedAt") SELECT "createdAt", "id", "judgement", "projectId", "remarks", "updatedAt" FROM "Evaluation";
DROP TABLE "Evaluation";
ALTER TABLE "new_Evaluation" RENAME TO "Evaluation";
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "modelFY" INTEGER NOT NULL,
    "modelSeries" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Project" ("author", "createdAt", "id", "modelFY", "modelName", "name", "updatedAt") SELECT "author", "createdAt", "id", "modelFY", "modelName", "name", "updatedAt" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Setting" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
