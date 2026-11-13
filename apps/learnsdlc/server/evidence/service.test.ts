import { describe, it, expect } from "vitest";
import { createService } from "./service";
const question = {
  id: "Q1",
  prompt: "Pick an observed value",
  options: ["A", "B", "C", "D"].map(id => ({
    id,
    text: id,
    rationale: `Reason ${id}`,
  })),
  correct_option: "A",
  explanation: "Boundary",
};
function fixture() {
  const rows = new Map<string, any>();
  const release: any = {
    version: "3.0",
    hash: "fixture",
    courses: [
      {
        course_id: "C01",
        title: "Fixture",
        introduction: {
          reader_dilemma: "D",
          reply: "R",
          outline: [],
          start_topic_id: "1.1",
        },
        outcomes: [],
        topics: [
          {
            topic_id: "1.1",
            title: "Scope",
            quiz: { id: "quiz", questions: [question], pass_count: 1 },
          },
        ],
        practical_completion: { reviewer_checks: ["Individual competence"] },
      },
    ],
    questions: { "topic:C01:1.1": [question], "final:C01": [question] },
    feedback: [],
    assets: [],
    matrices: [],
  };
  const store: any = {
    release: async () => release,
    get: async (t: string, id: string) => rows.get(t + id),
    list: async (t: string, owner?: number) =>
      Array.from(rows.entries())
        .filter(
          ([key, row]) =>
            key.startsWith(t) && (owner === undefined || row.ownerId === owner)
        )
        .map(([, v]) => v),
    put: async (t: string, row: any) => {
      rows.set(t + row.id, row);
      return row;
    },
    tx: async (_owner: number, fn: any) => fn(store),
  };
  return { service: createService(store), store };
}
const learner = { id: 11, role: "user" };
const stranger = { id: 12, role: "user" };
const admin = { id: 1, role: "admin" };
describe("Evidence Desk assessment and reviewer service", () => {
  it("delivers a stored form without keys or rationales", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    expect(a.questions[0]).toEqual({
      id: "Q1",
      prompt: "Pick an observed value",
      options: ["A", "B", "C", "D"].map(id => ({ id, text: id })),
    });
  });
  it("rejects another learner reading or saving an attempt", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    await expect(service.attempt(stranger, a.id)).rejects.toThrow();
    await expect(
      service.save(stranger, {
        attemptId: a.id,
        revision: 0,
        responses: { Q1: "A" },
      })
    ).rejects.toThrow();
  });
  it("saves and resumes a draft then submits the same stored form", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const saved = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "A" },
    });
    expect(saved.responses).toEqual({ Q1: "A" });
    const result = await service.submit(learner, {
      attemptId: a.id,
      revision: saved.revision,
    });
    expect(result).toMatchObject({
      score: 1,
      passed: true,
      status: "submitted",
    });
    expect(result.feedback[0]).toMatchObject({
      correct: true,
      correctAnswer: "A",
    });
  });
  it("rejects stale saves and prevents alteration after submission", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const s = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "B" },
    });
    await expect(
      service.save(learner, {
        attemptId: a.id,
        revision: 0,
        responses: { Q1: "A" },
      })
    ).rejects.toThrow();
    await service.submit(learner, { attemptId: a.id, revision: s.revision });
    await expect(
      service.save(learner, {
        attemptId: a.id,
        revision: s.revision,
        responses: { Q1: "A" },
      })
    ).rejects.toThrow();
  });
  it("repeated submission returns one immutable grade", async () => {
    const { service, store } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const s = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "A" },
    });
    const first = await service.submit(learner, {
      attemptId: a.id,
      revision: s.revision,
    });
    const second = await service.submit(learner, {
      attemptId: a.id,
      revision: s.revision,
    });
    expect(second.score).toBe(first.score);
    expect(await store.list("attempts", learner.id)).toHaveLength(1);
  });
  it("holds final keys until an authorized instructor releases them", async () => {
    const { service } = fixture();
    const a = await service.start(learner, { kind: "final", courseId: "C01" });
    const s = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "A" },
    });
    const result = await service.submit(learner, {
      attemptId: a.id,
      revision: s.revision,
    });
    expect(result.feedback).toBeNull();
    await expect(
      service.release(stranger, a.id, "review window")
    ).rejects.toThrow();
    await service.release(admin, a.id, "review window");
    expect(
      (await service.attempt(learner, a.id)).feedback[0].correctAnswer
    ).toBe("A");
  });
  it("blocks a final repeat until instructor remediation authorization", async () => {
    const { service } = fixture();
    const a = await service.start(learner, { kind: "final", courseId: "C01" });
    const s = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "B" },
    });
    await service.submit(learner, { attemptId: a.id, revision: s.revision });
    await expect(
      service.start(learner, { kind: "final", courseId: "C01" })
    ).rejects.toThrow();
    await service.allowRetake(admin, a.id, "Repaired denominator");
    expect(
      (await service.start(learner, { kind: "final", courseId: "C01" }))
        .retakeMode
    ).toBe("learning_repeat");
  });
  it("rejects self-assigned peer review and learner instructor judgments", async () => {
    const { service } = fixture();
    const sub = await service.evidence(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
      url: "https://example.org/private",
      connectionMode: "authentic_export",
      notes: "Frozen authorized evidence",
    });
    await expect(
      service.assign(admin, {
        submissionId: sub.id,
        reviewerId: 11,
        type: "peer",
      })
    ).rejects.toThrow();
    await expect(
      service.judge(learner, {
        submissionId: sub.id,
        levels: [3],
        gates: {
          truthful: true,
          authorized: true,
          reconciled: true,
          accessible: true,
          authentic: true,
        },
        reason: "Verified",
      })
    ).rejects.toThrow();
  });
  it("cannot mark knowledge passing as verified source competence", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const s = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "A" },
    });
    await service.submit(learner, { attemptId: a.id, revision: s.revision });
    const p = await service.progress(learner);
    expect(p.courses[0].verified).toBe(0);
    expect(p.courses[0].knowledgePassed).toBe(1);
    expect(p.eligible).toBe(false);
  });
  it("rejects certificate issuance when required practical evidence is absent", async () => {
    const { service } = fixture();
    await expect(service.issue(admin, 11)).rejects.toThrow();
    await expect(service.issue(learner, 11)).rejects.toThrow();
  });
});
