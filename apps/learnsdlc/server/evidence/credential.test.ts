import { it, expect } from "vitest";
import { fixture, learner, stranger, admin } from "./test-store";
const gates = {
  truthful: true,
  authorized: true,
  reconciled: true,
  accessible: true,
  authentic: true,
};
it("issues exactly one training credential only after every assessment, authentic rubric and two real review cycles", async () => {
  const { service, release, store } = fixture(true);
  async function pass(kind: string, courseId?: string, topicId?: string) {
    const a = await service.start(learner, { kind, courseId, topicId });
    const answers = Object.fromEntries(
      a.questions.map((q: any) => [q.id, "A"])
    );
    const saved = await service.save(learner, {
      attemptId: a.id,
      revision: a.revision,
      responses: answers,
    });
    return service.submit(learner, {
      attemptId: a.id,
      revision: saved.revision,
    });
  }
  async function submit(
    kind: string,
    courseId?: string,
    topicId?: string,
    levels = [3],
    cycleReviewId?: string
  ) {
    const s = await service.evidence(learner, {
      kind,
      courseId,
      topicId,
      cycleReviewId,
      url: "https://example.org/private-test-reference",
      connectionMode: "authentic_export",
      notes: "Isolated credential test fixture only",
    });
    await service.judge(admin, {
      submissionId: s.id,
      levels,
      gates,
      reason: "Observed test-fixture rubric checks",
    });
    return s;
  }
  const artifacts: any[] = [];
  for (const c of release.courses) {
    const id = c.course_id,
      t = c.topics[0].topic_id;
    await pass("topic", id, t);
    await pass("checkpoint", id);
    await pass("final", id);
    artifacts.push(await submit("topic", id, t));
    await submit("course", id);
  }
  expect((await service.progress(learner)).complete).toBe(14);
  await pass("program");
  await submit("technical", undefined, undefined, [3, 3, 3, 3, 3]);
  await submit("capstone", undefined, undefined, [3, 3, 3, 3, 3, 3, 3]);
  await expect(service.issue(admin, learner.id)).rejects.toThrow();
  for (const artifact of artifacts.slice(0, 2)) {
    const review = await service.assign(admin, {
      submissionId: artifact.id,
      reviewerId: stranger.id,
      type: "peer",
    });
    await service.respond(stranger, {
      reviewId: review.id,
      response: "Source-specific counterexample and repair request",
    });
    await service.authorResponse(learner, {
      reviewId: review.id,
      response: "Revised source boundary and response to challenge",
    });
    await submit("peer", undefined, undefined, [3], review.id);
  }
  const eligible = await service.progress(learner);
  expect(eligible.eligible).toBe(true);
  expect(eligible.overall).toBe(100);
  expect(
    eligible.milestones.filter((m: any) => m.id === "program")
  ).toHaveLength(1);
  const one = await service.issue(admin, learner.id),
    two = await service.issue(admin, learner.id);
  expect(two.certificateId).toBe(one.certificateId);
  expect(await store.list("credentials", learner.id)).toHaveLength(1);
  expect(one.title).toBe("Evidence Desk QA Measurement Certificate");
  expect(one.disclaimer).toContain("not ISO certification");
  expect((one as any).eligibilitySnapshot.components).toEqual(
    eligible.components
  );
});
