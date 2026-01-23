CREATE TABLE `grace_certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateType` enum('foundation','intermediate','advanced','grace_diploma') NOT NULL,
	`certificateCode` varchar(64) NOT NULL,
	`averageScore` int,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `grace_certificates_certificateCode_unique` UNIQUE(`certificateCode`)
);
--> statement-breakpoint
CREATE TABLE `grace_crucible_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`challengePrompt` text NOT NULL,
	`evaluationCriteria` text,
	`sampleResponse` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_crucible_challenges_id` PRIMARY KEY(`id`),
	CONSTRAINT `grace_crucible_challenges_moduleId_unique` UNIQUE(`moduleId`)
);
--> statement-breakpoint
CREATE TABLE `grace_crucible_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`submission` text NOT NULL,
	`status` enum('pending','approved','needs_revision') NOT NULL DEFAULT 'pending',
	`adminFeedback` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_crucible_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleNumber` int NOT NULL,
	`track` enum('foundation','intermediate','advanced') NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` varchar(500),
	`sparkContent` text,
	`imprintContent` text,
	`visualAidUrl` varchar(500),
	`visualAidDescription` text,
	`estimatedMinutes` int DEFAULT 15,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grace_modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `grace_modules_moduleNumber_unique` UNIQUE(`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `grace_quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`score` int NOT NULL,
	`answers` text NOT NULL,
	`timeTaken` int,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctAnswer` int NOT NULL,
	`explanation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `grace_quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `grace_user_progress` (
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
	CONSTRAINT `grace_user_progress_id` PRIMARY KEY(`id`)
);
