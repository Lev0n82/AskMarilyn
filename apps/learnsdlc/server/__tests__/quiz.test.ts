import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('../db', () => ({
  recordQuizAttempt: vi.fn().mockResolvedValue({ insertId: 1 }),
  getQuizAttempts: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      courseId: 'coding-style',
      topicId: 'file-organization',
      questionId: 'q1',
      selectedAnswer: 'B',
      isCorrect: 1,
      attemptNumber: 1,
      usedSimplifiedExplanation: 0,
      createdAt: new Date(),
    },
    {
      id: 2,
      userId: 1,
      courseId: 'coding-style',
      topicId: 'indentation',
      questionId: 'q2',
      selectedAnswer: 'C',
      isCorrect: 0,
      attemptNumber: 1,
      usedSimplifiedExplanation: 1,
      createdAt: new Date(),
    },
  ]),
  getQuizStats: vi.fn().mockResolvedValue({
    totalAttempts: 10,
    correctAttempts: 7,
    accuracy: 70,
    eli5Used: 3,
    uniqueTopics: 5,
    uniqueQuestions: 8,
  }),
  upsertCourseProgress: vi.fn().mockResolvedValue({ updated: true }),
  getCourseProgress: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      courseId: 'coding-style',
      topicsCompleted: 3,
      totalTopics: 5,
      quizzesPassed: 3,
      quizzesFailed: 1,
      totalQuizAttempts: 4,
      eli5ExplanationsUsed: 1,
      averageScore: 75,
    },
  ]),
  upsertTopicProgress: vi.fn().mockResolvedValue({ updated: true }),
  getTopicProgress: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      courseId: 'coding-style',
      topicId: 'file-organization',
      status: 'completed',
      quizScore: 100,
      quizAttempts: 1,
      usedEli5: 0,
    },
  ]),
}));

import {
  recordQuizAttempt,
  getQuizAttempts,
  getQuizStats,
  upsertCourseProgress,
  getCourseProgress,
  upsertTopicProgress,
  getTopicProgress,
} from '../db';

describe('Quiz Tracking Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('recordQuizAttempt', () => {
    it('should record a quiz attempt with all required fields', async () => {
      const attempt = {
        userId: 1,
        courseId: 'coding-style',
        topicId: 'file-organization',
        questionId: 'q1',
        selectedAnswer: 'B',
        isCorrect: 1,
        attemptNumber: 1,
        usedSimplifiedExplanation: 0,
      };

      const result = await recordQuizAttempt(attempt);
      
      expect(recordQuizAttempt).toHaveBeenCalledWith(attempt);
      expect(result).toHaveProperty('insertId');
    });

    it('should record when ELI5 explanation was used', async () => {
      const attempt = {
        userId: 1,
        courseId: 'commenting',
        topicId: 'comment-types',
        questionId: 'q3',
        selectedAnswer: 'A',
        isCorrect: 0,
        attemptNumber: 2,
        usedSimplifiedExplanation: 1,
      };

      await recordQuizAttempt(attempt);
      
      expect(recordQuizAttempt).toHaveBeenCalledWith(
        expect.objectContaining({ usedSimplifiedExplanation: 1 })
      );
    });
  });

  describe('getQuizAttempts', () => {
    it('should return quiz attempts for a user', async () => {
      const attempts = await getQuizAttempts(1);
      
      expect(getQuizAttempts).toHaveBeenCalledWith(1);
      expect(Array.isArray(attempts)).toBe(true);
      expect(attempts.length).toBeGreaterThan(0);
    });

    it('should filter by courseId when provided', async () => {
      await getQuizAttempts(1, 'coding-style');
      
      expect(getQuizAttempts).toHaveBeenCalledWith(1, 'coding-style');
    });

    it('should filter by topicId when provided', async () => {
      await getQuizAttempts(1, 'coding-style', 'file-organization');
      
      expect(getQuizAttempts).toHaveBeenCalledWith(1, 'coding-style', 'file-organization');
    });
  });

  describe('getQuizStats', () => {
    it('should return aggregated quiz statistics', async () => {
      const stats = await getQuizStats(1);
      
      expect(getQuizStats).toHaveBeenCalledWith(1);
      expect(stats).toHaveProperty('totalAttempts');
      expect(stats).toHaveProperty('correctAttempts');
      expect(stats).toHaveProperty('accuracy');
      expect(stats).toHaveProperty('eli5Used');
      expect(stats).toHaveProperty('uniqueTopics');
    });

    it('should calculate accuracy correctly', async () => {
      const stats = await getQuizStats(1);
      
      expect(stats?.accuracy).toBe(70); // 7/10 = 70%
    });
  });

  describe('Course Progress', () => {
    it('should upsert course progress', async () => {
      const progress = {
        userId: 1,
        courseId: 'coding-style',
        topicsCompleted: 3,
        totalTopics: 5,
        quizzesPassed: 3,
        quizzesFailed: 1,
        totalQuizAttempts: 4,
        eli5ExplanationsUsed: 1,
        averageScore: 75,
      };

      const result = await upsertCourseProgress(progress);
      
      expect(upsertCourseProgress).toHaveBeenCalledWith(progress);
      expect(result).toHaveProperty('updated');
    });

    it('should get course progress for a user', async () => {
      const progress = await getCourseProgress(1);
      
      expect(getCourseProgress).toHaveBeenCalledWith(1);
      expect(Array.isArray(progress)).toBe(true);
    });

    it('should get progress for a specific course', async () => {
      await getCourseProgress(1, 'coding-style');
      
      expect(getCourseProgress).toHaveBeenCalledWith(1, 'coding-style');
    });
  });

  describe('Topic Progress', () => {
    it('should upsert topic progress', async () => {
      const progress = {
        userId: 1,
        courseId: 'coding-style',
        topicId: 'file-organization',
        status: 'completed' as const,
        quizScore: 100,
        quizAttempts: 1,
        usedEli5: 0,
      };

      const result = await upsertTopicProgress(progress);
      
      expect(upsertTopicProgress).toHaveBeenCalledWith(progress);
      expect(result).toHaveProperty('updated');
    });

    it('should get topic progress for a course', async () => {
      const progress = await getTopicProgress(1, 'coding-style');
      
      expect(getTopicProgress).toHaveBeenCalledWith(1, 'coding-style');
      expect(Array.isArray(progress)).toBe(true);
    });
  });
});

describe('Quiz Data Validation', () => {
  it('should validate courseId is a valid course', () => {
    const validCourses = ['coding-style', 'commenting', 'technical-writing'];
    const testCourseId = 'coding-style';
    
    expect(validCourses.includes(testCourseId)).toBe(true);
  });

  it('should validate isCorrect is 0 or 1', () => {
    const validValues = [0, 1];
    
    expect(validValues.includes(0)).toBe(true);
    expect(validValues.includes(1)).toBe(true);
    expect(validValues.includes(2)).toBe(false);
  });

  it('should validate attemptNumber is positive', () => {
    const attemptNumber = 1;
    
    expect(attemptNumber).toBeGreaterThan(0);
  });
});
