CREATE TABLE `ed_attempts` (
	`id` varchar(128) NOT NULL,
	`ownerId` int NOT NULL,
	`version` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ed_credentials` (
	`id` varchar(128) NOT NULL,
	`ownerId` int NOT NULL,
	`version` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_credentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ed_learning` (
	`id` varchar(128) NOT NULL,
	`ownerId` int NOT NULL,
	`version` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_learning_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ed_releases` (
	`version` varchar(64) NOT NULL,
	`hash` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_releases_version` PRIMARY KEY(`version`)
);
--> statement-breakpoint
CREATE TABLE `ed_reviews` (
	`id` varchar(128) NOT NULL,
	`ownerId` int NOT NULL,
	`version` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ed_submissions` (
	`id` varchar(128) NOT NULL,
	`ownerId` int NOT NULL,
	`version` varchar(64) NOT NULL,
	`data` json NOT NULL,
	CONSTRAINT `ed_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `ed_attempts_owner` ON `ed_attempts` (`ownerId`,`version`);--> statement-breakpoint
CREATE INDEX `ed_credentials_owner` ON `ed_credentials` (`ownerId`,`version`);--> statement-breakpoint
CREATE INDEX `ed_learning_owner` ON `ed_learning` (`ownerId`,`version`);--> statement-breakpoint
CREATE INDEX `ed_reviews_owner` ON `ed_reviews` (`ownerId`,`version`);--> statement-breakpoint
CREATE INDEX `ed_submissions_owner` ON `ed_submissions` (`ownerId`,`version`);