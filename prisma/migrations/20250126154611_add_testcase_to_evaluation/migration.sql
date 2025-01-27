-- AlterTable
ALTER TABLE `Evaluation` ADD COLUMN `testcaseId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Testcase` MODIFY `group` VARCHAR(191) NOT NULL DEFAULT 'Common';

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_testcaseId_fkey` FOREIGN KEY (`testcaseId`) REFERENCES `Testcase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
