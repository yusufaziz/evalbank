/*
  Warnings:

  - You are about to drop the column `constrains` on the `setting` table. All the data in the column will be lost.
  - You are about to drop the `settingconstraints` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Setting` DROP COLUMN `constrains`;

-- DropTable
DROP TABLE `SettingConstraints`;

-- CreateTable
CREATE TABLE `_requireSettings` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_requireSettings_AB_unique`(`A`, `B`),
    INDEX `_requireSettings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_requireSettings` ADD CONSTRAINT `_requireSettings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_requireSettings` ADD CONSTRAINT `_requireSettings_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
