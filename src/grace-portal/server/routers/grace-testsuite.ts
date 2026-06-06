/**
 * GRACE Test Suite Router — CSC-GRACE-AI v1
 * Handles test suite creation, condition generation, approval workflow, and XLS export.
 */

import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, protectedProcedure } from "../_core/trpc";
import {
  createTestSuite, getTestSuites, getTestSuiteById, updateTestSuite,
  createTestCondition, getConditionsBySuite, updateCondition,
  createHitlItem, appendAuditLog, getWorkItemById, getDb,
} from "../db";
import { decomposeToAtomicRequirements, generateConditionsForRequirement } from "../grace/atomic-decomposer";
import { evaluate as evaluateConfidence } from "../grace/confidence-gate";
import { buildSchedule } from "../grace/dag-scheduler";
import { generateTestScriptXlsx, generatePfaamRegressionXlsx, formatSteps, formatTestData } from "../grace/xls-generator";
import { storagePut } from "../storage";
import { graceTestSuites, graceAdoConnections } from "../../drizzle/schema";
import { publishXlsxToAdoGit } from "../grace/ado-git-publisher";
import { eq as drizzleEq } from "drizzle-orm";

export const graceTestSuiteRouter = router({
  /** List all test suites, optionally filtered by work item */
  list: protectedProcedure
    .input(z.object({ workItemId: z.number().int().positive().optional() }))
    .query(async ({ input }) => {
      return getTestSuites(input.workItemId);
    }),

  /** Get a single test suite with its conditions */
  byId: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const suite = await getTestSuiteById(input.id);
      if (!suite) return null;
      const conditions = await getConditionsBySuite(input.id);
      return { ...suite, conditions };
    }),

  /** Create a new test suite and generate conditions via LLM */
  generate: protectedProcedure
    .input(z.object({
      workItemId: z.number().int().positive(),
      applicationName: z.string().min(1),
      environment: z.enum(["DEV", "IST", "UAT", "STAGE", "PROD"]).default("IST"),
      browserMatrix: z.array(z.string()).default(["chrome", "edge"]),
      userRole: z.string().default("authenticated user"),
      ownedBy: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const workItem = await getWorkItemById(input.workItemId);
      if (!workItem) throw new Error("Work item not found");
      if (workItem.status !== "ready") {
        throw new Error(`Work item status is '${workItem.status}'; must be 'ready' before generating a test suite`);
      }

      // Create the suite record
      await createTestSuite({
        workItemId: input.workItemId,
        name: `Test Suite — ${workItem.title}`,
        description: `Auto-generated from ADO ${workItem.adoId}`,
        applicationName: input.applicationName,
        environment: input.environment,
        browserMatrix: input.browserMatrix,
        status: "draft",
        ownedBy: input.ownedBy ?? ctx.user?.email ?? null,
      });

      // Get the newly created suite
      const suites = await getTestSuites(input.workItemId);
      const suite = suites[0];
      if (!suite) throw new Error("Failed to create test suite");

      // Decompose AC into atomic requirements
      const atomicReqs = await decomposeToAtomicRequirements(
        workItem.title,
        workItem.acceptanceCriteria ?? workItem.description ?? workItem.title
      );

      let conditionNumber = 1;
      let lowConfidenceCount = 0;

      for (const req of atomicReqs) {
        const conditions = await generateConditionsForRequirement(req, input.applicationName, input.userRole);
        for (const cond of conditions) {
          const gate = evaluateConfidence(cond.confidenceScore);
          await createTestCondition({
            suiteId: suite.id,
            conditionNumber,
            testType: cond.testType,
            title: cond.title,
            preconditions: cond.preconditions,
            steps: cond.steps,
            expectedResult: cond.expectedResult,
            testData: cond.testData,
            userRole: cond.userRole,
            browserTarget: input.browserMatrix[0] ?? "chrome",
            dependsOn: [],
            executionGroup: 1,
            confidenceScore: cond.confidenceScore.toString(),
            status: "pending",
          });
          conditionNumber++;
          if (!gate.passes) lowConfidenceCount++;
        }
      }

      // If any low-confidence conditions, create a HITL item
      if (lowConfidenceCount > 0) {
        await createHitlItem({
          itemType: "low_confidence_condition",
          priority: 2,
          title: `${lowConfidenceCount} low-confidence condition(s) in suite: ${suite.name}`,
          description: `${lowConfidenceCount} of ${conditionNumber - 1} conditions have confidence below threshold`,
          relatedEntityType: "test_suite",
          relatedEntityId: suite.id,
          payload: { suiteId: suite.id, lowConfidenceCount, totalConditions: conditionNumber - 1 },
          suggestedAction: "Review and approve or modify flagged conditions",
          slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
      }

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "generation",
        entityType: "test_suite",
        entityId: suite.id,
        payload: { conditionsGenerated: conditionNumber - 1, lowConfidenceCount },
        result: "success",
      });

      return { suiteId: suite.id, conditionsGenerated: conditionNumber - 1, lowConfidenceCount };
    }),

  /** Update suite status (approve/reject) */
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["draft", "pending_review", "approved", "rejected", "executing", "completed", "archived"]),
      rejectionReason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await updateTestSuite(input.id, {
        status: input.status,
        rejectionReason: input.rejectionReason ?? null,
      });
      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "scope_approval",
        entityType: "test_suite",
        entityId: input.id,
        payload: { status: input.status, rejectionReason: input.rejectionReason },
        result: "success",
      });
      return { success: true };
    }),

  /** Build and return the DAG execution schedule for a suite */
  schedule: protectedProcedure
    .input(z.object({ suiteId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const conditions = await getConditionsBySuite(input.suiteId);
      const nodes = conditions.map((c) => ({
        id: c.id,
        dependsOn: (c.dependsOn as number[]) ?? [],
      }));
      return buildSchedule(nodes);
    }),

  /** Export a test suite to XLS format and return the download URL */
  exportXls: protectedProcedure
    .input(z.object({ suiteId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const suite = await getTestSuiteById(input.suiteId);
      if (!suite) throw new Error("Suite not found");
      const conditions = await getConditionsBySuite(input.suiteId);

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

      // Generate PFAAM regression format (14-column Database Data layout)
      const { buffer } = generatePfaamRegressionXlsx(rows, {
        sheetName: "Database Data",
        collection: suite.name.slice(0, 20),
      });
      const fileKey = `grace-xls/${suite.id}-${Date.now()}.xlsx`;
      const { url } = await storagePut(fileKey, buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      await updateTestSuite(input.suiteId, { xlsFilePath: url });
      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "generation",
        entityType: "test_suite",
        entityId: input.suiteId,
        payload: { exportUrl: url },
        result: "success",
      });

      return { url };
    }),

  /** Manually publish an approved suite XLSX to ADO Git with branch strategy choice */
  publishToGit: protectedProcedure
    .input(z.object({
      suiteId: z.number().int().positive(),
      gitStrategy: z.enum(["main", "branch"]).default("main"),
      adoConnectionId: z.number().int().positive().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const suite = await getTestSuiteById(input.suiteId);
      if (!suite) throw new Error("Suite not found");

      // Resolve ADO connection
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      let connId = input.adoConnectionId;
      if (!connId) {
        const [defaultConn] = await db
          .select({ id: graceAdoConnections.id })
          .from(graceAdoConnections)
          .where(drizzleEq(graceAdoConnections.isDefault, 1))
          .limit(1);
        connId = defaultConn?.id;
      }
      if (!connId) throw new Error("No ADO connection configured — add one in Settings");

      const [conn] = await db
        .select()
        .from(graceAdoConnections)
        .where(drizzleEq(graceAdoConnections.id, connId))
        .limit(1);
      if (!conn) throw new Error("ADO connection not found");

      // Re-generate XLSX
      const conditions = await getConditionsBySuite(input.suiteId);
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
      const { buffer } = generatePfaamRegressionXlsx(rows, {
        sheetName: "Database Data",
        collection: suite.name.slice(0, 20),
      });

      // Decrypt PAT (stored as base64 in adoPatEncrypted)
      const pat = conn.adoPatEncrypted
        ? Buffer.from(conn.adoPatEncrypted, "base64").toString("utf8")
        : "";

      // Publish to Git
      const gitResult = await publishXlsxToAdoGit({
        adoOrgUrl: conn.adoOrgUrl,
        pat,
        adoProject: conn.adoProject,
        repoName: conn.adoProject,
        releaseName: suite.name,
        xlsxBuffer: Buffer.from(buffer),
        strategy: input.gitStrategy,
      });

      // Persist result
      await updateTestSuite(input.suiteId, {
        gitCommitSha: gitResult.commitSha,
        gitBranch: gitResult.branch,
        gitPrUrl: gitResult.prUrl ?? null,
        gitCommittedAt: new Date(),
      });

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "generation",
        entityType: "test_suite",
        entityId: input.suiteId,
        payload: { type: "git_publish", strategy: input.gitStrategy, branch: gitResult.branch, commitSha: gitResult.commitSha, prUrl: gitResult.prUrl },
        result: "success",
      });

      return {
        commitSha: gitResult.commitSha,
        branch: gitResult.branch,
        prUrl: gitResult.prUrl ?? null,
      };
    }),

  /** List all library suites (libraryStatus = 'library') with version history */
  listLibrary: protectedProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];
      const suites = await db
        .select()
        .from(graceTestSuites)
        .where(eq(graceTestSuites.libraryStatus, "library"))
        .orderBy(graceTestSuites.updatedAt);
      // For each suite, also fetch its version history (suites with same parentSuiteId chain)
      const result = await Promise.all(
        suites.map(async (suite) => {
          // Find all versions of this suite (suites that share the same root)
          const rootId = suite.parentSuiteId ?? suite.id;
          const versions = await db
            .select({
              id: graceTestSuites.id,
              libraryVersion: graceTestSuites.libraryVersion,
              status: graceTestSuites.status,
              createdAt: graceTestSuites.createdAt,
              adoPublishedAt: graceTestSuites.adoPublishedAt,
              gitCommitSha: graceTestSuites.gitCommitSha,
              gitBranch: graceTestSuites.gitBranch,
              gitPrUrl: graceTestSuites.gitPrUrl,
            })
            .from(graceTestSuites)
            .where(eq(graceTestSuites.parentSuiteId, rootId));
          return { ...suite, versions };
        })
      );
      return result;
    }),

  /** Re-run a library suite: if no changes → re-run original; if changes → create new version */
  rerunFromLibrary: protectedProcedure
    .input(z.object({
      suiteId: z.number().int().positive(),
      /** If provided, create a new version with these overrides */
      newVersion: z.object({
        applicationName: z.string().optional(),
        environment: z.enum(["DEV", "IST", "UAT", "STAGE", "PROD"]).optional(),
        browserMatrix: z.array(z.string()).optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const suite = await getTestSuiteById(input.suiteId);
      if (!suite) throw new Error("Suite not found");
      if (suite.libraryStatus !== "library") throw new Error("Suite is not in the library");

      if (!input.newVersion) {
        // No changes — re-export the original XLSX and return the URL
        const conditions = await getConditionsBySuite(input.suiteId);
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
        const { buffer } = generatePfaamRegressionXlsx(rows, {
          sheetName: "Database Data",
          collection: suite.name.slice(0, 20),
        });
        const fileKey = `grace-xls/${suite.id}-rerun-${Date.now()}.xlsx`;
        const { url } = await storagePut(fileKey, buffer, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        await appendAuditLog({
          actor: ctx.user?.email ?? "grace_agent",
          action: "generation",
          entityType: "test_suite",
          entityId: input.suiteId,
          payload: { event: "library_rerun_original", exportUrl: url },
          result: "success",
        });
        return { action: "rerun_original" as const, suiteId: input.suiteId, xlsUrl: url };
      }

      // Changes provided — create a new version suite
      const newSuiteData = {
        workItemId: suite.workItemId,
        name: suite.name,
        description: suite.description ?? undefined,
        applicationName: input.newVersion.applicationName ?? suite.applicationName ?? undefined,
        environment: (input.newVersion.environment ?? suite.environment) as "DEV" | "IST" | "UAT" | "STAGE" | "PROD",
        browserMatrix: input.newVersion.browserMatrix ?? (suite.browserMatrix as string[]) ?? ["chrome", "edge"],
        status: "pending_review" as const,
        ownedBy: suite.ownedBy ?? ctx.user?.email ?? undefined,
        parentSuiteId: suite.parentSuiteId ?? suite.id,
        libraryVersion: (suite.libraryVersion ?? 1) + 1,
        libraryStatus: "none" as const,
      };
      await createTestSuite(newSuiteData);
      const newSuites = await getTestSuites(suite.workItemId);
      const newSuite = newSuites[0];
      if (!newSuite) throw new Error("Failed to create new version suite");

      // Copy conditions from original suite
      const originalConditions = await getConditionsBySuite(input.suiteId);
      for (const cond of originalConditions) {
        await createTestCondition({
          suiteId: newSuite.id,
          conditionNumber: cond.conditionNumber,
          testType: cond.testType,
          title: cond.title,
          preconditions: cond.preconditions ?? undefined,
          steps: cond.steps ?? undefined,
          expectedResult: cond.expectedResult ?? undefined,
          testData: cond.testData ?? undefined,
          userRole: cond.userRole ?? undefined,
          browserTarget: input.newVersion.browserMatrix?.[0] ?? cond.browserTarget ?? "chrome",
          dependsOn: (cond.dependsOn as number[]) ?? [],
          executionGroup: cond.executionGroup ?? 1,
          confidenceScore: cond.confidenceScore ?? undefined,
          status: "pending",
        });
      }

      // Create HITL scope_review item for the new version
      await createHitlItem({
        itemType: "scope_review",
        priority: 2,
        title: `Library suite new version: ${newSuite.name} (v${newSuiteData.libraryVersion})`,
        description: `New version of library suite created for re-run with changed parameters`,
        relatedEntityType: "test_suite",
        relatedEntityId: newSuite.id,
        payload: { originalSuiteId: input.suiteId, newVersion: newSuiteData.libraryVersion },
        suggestedAction: "Review new version conditions and approve for execution",
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "generation",
        entityType: "test_suite",
        entityId: newSuite.id,
        payload: { event: "library_new_version", originalSuiteId: input.suiteId, version: newSuiteData.libraryVersion },
        result: "success",
      });

      return { action: "new_version" as const, suiteId: newSuite.id, version: newSuiteData.libraryVersion };
    }),

  /** Update a single test condition */
  updateCondition: protectedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().optional(),
      preconditions: z.string().optional(),
      expectedResult: z.string().optional(),
      status: z.enum(["pending", "executing", "passed", "failed", "skipped", "blocked"]).optional(),
      confidenceScore: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await updateCondition(id, data);
      await appendAuditLog({
        actor: ctx.user?.email ?? "grace_agent",
        action: "generation",
        entityType: "test_condition",
        entityId: id,
        payload: data,
        result: "success",
      });
      return { success: true };
    }),
});
