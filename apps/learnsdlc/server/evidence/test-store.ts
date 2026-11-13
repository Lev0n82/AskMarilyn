import { createService, type Release, type Store, type Row } from "./service";
export const learner = { id: 11, role: "user" },
  stranger = { id: 12, role: "user" },
  admin = { id: 1, role: "admin" };
export function fixture(full = false) {
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
  const courses = Array.from({ length: full ? 14 : 1 }, (_, i) => {
    const id = `C${String(i + 1).padStart(2, "0")}`;
    return {
      course_id: id,
      title: "Isolated test fixture",
      introduction: { dilemma: "D", reply: "R", start_topic_id: `${i + 1}.1` },
      outcomes: [],
      topics: [
        {
          topic_id: `${i + 1}.1`,
          title: "Scope",
          quiz: { id: "quiz", questions: [question], pass_count: 1 },
          video_clip_id: "none",
        },
      ],
      practical_completion: {
        reviewer_checks: ["All published local rubric areas competent"],
      },
    };
  });
  const questions: any = { program: [{ ...question, id: "PF" }] };
  for (const c of courses) {
    questions[`topic:${c.course_id}:${c.topics[0].topic_id}`] = [question];
    questions[`checkpoint:${c.course_id}`] = [question];
    questions[`final:${c.course_id}`] = [question];
  }
  const release: Release = {
    version: "3.0",
    hash: "isolated fixture",
    courses,
    questions,
    feedback: [],
    assets: [],
    matrices: [],
  };
  const rows = new Map<string, Row>(),
    locks = new Map<number, Promise<void>>();
  const clone = <T>(v: T): T => (v === undefined ? v : structuredClone(v));
  const store: Store = {
    actorExists: async id => [1, 11, 12].includes(id),
    release: async () => release,
    get: async (t, id) => clone(rows.get(t + id)),
    list: async (t, o) =>
      Array.from(rows.entries())
        .filter(
          ([k, r]) => k.startsWith(t) && (o === undefined || r.ownerId === o)
        )
        .map(([, r]) => clone(r)),
    put: async (t, r) => {
      rows.set(t + r.id, clone(r));
      return r;
    },
    tx: async (owner, fn) => {
      const prior = locks.get(owner) ?? Promise.resolve();
      let unlock!: () => void;
      const next = new Promise<void>(resolve => {
        unlock = resolve;
      });
      locks.set(
        owner,
        prior.then(() => next)
      );
      await prior;
      try {
        return await fn(store);
      } finally {
        unlock();
      }
    },
  };
  return { service: createService(store), store, release };
}
