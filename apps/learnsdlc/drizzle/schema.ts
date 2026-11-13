import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Leaderboard table for tracking scores
export const leaderboard = mysqlTable("leaderboard", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  gameType: mysqlEnum("gameType", ["refactoring", "boss"]).notNull(),
  score: int("score").notNull(),
  maxScore: int("maxScore").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeaderboardEntry = typeof leaderboard.$inferSelect;
export type InsertLeaderboardEntry = typeof leaderboard.$inferInsert;

// Badges table for gamification
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeType: mysqlEnum("badgeType", [
    "perfect_quiz",
    "perfect_refactoring",
    "perfect_boss",
    "first_attempt",
    "speed_runner",
    "master_logician",
    "early_adopter",
    "completionist",
    "streak_master",
    "abt_fundamentals_complete",
    "coding_style_complete",
    "commenting_complete",
    "technical_writing_complete",
    "all_courses_complete"
  ]).notNull(),
  courseId: varchar("courseId", { length: 64 }), // Optional: for course-specific badges
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

// Forum posts table
export const forumPosts = mysqlTable("forum_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["question", "example", "discussion"]).default("question").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

// Forum replies table
export const forumReplies = mysqlTable("forum_replies", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

// User streaks table for tracking daily activity
export const userStreaks = mysqlTable("user_streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserStreak = typeof userStreaks.$inferSelect;
export type InsertUserStreak = typeof userStreaks.$inferInsert;

// Micro-quiz attempts table for tracking individual quiz attempts
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(), // e.g., "coding-style", "commenting"
  topicId: varchar("topicId", { length: 64 }).notNull(), // e.g., "file-organization", "naming-conventions"
  questionId: varchar("questionId", { length: 64 }).notNull(),
  selectedAnswer: varchar("selectedAnswer", { length: 255 }).notNull(),
  isCorrect: int("isCorrect").notNull(), // 0 = false, 1 = true
  attemptNumber: int("attemptNumber").default(1).notNull(), // Which attempt (1st, 2nd after ELI5)
  usedSimplifiedExplanation: int("usedSimplifiedExplanation").default(0).notNull(), // 0 = false, 1 = true
  timeSpentSeconds: int("timeSpentSeconds").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

// Course progress table for tracking overall progress per course
export const courseProgress = mysqlTable("course_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  topicsCompleted: int("topicsCompleted").default(0).notNull(),
  totalTopics: int("totalTopics").notNull(),
  quizzesPassed: int("quizzesPassed").default(0).notNull(),
  quizzesFailed: int("quizzesFailed").default(0).notNull(),
  totalQuizAttempts: int("totalQuizAttempts").default(0).notNull(),
  eli5ExplanationsUsed: int("eli5ExplanationsUsed").default(0).notNull(),
  averageScore: int("averageScore").default(0), // Percentage 0-100
  lastAccessedAt: timestamp("lastAccessedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseProgress = typeof courseProgress.$inferSelect;
export type InsertCourseProgress = typeof courseProgress.$inferInsert;

// Topic progress table for granular tracking per topic
export const topicProgress = mysqlTable("topic_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  topicId: varchar("topicId", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "quiz_failed", "completed"]).default("not_started").notNull(),
  quizScore: int("quizScore"), // Percentage 0-100
  quizAttempts: int("quizAttempts").default(0).notNull(),
  usedEli5: int("usedEli5").default(0).notNull(), // 0 = false, 1 = true
  timeSpentSeconds: int("timeSpentSeconds").default(0),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TopicProgress = typeof topicProgress.$inferSelect;
export type InsertTopicProgress = typeof topicProgress.$inferInsert;


// Course completion certificates
export const courseCertificates = mysqlTable("course_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  courseName: varchar("courseName", { length: 255 }).notNull(),
  certificateNumber: varchar("certificateNumber", { length: 64 }).notNull().unique(),
  topicsCompleted: int("topicsCompleted").notNull(),
  quizzesPassed: int("quizzesPassed").notNull(),
  averageScore: int("averageScore").notNull(), // Percentage 0-100
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

export type CourseCertificate = typeof courseCertificates.$inferSelect;
export type InsertCourseCertificate = typeof courseCertificates.$inferInsert;

// Spaced repetition queue for failed questions
export const spacedRepetitionQueue = mysqlTable("spaced_repetition_queue", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  topicId: varchar("topicId", { length: 64 }).notNull(),
  questionId: varchar("questionId", { length: 64 }).notNull(),
  failedAttempts: int("failedAttempts").default(1).notNull(),
  easeFactor: int("easeFactor").default(250).notNull(), // SM-2 algorithm ease factor * 100
  intervalDays: int("intervalDays").default(1).notNull(), // Days until next review
  nextReviewAt: timestamp("nextReviewAt").notNull(),
  lastReviewedAt: timestamp("lastReviewedAt").defaultNow().notNull(),
  status: mysqlEnum("status", ["pending", "due", "mastered"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SpacedRepetitionItem = typeof spacedRepetitionQueue.$inferSelect;
export type InsertSpacedRepetitionItem = typeof spacedRepetitionQueue.$inferInsert;

// Section completion tracking with badges and points
export const sectionCompletions = mysqlTable("section_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  sectionPath: varchar("sectionPath", { length: 255 }).notNull(), // e.g., "/module-1", "/grace-academy/module-1"
  sectionType: mysqlEnum("sectionType", ["lesson", "game", "quiz", "exam", "challenge"]).notNull(),
  pointsEarned: int("pointsEarned").default(0).notNull(),
  badgeAwarded: varchar("badgeAwarded", { length: 64 }), // Badge ID if one was awarded
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type SectionCompletion = typeof sectionCompletions.$inferSelect;
export type InsertSectionCompletion = typeof sectionCompletions.$inferInsert;

// User points summary
export const userPoints = mysqlTable("user_points", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalPoints: int("totalPoints").default(0).notNull(),
  lessonsCompleted: int("lessonsCompleted").default(0).notNull(),
  gamesCompleted: int("gamesCompleted").default(0).notNull(),
  quizzesCompleted: int("quizzesCompleted").default(0).notNull(),
  examsCompleted: int("examsCompleted").default(0).notNull(),
  challengesCompleted: int("challengesCompleted").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPoints = typeof userPoints.$inferSelect;
export type InsertUserPoints = typeof userPoints.$inferInsert;

// Community statistics for peer comparison (aggregated daily)
export const communityStats = mysqlTable("community_stats", {
  id: int("id").autoincrement().primaryKey(),
  courseId: varchar("courseId", { length: 64 }).notNull(),
  topicId: varchar("topicId", { length: 64 }),
  totalAttempts: int("totalAttempts").default(0).notNull(),
  totalCorrect: int("totalCorrect").default(0).notNull(),
  averageAccuracy: int("averageAccuracy").default(0).notNull(), // Percentage 0-100
  totalUsers: int("totalUsers").default(0).notNull(),
  eli5UsageRate: int("eli5UsageRate").default(0).notNull(), // Percentage 0-100
  averageAttemptsToPass: int("averageAttemptsToPass").default(1).notNull(),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunityStats = typeof communityStats.$inferSelect;
export type InsertCommunityStats = typeof communityStats.$inferInsert;


// ============ GRACE ACADEMY TABLES ============

// GRACE Academy modules table
export const graceModules = mysqlTable("grace_modules", {
  id: int("id").autoincrement().primaryKey(),
  moduleNumber: int("moduleNumber").notNull().unique(),
  track: mysqlEnum("track", ["foundation", "intermediate", "advanced"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  sparkContent: text("sparkContent"), // The Spark - 3 min reading
  imprintContent: text("imprintContent"), // The Imprint - thought experiment
  visualAidUrl: varchar("visualAidUrl", { length: 500 }),
  visualAidDescription: text("visualAidDescription"),
  estimatedMinutes: int("estimatedMinutes").default(15),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GraceModule = typeof graceModules.$inferSelect;
export type InsertGraceModule = typeof graceModules.$inferInsert;

// GRACE Academy quiz questions (The Gauntlet)
export const graceQuizQuestions = mysqlTable("grace_quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  questionNumber: int("questionNumber").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array of options
  correctAnswer: int("correctAnswer").notNull(), // Index of correct option
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GraceQuizQuestion = typeof graceQuizQuestions.$inferSelect;
export type InsertGraceQuizQuestion = typeof graceQuizQuestions.$inferInsert;

// GRACE Academy Crucible challenges
export const graceCrucibleChallenges = mysqlTable("grace_crucible_challenges", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull().unique(),
  challengePrompt: text("challengePrompt").notNull(),
  evaluationCriteria: text("evaluationCriteria"),
  sampleResponse: text("sampleResponse"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GraceCrucibleChallenge = typeof graceCrucibleChallenges.$inferSelect;
export type InsertGraceCrucibleChallenge = typeof graceCrucibleChallenges.$inferInsert;

// GRACE Academy user progress
export const graceUserProgress = mysqlTable("grace_user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  sparkCompleted: int("sparkCompleted").default(0).notNull(), // 0 = false, 1 = true
  gauntletCompleted: int("gauntletCompleted").default(0).notNull(),
  crucibleCompleted: int("crucibleCompleted").default(0).notNull(),
  imprintCompleted: int("imprintCompleted").default(0).notNull(),
  moduleCompleted: int("moduleCompleted").default(0).notNull(),
  bestQuizScore: int("bestQuizScore"), // Percentage 0-100
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GraceUserProgress = typeof graceUserProgress.$inferSelect;
export type InsertGraceUserProgress = typeof graceUserProgress.$inferInsert;

// GRACE Academy quiz attempts
export const graceQuizAttempts = mysqlTable("grace_quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  score: int("score").notNull(), // Out of 5
  answers: text("answers").notNull(), // JSON array of selected answers
  timeTaken: int("timeTaken"), // Seconds
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});

export type GraceQuizAttempt = typeof graceQuizAttempts.$inferSelect;
export type InsertGraceQuizAttempt = typeof graceQuizAttempts.$inferInsert;

// GRACE Academy Crucible submissions
export const graceCrucibleSubmissions = mysqlTable("grace_crucible_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  submission: text("submission").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "needs_revision"]).default("pending").notNull(),
  adminFeedback: text("adminFeedback"),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type GraceCrucibleSubmission = typeof graceCrucibleSubmissions.$inferSelect;
export type InsertGraceCrucibleSubmission = typeof graceCrucibleSubmissions.$inferInsert;

// GRACE Academy certificates
export const graceCertificates = mysqlTable("grace_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  certificateType: mysqlEnum("certificateType", ["foundation", "intermediate", "advanced", "grace_diploma"]).notNull(),
  certificateCode: varchar("certificateCode", { length: 64 }).notNull().unique(),
  averageScore: int("averageScore"), // Percentage 0-100
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type GraceCertificate = typeof graceCertificates.$inferSelect;
export type InsertGraceCertificate = typeof graceCertificates.$inferInsert;


// ============ CMAKE MASTERY TABLES ============

// CMake Mastery modules table
export const cmakeModules = mysqlTable("cmake_modules", {
  id: int("id").autoincrement().primaryKey(),
  moduleNumber: int("moduleNumber").notNull().unique(),
  track: mysqlEnum("cmakeTrack", ["foundations", "build_system", "advanced", "tools"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  sparkContent: text("sparkContent"),
  imprintContent: text("imprintContent"),
  cruciblePrompt: text("cruciblePrompt"),
  crucibleSample: text("crucibleSample"),
  visualAidUrl: varchar("visualAidUrl", { length: 500 }),
  shockImageUrl: varchar("shockImageUrl", { length: 500 }),
  estimatedMinutes: int("estimatedMinutes").default(15),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CmakeModule = typeof cmakeModules.$inferSelect;
export type InsertCmakeModule = typeof cmakeModules.$inferInsert;

// CMake Mastery quiz questions (The Gauntlet)
export const cmakeQuizQuestions = mysqlTable("cmake_quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  questionNumber: int("questionNumber").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(),
  correctAnswer: int("correctAnswer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type CmakeQuizQuestion = typeof cmakeQuizQuestions.$inferSelect;
export type InsertCmakeQuizQuestion = typeof cmakeQuizQuestions.$inferInsert;

// CMake Mastery user progress
export const cmakeUserProgress = mysqlTable("cmake_user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  sparkCompleted: int("sparkCompleted").default(0).notNull(),
  gauntletCompleted: int("gauntletCompleted").default(0).notNull(),
  crucibleCompleted: int("crucibleCompleted").default(0).notNull(),
  imprintCompleted: int("imprintCompleted").default(0).notNull(),
  moduleCompleted: int("moduleCompleted").default(0).notNull(),
  bestQuizScore: int("bestQuizScore"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type CmakeUserProgress = typeof cmakeUserProgress.$inferSelect;
export type InsertCmakeUserProgress = typeof cmakeUserProgress.$inferInsert;

// CMake Mastery quiz attempts
export const cmakeQuizAttempts = mysqlTable("cmake_quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  score: int("score").notNull(),
  answers: text("answers").notNull(),
  timeTaken: int("timeTaken"),
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});
export type CmakeQuizAttempt = typeof cmakeQuizAttempts.$inferSelect;
export type InsertCmakeQuizAttempt = typeof cmakeQuizAttempts.$inferInsert;

// CMake Mastery crucible submissions
export const cmakeCrucibleSubmissions = mysqlTable("cmake_crucible_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  submission: text("submission").notNull(),
  status: mysqlEnum("cmakeStatus", ["pending", "approved", "needs_revision"]).default("pending").notNull(),
  adminFeedback: text("adminFeedback"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});
export type CmakeCrucibleSubmission = typeof cmakeCrucibleSubmissions.$inferSelect;
export type InsertCmakeCrucibleSubmission = typeof cmakeCrucibleSubmissions.$inferInsert;

// CMake Mastery certificates
export const cmakeCertificates = mysqlTable("cmake_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  certificateType: mysqlEnum("cmakeCertType", ["cmake_foundations", "cmake_advanced", "cmake_mastery_diploma"]).notNull(),
  certificateCode: varchar("certificateCode", { length: 64 }).notNull().unique(),
  averageScore: int("averageScore"),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});
export type CmakeCertificate = typeof cmakeCertificates.$inferSelect;
export type InsertCmakeCertificate = typeof cmakeCertificates.$inferInsert;


// ============ SOFTWARE TESTING FUNDAMENTALS TABLES ============

// STF modules table
export const stfModules = mysqlTable("stf_modules", {
  id: int("id").autoincrement().primaryKey(),
  moduleNumber: int("moduleNumber").notNull().unique(),
  track: mysqlEnum("stfTrack", ["foundations", "sdlc_models", "methodologies", "techniques", "professional_practice"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  sparkContent: text("sparkContent"),
  imprintContent: text("imprintContent"),
  crucibleType: mysqlEnum("crucibleType", ["game", "exercise", "simulation"]).default("game").notNull(),
  cruciblePrompt: text("cruciblePrompt"),
  crucibleConfig: text("crucibleConfig"), // JSON config for the game (items, correct answers, scoring)
  visualAidUrl: varchar("visualAidUrl", { length: 500 }),
  infographicTakeaway: varchar("infographicTakeaway", { length: 500 }),
  estimatedMinutes: int("estimatedMinutes").default(15),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type StfModule = typeof stfModules.$inferSelect;
export type InsertStfModule = typeof stfModules.$inferInsert;

// STF quiz questions (The Gauntlet)
export const stfQuizQuestions = mysqlTable("stf_quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  questionNumber: int("questionNumber").notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON array of options
  correctAnswer: int("correctAnswer").notNull(), // Index of correct option (0-based)
  explanation: text("explanation"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type StfQuizQuestion = typeof stfQuizQuestions.$inferSelect;
export type InsertStfQuizQuestion = typeof stfQuizQuestions.$inferInsert;

// STF user progress
export const stfUserProgress = mysqlTable("stf_user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  sparkCompleted: int("sparkCompleted").default(0).notNull(),
  gauntletCompleted: int("gauntletCompleted").default(0).notNull(),
  crucibleCompleted: int("crucibleCompleted").default(0).notNull(),
  imprintCompleted: int("imprintCompleted").default(0).notNull(),
  moduleCompleted: int("moduleCompleted").default(0).notNull(),
  bestQuizScore: int("bestQuizScore"),
  bestGameScore: int("bestGameScore"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type StfUserProgress = typeof stfUserProgress.$inferSelect;
export type InsertStfUserProgress = typeof stfUserProgress.$inferInsert;

// STF quiz attempts
export const stfQuizAttempts = mysqlTable("stf_quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  score: int("score").notNull(), // Out of 5
  answers: text("answers").notNull(), // JSON array of selected answers
  timeTaken: int("timeTaken"), // Seconds
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});
export type StfQuizAttempt = typeof stfQuizAttempts.$inferSelect;
export type InsertStfQuizAttempt = typeof stfQuizAttempts.$inferInsert;

// STF game scores (The Crucible)
export const stfGameScores = mysqlTable("stf_game_scores", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  gameName: varchar("gameName", { length: 128 }).notNull(),
  score: int("score").notNull(),
  maxScore: int("maxScore").notNull(),
  timeTaken: int("timeTaken"), // Seconds
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});
export type StfGameScore = typeof stfGameScores.$inferSelect;
export type InsertStfGameScore = typeof stfGameScores.$inferInsert;

// STF final exam attempts
export const stfExamAttempts = mysqlTable("stf_exam_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  score: int("score").notNull(), // Out of 30
  answers: text("answers").notNull(), // JSON array of selected answers
  passed: int("passed").notNull(), // 0 = false, 1 = true (70% = 21/30 to pass)
  timeTaken: int("timeTaken"), // Seconds
  attemptedAt: timestamp("attemptedAt").defaultNow().notNull(),
});
export type StfExamAttempt = typeof stfExamAttempts.$inferSelect;
export type InsertStfExamAttempt = typeof stfExamAttempts.$inferInsert;

// STF certificates
export const stfCertificates = mysqlTable("stf_certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  certificateType: mysqlEnum("stfCertType", ["stf_foundations", "stf_advanced", "stf_diploma"]).notNull(),
  certificateCode: varchar("certificateCode", { length: 64 }).notNull().unique(),
  averageScore: int("averageScore"),
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});
export type StfCertificate = typeof stfCertificates.$inferSelect;
export type InsertStfCertificate = typeof stfCertificates.$inferInsert;

// Isolated additive Evidence Desk tables; legacy schema above is unchanged.
export * from "./evidence-schema";
