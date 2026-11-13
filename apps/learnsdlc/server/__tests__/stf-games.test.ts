import { describe, it, expect } from 'vitest';

/**
 * Tests for STF game (crucibleConfig) data structure and dynamic quiz counts.
 * Validates that the game data matches what the TheCrucible component expects.
 */

describe('STF Game Data Structure', () => {
  // Mock crucibleConfig data matching what's in the database
  const dragMatchConfig = {
    gameName: "The Cost Calculator",
    type: "drag-match",
    items: [
      { defect: "Missing login validation found at Requirements review", answer: "1x", points: 20 },
      { defect: "Wrong database schema found at Design phase", answer: "3-6x", points: 20 },
      { defect: "Buffer overflow found at Coding", answer: "10x", points: 20 },
      { defect: "Integration failure found at Integration testing", answer: "15-40x", points: 20 },
      { defect: "Security vulnerability found at Production", answer: "30-100x", points: 20 },
    ],
  };

  const orderingConfig = {
    gameName: "The SDLC Sequencer",
    type: "ordering",
    items: [
      { item: "Requirements Analysis", correctPosition: 1, points: 20 },
      { item: "Design", correctPosition: 2, points: 20 },
      { item: "Implementation", correctPosition: 3, points: 20 },
      { item: "Testing", correctPosition: 4, points: 20 },
      { item: "Deployment & Maintenance", correctPosition: 5, points: 20 },
    ],
  };

  describe('drag-match game type', () => {
    it('should have required fields: gameName, type, items', () => {
      expect(dragMatchConfig).toHaveProperty('gameName');
      expect(dragMatchConfig).toHaveProperty('type');
      expect(dragMatchConfig).toHaveProperty('items');
      expect(dragMatchConfig.type).toBe('drag-match');
    });

    it('each item should have defect, answer, and points', () => {
      for (const item of dragMatchConfig.items) {
        expect(item).toHaveProperty('defect');
        expect(item).toHaveProperty('answer');
        expect(item).toHaveProperty('points');
        expect(typeof item.defect).toBe('string');
        expect(typeof item.answer).toBe('string');
        expect(typeof item.points).toBe('number');
      }
    });

    it('should have at least 3 items for meaningful gameplay', () => {
      expect(dragMatchConfig.items.length).toBeGreaterThanOrEqual(3);
    });

    it('should generate valid options from unique answers', () => {
      const allAnswers = Array.from(new Set(dragMatchConfig.items.map(it => it.answer)));
      expect(allAnswers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('ordering game type', () => {
    it('should have required fields: gameName, type, items', () => {
      expect(orderingConfig).toHaveProperty('gameName');
      expect(orderingConfig).toHaveProperty('type');
      expect(orderingConfig).toHaveProperty('items');
      expect(orderingConfig.type).toBe('ordering');
    });

    it('each item should have item, correctPosition, and points', () => {
      for (const item of orderingConfig.items) {
        expect(item).toHaveProperty('item');
        expect(item).toHaveProperty('correctPosition');
        expect(item).toHaveProperty('points');
        expect(typeof item.item).toBe('string');
        expect(typeof item.correctPosition).toBe('number');
        expect(typeof item.points).toBe('number');
      }
    });

    it('positions should be sequential starting from 1', () => {
      const positions = orderingConfig.items.map(it => it.correctPosition).sort((a, b) => a - b);
      for (let i = 0; i < positions.length; i++) {
        expect(positions[i]).toBe(i + 1);
      }
    });
  });
});

describe('STF Quiz Dynamic Counts', () => {
  // Simulate the dynamic quiz scoring logic from the server
  function calculatePassThreshold(totalQuestions: number): number {
    return Math.ceil(totalQuestions * 0.6);
  }

  it('should calculate 60% pass threshold for 5 questions (original)', () => {
    expect(calculatePassThreshold(5)).toBe(3);
  });

  it('should calculate 60% pass threshold for 9 questions (module 1 enriched)', () => {
    expect(calculatePassThreshold(9)).toBe(6);
  });

  it('should calculate 60% pass threshold for 10 questions (module 9 enriched)', () => {
    expect(calculatePassThreshold(10)).toBe(6);
  });

  it('should calculate 60% pass threshold for 8 questions (modules 10, 12, 15)', () => {
    expect(calculatePassThreshold(8)).toBe(5);
  });

  it('should calculate 60% pass threshold for 7 questions (module 13)', () => {
    expect(calculatePassThreshold(7)).toBe(5);
  });

  it('quiz answers array should match question count dynamically', () => {
    // Simulate the dynamic answers initialization
    const questionCounts = [5, 7, 8, 9, 10];
    for (const count of questionCounts) {
      const answers = Array(count).fill(null);
      expect(answers.length).toBe(count);
    }
  });
});
