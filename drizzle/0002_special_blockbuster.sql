CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeType` enum('perfect_quiz','perfect_refactoring','perfect_boss','first_attempt','speed_runner','master_logician','early_adopter','completionist') NOT NULL,
	`awardedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`category` enum('question','example','discussion') NOT NULL DEFAULT 'question',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forum_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forum_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`userName` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `forum_replies_id` PRIMARY KEY(`id`)
);
