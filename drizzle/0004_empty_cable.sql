CREATE TABLE `course_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` varchar(64) NOT NULL,
	`topicsCompleted` int NOT NULL DEFAULT 0,
	`totalTopics` int NOT NULL,
	`quizzesPassed` int NOT NULL DEFAULT 0,
	`quizzesFailed` int NOT NULL DEFAULT 0,
	`totalQuizAttempts` int NOT NULL DEFAULT 0,
	`eli5ExplanationsUsed` int NOT NULL DEFAULT 0,
	`averageScore` int DEFAULT 0,
	`lastAccessedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `course_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` varchar(64) NOT NULL,
	`topicId` varchar(64) NOT NULL,
	`questionId` varchar(64) NOT NULL,
	`selectedAnswer` varchar(255) NOT NULL,
	`isCorrect` int NOT NULL,
	`attemptNumber` int NOT NULL DEFAULT 1,
	`usedSimplifiedExplanation` int NOT NULL DEFAULT 0,
	`timeSpentSeconds` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `topic_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` varchar(64) NOT NULL,
	`topicId` varchar(64) NOT NULL,
	`status` enum('not_started','in_progress','quiz_failed','completed') NOT NULL DEFAULT 'not_started',
	`quizScore` int,
	`quizAttempts` int NOT NULL DEFAULT 0,
	`usedEli5` int NOT NULL DEFAULT 0,
	`timeSpentSeconds` int DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `topic_progress_id` PRIMARY KEY(`id`)
);
