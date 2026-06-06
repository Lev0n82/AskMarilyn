/**
 * GRACE HITL Router — CSC-GRACE-AI v1.2
 * Human-in-the-Loop review queue: list, review, approve, reject, modify, escalate.
 *
 * Post-approval pipeline (triggered when a scope_review item is approved):
 *   1. Generate XLSX for the linked test suite
 *   2. Publish to ADO Test Plan (one plan per release, one suite per GRACE suite)
 *   3. Commit XLSX to ADO Git repo
 *   4. Mark suite as libraryStatus: "library"
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../_core/trpc";
import {
  getHitlQueue, getHitlItemById, updateHitlItem, appendAuditLog,
  getTestSuiteById, updateTestSuite, getConditionsBySuite,
} from "../db";
import { recordPositive, recordCorrection } from "../grace/learning-recorder";
import { getDb } from "../db";
import {
  graceAdoConnections, graceReleases,
} from "../../drizzle/schema";
import { generatePfaamRegressionXlsx } from "../grace/xls-generator";
import { storagePut } from "../storage";
import {
  publishSuiteToAdoTestPlan,
  loadAdoConnectionCredentials,
} from "../grace/ado-test-plan-publisher";
import { publishXlsxToAdoGit } from "../grace/ado-git-publisher";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Look up the ADO connection for a suite:
 *   1. Try to find a release whose releaseName appears in the work item description
 *      and use that release's adoConnectionId.
 *   2. Fall back to the default ADO connection (isDefault = 1).
 *   3. Return null if no connection is configured.
 */
async function resolveAdoConnection(suiteId: number) {
  const db = await getDb();
  if (!db) return null;

  // Get the suite → work item
  const suite = await getTestSuiteById(suiteId);
  if (!suite) return null;

  // Try to find a release that owns this work item's adoProject/platform
  // (work items store "Release: <name>" in their description)
  const releases = await db
    .select()
    .from(graceReleases)
    .where(eq(graceReleases.status, "confirmed"))
    .orderBy(graceReleases.createdAt);

  // Pick the most recent release that has an ADO connection
  const releaseWithConn = releases
    .filter((r) => r.adoConnectionId !== null)
    .at(-1);

  const connectionId = releaseWithConn?.adoConnectionId ?? null;
  const releaseName = releaseWithConn?.releaseName ?? suite.name;

  if (connectionId) {
    const conns = await db
      .select()
      .from(graceAdoConnections)
      .where(eq(graceAdoConnections.id, connectionId))
      .limit(1);
    if (conns[0]) return { conn: conns[0], releaseName };
  }

  // Fall back to default connection
  const defaults = await db
    .select()
    .from(graceAdoConnections)
    .where(eq(graceAdoConnections.isDefault, 1))
    .limit(1);

  if (defaults[0]) return { conn: defaults[0], releaseName };

  return null;
}

/**
 * Run the full post-approval pipeline for a test suite.
 * All steps are non-blocking — failures are logged but do not block the approval.
 */
