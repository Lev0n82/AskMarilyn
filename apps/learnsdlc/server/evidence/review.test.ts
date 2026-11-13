import { describe, it, expect } from "vitest";
import { fixture, learner, stranger, admin } from "./test-store";
const gates = {
  truthful: true,
  authorized: true,
  reconciled: true,
  accessible: true,
  authentic: true,
};
const evidence = {
  kind: "topic",
  courseId: "C01",
  topicId: "1.1",
  url: "https://example.org/authorized-report",
  connectionMode: "authentic_export",
  notes: "Isolated test fixture, not organizational evidence",
};
describe("Source, reviewer, revision and progress gates", () => {
  it("does not accept a pending-source submission even if all boxes are checked", async () => {
    const { service } = fixture();
    const s = await service.evidence(learner, {
      ...evidence,
      connectionMode: "pending_source",
    });
    const j = await service.judge(admin, {
      submissionId: s.id,
      levels: [3],
      gates,
      reason: "Control check",
    });
    expect(j.data.accepted).toBe(false);
  });
  it("does not allow a nonexistent registered reviewer", async () => {
    const { service, store } = fixture();
    (store as any).actorExists = async (id: number) => [1, 11, 12].includes(id);
    const s = await service.evidence(learner, evidence);
    await expect(
      service.assign(admin, {
        submissionId: s.id,
        reviewerId: 9999,
        type: "peer",
      })
    ).rejects.toThrow();
  });
  it("limits peer queue to assigned evidence and blocks other responses", async () => {
    const { service } = fixture();
    const s = await service.evidence(learner, evidence);
    const r = await service.assign(admin, {
      submissionId: s.id,
      reviewerId: 12,
      type: "peer",
    });
    expect(
      (await service.queue({ id: 13, role: "user" })).submissions
    ).toHaveLength(0);
    expect((await service.queue(stranger)).submissions).toHaveLength(1);
    await expect(
      service.respond(
        { id: 13, role: "user" },
        { reviewId: r.id, response: "Unauthorized" }
      )
    ).rejects.toThrow();
    await service.respond(stranger, {
      reviewId: r.id,
      response: "Two source-linked counterexamples",
    });
    expect((await service.submissions(learner))[0].reviews[0].data.state).toBe(
      "responded"
    );
  });
  it("preserves immutable judgments and requires corrected evidence revisions", async () => {
    const { service } = fixture();
    const s = await service.evidence(learner, evidence);
    await service.judge(admin, {
      submissionId: s.id,
      levels: [1],
      gates,
      reason: "Repair required",
    });
    await expect(
      service.judge(admin, {
        submissionId: s.id,
        levels: [3],
        gates,
        reason: "Overwrite",
      })
    ).rejects.toThrow();
    const revised = await service.evidence(learner, {
      ...evidence,
      parentId: s.id,
      notes: "Corrected evidence revision",
    });
    expect(revised.id).not.toBe(s.id);
    expect(
      (
        await service.judge(admin, {
          submissionId: revised.id,
          levels: [2],
          gates,
          reason: "Verified correction",
        })
      ).data.accepted
    ).toBe(true);
  });
  it("does not use an earlier accepted revision for a newer unreviewed revision", async () => {
    const { service } = fixture();
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
    const s = await service.evidence(learner, evidence);
    await service.judge(admin, {
      submissionId: s.id,
      levels: [2],
      gates,
      reason: "Verified",
    });
    expect((await service.progress(learner)).courses[0].verified).toBe(1);
    await new Promise(r => setTimeout(r, 2));
    await service.evidence(learner, { ...evidence, parentId: s.id });
    expect((await service.progress(learner)).courses[0].verified).toBe(0);
  });
  it("creates a once-only verified midpoint and never uses game points", async () => {
    const { service } = fixture();
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
    expect((await service.progress(learner)).milestones).toHaveLength(0);
    const s = await service.evidence(learner, evidence);
    await service.judge(admin, {
      submissionId: s.id,
      levels: [2],
      gates,
      reason: "Authentic individual competence",
    });
    expect((await service.progress(learner)).milestones).toHaveLength(1);
    expect((await service.progress(learner)).milestones).toHaveLength(1);
  });
  it("allows exactly one concurrent save at an expected revision", async () => {
    const { service } = fixture();
    const a = await service.start(learner, {
      kind: "topic",
      courseId: "C01",
      topicId: "1.1",
    });
    const result = await Promise.allSettled([
      service.save(learner, {
        attemptId: a.id,
        revision: 0,
        responses: { Q1: "A" },
      }),
      service.save(learner, {
        attemptId: a.id,
        revision: 0,
        responses: { Q1: "B" },
      }),
    ]);
    expect(result.filter(x => x.status === "fulfilled")).toHaveLength(1);
    expect(result.filter(x => x.status === "rejected")).toHaveLength(1);
  });
  it("requires complete real reviewer and author responses before a peer-cycle claim", async () => {
    const { service } = fixture();
    const s = await service.evidence(learner, evidence);
    const r = await service.assign(admin, {
      submissionId: s.id,
      reviewerId: 12,
      type: "peer",
    });
    await expect(
      service.evidence(learner, {
        ...evidence,
        kind: "peer",
        cycleReviewId: r.id,
      })
    ).rejects.toThrow();
    await service.respond(stranger, {
      reviewId: r.id,
      response: "Source-linked challenge",
    });
    await expect(
      service.evidence(learner, {
        ...evidence,
        kind: "peer",
        cycleReviewId: r.id,
      })
    ).rejects.toThrow();
    await service.authorResponse(learner, {
      reviewId: r.id,
      response: "Repair and changed conclusion",
    });
    expect(
      (
        await service.evidence(learner, {
          ...evidence,
          kind: "peer",
          cycleReviewId: r.id,
        })
      ).data.cycleReviewId
    ).toBe(r.id);
  });
  it("saves a bounded resume revision and rejects a stale or foreign route", async () => {
    const { service } = fixture();
    await expect(
      service.resume(learner, {
        route: "/other-course",
        section: "lab",
        scrollY: 120,
        revision: 0,
      })
    ).rejects.toThrow();
    await service.resume(learner, {
      route: "/evidence-desk/v3/courses/C01/topics/1.1",
      section: "guided-build",
      scrollY: 321,
      revision: 0,
    });
    expect((await service.progress(learner)).resume.scrollY).toBe(321);
    await expect(
      service.resume(learner, {
        route: "/evidence-desk/v3/courses/C01",
        section: "outline",
        scrollY: 0,
        revision: 0,
      })
    ).rejects.toThrow();
  });
  it("discloses practice feedback only for a committed response to that topic", async () => {
    const { service, release } = fixture();
    release.courses[0].topics[0].prediction = { feedback_ref: "P" };
    release.feedback.push({
      id: "P",
      expected: "Check the scope",
      correction: "Retain missing evidence",
    });
    await expect(
      service.practice(learner, {
        courseId: "C01",
        topicId: "1.1",
        feedbackId: "other",
        response: "Guess",
      })
    ).rejects.toThrow();
    const result = await service.practice(learner, {
      courseId: "C01",
      topicId: "1.1",
      feedbackId: "P",
      response: "Check scope",
    });
    expect(result.expected).toBe("Check the scope");
    await service.saveLearning(learner, {
      courseId: "C01",
      topicId: "1.1",
      response: "Retrieval repair",
      returnDay: 7,
    });
    expect(
      (await service.progress(learner)).learning["1.1"].returns["7"].response
    ).toBe("Retrieval repair");
  });
});
