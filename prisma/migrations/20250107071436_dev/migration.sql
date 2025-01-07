/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `title` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `customer` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `executive` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Ticket` DROP PRIMARY KEY,
    DROP COLUMN `title`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `customer` VARCHAR(191) NOT NULL,
    ADD COLUMN `executive` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('OPEN', 'CLOSED', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    ADD COLUMN `subject` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
