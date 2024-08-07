/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postoncategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postontag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `postoncategory` DROP FOREIGN KEY `PostOnCategory_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `postoncategory` DROP FOREIGN KEY `PostOnCategory_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `postontag` DROP FOREIGN KEY `PostOnTag_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `postontag` DROP FOREIGN KEY `PostOnTag_tag_id_fkey`;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `postoncategory`;

-- DropTable
DROP TABLE `postontag`;

-- DropTable
DROP TABLE `tags`;
