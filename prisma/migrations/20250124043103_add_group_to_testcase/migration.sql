-- Step 1: Add the column as nullable
ALTER TABLE `Testcase` ADD COLUMN `group` VARCHAR(191) NULL;

-- Step 2: Update existing rows to set the default value
UPDATE `Testcase` SET `group` = 'Common' WHERE `group` IS NULL;

-- Step 3: Alter the column to NOT NULL
ALTER TABLE `Testcase` MODIFY COLUMN `group` VARCHAR(191) NOT NULL;