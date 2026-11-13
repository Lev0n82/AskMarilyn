import { describe, it, expect } from "vitest";
import courses from "../../course-content/evidence-desk/courses.json";
import resources from "../../course-content/evidence-desk/resources.json";
import { validateRelease } from "./import";
// Synthetic answer keys are test fixtures only. Production imports use the approved owner bank.
function fixture() {
  const q = (id: string) => ({
    id,
    prompt: "Isolated test fixture",
    options: ["A", "B", "C", "D"].map(id => ({
      id,
      text: id,
      rationale: "Test rationale",
    })),
    correct_option: "A",
    explanation: "Test explanation",
  });
  const questions: any = {};
  for (const c of courses) {
    for (const t of c.topics)
      questions[`topic:${c.course_id}:${t.topic_id}`] = t.quiz.questions.map(
        x => q(x.id)
      );
    questions[`checkpoint:${c.course_id}`] = [1, 2, 3].map(i =>
      q(`${c.course_id}-CP-${i}`)
    );
    questions[`final:${c.course_id}`] = [1, 2, 3, 4, 5].map(i =>
      q(`${c.course_id}-F-${i}`)
    );
  }
  questions.program = Array.from({ length: 36 }, (_, i) => q(`PF-${i}`));
  return {
    version: "3.0",
    hash: "test",
    courses,
    questions,
    feedback: [],
    ...resources,
  };
}
describe("Approved content import", () => {
  it("accepts all fourteen courses and forty-three independently named topics", () => {
    const r = validateRelease(fixture());
    expect(r.courses).toHaveLength(14);
    expect(r.courses.flatMap(c => c.topics)).toHaveLength(43);
  });
  it("rejects a public topic payload containing a private answer key", () => {
    const r = structuredClone(fixture());
    (r.courses[0].topics[0].quiz.questions[0] as any).correct_option = "A";
    expect(() => validateRelease(r)).toThrow(/private/i);
  });
  it("rejects duplicate private question IDs across assessments", () => {
    const r = fixture();
    r.questions.program[0].id = r.questions["checkpoint:C01"][0].id;
    expect(() => validateRelease(r)).toThrow(/duplicate/i);
  });
  it("rejects a missing course final rather than substituting a checkpoint", () => {
    const r = fixture();
    delete r.questions["final:C07"];
    expect(() => validateRelease(r)).toThrow();
  });
  it("retains both three-round games on every topic and all eighteen matrices", () => {
    const r = validateRelease(fixture());
    expect(
      r.courses.flatMap(c => c.topics.flatMap((t: any) => t.games))
    ).toHaveLength(86);
    expect(r.matrices).toHaveLength(18);
  });
});
