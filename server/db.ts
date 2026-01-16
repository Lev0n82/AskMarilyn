import { eq, desc, and, sql, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leaderboard, InsertLeaderboardEntry, badges, InsertBadge, forumPosts, InsertForumPost, forumReplies, InsertForumReply, userStreaks, InsertUserStreak, quizAttempts, InsertQuizAttempt, courseProgress, InsertCourseProgress, topicProgress, InsertTopicProgress, courseCertificates, InsertCourseCertificate, spacedRepetitionQueue, InsertSpacedRepetitionItem, communityStats, InsertCommunityStats } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Leaderboard queries
export async function submitScore(entry: InsertLeaderboardEntry) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot submit score: database not available");
    return undefined;
  }

  const result = await db.insert(leaderboard).values(entry);
  return result;
}

export async function getTopScores(gameType: "refactoring" | "boss", limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get scores: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.gameType, gameType))
    .orderBy(desc(leaderboard.score))
    .limit(limit);

  return result;
}

export async function getUserBestScore(userId: number, gameType: "refactoring" | "boss") {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user score: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(leaderboard)
    .where(eq(leaderboard.userId, userId))
    .orderBy(desc(leaderboard.score))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}


// Badge queries
export async function awardBadge(badge: InsertBadge) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot award badge: database not available");
    return undefined;
  }

  // Check if user already has this badge
  const existing = await db
    .select()
    .from(badges)
    .where(eq(badges.userId, badge.userId))
    .limit(100);
  
  if (existing.some(b => b.badgeType === badge.badgeType)) {
    return { alreadyAwarded: true };
  }

  const result = await db.insert(badges).values(badge);
  return result;
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get badges: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(badges)
    .where(eq(badges.userId, userId))
    .orderBy(desc(badges.awardedAt));

  return result;
}

// Forum queries
export async function createForumPost(post: InsertForumPost) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create post: database not available");
    return undefined;
  }

  const result = await db.insert(forumPosts).values(post);
  return result;
}

export async function getForumPosts(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get posts: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(forumPosts)
    .orderBy(desc(forumPosts.createdAt))
    .limit(limit);

  return result;
}

export async function getForumPostById(postId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get post: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(forumPosts)
    .where(eq(forumPosts.id, postId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createForumReply(reply: InsertForumReply) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create reply: database not available");
    return undefined;
  }

  const result = await db.insert(forumReplies).values(reply);
  return result;
}

export async function getPostReplies(postId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get replies: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(forumReplies)
    .where(eq(forumReplies.postId, postId))
    .orderBy(forumReplies.createdAt);

  return result;
}

// Streak queries
export async function recordActivity(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record activity: database not available");
    return undefined;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get current streak data
  const existing = await db
    .select()
    .from(userStreaks)
    .where(eq(userStreaks.userId, userId))
    .limit(1);

  if (existing.length === 0) {
    // First activity - create new streak record
    await db.insert(userStreaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
    });
    return { currentStreak: 1, longestStreak: 1, isNewStreak: true };
  }

  const streak = existing[0];
  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
  
  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let newCurrentStreak = streak.currentStreak;
  let newLongestStreak = streak.longestStreak;

  if (lastActivity && lastActivity.getTime() === today.getTime()) {
    // Already recorded today - no change
    return { currentStreak: streak.currentStreak, longestStreak: streak.longestStreak, isNewStreak: false };
  } else if (lastActivity && lastActivity.getTime() === yesterday.getTime()) {
    // Consecutive day - increment streak
    newCurrentStreak = streak.currentStreak + 1;
    newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
  } else {
    // Streak broken - reset to 1
    newCurrentStreak = 1;
  }

  await db
    .update(userStreaks)
    .set({
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: today,
    })
    .where(eq(userStreaks.userId, userId));

  return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak, isNewStreak: newCurrentStreak > streak.currentStreak };
}

export async function getUserStreak(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get streak: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(userStreaks)
    .where(eq(userStreaks.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}


// Quiz attempt tracking
export async function recordQuizAttempt(attempt: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot record quiz attempt: database not available");
    return undefined;
  }

  const result = await db.insert(quizAttempts).values(attempt);
  return result;
}

export async function getQuizAttempts(userId: number, courseId?: string, topicId?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get quiz attempts: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt));
  
  // Filter in JS since drizzle doesn't support dynamic AND conditions easily
  return result.filter(a => {
    if (courseId && a.courseId !== courseId) return false;
    if (topicId && a.topicId !== topicId) return false;
    return true;
  });
}

