-- CreateTable
CREATE TABLE `_ProjectToSetting` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectToSetting_AB_unique`(`A`, `B`),
    INDEX `_ProjectToSetting_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectToSetting` ADD CONSTRAINT `_ProjectToSetting_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToSetting` ADD CONSTRAINT `_ProjectToSetting_B_fkey` FOREIGN KEY (`B`) REFERENCES `Setting`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
