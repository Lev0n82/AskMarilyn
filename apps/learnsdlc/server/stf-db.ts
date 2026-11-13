/**
 * Software Testing Fundamentals Course - Database Access Layer
 * All database operations for the STF course modules, quizzes, games, progress, exams, and certificates.
 */
import { eq, desc, and, asc, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  stfModules, InsertStfModule,
  stfQuizQuestions, InsertStfQuizQuestion,
  stfUserProgress, InsertStfUserProgress,
  stfQuizAttempts, InsertStfQuizAttempt,
  stfGameScores, InsertStfGameScore,
  stfExamAttempts, InsertStfExamAttempt,
  stfCertificates, InsertStfCertificate,
} from "../drizzle/schema";
import { nanoid } from "nanoid";

// ============ MODULE QUERIES ============

export async function getAllStfModules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfModules).orderBy(asc(stfModules.moduleNumber));
}

export async function getStfModulesByTrack(track: 'foundations' | 'sdlc_models' | 'methodologies' | 'techniques' | 'professional_practice') {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfModules)
    .where(eq(stfModules.track, track))
    .orderBy(asc(stfModules.moduleNumber));
}

export async function getStfModuleByNumber(moduleNumber: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(stfModules)
    .where(eq(stfModules.moduleNumber, moduleNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createStfModule(module: InsertStfModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stfModules).values(module);
}

export async function updateStfModule(moduleNumber: number, data: Partial<InsertStfModule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stfModules).set(data).where(eq(stfModules.moduleNumber, moduleNumber));
}

// ============ QUIZ QUERIES ============

export async function getStfQuizQuestions(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfQuizQuestions)
    .where(eq(stfQuizQuestions.moduleId, moduleId))
    .orderBy(asc(stfQuizQuestions.questionNumber));
}

export async function createStfQuizQuestion(question: InsertStfQuizQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stfQuizQuestions).values(question);
}

// ============ USER PROGRESS QUERIES ============

export async function getStfUserProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(stfUserProgress)
    .where(and(eq(stfUserProgress.userId, userId), eq(stfUserProgress.moduleId, moduleId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllStfUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfUserProgress).where(eq(stfUserProgress.userId, userId));
}

export async function markStfSectionComplete(
  userId: number,
  moduleId: number,
  section: 'spark' | 'gauntlet' | 'crucible' | 'imprint'
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getStfUserProgress(userId, moduleId);
  const updateData: Partial<InsertStfUserProgress> = {};

  if (section === 'spark') updateData.sparkCompleted = 1;
  if (section === 'gauntlet') updateData.gauntletCompleted = 1;
  if (section === 'crucible') updateData.crucibleCompleted = 1;
  if (section === 'imprint') updateData.imprintCompleted = 1;

  if (existing) {
    const updated = { ...existing, ...updateData };
    const allDone = updated.sparkCompleted && updated.gauntletCompleted &&
      updated.crucibleCompleted && updated.imprintCompleted;
    if (allDone) {
      updateData.moduleCompleted = 1;
      updateData.completedAt = new Date();
    }
    await db.update(stfUserProgress).set(updateData)
      .where(eq(stfUserProgress.id, existing.id));
  } else {
    await db.insert(stfUserProgress).values({
      userId,
      moduleId,
      ...updateData,
    });
  }
}

// ============ QUIZ ATTEMPT QUERIES ============

export async function createStfQuizAttempt(attempt: InsertStfQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stfQuizAttempts).values(attempt);

  const progress = await getStfUserProgress(attempt.userId, attempt.moduleId);
  const scorePercent = Math.round((attempt.score / 5) * 100);
  const passed = attempt.score >= 3;

  if (progress) {
    const updateData: Partial<InsertStfUserProgress> = {};
    if (!progress.bestQuizScore || scorePercent > progress.bestQuizScore) {
      updateData.bestQuizScore = scorePercent;
    }
    if (passed) updateData.gauntletCompleted = 1;
    if (Object.keys(updateData).length > 0) {
      await db.update(stfUserProgress).set(updateData)
        .where(eq(stfUserProgress.id, progress.id));
    }
  } else {
    await db.insert(stfUserProgress).values({
      userId: attempt.userId,
      moduleId: attempt.moduleId,
      bestQuizScore: scorePercent,
      gauntletCompleted: passed ? 1 : 0,
    });
  }

  if (passed) {
    await markStfSectionComplete(attempt.userId, attempt.moduleId, 'gauntlet');
  }
}

// ============ GAME SCORE QUERIES ============

export async function createStfGameScore(score: InsertStfGameScore) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stfGameScores).values(score);

  // Update best game score in progress
  const progress = await getStfUserProgress(score.userId, score.moduleId);
  const scorePercent = Math.round((score.score / score.maxScore) * 100);
  const passed = scorePercent >= 60;

  if (progress) {
    const updateData: Partial<InsertStfUserProgress> = {};
    if (!progress.bestGameScore || scorePercent > progress.bestGameScore) {
      updateData.bestGameScore = scorePercent;
    }
    if (passed) updateData.crucibleCompleted = 1;
    if (Object.keys(updateData).length > 0) {
      await db.update(stfUserProgress).set(updateData)
        .where(eq(stfUserProgress.id, progress.id));
    }
  } else {
    await db.insert(stfUserProgress).values({
      userId: score.userId,
      moduleId: score.moduleId,
      bestGameScore: scorePercent,
      crucibleCompleted: passed ? 1 : 0,
    });
  }

  if (passed) {
    await markStfSectionComplete(score.userId, score.moduleId, 'crucible');
  }
}