// Course progress tracking
export async function upsertCourseProgress(progress: InsertCourseProgress) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert course progress: database not available");
    return undefined;
  }

  // Check if progress exists
  const existing = await db
    .select()
    .from(courseProgress)
    .where(and(
      eq(courseProgress.userId, progress.userId),
      eq(courseProgress.courseId, progress.courseId)
    ))
    .limit(1);

  if (existing.length === 0) {
    // Create new progress record
    await db.insert(courseProgress).values(progress);
    return { created: true };
  }

  // Update existing record
  await db
    .update(courseProgress)
    .set({
      topicsCompleted: progress.topicsCompleted,
      quizzesPassed: progress.quizzesPassed,
      quizzesFailed: progress.quizzesFailed,
      totalQuizAttempts: progress.totalQuizAttempts,
      eli5ExplanationsUsed: progress.eli5ExplanationsUsed,
      averageScore: progress.averageScore,
      lastAccessedAt: new Date(),
      completedAt: progress.completedAt,
    })
    .where(and(
      eq(courseProgress.userId, progress.userId),
      eq(courseProgress.courseId, progress.courseId)
    ));

  return { updated: true };
}

export async function getCourseProgress(userId: number, courseId?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get course progress: database not available");
    return [];
  }

  if (courseId) {
    const result = await db
      .select()
      .from(courseProgress)
      .where(and(
        eq(courseProgress.userId, userId),
        eq(courseProgress.courseId, courseId)
      ))
      .limit(1);
    return result;
  }

  const result = await db
    .select()
    .from(courseProgress)
    .where(eq(courseProgress.userId, userId))
    .orderBy(desc(courseProgress.lastAccessedAt));

  return result;
}

// Topic progress tracking
export async function upsertTopicProgress(progress: InsertTopicProgress) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert topic progress: database not available");
    return undefined;
  }

  // Check if progress exists
  const existing = await db
    .select()
    .from(topicProgress)
    .where(and(
      eq(topicProgress.userId, progress.userId),
      eq(topicProgress.courseId, progress.courseId),
      eq(topicProgress.topicId, progress.topicId)
    ))
    .limit(1);

  if (existing.length === 0) {
    // Create new progress record
    await db.insert(topicProgress).values({
      ...progress,
      startedAt: new Date(),
    });
    return { created: true };
  }

  // Update existing record
  await db
    .update(topicProgress)
    .set({
      status: progress.status,
      quizScore: progress.quizScore,
      quizAttempts: progress.quizAttempts,
      usedEli5: progress.usedEli5,
      timeSpentSeconds: progress.timeSpentSeconds,
      completedAt: progress.completedAt,
    })
    .where(and(
      eq(topicProgress.userId, progress.userId),
      eq(topicProgress.courseId, progress.courseId),
      eq(topicProgress.topicId, progress.topicId)
    ));

  return { updated: true };
}

export async function getTopicProgress(userId: number, courseId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get topic progress: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(topicProgress)
    .where(and(
      eq(topicProgress.userId, userId),
      eq(topicProgress.courseId, courseId)
    ));

  return result;
}

// Get quiz statistics for a user
export async function getQuizStats(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get quiz stats: database not available");
    return null;
  }

  const attempts = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.userId, userId));

  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect === 1).length;
  const eli5Used = attempts.filter(a => a.usedSimplifiedExplanation === 1).length;
  const uniqueTopics = new Set(attempts.map(a => `${a.courseId}:${a.topicId}`)).size;
  const uniqueQuestions = new Set(attempts.map(a => a.questionId)).size;

  return {
    totalAttempts,
    correctAttempts,
    accuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
    eli5Used,
    uniqueTopics,
    uniqueQuestions,
  };
}


// Certificate functions
export async function issueCertificate(certificate: InsertCourseCertificate) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot issue certificate: database not available");
    return undefined;
  }

  // Check if certificate already exists for this user and course
  const existing = await db
    .select()
    .from(courseCertificates)
    .where(and(
      eq(courseCertificates.userId, certificate.userId),
      eq(courseCertificates.courseId, certificate.courseId)
    ))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyIssued: true, certificate: existing[0] };
  }

  await db.insert(courseCertificates).values(certificate);
  
  // Fetch the newly created certificate
  const newCert = await db
    .select()
    .from(courseCertificates)
    .where(eq(courseCertificates.certificateNumber, certificate.certificateNumber))
    .limit(1);

  return { issued: true, certificate: newCert[0] };
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificates: database not available");
    return [];
  }

  const result = await db
    .select()
    .from(courseCertificates)
    .where(eq(courseCertificates.userId, userId))
    .orderBy(desc(courseCertificates.issuedAt));

  return result;
}

