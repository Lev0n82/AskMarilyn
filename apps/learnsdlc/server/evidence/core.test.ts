import { describe, expect, it } from "vitest";
import * as core from "./core";
const q = {
  id: "Q1",
  prompt: "Which denominator?",
  options: [
    { id: "A", text: "Recorded outcomes", rationale: "Preserves scope" },
    { id: "B", text: "All products", rationale: "Changes scope" },
    { id: "C", text: "All customers", rationale: "No observations" },
    { id: "D", text: "None", rationale: "Missing boundary" },
  ],
  correct_option: "A",
  explanation: "Use the declared inventory.",
};
describe("Evidence Desk core contracts", () => {
  it("strips answer keys and option rationales before attempt delivery", () => {
    expect(core.publicQuestion(q)).toEqual({
      id: "Q1",
      prompt: "Which denominator?",
      options: [
        { id: "A", text: "Recorded outcomes" },
        { id: "B", text: "All products" },
        { id: "C", text: "All customers" },
        { id: "D", text: "None" },
      ],
    });
  });
  it("grades stable option IDs, not display positions", () => {
    expect(core.grade([q], { Q1: "A" })).toMatchObject({
      score: 1,
      total: 1,
      passed: true,
    });
    expect(core.grade([q], { Q1: "B" })).toMatchObject({
      score: 0,
      passed: false,
    });
  });
  it("rejects an unanswered or alien question instead of silently grading", () => {
    expect(() => core.grade([q], {})).toThrow();
    expect(() => core.grade([q], { Q1: "A", alien: "A" })).toThrow();
  });
  it("rejects invalid option IDs", () => {
    expect(() => core.grade([q], { Q1: "E" })).toThrow();
  });
  it("requires 29 of 36 at the eighty percent boundary", () => {
    const qs = Array.from({ length: 36 }, (_, i) => ({ ...q, id: `Q${i}` }));
    const answers = Object.fromEntries(
      qs.map((x, i) => [x.id, i < 28 ? "A" : "B"])
    );
    expect(core.grade(qs, answers).passed).toBe(false);
    answers.Q28 = "A";
    expect(core.grade(qs, answers).passed).toBe(true);
  });
  it("rejects malformed private question options and missing keys", () => {
    expect(() =>
      core.validateQuestion({ ...q, correct_option: "E" })
    ).toThrow();
    expect(() =>
      core.validateQuestion({
        ...q,
        options: [q.options[0], q.options[0], q.options[2], q.options[3]],
      })
    ).toThrow();
  });
  it("does not let a rubric average compensate for an incompetent area", () => {
    expect(core.rubric([3, 3, 3, 3, 1])).toEqual({
      score: 90,
      competent: false,
    });
    expect(core.rubric([2, 2, 2, 2, 2])).toEqual({
      score: 80,
      competent: true,
    });
  });
  it("rejects source URLs containing embedded credentials or access tokens", () => {
    expect(() =>
      core.evidenceUrl("https://user:password@example.org/file")
    ).toThrow();
    expect(() =>
      core.evidenceUrl("https://example.org/file?access_token=secret")
    ).toThrow();
    expect(core.evidenceUrl("https://example.org/private-report")).toBe(
      "https://example.org/private-report"
    );
  });
  it("uses verified topic counts for midpoint and keeps games out of eligibility", () => {
    expect(core.halfway(12, 5)).toBe(false);
    expect(core.halfway(12, 6)).toBe(true);
    expect(core.halfway(3, 1)).toBe(false);
    expect(core.halfway(3, 2)).toBe(true);
  });
  it("makes an authentic-source gate absolute", () => {
    expect(
      core.gatesPass({
        truthful: true,
        authorized: true,
        reconciled: true,
        accessible: true,
        authentic: false,
      })
    ).toBe(false);
  });
});
