CREATE TABLE `cmake_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cmakeCertType` enum('cmake_foundations','cmake_advanced','cmake_mastery_diploma') NOT NULL,
	`certificateCode` varchar(64) NOT NULL,
	`averageScore` int,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cmake_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `cmake_certificates_certificateCode_unique` UNIQUE(`certificateCode`)
);
--> statement-breakpoint
CREATE TABLE `cmake_crucible_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`submission` text NOT NULL,
	`cmakeStatus` enum('pending','approved','needs_revision') NOT NULL DEFAULT 'pending',
	`adminFeedback` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cmake_crucible_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cmake_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleNumber` int NOT NULL,
	`cmakeTrack` enum('foundations','build_system','advanced','tools') NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`sparkContent` text,
	`imprintContent` text,
	`cruciblePrompt` text,
	`crucibleSample` text,
	`visualAidUrl` varchar(500),
	`shockImageUrl` varchar(500),
	`estimatedMinutes` int DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cmake_modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `cmake_modules_moduleNumber_unique` UNIQUE(`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `cmake_quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`score` int NOT NULL,
	`answers` text NOT NULL,
	`timeTaken` int,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cmake_quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cmake_quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctAnswer` int NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cmake_quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cmake_user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`sparkCompleted` int NOT NULL DEFAULT 0,
	`gauntletCompleted` int NOT NULL DEFAULT 0,
	`crucibleCompleted` int NOT NULL DEFAULT 0,
	`imprintCompleted` int NOT NULL DEFAULT 0,
	`moduleCompleted` int NOT NULL DEFAULT 0,
	`bestQuizScore` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cmake_user_progress_id` PRIMARY KEY(`id`)
);