export async function getCertificateByNumber(certificateNumber: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificate: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(courseCertificates)
    .where(eq(courseCertificates.certificateNumber, certificateNumber))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Spaced repetition functions
export async function addToSpacedRepetition(item: InsertSpacedRepetitionItem) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add to spaced repetition: database not available");
    return undefined;
  }

  // Check if item already exists
  const existing = await db
    .select()
    .from(spacedRepetitionQueue)
    .where(and(
      eq(spacedRepetitionQueue.userId, item.userId),
      eq(spacedRepetitionQueue.courseId, item.courseId),
      eq(spacedRepetitionQueue.topicId, item.topicId),
      eq(spacedRepetitionQueue.questionId, item.questionId)
    ))
    .limit(1);

  if (existing.length > 0) {
    // Update existing item - increment failed attempts and reset interval
    const current = existing[0];
    const newFailedAttempts = current.failedAttempts + 1;
    const newEaseFactor = Math.max(130, current.easeFactor - 20); // Decrease ease factor on failure
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1); // Review again tomorrow

    await db
      .update(spacedRepetitionQueue)
      .set({
        failedAttempts: newFailedAttempts,
        easeFactor: newEaseFactor,
        intervalDays: 1,
        nextReviewAt: nextReview,
        lastReviewedAt: new Date(),
        status: 'due',
      })
      .where(eq(spacedRepetitionQueue.id, current.id));

    return { updated: true };
  }

  // Create new item
  await db.insert(spacedRepetitionQueue).values(item);
  return { created: true };
}

export async function getDueReviews(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get due reviews: database not available");
    return [];
  }

  const now = new Date();

  const result = await db
    .select()
    .from(spacedRepetitionQueue)
    .where(and(
      eq(spacedRepetitionQueue.userId, userId),
      lte(spacedRepetitionQueue.nextReviewAt, now),
      eq(spacedRepetitionQueue.status, 'due')
    ))
    .orderBy(spacedRepetitionQueue.nextReviewAt);

  return result;
}

export async function markReviewComplete(itemId: number, wasCorrect: boolean) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot mark review complete: database not available");
    return undefined;
  }

  const existing = await db
    .select()
    .from(spacedRepetitionQueue)
    .where(eq(spacedRepetitionQueue.id, itemId))
    .limit(1);

  if (existing.length === 0) return undefined;

  const item = existing[0];

  if (wasCorrect) {
    // SM-2 algorithm: increase interval on success
    const newEaseFactor = Math.min(300, item.easeFactor + 15);
    const newInterval = Math.round(item.intervalDays * (newEaseFactor / 100));
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + newInterval);

    // Mark as mastered if interval exceeds 30 days
    const newStatus = newInterval > 30 ? 'mastered' : 'pending';

    await db
      .update(spacedRepetitionQueue)
      .set({
        easeFactor: newEaseFactor,
        intervalDays: newInterval,
        nextReviewAt: nextReview,
        lastReviewedAt: new Date(),
        status: newStatus,
      })
      .where(eq(spacedRepetitionQueue.id, itemId));

    return { success: true, mastered: newStatus === 'mastered' };
  } else {
    // Reset on failure
    const newEaseFactor = Math.max(130, item.easeFactor - 20);
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    await db
      .update(spacedRepetitionQueue)
      .set({
        failedAttempts: item.failedAttempts + 1,
        easeFactor: newEaseFactor,
        intervalDays: 1,
        nextReviewAt: nextReview,
        lastReviewedAt: new Date(),
        status: 'due',
      })
      .where(eq(spacedRepetitionQueue.id, itemId));

    return { success: true, mastered: false };
  }
}

