CREATE TABLE `user_streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActivityDate` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_streaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_streaks_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `badges` MODIFY COLUMN `badgeType` enum('perfect_quiz','perfect_refactoring','perfect_boss','first_attempt','speed_runner','master_logician','early_adopter','completionist','streak_master') NOT NULL;