/*
  Warnings:

  - You are about to drop the column `requiredSettings` on the `checkitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `checkitem` DROP COLUMN `requiredSettings`;

-- CreateTable
CREATE TABLE `_CheckitemToSetting` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CheckitemToSetting_AB_unique`(`A`, `B`),
    INDEX `_CheckitemToSetting_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CheckitemToSetting` ADD CONSTRAINT `_CheckitemToSetting_A_fkey` FOREIGN KEY (`A`) REFERENCES `Checkitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CheckitemToSetting` ADD CONSTRAINT `_CheckitemToSetting_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
