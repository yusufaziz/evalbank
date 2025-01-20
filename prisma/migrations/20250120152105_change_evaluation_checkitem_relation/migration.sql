/*
  Warnings:

  - You are about to drop the `_CheckitemToEvaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_CheckitemToEvaluation` DROP FOREIGN KEY `_CheckitemToEvaluation_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CheckitemToEvaluation` DROP FOREIGN KEY `_CheckitemToEvaluation_B_fkey`;

-- AlterTable
ALTER TABLE `Evaluation` ADD COLUMN `checkitemId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_CheckitemToEvaluation`;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_checkitemId_fkey` FOREIGN KEY (`checkitemId`) REFERENCES `Checkitem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
