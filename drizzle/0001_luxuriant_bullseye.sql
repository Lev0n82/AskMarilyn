CREATE TABLE `leaderboard` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`gameType` enum('refactoring','boss') NOT NULL,
	`score` int NOT NULL,
	`maxScore` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leaderboard_id` PRIMARY KEY(`id`)
);
