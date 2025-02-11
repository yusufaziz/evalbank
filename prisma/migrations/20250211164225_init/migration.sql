-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `modelFY` INTEGER NOT NULL,
    `modelSeries` VARCHAR(191) NOT NULL,
    `modelName` VARCHAR(191) NOT NULL,
    `redmineProject` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Testcase` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL DEFAULT 'Common',
    `procedures` VARCHAR(191) NOT NULL,
    `redmineTitle` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Checkitem` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `module` VARCHAR(191) NOT NULL,
    `expectedTarget` VARCHAR(191) NOT NULL,
    `testcaseId` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `judgement` INTEGER NOT NULL,
    `redmineId` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `projectId` VARCHAR(191) NULL,
    `testcaseId` VARCHAR(191) NULL,
    `checkitemId` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attachment` (
    `id` VARCHAR(191) NOT NULL DEFAULT '',
    `filename` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NULL,
    `modifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectSettings` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectSettings_AB_unique`(`A`, `B`),
    INDEX `_ProjectSettings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CheckitemSettings` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CheckitemSettings_AB_unique`(`A`, `B`),
    INDEX `_CheckitemSettings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RequiredBySettings` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RequiredBySettings_AB_unique`(`A`, `B`),
    INDEX `_RequiredBySettings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EvaluationSettings` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EvaluationSettings_AB_unique`(`A`, `B`),
    INDEX `_EvaluationSettings_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SettingAttachments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SettingAttachments_AB_unique`(`A`, `B`),
    INDEX `_SettingAttachments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EvaluationAttachments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EvaluationAttachments_AB_unique`(`A`, `B`),
    INDEX `_EvaluationAttachments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CheckitemAttachments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CheckitemAttachments_AB_unique`(`A`, `B`),
    INDEX `_CheckitemAttachments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TestcaseAttachments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_TestcaseAttachments_AB_unique`(`A`, `B`),
    INDEX `_TestcaseAttachments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectAttachments` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectAttachments_AB_unique`(`A`, `B`),
    INDEX `_ProjectAttachments_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Checkitem` ADD CONSTRAINT `Checkitem_testcaseId_fkey` FOREIGN KEY (`testcaseId`) REFERENCES `Testcase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_testcaseId_fkey` FOREIGN KEY (`testcaseId`) REFERENCES `Testcase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_checkitemId_fkey` FOREIGN KEY (`checkitemId`) REFERENCES `Checkitem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectSettings` ADD CONSTRAINT `_ProjectSettings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectSettings` ADD CONSTRAINT `_ProjectSettings_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CheckitemSettings` ADD CONSTRAINT `_CheckitemSettings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Checkitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CheckitemSettings` ADD CONSTRAINT `_CheckitemSettings_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RequiredBySettings` ADD CONSTRAINT `_RequiredBySettings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RequiredBySettings` ADD CONSTRAINT `_RequiredBySettings_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EvaluationSettings` ADD CONSTRAINT `_EvaluationSettings_A_fkey` FOREIGN KEY (`A`) REFERENCES `Evaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EvaluationSettings` ADD CONSTRAINT `_EvaluationSettings_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SettingAttachments` ADD CONSTRAINT `_SettingAttachments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SettingAttachments` ADD CONSTRAINT `_SettingAttachments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EvaluationAttachments` ADD CONSTRAINT `_EvaluationAttachments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EvaluationAttachments` ADD CONSTRAINT `_EvaluationAttachments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Evaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CheckitemAttachments` ADD CONSTRAINT `_CheckitemAttachments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CheckitemAttachments` ADD CONSTRAINT `_CheckitemAttachments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Checkitem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TestcaseAttachments` ADD CONSTRAINT `_TestcaseAttachments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TestcaseAttachments` ADD CONSTRAINT `_TestcaseAttachments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Testcase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectAttachments` ADD CONSTRAINT `_ProjectAttachments_A_fkey` FOREIGN KEY (`A`) REFERENCES `Attachment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectAttachments` ADD CONSTRAINT `_ProjectAttachments_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
