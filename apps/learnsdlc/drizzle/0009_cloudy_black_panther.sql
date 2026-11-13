CREATE TABLE `stf_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stfCertType` enum('stf_foundations','stf_advanced','stf_diploma') NOT NULL,
	`certificateCode` varchar(64) NOT NULL,
	`averageScore` int,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stf_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `stf_certificates_certificateCode_unique` UNIQUE(`certificateCode`)
);
--> statement-breakpoint
CREATE TABLE `stf_exam_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL,
	`answers` text NOT NULL,
	`passed` int NOT NULL,
	`timeTaken` int,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stf_exam_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stf_game_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`gameName` varchar(128) NOT NULL,
	`score` int NOT NULL,
	`maxScore` int NOT NULL,
	`timeTaken` int,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stf_game_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stf_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleNumber` int NOT NULL,
	`stfTrack` enum('foundations','sdlc_models','methodologies','techniques','professional_practice') NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`sparkContent` text,
	`imprintContent` text,
	`crucibleType` enum('game','exercise','simulation') NOT NULL DEFAULT 'game',
	`cruciblePrompt` text,
	`crucibleConfig` text,
	`visualAidUrl` varchar(500),
	`infographicTakeaway` varchar(500),
	`estimatedMinutes` int DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stf_modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `stf_modules_moduleNumber_unique` UNIQUE(`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `stf_quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`score` int NOT NULL,
	`answers` text NOT NULL,
	`timeTaken` int,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stf_quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stf_quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctAnswer` int NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stf_quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stf_user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`sparkCompleted` int NOT NULL DEFAULT 0,
	`gauntletCompleted` int NOT NULL DEFAULT 0,
	`crucibleCompleted` int NOT NULL DEFAULT 0,
	`imprintCompleted` int NOT NULL DEFAULT 0,
	`moduleCompleted` int NOT NULL DEFAULT 0,
	`bestQuizScore` int,
	`bestGameScore` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stf_user_progress_id` PRIMARY KEY(`id`)
);
