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
