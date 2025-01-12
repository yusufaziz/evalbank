-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "modelFY" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "procedures" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CheckItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expectedTarget" TEXT NOT NULL,
    "testCaseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CheckItem_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "TestCase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "constraints" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "judgement" TEXT NOT NULL,
    "remarks" TEXT,
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CheckItemToSetting" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CheckItemToSetting_A_fkey" FOREIGN KEY ("A") REFERENCES "CheckItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CheckItemToSetting_B_fkey" FOREIGN KEY ("B") REFERENCES "Setting" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CheckItemToEvaluation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CheckItemToEvaluation_A_fkey" FOREIGN KEY ("A") REFERENCES "CheckItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CheckItemToEvaluation_B_fkey" FOREIGN KEY ("B") REFERENCES "Evaluation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CheckItemToSetting_AB_unique" ON "_CheckItemToSetting"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckItemToSetting_B_index" ON "_CheckItemToSetting"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CheckItemToEvaluation_AB_unique" ON "_CheckItemToEvaluation"("A", "B");

-- CreateIndex
CREATE INDEX "_CheckItemToEvaluation_B_index" ON "_CheckItemToEvaluation"("B");
