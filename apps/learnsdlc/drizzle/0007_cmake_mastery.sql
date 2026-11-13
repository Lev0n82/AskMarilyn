-- CMake Mastery Course Tables Migration

CREATE TABLE IF NOT EXISTS `cmake_modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moduleNumber` int NOT NULL,
  `cmakeTrack` enum('foundations','build_system','advanced','tools') NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(500),
  `sparkContent` text,
  `cruciblePrompt` text,
  `crucibleSample` text,
  `imprintContent` text,
  `visualAidUrl` varchar(500),
  `shockImageUrl` varchar(500),
  `estimatedMinutes` int DEFAULT 15,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmake_modules_moduleNumber_unique` (`moduleNumber`)
);

CREATE TABLE IF NOT EXISTS `cmake_quiz_questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `moduleId` int NOT NULL,
  `questionNumber` int NOT NULL,
  `question` text NOT NULL,
  `options` text NOT NULL,
  `correctAnswer` int NOT NULL,
  `explanation` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `cmake_user_progress` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `moduleId` int NOT NULL,
  `sparkCompleted` tinyint DEFAULT 0,
  `gauntletCompleted` tinyint DEFAULT 0,
  `crucibleCompleted` tinyint DEFAULT 0,
  `imprintCompleted` tinyint DEFAULT 0,
  `moduleCompleted` tinyint DEFAULT 0,
  `bestQuizScore` int DEFAULT 0,
  `completedAt` timestamp NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmake_user_progress_user_module_unique` (`userId`, `moduleId`)
);

CREATE TABLE IF NOT EXISTS `cmake_quiz_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `moduleId` int NOT NULL,
  `score` int NOT NULL,
  `answers` text NOT NULL,
  `timeTaken` int,
  `attemptedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `cmake_crucible_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `moduleId` int NOT NULL,
  `submission` text NOT NULL,
  `status` enum('pending','approved','needs_revision') DEFAULT 'pending' NOT NULL,
  `feedback` text,
  `submittedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `cmake_certificates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `certificateType` enum('cmake_foundations','cmake_advanced','cmake_mastery_diploma') NOT NULL,
  `certificateCode` varchar(50) NOT NULL,
  `averageScore` int DEFAULT 0,
  `earnedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmake_certificates_code_unique` (`certificateCode`)
);
