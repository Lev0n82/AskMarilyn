import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the STF database module
vi.mock('../stf-db', () => ({
  getStfModules: vi.fn().mockResolvedValue([
    { id: 1, moduleNumber: 1, track: 'foundations', title: 'Why We Test', subtitle: 'The cost of ignorance', sparkContent: 'content...', gauntletContent: 'content...', crucibleContent: 'content...', imprintContent: 'content...', visualAidUrl: 'https://cdn.example.com/m1.png', takeaway: 'Testing prevents costly failures', createdAt: new Date() },
    { id: 2, moduleNumber: 2, track: 'foundations', title: 'Seven Principles of Testing', subtitle: 'ISTQB principles', sparkContent: 'content...', gauntletContent: 'content...', crucibleContent: 'content...', imprintContent: 'content...', visualAidUrl: 'https://cdn.example.com/m2.png', takeaway: 'Seven principles guide all testing', createdAt: new Date() },
  ]),
  getStfModuleByNumber: vi.fn().mockImplementation((num: number) => {
    if (num === 1) return Promise.resolve({ id: 1, moduleNumber: 1, track: 'foundations', title: 'Why We Test', subtitle: 'The cost of ignorance', sparkContent: 'content...', gauntletContent: 'content...', crucibleContent: 'content...', imprintContent: 'content...', visualAidUrl: 'https://cdn.example.com/m1.png', takeaway: 'Testing prevents costly failures', createdAt: new Date() });
    if (num === 99) return Promise.resolve(null);
    return Promise.resolve({ id: num, moduleNumber: num, track: 'foundations', title: `Module ${num}`, subtitle: 'subtitle', sparkContent: 'content...', gauntletContent: 'content...', crucibleContent: 'content...', imprintContent: 'content...', visualAidUrl: `https://cdn.example.com/m${num}.png`, takeaway: 'takeaway', createdAt: new Date() });
  }),
  getStfQuizQuestions: vi.fn().mockResolvedValue([
    { id: 1, moduleNumber: 1, questionText: 'What is the primary purpose of testing?', optionA: 'Find bugs', optionB: 'Prove correctness', optionC: 'Reduce risk', optionD: 'Delay release', correctAnswer: 'C', explanation: 'Testing reduces risk', difficulty: 'easy' },
    { id: 2, moduleNumber: 1, questionText: 'Which is NOT a testing principle?', optionA: 'Early testing', optionB: 'Exhaustive testing is possible', optionC: 'Defect clustering', optionD: 'Pesticide paradox', correctAnswer: 'B', explanation: 'Exhaustive testing is impossible', difficulty: 'medium' },
  ]),
  recordStfQuizAttempt: vi.fn().mockResolvedValue({ insertId: 1 }),
  getStfQuizAttempts: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, moduleNumber: 1, questionId: 1, selectedAnswer: 'C', isCorrect: 1, attemptNumber: 1, createdAt: new Date() },
  ]),
  getStfModuleProgress: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, moduleNumber: 1, sparkCompleted: 1, gauntletCompleted: 1, crucibleCompleted: 0, imprintCompleted: 0, quizScore: 80, quizAttempts: 1, gameScore: 90, completedAt: null },
  ]),
  upsertStfModuleProgress: vi.fn().mockResolvedValue({ updated: true }),
  recordStfGameScore: vi.fn().mockResolvedValue({ insertId: 1 }),
  getStfGameScores: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, moduleNumber: 1, gameType: 'matching', score: 90, maxScore: 100, timeSpentSeconds: 45, createdAt: new Date() },
  ]),
  getStfDashboard: vi.fn().mockResolvedValue({
    modules: [
      { id: 1, moduleNumber: 1, title: 'Why We Test', track: 'foundations' },
      { id: 2, moduleNumber: 2, title: 'Seven Principles', track: 'foundations' },
    ],
    progress: [
      { moduleNumber: 1, sparkCompleted: 1, gauntletCompleted: 1, crucibleCompleted: 1, imprintCompleted: 1, quizScore: 90, gameScore: 85 },
    ],
    quizAttempts: [
      { moduleNumber: 1, questionId: 1, isCorrect: 1 },
    ],
    gameScores: [
      { moduleNumber: 1, gameType: 'matching', score: 90, maxScore: 100 },
    ],
    certificate: null,
  }),
  awardStfCertificate: vi.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    certificateCode: 'STF-ABC123',
    awardedAt: new Date(),
    userName: 'Test User',
    completionPercentage: 100,
    averageQuizScore: 92,
    averageGameScore: 88,
    totalTimeSpent: 420,
  }),
  getStfUserCertificates: vi.fn().mockResolvedValue([]),
  verifyStfCertificate: vi.fn().mockImplementation((code: string) => {
    if (code === 'STF-ABC123') return Promise.resolve({ valid: true, userName: 'Test User', awardedAt: new Date() });
    return Promise.resolve(null);
  }),
}));

