/*
  Warnings:

  - You are about to drop the column `settingsNames` on the `Checkitem` table. All the data in the column will be lost.
  - You are about to drop the column `constrains` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Checkitem` DROP COLUMN `settingsNames`,
    ADD COLUMN `requiredSettings` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `constrains`;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToSetting` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToSetting_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToSetting_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToEvaluation` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToEvaluation_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToEvaluation_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToCheckitem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToCheckitem_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToCheckitem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToTestcase` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToTestcase_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToTestcase_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AttachmentToProject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AttachmentToProject_AB_unique`(`A`, `B`),
    INDEX `_AttachmentToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AttachmentToSetting` ADD CONSTRAINT `_AttachmentToSetting_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToSetting` ADD CONSTRAINT `_AttachmentToSetting_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToEvaluation` ADD CONSTRAINT `_AttachmentToEvaluation_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToEvaluation` ADD CONSTRAINT `_AttachmentToEvaluation_B_fkey` FOREIGN KEY (`B`) REFERENCES `Evaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToCheckitem` ADD CONSTRAINT `_AttachmentToCheckitem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToCheckitem` ADD CONSTRAINT `_AttachmentToCheckitem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Checkitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToTestcase` ADD CONSTRAINT `_AttachmentToTestcase_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToTestcase` ADD CONSTRAINT `_AttachmentToTestcase_B_fkey` FOREIGN KEY (`B`) REFERENCES `Testcase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToProject` ADD CONSTRAINT `_AttachmentToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AttachmentToProject` ADD CONSTRAINT `_AttachmentToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
