/*
  Warnings:

  - You are about to drop the `spptb` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `spptb`;

-- CreateTable
CREATE TABLE `spptpbb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomer_antrian` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