export async function getSpacedRepetitionStats(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get spaced repetition stats: database not available");
    return null;
  }

  const items = await db
    .select()
    .from(spacedRepetitionQueue)
    .where(eq(spacedRepetitionQueue.userId, userId));

  const now = new Date();
  const dueCount = items.filter(i => i.status === 'due' && new Date(i.nextReviewAt) <= now).length;
  const pendingCount = items.filter(i => i.status === 'pending').length;
  const masteredCount = items.filter(i => i.status === 'mastered').length;
  const totalItems = items.length;

  return {
    dueCount,
    pendingCount,
    masteredCount,
    totalItems,
  };
}

// Community statistics functions
export async function updateCommunityStats(courseId: string, topicId: string | null = null) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update community stats: database not available");
    return undefined;
  }

  // Get all attempts for this course/topic
  let attempts;
  if (topicId) {
    attempts = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.courseId, courseId),
        eq(quizAttempts.topicId, topicId)
      ));
  } else {
    attempts = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.courseId, courseId));
  }

  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect === 1).length;
  const eli5Count = attempts.filter(a => a.usedSimplifiedExplanation === 1).length;
  const uniqueUsers = new Set(attempts.map(a => a.userId)).size;
  
  // Calculate average attempts to pass per question
  const questionAttempts: Record<string, number[]> = {};
  attempts.forEach(a => {
    const key = `${a.courseId}:${a.topicId}:${a.questionId}`;
    if (!questionAttempts[key]) questionAttempts[key] = [];
    if (a.isCorrect === 1) {
      questionAttempts[key].push(a.attemptNumber);
    }
  });
  
  const avgAttemptsToPass = Object.values(questionAttempts).length > 0
    ? Math.round(Object.values(questionAttempts).flat().reduce((a, b) => a + b, 0) / Object.values(questionAttempts).flat().length)
    : 1;

  const stats = {
    courseId,
    topicId,
    totalAttempts,
    totalCorrect,
    averageAccuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
    totalUsers: uniqueUsers,
    eli5UsageRate: totalAttempts > 0 ? Math.round((eli5Count / totalAttempts) * 100) : 0,
    averageAttemptsToPass: avgAttemptsToPass,
  };

  // Upsert community stats
  const existing = await db
    .select()
    .from(communityStats)
    .where(and(
      eq(communityStats.courseId, courseId),
      topicId ? eq(communityStats.topicId, topicId) : sql`${communityStats.topicId} IS NULL`
    ))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(communityStats).values(stats);
  } else {
    await db
      .update(communityStats)
      .set(stats)
      .where(eq(communityStats.id, existing[0].id));
  }

  return stats;
}

export async function getCommunityStats(courseId?: string, topicId?: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get community stats: database not available");
    return [];
  }

  if (courseId && topicId) {
    const result = await db
      .select()
      .from(communityStats)
      .where(and(
        eq(communityStats.courseId, courseId),
        eq(communityStats.topicId, topicId)
      ))
      .limit(1);
    return result;
  }

  if (courseId) {
    const result = await db
      .select()
      .from(communityStats)
      .where(eq(communityStats.courseId, courseId));
    return result;
  }

  const result = await db
    .select()
    .from(communityStats);

  return result;
}

export async function getUserRankInCourse(userId: number, courseId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user rank: database not available");
    return null;
  }

  // Get all users' accuracy for this course
  const allAttempts = await db
    .select()
    .from(quizAttempts)
    .where(eq(quizAttempts.courseId, courseId));

  // Group by user and calculate accuracy
  const userAccuracies: Record<number, { correct: number; total: number }> = {};
  allAttempts.forEach(a => {
    if (!userAccuracies[a.userId]) {
      userAccuracies[a.userId] = { correct: 0, total: 0 };
    }
    userAccuracies[a.userId].total++;
    if (a.isCorrect === 1) {
      userAccuracies[a.userId].correct++;
    }
  });

  // Calculate accuracy percentages and sort
  const accuracies = Object.entries(userAccuracies)
    .map(([uid, stats]) => ({
      userId: parseInt(uid),
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // Find user's rank
  const userRank = accuracies.findIndex(a => a.userId === userId) + 1;
  const userStats = userAccuracies[userId];
  const userAccuracy = userStats ? (userStats.correct / userStats.total) * 100 : 0;

  // Calculate percentile
  const percentile = accuracies.length > 0
    ? Math.round(((accuracies.length - userRank + 1) / accuracies.length) * 100)
    : 0;

  return {
    rank: userRank || accuracies.length + 1,
    totalUsers: accuracies.length,
    userAccuracy: Math.round(userAccuracy),
    percentile,
  };
}
