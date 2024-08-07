/*
  Warnings:

  - You are about to drop the column `user_id` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_user_id_fkey`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `user_id`;
