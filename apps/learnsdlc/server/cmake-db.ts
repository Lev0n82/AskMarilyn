/**
 * CMake Mastery Course - Database Access Layer
 * All database operations for the CMake course modules, quizzes, progress, and certificates.
 */
import { eq, desc, and, asc } from "drizzle-orm";
import { getDb } from "./db";
import {
  cmakeModules, InsertCmakeModule,
  cmakeQuizQuestions, InsertCmakeQuizQuestion,
  cmakeUserProgress, InsertCmakeUserProgress,
  cmakeQuizAttempts, InsertCmakeQuizAttempt,
  cmakeCrucibleSubmissions, InsertCmakeCrucibleSubmission,
  cmakeCertificates, InsertCmakeCertificate,
} from "../drizzle/schema";
import { nanoid } from "nanoid";

// ============ MODULE QUERIES ============

export async function getAllCmakeModules() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmakeModules).orderBy(asc(cmakeModules.moduleNumber));
}

export async function getCmakeModulesByTrack(track: 'foundations' | 'build_system' | 'advanced' | 'tools') {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmakeModules)
    .where(eq(cmakeModules.track, track))
    .orderBy(asc(cmakeModules.moduleNumber));
}

export async function getCmakeModuleByNumber(moduleNumber: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cmakeModules)
    .where(eq(cmakeModules.moduleNumber, moduleNumber)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCmakeModule(module: InsertCmakeModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cmakeModules).values(module);
}

export async function updateCmakeModule(moduleNumber: number, data: Partial<InsertCmakeModule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cmakeModules).set(data).where(eq(cmakeModules.moduleNumber, moduleNumber));
}

// ============ QUIZ QUERIES ============

export async function getCmakeQuizQuestions(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmakeQuizQuestions)
    .where(eq(cmakeQuizQuestions.moduleId, moduleId))
    .orderBy(asc(cmakeQuizQuestions.questionNumber));
}

export async function createCmakeQuizQuestion(question: InsertCmakeQuizQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cmakeQuizQuestions).values(question);
}

// ============ USER PROGRESS QUERIES ============

export async function getCmakeUserProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cmakeUserProgress)
    .where(and(eq(cmakeUserProgress.userId, userId), eq(cmakeUserProgress.moduleId, moduleId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllCmakeUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmakeUserProgress).where(eq(cmakeUserProgress.userId, userId));
}

export async function markCmakeSectionComplete(
  userId: number,
  moduleId: number,
  section: 'spark' | 'gauntlet' | 'crucible' | 'imprint'
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getCmakeUserProgress(userId, moduleId);
  const updateData: Partial<InsertCmakeUserProgress> = {};

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
    await db.update(cmakeUserProgress).set(updateData)
      .where(eq(cmakeUserProgress.id, existing.id));
  } else {
    await db.insert(cmakeUserProgress).values({
      userId,
      moduleId,
      ...updateData,
    });
  }
}

export async function createCmakeQuizAttempt(attempt: InsertCmakeQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cmakeQuizAttempts).values(attempt);

  const progress = await getCmakeUserProgress(attempt.userId, attempt.moduleId);
  const scorePercent = Math.round((attempt.score / 5) * 100);
  const passed = attempt.score >= 3;

  if (progress) {
    const updateData: Partial<InsertCmakeUserProgress> = {};
    if (!progress.bestQuizScore || scorePercent > progress.bestQuizScore) {
      updateData.bestQuizScore = scorePercent;
    }
    if (passed) updateData.gauntletCompleted = 1;
    if (Object.keys(updateData).length > 0) {
      await db.update(cmakeUserProgress).set(updateData)
        .where(eq(cmakeUserProgress.id, progress.id));
    }
  } else {
    await db.insert(cmakeUserProgress).values({
      userId: attempt.userId,
      moduleId: attempt.moduleId,
      bestQuizScore: scorePercent,
      gauntletCompleted: passed ? 1 : 0,
    });
  }

  if (passed) {
    await markCmakeSectionComplete(attempt.userId, attempt.moduleId, 'gauntlet');
  }
}

export async function createCmakeCrucibleSubmission(submission: InsertCmakeCrucibleSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(cmakeCrucibleSubmissions).values(submission);
  await markCmakeSectionComplete(submission.userId, submission.moduleId, 'crucible');
}

// ============ CERTIFICATE QUERIES ============

export async function getCmakeUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmakeCertificates)
    .where(eq(cmakeCertificates.userId, userId))
    .orderBy(desc(cmakeCertificates.earnedAt));
}

export async function createCmakeCertificate(data: Omit<InsertCmakeCertificate, 'certificateCode'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const certificateCode = `CMAKE-${nanoid(12).toUpperCase()}`;
  await db.insert(cmakeCertificates).values({ ...data, certificateCode });
  return certificateCode;
}

export async function checkAndAwardCmakeCertificates(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const progress = await getAllCmakeUserProgress(userId);
  const completedModules = progress.filter(p => p.moduleCompleted).map(p => p.moduleId);
  const existing = await getCmakeUserCertificates(userId);
  const existingTypes = existing.map(c => c.certificateType);
  const awarded: string[] = [];

  // Foundations certificate: modules 1-10
  const foundationIds = Array.from({ length: 10 }, (_, i) => i + 1);
  if (!existingTypes.includes('cmake_foundations') &&
    foundationIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => foundationIds.includes(p.moduleId) && p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createCmakeCertificate({ userId, certificateType: 'cmake_foundations', averageScore: avg });
    awarded.push('cmake_foundations');
  }

  // Advanced certificate: modules 11-20
  const advancedIds = Array.from({ length: 10 }, (_, i) => i + 11);
  if (!existingTypes.includes('cmake_advanced') &&
    advancedIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => advancedIds.includes(p.moduleId) && p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createCmakeCertificate({ userId, certificateType: 'cmake_advanced', averageScore: avg });
    awarded.push('cmake_advanced');
  }

  // Mastery diploma: all 20 modules
  const allIds = Array.from({ length: 20 }, (_, i) => i + 1);
  if (!existingTypes.includes('cmake_mastery_diploma') &&
    allIds.every(id => completedModules.includes(id))) {
    const scores = progress.filter(p => p.bestQuizScore);
    const avg = scores.length > 0
      ? Math.round(scores.reduce((s, p) => s + (p.bestQuizScore || 0), 0) / scores.length)
      : 0;
    await createCmakeCertificate({ userId, certificateType: 'cmake_mastery_diploma', averageScore: avg });
    awarded.push('cmake_mastery_diploma');
  }

  return awarded;
}

export async function verifyCmakeCertificate(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(cmakeCertificates)
    .where(eq(cmakeCertificates.certificateCode, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getCmakeDashboard(userId: number) {
  const progress = await getAllCmakeUserProgress(userId);
  const certificates = await getCmakeUserCertificates(userId);
  const completedModules = progress.filter(p => p.moduleCompleted).length;
  const foundationsComplete = progress.filter(p => p.moduleCompleted && p.moduleId >= 1 && p.moduleId <= 10).length;
  const advancedComplete = progress.filter(p => p.moduleCompleted && p.moduleId >= 11 && p.moduleId <= 20).length;
  const avgScore = progress.length > 0
    ? progress.reduce((sum, p) => sum + (p.bestQuizScore || 0), 0) / progress.length
    : 0;
  return {
    totalModules: 20,
    completedModules,
    foundationsProgress: foundationsComplete,
    advancedProgress: advancedComplete,
    averageScore: Math.round(avgScore),
    certificates,
    progress,
  };
}
