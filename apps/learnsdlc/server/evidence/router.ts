import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { createService } from "./service";
import { databaseStore } from "./store";
const courseId = z.string().regex(/^C(0[1-9]|1[0-4])$/);
const topicId = z.string().min(1).max(20);
const uuid = z.string().uuid();
const text = z.string().trim().min(1).max(8000);
const service = createService(databaseStore);
export const evidenceDeskRouter = router({
  catalog: publicProcedure.query(() => service.catalog()),
  course: publicProcedure
    .input(z.object({ courseId }))
    .query(({ input }) => service.course(input.courseId)),
  topic: publicProcedure
    .input(z.object({ courseId, topicId }))
    .query(({ input }) => service.topic(input.courseId, input.topicId)),
  resources: publicProcedure.query(() => service.resources()),
  start: protectedProcedure
    .input(
      z.object({
        kind: z.enum(["topic", "checkpoint", "final", "program"]),
        courseId: courseId.optional(),
        topicId: topicId.optional(),
      })
    )
    .mutation(({ ctx, input }) => service.start(ctx.user, input)),
  attempt: protectedProcedure
    .input(z.object({ attemptId: uuid }))
    .query(({ ctx, input }) => service.attempt(ctx.user, input.attemptId)),
  save: protectedProcedure
    .input(
      z.object({
        attemptId: uuid,
        revision: z.number().int().nonnegative(),
        responses: z.record(z.string().max(100), z.enum(["A", "B", "C", "D"])),
      })
    )
    .mutation(({ ctx, input }) => service.save(ctx.user, input)),
  submit: protectedProcedure
    .input(
      z.object({ attemptId: uuid, revision: z.number().int().nonnegative() })
    )
    .mutation(({ ctx, input }) => service.submit(ctx.user, input)),
  progress: protectedProcedure.query(({ ctx }) => service.progress(ctx.user)),
  practice: protectedProcedure
    .input(
      z.object({
        courseId,
        topicId,
        feedbackId: z.string().max(100),
        response: text,
      })
    )
    .mutation(({ ctx, input }) => service.practice(ctx.user, input)),
  learning: protectedProcedure
    .input(
      z.object({
        courseId,
        topicId,
        response: text,
        returnDay: z
          .union([z.literal(1), z.literal(7), z.literal(21)])
          .optional(),
      })
    )
    .mutation(({ ctx, input }) => service.saveLearning(ctx.user, input)),
  resume: protectedProcedure
    .input(
      z.object({
        route: z.string().max(200),
        section: z.string().max(100),
        scrollY: z.number().min(0).max(1000000),
        revision: z.number().int().nonnegative(),
      })
    )
    .mutation(({ ctx, input }) => service.resume(ctx.user, input)),
  evidence: protectedProcedure
    .input(
      z.object({
        kind: z.enum(["topic", "course", "technical", "capstone", "peer"]),
        courseId: courseId.optional(),
        topicId: topicId.optional(),
        parentId: uuid.optional(),
        url: z.string().url().max(2000),
        connectionMode: z.enum([
          "live_authorized",
          "authentic_export",
          "pending_source",
        ]),
        notes: text,
        cycleReviewId: uuid.optional(),
      })
    )
    .mutation(({ ctx, input }) => service.evidence(ctx.user, input)),
  submissions: protectedProcedure.query(({ ctx }) =>
    service.submissions(ctx.user)
  ),
  queue: protectedProcedure.query(({ ctx }) => service.queue(ctx.user)),
  assign: protectedProcedure
    .input(
      z.object({
        submissionId: uuid,
        reviewerId: z.number().int().positive(),
        type: z.literal("peer"),
      })
    )
    .mutation(({ ctx, input }) => service.assign(ctx.user, input)),
  respond: protectedProcedure
    .input(z.object({ reviewId: uuid, response: text }))
    .mutation(({ ctx, input }) => service.respond(ctx.user, input)),
  authorResponse: protectedProcedure
    .input(z.object({ reviewId: uuid, response: text }))
    .mutation(({ ctx, input }) => service.authorResponse(ctx.user, input)),
  judge: protectedProcedure
    .input(
      z.object({
        submissionId: uuid,
        levels: z.array(z.number().int().min(0).max(3)).min(1).max(40),
        gates: z.object({
          truthful: z.boolean(),
          authorized: z.boolean(),
          reconciled: z.boolean(),
          accessible: z.boolean(),
          authentic: z.boolean(),
        }),
        reason: text,
      })
    )
    .mutation(({ ctx, input }) => service.judge(ctx.user, input)),
  release: protectedProcedure
    .input(z.object({ attemptId: uuid, reason: text }))
    .mutation(({ ctx, input }) =>
      service.release(ctx.user, input.attemptId, input.reason)
    ),
  allowRetake: protectedProcedure
    .input(z.object({ attemptId: uuid, reason: text }))
    .mutation(({ ctx, input }) =>
      service.allowRetake(ctx.user, input.attemptId, input.reason)
    ),
  instructorAttempts: protectedProcedure
    .input(z.object({ learnerId: z.number().int().positive() }))
    .query(({ ctx, input }) =>
      service.instructorAttempts(ctx.user, input.learnerId)
    ),
  issue: protectedProcedure
    .input(z.object({ learnerId: z.number().int().positive() }))
    .mutation(({ ctx, input }) => service.issue(ctx.user, input.learnerId)),
});
