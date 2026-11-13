import { it, expect } from "vitest";
import { fixture, learner, admin, stranger } from "./test-store";
it("returns only public course metadata and resources from the content adapter", async () => {
  const { service } = fixture();
  const catalog = await service.catalog();
  expect(catalog.courses[0]).toMatchObject({
    id: "C01",
    topics: [{ id: "1.1", title: "Scope" }],
  });
  expect(JSON.stringify(catalog)).not.toContain("correct_option");
  expect((await service.course("C01")).title).toBe("Isolated test fixture");
  expect((await service.topic("C01", "1.1")).title).toBe("Scope");
  expect((await service.resources()).matrices).toEqual([]);
  await expect(service.course("C99")).rejects.toThrow();
  await expect(service.topic("C01", "missing")).rejects.toThrow();
});
it("returns protected attempt intake only to instructors and lists their submitted evidence for review", async () => {
  const { service } = fixture();
  const a = await service.start(learner, { kind: "final", courseId: "C01" });
  const saved = await service.save(learner, {
    attemptId: a.id,
    revision: 0,
    responses: { Q1: "A" },
  });
  await service.submit(learner, { attemptId: a.id, revision: saved.revision });
  await expect(service.instructorAttempts(stranger, 11)).rejects.toThrow();
  const intake = await service.instructorAttempts(admin, 11);
  expect(intake[0].feedback).toBeNull();
  await service.evidence(learner, {
    kind: "topic",
    courseId: "C01",
    topicId: "1.1",
    url: "https://example.org/test-only",
    notes: "Isolated public intake test",
    connectionMode: "authentic_export",
  });
  expect((await service.queue(admin)).submissions).toHaveLength(1);
});