async function runPostApprovalPipeline(
  suiteId: number,
  actor: string,
): Promise<void> {
  const suite = await getTestSuiteById(suiteId);
  if (!suite) return;

  const conditions = await getConditionsBySuite(suiteId);
  if (conditions.length === 0) return;

  // 1. Generate XLSX buffer
  const rows = conditions.map((c, idx) => ({
    sequence: idx + 1,
    condition_type: c.testType ?? "functional",
    title: c.title,
    steps_json: c.steps ?? [],
    expected_result: c.expectedResult ?? "",
    depends_on: Array.isArray(c.dependsOn) ? (c.dependsOn as number[]).join(",") : "",
    execution_group: String(c.executionGroup ?? ""),
    role_required: c.userRole ?? "",
    browser_target: c.browserTarget ?? "chromium",
  }));

  const { buffer: xlsxBuffer } = generatePfaamRegressionXlsx(rows, {
    sheetName: "Database Data",
    collection: suite.name.slice(0, 20),
  });

  // Upload XLSX to S3 and save URL on the suite
  try {
    const fileKey = `grace-xls/${suite.id}-approved-${Date.now()}.xlsx`;
    const { url } = await storagePut(
      fileKey,
      xlsxBuffer,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    await updateTestSuite(suiteId, { xlsFilePath: url });
  } catch (err) {
    console.warn(`[GRACE] XLSX upload failed for suite ${suiteId}:`, err);
  }

  // 2. Resolve ADO connection
  const adoCtx = await resolveAdoConnection(suiteId);

  if (adoCtx) {
    const { conn, releaseName } = adoCtx;

    let creds: { adoOrgUrl: string; adoProject: string; pat: string } | null = null;
    try {
      creds = await loadAdoConnectionCredentials(conn);
    } catch (err) {
      console.warn(`[GRACE] Could not decrypt ADO credentials for suite ${suiteId}:`, err);
    }

    if (creds) {
      // 2a. Publish to ADO Test Plan
      try {
        const planResult = await publishSuiteToAdoTestPlan({
          adoOrgUrl: creds.adoOrgUrl,
          adoProject: creds.adoProject,
          pat: creds.pat,
          releaseName,
          suiteName: suite.name,
          conditions: conditions.map((c) => ({
            conditionNumber: c.conditionNumber,
            title: c.title,
            testType: c.testType,
            preconditions: c.preconditions ?? null,
            expectedResult: c.expectedResult ?? null,
            steps: Array.isArray(c.steps)
              ? (c.steps as Array<{ stepNumber: number; action: string; expectedResult: string }>)
              : [],
          })),
        });

        if (planResult.success) {
          await updateTestSuite(suiteId, {
            adoTestPlanId: planResult.testPlanId ?? null,
            adoTestSuiteId: planResult.testSuiteId ?? null,
            adoPublishedAt: new Date(),
            adoPublishedBy: actor,
          });
          await appendAuditLog({
            actor,
            action: "generation",
            entityType: "test_suite",
            entityId: suiteId,
            payload: {
              event: "ado_test_plan_published",
              testPlanId: planResult.testPlanId,
              testSuiteId: planResult.testSuiteId,
              testCaseCount: planResult.testCaseIds?.length ?? 0,
            },
            result: "success",
          });
        } else {
          console.warn(`[GRACE] ADO Test Plan publish failed for suite ${suiteId}:`, planResult.error);
          await appendAuditLog({
            actor,
            action: "generation",
            entityType: "test_suite",
            entityId: suiteId,
            payload: { event: "ado_test_plan_publish_failed", error: planResult.error },
            result: "failure",
            errorDetail: planResult.error,
          });
        }
      } catch (err) {
        console.warn(`[GRACE] ADO Test Plan publish threw for suite ${suiteId}:`, err);
      }

      // 2b. Commit XLSX to ADO Git
      try {
        const gitResult = await publishXlsxToAdoGit({
          adoOrgUrl: creds.adoOrgUrl,
          adoProject: creds.adoProject,
          pat: creds.pat,
          releaseName,
          xlsxBuffer,
          strategy: "main",
          commitMessage: `[GRACE] Approved regression suite: ${suite.name}`,
        });

        if (gitResult.success) {
          await updateTestSuite(suiteId, {
            gitCommitSha: gitResult.commitSha ?? null,
            gitBranch: gitResult.branch ?? null,
            gitPrUrl: gitResult.prUrl ?? null,
            gitCommittedAt: new Date(),
          });
          await appendAuditLog({
            actor,
            action: "generation",
            entityType: "test_suite",
            entityId: suiteId,
            payload: {
              event: "git_xlsx_committed",
              commitSha: gitResult.commitSha,
              branch: gitResult.branch,
              filePath: gitResult.filePath,
              prUrl: gitResult.prUrl,
            },
            result: "success",
          });
        } else {
          console.warn(`[GRACE] ADO Git commit failed for suite ${suiteId}:`, gitResult.error);
          await appendAuditLog({
            actor,
            action: "generation",
            entityType: "test_suite",
            entityId: suiteId,
            payload: { event: "git_xlsx_commit_failed", error: gitResult.error },
            result: "failure",
            errorDetail: gitResult.error,
          });
        }
      } catch (err) {
        console.warn(`[GRACE] ADO Git commit threw for suite ${suiteId}:`, err);
      }
    }
  } else {
    console.info(`[GRACE] No ADO connection found for suite ${suiteId} — skipping ADO publish and Git commit.`);
  }

  // 3. Mark suite as library (version 1 if first approval)
  try {
    const currentSuite = await getTestSuiteById(suiteId);
    const isFirstApproval = currentSuite?.libraryStatus !== "library";
    await updateTestSuite(suiteId, {
      libraryStatus: "library",
      libraryVersion: isFirstApproval ? 1 : (currentSuite?.libraryVersion ?? 1),
    });
  } catch (err) {
    console.warn(`[GRACE] Library status update failed for suite ${suiteId}:`, err);
  }
}

export const graceHitlRouter = router({
  /** List HITL queue, optionally filtered by status */
  list: protectedProcedure
    .input(z.object({
      status: z.enum(["open", "in_review", "approved", "rejected", "modified", "escalated", "all"]).optional().default("open"),
    }))
    .query(async ({ input }) => {
      const status = input.status === "all" ? undefined : input.status;
      return getHitlQueue(status);
    }),

  /** Get a single HITL item by ID */
  byId: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getHitlItemById(input.id);
    }),

  /** Approve a HITL item — records positive example and triggers post-approval pipeline */
  approve: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      reviewNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await getHitlItemById(input.id);
      if (!item) throw new Error("HITL item not found");

      const actor = ctx.user?.email ?? "unknown";

      await updateHitlItem(input.id, {
        status: "approved",
        reviewedBy: actor,
        reviewedAt: new Date(),
        reviewNotes: input.reviewNotes ?? null,
      });

      // Record positive learning example
      await recordPositive({
        content: item.description ?? item.title,
        hitlItemId: item.id,
        conditionId: item.relatedEntityType === "test_condition" ? item.relatedEntityId ?? undefined : undefined,
        applicationName: (item.payload as Record<string, string> | null)?.applicationName,
      });

      await appendAuditLog({
        actor,
        action: "hitl_decision",
        entityType: "hitl_item",
        entityId: input.id,
        payload: { decision: "approved", notes: input.reviewNotes },
        result: "success",
      });

      // ── Post-approval pipeline (scope_review items linked to a test suite) ──
      if (
        item.itemType === "scope_review" &&
        item.relatedEntityType === "test_suite" &&
        item.relatedEntityId !== null
      ) {
        const suiteId = item.relatedEntityId;

        // Update suite status to approved first
        await updateTestSuite(suiteId, { status: "approved" });

        // Run the pipeline asynchronously (non-blocking)
        runPostApprovalPipeline(suiteId, actor).catch((err) => {
          console.error(`[GRACE] Post-approval pipeline error for suite ${suiteId}:`, err);
        });
      }

      return { success: true };
    }),

  /** Reject a HITL item */
  reject: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      reviewNotes: z.string().min(1, "Rejection reason is required"),
    }))
    .mutation(async ({ ctx, input }) => {
      await updateHitlItem(input.id, {
        status: "rejected",
        reviewedBy: ctx.user?.email ?? "unknown",
        reviewedAt: new Date(),
        reviewNotes: input.reviewNotes,
      });

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "hitl_decision",
        entityType: "hitl_item",
        entityId: input.id,
        payload: { decision: "rejected", notes: input.reviewNotes },
        result: "success",
      });

      return { success: true };
    }),

  /** Modify a HITL item — records correction in knowledge store */
  modify: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      modifiedPayload: z.record(z.string(), z.unknown()),
      reviewNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await getHitlItemById(input.id);
      if (!item) throw new Error("HITL item not found");

      await updateHitlItem(input.id, {
        status: "modified",
        reviewedBy: ctx.user?.email ?? "unknown",
        reviewedAt: new Date(),
        reviewNotes: input.reviewNotes ?? null,
        modifiedPayload: input.modifiedPayload,
      });

      // Record correction learning example
      const originalContent = item.description ?? item.title;
      const correctedContent = JSON.stringify(input.modifiedPayload);
      await recordCorrection({
        original: originalContent,
        corrected: correctedContent,
        hitlItemId: item.id,
        conditionId: item.relatedEntityType === "test_condition" ? item.relatedEntityId ?? undefined : undefined,
      });

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "hitl_decision",
        entityType: "hitl_item",
        entityId: input.id,
        payload: { decision: "modified", modifiedPayload: input.modifiedPayload },
        result: "success",
      });

      return { success: true };
    }),

  /** Escalate a HITL item to a higher priority */
  escalate: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      reason: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const item = await getHitlItemById(input.id);
      if (!item) throw new Error("HITL item not found");
      void item; // used for priority access below

      await updateHitlItem(input.id, {
        status: "escalated",
        priority: Math.max(1, item.priority - 1), // bump priority up
        reviewNotes: `Escalated: ${input.reason}`,
      });

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "hitl_decision",
        entityType: "hitl_item",
        entityId: input.id,
        payload: { decision: "escalated", reason: input.reason },
        result: "success",
      });

      return { success: true };
    }),

  /** Get HITL queue summary counts by status */
  summary: protectedProcedure.query(async () => {
    const [open, inReview, escalated] = await Promise.all([
      getHitlQueue("open"),
      getHitlQueue("in_review"),
      getHitlQueue("escalated"),
    ]);
    return {
      open: open.length,
      inReview: inReview.length,
      escalated: escalated.length,
      total: open.length + inReview.length + escalated.length,
    };
  }),
});
