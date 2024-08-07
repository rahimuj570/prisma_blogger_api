-- AlterTable
ALTER TABLE `users` ADD COLUMN `user_role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
