-- AlterTable
ALTER TABLE `evaluation` ADD COLUMN `redmineId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `redmineProject` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `testcase` ADD COLUMN `redmineTitle` VARCHAR(191) NULL;
