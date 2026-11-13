import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import {
  grade,
  publicQuestion,
  questionFeedback,
  rubric,
  gatesPass,
  evidenceUrl,
  halfway,
  type Question,
  type Gates,
} from "./core";
export type Actor = { id: number; role: string };
export type Row = { id: string; ownerId: number; version: string; data: any };
export type Release = {
  version: string;
  hash: string;
  courses: any[];
  questions: Record<string, Question[]>;
  feedback: any[];
  assets: any[];
  matrices: any[];
  clips?: Record<string, string>;
};
export type Store = {
  release: () => Promise<Release>;
  actorExists: (id: number) => Promise<boolean>;
  get: (table: string, id: string) => Promise<Row | undefined>;
  list: (table: string, ownerId?: number) => Promise<Row[]>;
  put: (table: string, row: Row) => Promise<Row>;
  tx: <T>(ownerId: number, fn: (s: Store) => Promise<T>) => Promise<T>;
};
const fail = (
  code:
    | "BAD_REQUEST"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "PRECONDITION_FAILED",
  message: string
): never => {
  throw new TRPCError({ code, message });
};
const admin = (u: Actor) => {
  if (u.role !== "admin") fail("FORBIDDEN", "Instructor permission required");
};
const tableRow = (
  id: string,
  ownerId: number,
  version: string,
  data: any
): Row => ({ id, ownerId, version, data });
export function createService(store: Store) {
  const release = () => store.release();
  const own = async (s: Store, t: string, id: string, u: Actor) => {
    const r = await s.get(t, id);
    if (!r) fail("NOT_FOUND", "Record not found");
    if (r!.ownerId !== u.id)
      fail("FORBIDDEN", "This record belongs to another learner");
    return r!;
  };
  const findCourse = (r: Release, id: string) => {
    const c = r.courses.find(c => c.course_id === id);
    if (!c) fail("NOT_FOUND", "Course not found");
    return c;
  };
  const findTopic = (r: Release, c: string, t: string) => {
    const topic = findCourse(r, c).topics.find((x: any) => x.topic_id === t);
    if (!topic) fail("NOT_FOUND", "Topic not found");
    return topic;
  };
  const safeAttempt = (a: Row) => {
    const d = a.data;
    return {
      id: a.id,
      version: a.version,
      key: d.key,
      kind: d.kind,
      courseId: d.courseId,
      topicId: d.topicId,
      revision: d.revision,
      responses: d.responses,
      status: d.status,
      score: d.score ?? null,
      total: d.questions.length,
      passed: d.passed ?? false,
      retakeMode: d.retakeMode ?? null,
      questions: d.questions.map(publicQuestion),
      feedback: d.released
        ? d.questions.map((q: Question) =>
            questionFeedback(q, d.responses[q.id])
          )
        : null,
      memoryText: d.released ? (d.memoryText ?? null) : null,
    };
  };
  const rubricLabels = (r: Release, s: Row) => {
    if (s.data.kind === "technical")
      return [
        "Source/access and complete extraction",
        "Lineage, grain, history and relationships",
        "Denominator, selection and DAX correctness",
        "Matrix reconciliation and source drillback",
        "Usable ethical handoff and owned decisions",
      ];
    if (s.data.kind === "capstone")
      return [
        "Decision/business relevance",
        "Audience fit",
        "Evidence/model accuracy",
        "QA management and improvement",
        "Narrative logic and challenge",
        "Visual access",
        "Ethical restraint",
      ];
    if (s.data.kind === "peer")
      return [
        "Substantive source-linked review, author response and revision cycle",
      ];
    if (s.data.kind === "topic")
      return [
        "Individual changed-scope task: all published success checks and authentic evidence",
      ];
    return findCourse(r, s.data.courseId).practical_completion.reviewer_checks;
  };
  const latest = (rows: Row[]) =>
    rows
      .slice()
      .sort(
        (a, b) =>
          (b.data.sequence ?? 0) - (a.data.sequence ?? 0) ||
          (b.data.createdAt ?? 0) - (a.data.createdAt ?? 0)
      )[0];
  async function compute(u: Actor, s: Store = store) {
    const r = await release();
    const attempts = await s.list("attempts", u.id);
    const subs = await s.list("submissions", u.id);
    const reviews = await s.list("reviews", u.id);
    // An unreviewed newest revision supersedes an earlier accepted revision for the same requirement.
    const accepted = (kind: string, c?: string, t?: string) => {
      const sub = latest(
        subs.filter(
          x =>
            x.data.kind === kind &&
            (!c || x.data.courseId === c) &&
            (!t || x.data.topicId === t)
        )
      );
      if (!sub) return undefined;
      return reviews.find(
        x =>
          x.data.type === "instructor" &&
          x.data.submissionId === sub.id &&
          x.data.accepted === true
      );
    };
    const passing = (key: string) =>
      latest(
        attempts.filter(
          a =>
            a.data.key === key && a.data.status === "submitted" && a.data.passed
        )
      );
    const courses = r.courses.map(c => {
      const topics = c.topics.map((t: any) => ({
        id: t.topic_id,
        title: t.title,
        knowledge: !!passing(`topic:${c.course_id}:${t.topic_id}`),
        submitted: !!latest(
          subs.filter(
            x => x.data.kind === "topic" && x.data.topicId === t.topic_id
          )
        ),
        verified:
          !!passing(`topic:${c.course_id}:${t.topic_id}`) &&
          !!accepted("topic", c.course_id, t.topic_id),
      }));
      const verified = topics.filter((t: any) => t.verified).length;
      return {
        id: c.course_id,
        title: c.title,
        total: topics.length,
        topics,
        verified,
        knowledgePassed: topics.filter((t: any) => t.knowledge).length,
        checkpointPassed: !!passing(`checkpoint:${c.course_id}`),
        finalPassed: !!passing(`final:${c.course_id}`),
        performanceAccepted: !!accepted("course", c.course_id),
        completed:
          verified === topics.length &&
          !!passing(`checkpoint:${c.course_id}`) &&
          !!passing(`final:${c.course_id}`) &&
          !!accepted("course", c.course_id),
      };
    });
    const technical = accepted("technical"),
      capstone = accepted("capstone");
    const program = passing("program");
    const peerRows = subs.filter(x => x.data.kind === "peer");
    const peers = peerRows
      .filter(sub =>
        reviews.some(
          x =>
            x.data.type === "instructor" &&
            x.data.submissionId === sub.id &&
            x.data.accepted === true
        )
      )
      .filter(
        (sub, i, arr) =>
          arr.findIndex(
            x => x.data.cycleReviewId === sub.data.cycleReviewId
          ) === i
      ).length;
    const pct = (a?: Row) =>
      a ? (a.data.score / a.data.questions.length) * 100 : 0;
    const topicScores = courses.flatMap(c =>
      c.topics.map((t: any) => pct(passing(`topic:${c.id}:${t.id}`)))
    );
    const mean = (v: number[]) =>
      v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
    const components = {
      topics: mean(topicScores),
      courses: mean(
        courses.map(
          c =>
            (pct(passing(`checkpoint:${c.id}`)) +
              pct(passing(`final:${c.id}`))) /
            2
        )
      ),
      technical: technical?.data.rubricScore ?? 0,
      program: pct(program),
      capstone: capstone?.data.rubricScore ?? 0,
      peers: Math.min(peers, 2) * 50,
    };
    const overall =
      components.topics * 0.1 +
      components.courses * 0.15 +
      components.technical * 0.2 +
      components.program * 0.15 +
      components.capstone * 0.35 +
      components.peers * 0.05;
    const complete = courses.filter(c => c.completed).length;
    const eligible =
      courses.length === 14 &&
      complete === 14 &&
      !!program &&
      !!technical &&
      !!capstone &&
      peers >= 2 &&
      overall >= 80;
    const learning = await s.get("learning", `${u.id}:${r.version}`);
    const milestones = learning?.data.milestones ?? [];
    return {
      version: r.version,
      courses,
      complete,
      total: courses.length,
      components,
      overall,
      eligible,
      peers,
      technicalAccepted: !!technical,
      capstoneAccepted: !!capstone,
      programPassed: !!program,
      milestones,
      learning: learning?.data.topics ?? {},
      resume: learning?.data.resume ?? null,
      revision: learning?.data.revision ?? 0,
      attempts: attempts.map(safeAttempt),
      credential:
        (await s.get("credentials", `${u.id}:${r.version}`))?.data ?? null,
    };
  }
  async function reconcile(u: Actor, s: Store) {
    const p = await compute(u, s);
    const id = `${u.id}:${p.version}`;
    const row =
      (await s.get("learning", id)) ??
      tableRow(id, u.id, p.version, {
        topics: {},
        revision: 0,
        milestones: [],
      });
    for (const c of p.courses) {
      if (
        halfway(c.total, c.verified) &&
        !row.data.milestones.some((m: any) => m.id === c.id)
      )
        row.data.milestones.push({
          id: c.id,
          text: `Halfway through ${c.id}: ${c.verified} of ${c.total} topic units verified. Your work is saved.`,
          createdAt: Date.now(),
        });
    }
    if (
      p.complete >= 7 &&
      !row.data.milestones.some((m: any) => m.id === "program")
    )
      row.data.milestones.push({
        id: "program",
        text: "Halfway milestone reached: 7 of 14 micro-courses completed. Your progress is saved.",
        createdAt: Date.now(),
      });
    await s.put("learning", row);
    return p;
  }
  return {
    async catalog() {
      const r = await release();
      return {
        version: r.version,
        title: "Evidence Desk — Azure DevOps QA Measurement",
        courses: r.courses.map(c => ({
          id: c.course_id,
          title: c.title,
          introduction: c.introduction,
          outcomes: c.outcomes,
          topics: c.topics.map((t: any) => ({
            id: t.topic_id,
            title: t.title,
          })),
        })),
      };
    },
    async course(id: string) {
      return findCourse(await release(), id);
    },
    async topic(c: string, t: string) {
      return findTopic(await release(), c, t);
    },
    async resources() {
      const r = await release();
      return { assets: r.assets, matrices: r.matrices };
    },
    async start(
      u: Actor,
      input: { kind: string; courseId?: string; topicId?: string }
    ) {
      const r = await release();
      const key =
        input.kind === "program"
          ? "program"
          : `${input.kind}:${input.courseId}${input.kind === "topic" ? `:${input.topicId}` : ""}`;
      const questions = r.questions[key];
      if (!questions?.length) fail("NOT_FOUND", "Assessment not available");
      return store.tx(u.id, async s => {
        const previous = latest(
          (await s.list("attempts", u.id)).filter(a => a.data.key === key)
        );
        if (previous?.data.status === "draft") return safeAttempt(previous);
        if (
          ["final", "program"].includes(input.kind) &&
          previous &&
          !previous.data.retakeApproved
        )
          fail(
            "PRECONDITION_FAILED",
            "Final retake needs instructor-reviewed remediation. Only a learning repeat of this form is available."
          );
        if (previous) {
          previous.data.retakeApproved = false;
          await s.put("attempts", previous);
        }
        const row = tableRow(randomUUID(), u.id, r.version, {
          key,
          ...input,
          questions,
          responses: {},
          revision: 0,
          status: "draft",
          sequence: (previous?.data.sequence ?? 0) + 1,
          createdAt: Date.now(),
          released: false,
          retakeMode:
            previous && ["final", "program"].includes(input.kind)
              ? "learning_repeat"
              : null,
          memoryText:
            input.kind === "topic"
              ? r.clips?.[
                  findTopic(r, input.courseId!, input.topicId!).video_clip_id
                ]
              : null,
        });
        await s.put("attempts", row);
        return safeAttempt(row);
      });
    },
    async attempt(u: Actor, id: string) {
      return safeAttempt(await own(store, "attempts", id, u));
    },
    async save(
      u: Actor,
      input: {
        attemptId: string;
        revision: number;
        responses: Record<string, string>;
      }
    ) {
      return store.tx(u.id, async s => {
        const a = await own(s, "attempts", input.attemptId, u);
        if (a.data.status !== "draft" || a.data.revision !== input.revision)
          fail(
            "CONFLICT",
            "This attempt changed or was submitted. Reload the saved attempt."
          );
        if (
          Object.keys(input.responses).some(
            id =>
              !a.data.questions.some(
                (q: Question) =>
                  q.id === id &&
                  q.options.some(o => o.id === input.responses[id])
              )
          )
        )
          fail("BAD_REQUEST", "Invalid question or option");
        a.data.responses = input.responses;
        a.data.revision++;
        await s.put("attempts", a);
        return safeAttempt(a);
      });
    },
    async submit(u: Actor, input: { attemptId: string; revision: number }) {
      return store.tx(u.id, async s => {
        const a = await own(s, "attempts", input.attemptId, u);
        if (a.data.status === "submitted") return safeAttempt(a);
        if (a.data.revision !== input.revision)
          fail("CONFLICT", "Save conflict. Reload before submitting.");
        let result;
        try {
          result = grade(a.data.questions, a.data.responses);
        } catch {
          fail(
            "BAD_REQUEST",
            "Answer every presented question before submission"
          );
        }
        Object.assign(a.data, result!, {
          status: "submitted",
          submittedAt: Date.now(),
          released: ["topic", "checkpoint"].includes(a.data.kind),
          revision: a.data.revision + 1,
        });
        await s.put("attempts", a);
        await reconcile(u, s);
        return safeAttempt(a);
      });
    },
    async release(u: Actor, id: string, reason: string) {
      admin(u);
      const a = await store.get("attempts", id);
      if (!a || a.data.status !== "submitted")
        fail("BAD_REQUEST", "Submitted attempt required");
      return store.tx(a!.ownerId, async s => {
        const row = (await s.get("attempts", id))!;
        row.data.released = true;
        row.data.releaseReason = reason;
        row.data.releasedBy = u.id;
        await s.put("attempts", row);
        return { success: true };
      });
    },
    async allowRetake(u: Actor, id: string, reason: string) {
      admin(u);
      const a = await store.get("attempts", id);
      if (
        !a ||
        a.data.status !== "submitted" ||
        !["final", "program"].includes(a.data.kind)
      )
        fail("BAD_REQUEST", "Submitted final attempt required");
      return store.tx(a!.ownerId, async s => {
        const row = (await s.get("attempts", id))!;
        row.data.retakeApproved = true;
        row.data.retakeReason = reason;
        row.data.retakeBy = u.id;
        await s.put("attempts", row);
        return { success: true };
      });
    },
    async practice(
      u: Actor,
      input: {
        courseId: string;
        topicId: string;
        feedbackId: string;
        response: string;
      }
    ) {
      const r = await release();
      const t = findTopic(r, input.courseId, input.topicId);
      const permitted = [
        t.prediction?.feedback_ref,
        t.recall?.feedback_ref,
        ...(t.returns ?? []).map((x: any) => x.feedback_ref),
        ...(t.games ?? []).flatMap((g: any) =>
          g.rounds.map((x: any) => x.feedback_ref)
        ),
      ];
      if (!permitted.includes(input.feedbackId) || !input.response.trim())
        fail("BAD_REQUEST", "Commit a response to this topic activity first");
      const f = r.feedback.find(f => f.id === input.feedbackId);
      if (!f) fail("NOT_FOUND", "Practice feedback unavailable");
      return {
        expected: f.expected,
        correction: f.correction,
        evaluation:
          "Compare your answer with the authored explanation; complex responses are not automatically graded.",
      };
    },
    async saveLearning(
      u: Actor,
      input: {
        courseId: string;
        topicId: string;
        response: string;
        returnDay?: number;
      }
    ) {
      const r = await release();
      findTopic(r, input.courseId, input.topicId);
      return store.tx(u.id, async s => {
        const id = `${u.id}:${r.version}`;
        const row =
          (await s.get("learning", id)) ??
          tableRow(id, u.id, r.version, {
            topics: {},
            milestones: [],
            revision: 0,
          });
        const old = row.data.topics[input.topicId] ?? {
          startedAt: Date.now(),
          returns: {},
        };
        if (input.returnDay)
          old.returns[input.returnDay] = {
            response: input.response,
            at: Date.now(),
          };
        else old.response = input.response;
        row.data.topics[input.topicId] = old;
        row.data.revision++;
        await s.put("learning", row);
        return { revision: row.data.revision };
      });
    },
    async resume(
      u: Actor,
      input: {
        route: string;
        section: string;
        scrollY: number;
        revision: number;
      }
    ) {
      const r = await release();
      if (!input.route.startsWith("/evidence-desk/v3/"))
        fail("BAD_REQUEST", "Invalid learning route");
      return store.tx(u.id, async s => {
        const id = `${u.id}:${r.version}`;
        const row =
          (await s.get("learning", id)) ??
          tableRow(id, u.id, r.version, {
            topics: {},
            milestones: [],
            revision: 0,
          });
        if (row.data.revision !== input.revision)
          fail("CONFLICT", "Resume state changed. Refresh progress.");
        row.data.resume = {
          route: input.route,
          section: input.section,
          scrollY: input.scrollY,
          at: Date.now(),
        };
        row.data.revision++;
        await s.put("learning", row);
        return { revision: row.data.revision, resume: row.data.resume };
      });
    },
    progress: compute,
    async evidence(
      u: Actor,
      input: {
        kind: string;
        courseId?: string;
        topicId?: string;
        parentId?: string;
        url: string;
        connectionMode: string;
        notes: string;
        cycleReviewId?: string;
      }
    ) {
      const r = await release();
      if (input.courseId) findCourse(r, input.courseId);
      if (input.kind === "topic") findTopic(r, input.courseId!, input.topicId!);
      try {
        evidenceUrl(input.url);
      } catch {
        fail(
          "BAD_REQUEST",
          "Provide a permission-controlled HTTPS evidence reference without credentials."
        );
      }
      if (input.parentId) {
        const parent = await own(store, "submissions", input.parentId, u);
        if (
          parent.data.kind !== input.kind ||
          parent.data.courseId !== input.courseId ||
          parent.data.topicId !== input.topicId
        )
          fail("BAD_REQUEST", "Revision must keep the original requirement");
      }
      if (input.kind === "peer") {
        const rv = await own(store, "reviews", input.cycleReviewId ?? "", u);
        if (
          rv.data.type !== "peer" ||
          rv.data.state !== "responded" ||
          !rv.data.authorResponse
        )
          fail(
            "PRECONDITION_FAILED",
            "Peer evidence needs an assigned real reviewer response and your author response"
          );
      }
      const row = tableRow(randomUUID(), u.id, r.version, {
        ...input,
        createdAt: Date.now(),
      });
      await store.tx(u.id, async s => {
        const previous = await s.list("submissions", u.id);
        row.data.sequence =
          Math.max(0, ...previous.map(x => x.data.sequence ?? 0)) + 1;
        return s.put("submissions", row);
      });
      return { ...row, labels: rubricLabels(r, row) };
    },
    async submissions(u: Actor) {
      const r = await release();
      return Promise.all(
        (await store.list("submissions", u.id)).map(async s => ({
          ...s,
          labels: rubricLabels(r, s),
          reviews: (await store.list("reviews", u.id)).filter(
            x => x.data.submissionId === s.id
          ),
        }))
      );
    },
    async queue(u: Actor) {
      const reviews = (await store.list("reviews")).filter(
        x => x.data.reviewerId === u.id
      );
      const submissions =
        u.role === "admin" ? await store.list("submissions") : [];
      const allowedIds = reviews.map(x => x.data.submissionId);
      return {
        reviews,
        submissions:
          u.role === "admin"
            ? submissions
            : (await store.list("submissions")).filter(x =>
                allowedIds.includes(x.id)
              ),
      };
    },
    async assign(
      u: Actor,
      input: { submissionId: string; reviewerId: number; type: string }
    ) {
      admin(u);
      const s = await store.get("submissions", input.submissionId);
      if (!s) fail("NOT_FOUND", "Submission not found");
      if (s!.ownerId === input.reviewerId)
        fail("BAD_REQUEST", "A learner cannot be their own reviewer");
      if (!(await store.actorExists(input.reviewerId)))
        fail(
          "BAD_REQUEST",
          "Reviewer must be an actual registered academy user"
        );
      const r = await release();
      const row = tableRow(randomUUID(), s!.ownerId, r.version, {
        ...input,
        state: "assigned",
        createdAt: Date.now(),
      });
      await store.tx(s!.ownerId, tx => tx.put("reviews", row));
      return row;
    },
    async respond(u: Actor, input: { reviewId: string; response: string }) {
      const row = await store.get("reviews", input.reviewId);
      if (!row || row.data.reviewerId !== u.id || row.data.type !== "peer")
        fail("FORBIDDEN", "Only the assigned peer can respond");
      return store.tx(row!.ownerId, async s => {
        const x = (await s.get("reviews", input.reviewId))!;
        if (x.data.state === "responded")
          fail("CONFLICT", "Peer review already responded");
        x.data.response = input.response;
        x.data.state = "responded";
        x.data.respondedAt = Date.now();
        return s.put("reviews", x);
      });
    },
    async authorResponse(
      u: Actor,
      input: { reviewId: string; response: string }
    ) {
      return store.tx(u.id, async s => {
        const row = await own(s, "reviews", input.reviewId, u);
        if (row.data.type !== "peer" || row.data.state !== "responded")
          fail("PRECONDITION_FAILED", "A real peer response is required");
        row.data.authorResponse = input.response;
        row.data.authorRespondedAt = Date.now();
        return s.put("reviews", row);
      });
    },
    async judge(
      u: Actor,
      input: {
        submissionId: string;
        levels: number[];
        gates: Gates;
        reason: string;
      }
    ) {
      admin(u);
      const sub = await store.get("submissions", input.submissionId);
      if (!sub) fail("NOT_FOUND", "Submission not found");
      if (sub!.ownerId === u.id)
        fail("FORBIDDEN", "Instructor cannot verify their own evidence");
      const r = await release();
      if (input.levels.length !== rubricLabels(r, sub!).length)
        fail("BAD_REQUEST", "Complete every published review criterion");
      const result = rubric(
        input.levels,
        sub!.data.kind === "capstone" ? [15, 10, 25, 15, 15, 10, 10] : undefined
      );
      const accepted =
        result.competent &&
        gatesPass(input.gates) &&
        ["authentic_export", "live_authorized"].includes(
          sub!.data.connectionMode
        );
      return store.tx(sub!.ownerId, async s => {
        const existing = (await s.list("reviews", sub!.ownerId)).find(
          x => x.data.type === "instructor" && x.data.submissionId === sub!.id
        );
        if (existing)
          fail(
            "CONFLICT",
            "This revision has already been judged. Submit a corrected revision for a new judgment."
          );
        const row = tableRow(randomUUID(), sub!.ownerId, r.version, {
          type: "instructor",
          reviewerId: u.id,
          state: "judged",
          ...input,
          accepted,
          rubricScore: result.score,
          createdAt: Date.now(),
        });
        await s.put("reviews", row);
        await reconcile({ id: sub!.ownerId, role: "user" }, s);
        return row;
      });
    },
    async instructorAttempts(u: Actor, learnerId: number) {
      admin(u);
      return (await store.list("attempts", learnerId)).map(safeAttempt);
    },
    async issue(u: Actor, learnerId: number) {
      admin(u);
      if (u.id === learnerId) fail("FORBIDDEN", "Instructor cannot self-issue");
      const r = await release();
      return store.tx(learnerId, async s => {
        const id = `${learnerId}:${r.version}`;
        const old = await s.get("credentials", id);
        if (old) return old.data;
        const p = await compute({ id: learnerId, role: "user" }, s);
        if (!p.eligible)
          fail(
            "PRECONDITION_FAILED",
            "Completion gates are not verified. Passing quizzes alone is insufficient."
          );
        const data = {
          certificateId: randomUUID(),
          title: "Evidence Desk QA Measurement Certificate",
          learnerId,
          version: r.version,
          issuerId: u.id,
          issuedAt: Date.now(),
          overall: p.overall,
          eligibilitySnapshot: {
            contentHash: r.hash,
            components: p.components,
            completedCourses: p.courses.filter(c => c.completed).map(c => c.id),
            acceptedReviewIds: (await s.list("reviews", learnerId))
              .filter(x => x.data.type === "instructor" && x.data.accepted)
              .map(x => x.id),
            passingAttemptIds: (await s.list("attempts", learnerId))
              .filter(x => x.data.status === "submitted" && x.data.passed)
              .map(x => x.id),
          },
          disclaimer:
            "Training completion only; not ISO certification or organizational conformity assurance.",
        };
        await s.put("credentials", tableRow(id, learnerId, r.version, data));
        return data;
      });
    },
  };
}