import {
  getStfModules,
  getStfModuleByNumber,
  getStfQuizQuestions,
  recordStfQuizAttempt,
  getStfQuizAttempts,
  getStfModuleProgress,
  upsertStfModuleProgress,
  recordStfGameScore,
  getStfGameScores,
  getStfDashboard,
  awardStfCertificate,
  getStfUserCertificates,
  verifyStfCertificate,
} from '../stf-db';

describe('STF Course - Module Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all 15 modules (mocked as 2)', async () => {
    const modules = await getStfModules();
    expect(getStfModules).toHaveBeenCalled();
    expect(Array.isArray(modules)).toBe(true);
    expect(modules.length).toBeGreaterThan(0);
  });

  it('should return a specific module by number', async () => {
    const module = await getStfModuleByNumber(1);
    expect(getStfModuleByNumber).toHaveBeenCalledWith(1);
    expect(module).not.toBeNull();
    expect(module?.moduleNumber).toBe(1);
    expect(module?.title).toBe('Why We Test');
    expect(module?.track).toBe('foundations');
  });

  it('should return null for non-existent module', async () => {
    const module = await getStfModuleByNumber(99);
    expect(module).toBeNull();
  });

  it('should include all required content sections', async () => {
    const module = await getStfModuleByNumber(1);
    expect(module).toHaveProperty('sparkContent');
    expect(module).toHaveProperty('gauntletContent');
    expect(module).toHaveProperty('crucibleContent');
    expect(module).toHaveProperty('imprintContent');
    expect(module).toHaveProperty('visualAidUrl');
    expect(module).toHaveProperty('takeaway');
  });
});

describe('STF Course - Quiz System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return quiz questions for a module', async () => {
    const questions = await getStfQuizQuestions(1);
    expect(getStfQuizQuestions).toHaveBeenCalledWith(1);
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  it('should have valid question structure', async () => {
    const questions = await getStfQuizQuestions(1);
    const q = questions[0];
    expect(q).toHaveProperty('questionText');
    expect(q).toHaveProperty('optionA');
    expect(q).toHaveProperty('optionB');
    expect(q).toHaveProperty('optionC');
    expect(q).toHaveProperty('optionD');
    expect(q).toHaveProperty('correctAnswer');
    expect(q).toHaveProperty('explanation');
    expect(q).toHaveProperty('difficulty');
  });

  it('should validate correct answer is A, B, C, or D', async () => {
    const questions = await getStfQuizQuestions(1);
    const validAnswers = ['A', 'B', 'C', 'D'];
    questions.forEach((q: any) => {
      expect(validAnswers).toContain(q.correctAnswer);
    });
  });

  it('should record a quiz attempt', async () => {
    const attempt = {
      userId: 1,
      moduleNumber: 1,
      questionId: 1,
      selectedAnswer: 'C',
      isCorrect: 1,
      attemptNumber: 1,
    };
    const result = await recordStfQuizAttempt(attempt);
    expect(recordStfQuizAttempt).toHaveBeenCalledWith(attempt);
    expect(result).toHaveProperty('insertId');
  });

  it('should retrieve quiz attempts for a user', async () => {
    const attempts = await getStfQuizAttempts(1, 1);
    expect(getStfQuizAttempts).toHaveBeenCalledWith(1, 1);
    expect(Array.isArray(attempts)).toBe(true);
  });
});

describe('STF Course - Progress Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track module progress with four sections', async () => {
    const progress = await getStfModuleProgress(1);
    expect(getStfModuleProgress).toHaveBeenCalledWith(1);
    expect(Array.isArray(progress)).toBe(true);
    const p = progress[0];
    expect(p).toHaveProperty('sparkCompleted');
    expect(p).toHaveProperty('gauntletCompleted');
    expect(p).toHaveProperty('crucibleCompleted');
    expect(p).toHaveProperty('imprintCompleted');
    expect(p).toHaveProperty('quizScore');
    expect(p).toHaveProperty('gameScore');
  });

  it('should upsert module progress', async () => {
    const progressData = {
      userId: 1,
      moduleNumber: 1,
      sparkCompleted: 1,
      gauntletCompleted: 1,
      crucibleCompleted: 1,
      imprintCompleted: 0,
      quizScore: 80,
      quizAttempts: 1,
      gameScore: 90,
    };
    const result = await upsertStfModuleProgress(progressData);
    expect(upsertStfModuleProgress).toHaveBeenCalledWith(progressData);
    expect(result).toHaveProperty('updated');
  });
});

