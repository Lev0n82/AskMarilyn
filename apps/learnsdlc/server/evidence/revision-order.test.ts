import { it, expect, vi } from "vitest";
import { fixture, learner, admin } from "./test-store";
it("orders submission revisions independently of same-millisecond timestamps", async () => {
  const { service } = fixture();
  vi.spyOn(Date, "now").mockReturnValue(1000);
  try {
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const draft = await service.save(learner, {
      attemptId: a.id,
      revision: 0,
      responses: { Q1: "A" },
    });
    await service.submit(learner, {
      attemptId: a.id,
      revision: draft.revision,
    });
    const input = {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
      url: "https://example.org/test-only",
      notes: "Isolated revision fixture",
      connectionMode: "authentic_export",
    };
    const first = await service.evidence(learner, input);
    await service.judge(admin, {
      submissionId: first.id,
      levels: [2],
      gates: {
        truthful: true,
        authorized: true,
        reconciled: true,
        accessible: true,
        authentic: true,
      },
      reason: "First revision verified",
    });
    expect((await service.progress(learner)).courses[0].verified).toBe(1);
    await service.evidence(learner, { ...input, parentId: first.id });
    expect((await service.progress(learner)).courses[0].verified).toBe(0);
  } finally {
    vi.restoreAllMocks();
  }
});