export async function getStfGameScores(userId: number, moduleId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (moduleId) {
    return db.select().from(stfGameScores)
      .where(and(eq(stfGameScores.userId, userId), eq(stfGameScores.moduleId, moduleId)))
      .orderBy(desc(stfGameScores.attemptedAt));
  }
  return db.select().from(stfGameScores)
    .where(eq(stfGameScores.userId, userId))
    .orderBy(desc(stfGameScores.attemptedAt));
}

// ============ EXAM QUERIES ============

export async function createStfExamAttempt(attempt: InsertStfExamAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(stfExamAttempts).values(attempt);
}

export async function getStfExamAttempts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfExamAttempts)
    .where(eq(stfExamAttempts.userId, userId))
    .orderBy(desc(stfExamAttempts.attemptedAt));
}

// ============ CERTIFICATE QUERIES ============

export async function getStfUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stfCertificates)
    .where(eq(stfCertificates.userId, userId))
    .orderBy(desc(stfCertificates.earnedAt));
}

export async function createStfCertificate(data: Omit<InsertStfCertificate, 'certificateCode'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const certificateCode = `STF-${nanoid(12).toUpperCase()}`;
  await db.insert(stfCertificates).values({ ...data, certificateCode });
  return certificateCode;
}

export async function checkAndAwardStfCertificates(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const progress = await getAllStfUserProgress(userId);
  const completedModules = progress.filter(p => p.moduleCompleted).map(p => p.moduleId);
  const existing = await getStfUserCertificates(userId);
  const existingTypes = existing.map(c => c.certificateType);
  const awarded: string[] = [];

  // Foundations certificate: modules 1-7 (Foundations + SDLC Models + Methodologies)
  const foundationIds = Array.from({ length: 7 }, (_, i) => i + 1);
  if (!existingTypes.includes('stf_foundations') &&
    foundationIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => foundationIds.includes(p.moduleId) && p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createStfCertificate({ userId, certificateType: 'stf_foundations', averageScore: avg });
    awarded.push('stf_foundations');
  }

  // Advanced certificate: modules 8-14 (Techniques + Professional Practice)
  const advancedIds = Array.from({ length: 7 }, (_, i) => i + 8);
  if (!existingTypes.includes('stf_advanced') &&
    advancedIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => advancedIds.includes(p.moduleId) && p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createStfCertificate({ userId, certificateType: 'stf_advanced', averageScore: avg });
    awarded.push('stf_advanced');
  }

  // Diploma: all 15 modules
  const allIds = Array.from({ length: 15 }, (_, i) => i + 1);
  if (!existingTypes.includes('stf_diploma') &&
    allIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createStfCertificate({ userId, certificateType: 'stf_diploma', averageScore: avg });
    awarded.push('stf_diploma');
  }

  return awarded;
}

export async function verifyStfCertificate(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(stfCertificates)
    .where(eq(stfCertificates.certificateCode, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ DASHBOARD QUERIES ============

export async function getStfDashboard(userId: number) {
  const progress = await getAllStfUserProgress(userId);
  const certificates = await getStfUserCertificates(userId);
  const gameScores = await getStfGameScores(userId);
  const examAttempts = await getStfExamAttempts(userId);
  const completedModules = progress.filter(p => p.moduleCompleted).length;

  const trackProgress = {
    foundations: progress.filter(p => p.moduleCompleted && p.moduleId >= 1 && p.moduleId <= 2).length,
    sdlcModels: progress.filter(p => p.moduleCompleted && p.moduleId >= 3 && p.moduleId <= 5).length,
    methodologies: progress.filter(p => p.moduleCompleted && p.moduleId >= 6 && p.moduleId <= 7).length,
    techniques: progress.filter(p => p.moduleCompleted && p.moduleId >= 8 && p.moduleId <= 10).length,
    professionalPractice: progress.filter(p => p.moduleCompleted && p.moduleId >= 11 && p.moduleId <= 15).length,
  };

  const avgQuizScore = progress.filter(p => p.bestQuizScore).length > 0
    ? Math.round(progress.filter(p => p.bestQuizScore).reduce((sum, p) => sum + (p.bestQuizScore || 0), 0) / progress.filter(p => p.bestQuizScore).length)
    : 0;

  const avgGameScore = progress.filter(p => p.bestGameScore).length > 0
    ? Math.round(progress.filter(p => p.bestGameScore).reduce((sum, p) => sum + (p.bestGameScore || 0), 0) / progress.filter(p => p.bestGameScore).length)
    : 0;

  const bestExamScore = examAttempts.length > 0
    ? Math.max(...examAttempts.map(e => e.score))
    : null;

  return {
    totalModules: 15,
    completedModules,
    trackProgress,
    averageQuizScore: avgQuizScore,
    averageGameScore: avgGameScore,
    bestExamScore,
    examPassed: examAttempts.some(e => e.passed === 1),
    certificates,
    progress,
    totalGameAttempts: gameScores.length,
    totalExamAttempts: examAttempts.length,
  };
}