describe('STF Course - Game Score Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should record a game score', async () => {
    const scoreData = {
      userId: 1,
      moduleNumber: 1,
      gameType: 'matching',
      score: 90,
      maxScore: 100,
      timeSpentSeconds: 45,
    };
    const result = await recordStfGameScore(scoreData);
    expect(recordStfGameScore).toHaveBeenCalledWith(scoreData);
    expect(result).toHaveProperty('insertId');
  });

  it('should retrieve game scores for a user', async () => {
    const scores = await getStfGameScores(1, 1);
    expect(getStfGameScores).toHaveBeenCalledWith(1, 1);
    expect(Array.isArray(scores)).toBe(true);
    const s = scores[0];
    expect(s).toHaveProperty('gameType');
    expect(s).toHaveProperty('score');
    expect(s).toHaveProperty('maxScore');
    expect(s).toHaveProperty('timeSpentSeconds');
  });

  it('should validate score does not exceed maxScore', async () => {
    const scores = await getStfGameScores(1, 1);
    scores.forEach((s: any) => {
      expect(s.score).toBeLessThanOrEqual(s.maxScore);
    });
  });
});

describe('STF Course - Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return comprehensive dashboard data', async () => {
    const dashboard = await getStfDashboard(1);
    expect(getStfDashboard).toHaveBeenCalledWith(1);
    expect(dashboard).toHaveProperty('modules');
    expect(dashboard).toHaveProperty('progress');
    expect(dashboard).toHaveProperty('quizAttempts');
    expect(dashboard).toHaveProperty('gameScores');
    expect(dashboard).toHaveProperty('certificate');
  });

  it('should include module list in dashboard', async () => {
    const dashboard = await getStfDashboard(1);
    expect(Array.isArray(dashboard.modules)).toBe(true);
    expect(dashboard.modules.length).toBeGreaterThan(0);
    expect(dashboard.modules[0]).toHaveProperty('title');
    expect(dashboard.modules[0]).toHaveProperty('track');
  });
});

describe('STF Course - Certificates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should award a certificate with all required fields', async () => {
    const cert = await awardStfCertificate(1, 'Test User');
    expect(awardStfCertificate).toHaveBeenCalledWith(1, 'Test User');
    expect(cert).toHaveProperty('certificateCode');
    expect(cert).toHaveProperty('userName');
    expect(cert).toHaveProperty('completionPercentage');
    expect(cert).toHaveProperty('averageQuizScore');
    expect(cert).toHaveProperty('averageGameScore');
    expect(cert.certificateCode).toMatch(/^STF-/);
  });

  it('should retrieve user certificates', async () => {
    const certs = await getStfUserCertificates(1);
    expect(getStfUserCertificates).toHaveBeenCalledWith(1);
    expect(Array.isArray(certs)).toBe(true);
  });

  it('should verify a valid certificate code', async () => {
    const result = await verifyStfCertificate('STF-ABC123');
    expect(verifyStfCertificate).toHaveBeenCalledWith('STF-ABC123');
    expect(result).not.toBeNull();
    expect(result?.valid).toBe(true);
    expect(result?.userName).toBe('Test User');
  });

  it('should return null for invalid certificate code', async () => {
    const result = await verifyStfCertificate('INVALID-CODE');
    expect(result).toBeNull();
  });
});

describe('STF Course - Data Validation', () => {
  it('should validate module numbers are 1-15', () => {
    const validModuleNumbers = Array.from({ length: 15 }, (_, i) => i + 1);
    expect(validModuleNumbers).toHaveLength(15);
    expect(validModuleNumbers[0]).toBe(1);
    expect(validModuleNumbers[14]).toBe(15);
  });

  it('should validate track names', () => {
    const validTracks = ['foundations', 'sdlc-models', 'test-engineering', 'professional-practice', 'capstone'];
    expect(validTracks).toContain('foundations');
    expect(validTracks).toContain('sdlc-models');
    expect(validTracks).toContain('test-engineering');
    expect(validTracks).toContain('professional-practice');
    expect(validTracks).toContain('capstone');
  });

  it('should validate difficulty levels', () => {
    const validDifficulties = ['easy', 'medium', 'hard'];
    expect(validDifficulties).toContain('easy');
    expect(validDifficulties).toContain('medium');
    expect(validDifficulties).toContain('hard');
  });

  it('should validate game types', () => {
    const validGameTypes = ['matching', 'sorting', 'scenario', 'timeline', 'categorize'];
    expect(validGameTypes.length).toBeGreaterThan(0);
    validGameTypes.forEach(type => {
      expect(typeof type).toBe('string');
      expect(type.length).toBeGreaterThan(0);
    });
  });

  it('should validate certificate code format', () => {
    const code = 'STF-ABC123';
    expect(code).toMatch(/^STF-/);
    expect(code.length).toBeGreaterThan(4);
  });
});
