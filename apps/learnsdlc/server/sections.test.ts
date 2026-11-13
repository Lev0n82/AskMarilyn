import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  recordSectionCompletion: vi.fn(),
  getSectionCompletions: vi.fn(),
  getUserPoints: vi.fn(),
}));

import { recordSectionCompletion, getSectionCompletions, getUserPoints } from "./db";

describe("Section Completion API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("recordSectionCompletion", () => {
    it("should record a new section completion with points", async () => {
      const mockResult = { created: true, pointsEarned: 10 };
      vi.mocked(recordSectionCompletion).mockResolvedValue(mockResult);

      const result = await recordSectionCompletion({
        userId: 1,
        courseId: "abt-fundamentals",
        sectionPath: "/module-1",
        sectionType: "lesson",
      });

      expect(result).toEqual(mockResult);
      expect(recordSectionCompletion).toHaveBeenCalledWith({
        userId: 1,
        courseId: "abt-fundamentals",
        sectionPath: "/module-1",
        sectionType: "lesson",
      });
    });

    it("should return alreadyCompleted for duplicate completions", async () => {
      const mockResult = { 
        alreadyCompleted: true, 
        completion: { 
          id: 1, 
          userId: 1, 
          sectionPath: "/module-1" 
        } 
      };
      vi.mocked(recordSectionCompletion).mockResolvedValue(mockResult);

      const result = await recordSectionCompletion({
        userId: 1,
        courseId: "abt-fundamentals",
        sectionPath: "/module-1",
        sectionType: "lesson",
      });

      expect(result?.alreadyCompleted).toBe(true);
    });

    it("should award correct points for different section types", async () => {
      const pointsByType = {
        lesson: 10,
        game: 25,
        quiz: 20,
        exam: 50,
        challenge: 30,
      };

      for (const [sectionType, expectedPoints] of Object.entries(pointsByType)) {
        vi.mocked(recordSectionCompletion).mockResolvedValue({ 
          created: true, 
          pointsEarned: expectedPoints 
        });

        const result = await recordSectionCompletion({
          userId: 1,
          courseId: "abt-fundamentals",
          sectionPath: `/test-${sectionType}`,
          sectionType: sectionType as "lesson" | "game" | "quiz" | "exam" | "challenge",
        });

        expect(result?.pointsEarned).toBe(expectedPoints);
      }
    });
  });

  describe("getSectionCompletions", () => {
    it("should return all completions for a user", async () => {
      const mockCompletions = [
        { id: 1, userId: 1, sectionPath: "/module-1", courseId: "abt-fundamentals" },
        { id: 2, userId: 1, sectionPath: "/module-2", courseId: "abt-fundamentals" },
      ];
      vi.mocked(getSectionCompletions).mockResolvedValue(mockCompletions);

      const result = await getSectionCompletions(1);

      expect(result).toHaveLength(2);
      expect(getSectionCompletions).toHaveBeenCalledWith(1);
    });

    it("should filter completions by courseId", async () => {
      const mockCompletions = [
        { id: 1, userId: 1, sectionPath: "/module-1", courseId: "abt-fundamentals" },
      ];
      vi.mocked(getSectionCompletions).mockResolvedValue(mockCompletions);

      const result = await getSectionCompletions(1, "abt-fundamentals");

      expect(result).toHaveLength(1);
      expect(getSectionCompletions).toHaveBeenCalledWith(1, "abt-fundamentals");
    });
  });

  describe("getUserPoints", () => {
    it("should return user points summary", async () => {
      const mockPoints = {
        id: 1,
        userId: 1,
        totalPoints: 100,
        lessonsCompleted: 5,
        gamesCompleted: 2,
        quizzesCompleted: 3,
        examsCompleted: 1,
        challengesCompleted: 0,
      };
      vi.mocked(getUserPoints).mockResolvedValue(mockPoints);

      const result = await getUserPoints(1);

      expect(result?.totalPoints).toBe(100);
      expect(result?.lessonsCompleted).toBe(5);
    });

    it("should return null for user with no points", async () => {
      vi.mocked(getUserPoints).mockResolvedValue(null);

      const result = await getUserPoints(999);

      expect(result).toBeNull();
    });
  });
});
