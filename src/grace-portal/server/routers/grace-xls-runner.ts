/**
 * grace-xls-runner router — CSC-GRACE-AI v1.2
 *
 * Full XLS-driven test execution pipeline:
 *   1. importXls    — parse uploaded PFAAM regression XLS → DB tables
 *   2. listRuns     — list all XLS runs for the current user
 *   3. getRun       — get a single run with all test cases
 *   4. getTestCaseSteps — get all steps for a test case
 *   5. startRun     — queue a run for execution
 *   6. pollRun      — poll run status and recent step results
 *   7. exportResults — regenerate XLS with results, upload to S3
 *   8. publishToAdo  — create ADO test run and publish results
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and } from "drizzle-orm";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import {
  graceXlsRuns,
  graceXlsTestCases,
  graceXlsSteps,
  graceAdoConnections,
  type InsertGraceXlsRun,
  type InsertGraceXlsTestCase,
  type InsertGraceXlsStep,
} from "../../drizzle/schema";
import { parseRegressionXls, type ParsedXlsResult } from "../grace/xls-importer";
import { generatePfaamRegressionXlsx } from "../grace/xls-generator";
import { storagePut } from "../storage";
import { invokeLLM } from "../_core/llm";
import { createHitlItem, appendAuditLog } from "../db";

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  return db;
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export const graceXlsRunnerRouter = router({

  /** Parse and import an XLS file into the database */
  importXls: protectedProcedure
    .input(z.object({
      filename: z.string().min(1).max(256),
      fileBase64: z.string().min(1),
      adoConnectionId: z.number().int().optional(),
      targetEnvironment: z.enum(["DEV", "IST", "UAT", "STAGE", "PROD"]).default("IST"),
      targetBrowser: z.enum(["chromium", "firefox", "webkit", "chrome", "edge"]).default("chromium"),
      targetBaseUrl: z.string().url().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      const buf = Buffer.from(input.fileBase64, "base64");

      // Upload original XLSX to S3
      const xlsKey = `grace-xls-runs/${ctx.user.id}/${Date.now()}-${randomSuffix()}-${input.filename}`;
      const { url: s3Url } = await storagePut(xlsKey, buf, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      // Parse the XLSX
      let parsed: ParsedXlsResult;
      try {
        parsed = parseRegressionXls(buf);
      } catch (err) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Failed to parse XLS: ${err instanceof Error ? err.message : String(err)}`,
        });
      }

      const totalSteps = parsed.testCases.reduce((sum: number, tc) => sum + tc.steps.length, 0);

      // Create run record
      const runInsert: InsertGraceXlsRun = {
        fileName: input.filename,
        s3Key: xlsKey,
        s3Url,
        adoConnectionId: input.adoConnectionId ?? null,
        targetEnvironment: input.targetEnvironment,
        targetBrowser: input.targetBrowser,
        targetUrl: input.targetBaseUrl ?? null,
        status: "imported",
        totalTestCases: parsed.testCases.length,
        totalSteps,
        passedTestCases: 0,
        failedTestCases: 0,
        skippedTestCases: 0,
        createdByUserId: ctx.user.id,
        releaseVersion: parsed.releaseVersion ?? null,
      };

      const [runResult] = await db.insert(graceXlsRuns).values(runInsert);
      const runId = (runResult as { insertId: number }).insertId;

      // Insert test cases
      for (let caseIdx = 0; caseIdx < parsed.testCases.length; caseIdx++) {
        const tc = parsed.testCases[caseIdx];
        const caseInsert: InsertGraceXlsTestCase = {
          runId,
          testCaseName: tc.name,
          orderNumber: caseIdx + 1,
          scenarioSummary: parsed.testSet[0]?.scenarioSummary ?? null,
          totalSteps: tc.steps.length,
          status: "not_run",
        };
        const [caseResult] = await db.insert(graceXlsTestCases).values(caseInsert);
        const testCaseId = (caseResult as { insertId: number }).insertId;

        // Insert steps
        if (tc.steps.length > 0) {
          const stepInserts: InsertGraceXlsStep[] = tc.steps.map((step: import("../grace/xls-importer").ParsedTestStep) => ({
            testCaseId,
            runId,
            stepNum: step.stepNum,
            stepDescription: step.stepDescription ?? null,
            actionOnObject: step.actionOnObject,
            object: step.object ?? null,
            value: step.value ?? null,
            comments: step.comments ?? null,
            testStepType: step.testStepType ?? null,
            gotoStep: step.gotoStep ?? null,
            localAttempts: step.localAttempts ?? 1,
            localTimeout: step.localTimeout ?? 30,
            status: "not_run",
            actualResult: null,
            screenshotUrl: null,
            errorMessage: null,
            durationMs: null,
          }));
          await db.insert(graceXlsSteps).values(stepInserts);
        }
      }

      return {
        runId,
        filename: input.filename,
        totalCases: parsed.testCases.length,
        totalSteps,
        releaseLabel: parsed.releaseVersion,
        scenarioSummary: parsed.testSet[0]?.scenarioSummary ?? null,
        s3Url,
      };
    }),

  /** List all XLS runs for the current user, newest first */
  listRuns: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb(await getDb());
    return db
      .select()
      .from(graceXlsRuns)
      .where(eq(graceXlsRuns.createdByUserId, ctx.user.id))
      .orderBy(desc(graceXlsRuns.createdAt))
      .limit(50);
  }),

  /** Get a single run with all test cases */
  getRun: protectedProcedure
    .input(z.object({ runId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      const runs = await db
        .select()
        .from(graceXlsRuns)
        .where(and(eq(graceXlsRuns.id, input.runId), eq(graceXlsRuns.createdByUserId, ctx.user.id)))
        .limit(1);
      if (!runs[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });

      const testCases = await db
        .select()
        .from(graceXlsTestCases)
        .where(eq(graceXlsTestCases.runId, input.runId))
        .orderBy(graceXlsTestCases.orderNumber);

      return { run: runs[0], testCases };
    }),

  /** Get all steps for a specific test case */
  getTestCaseSteps: protectedProcedure
    .input(z.object({ testCaseId: z.number().int() }))
    .query(async ({ input }) => {
      const db = requireDb(await getDb());
      return db
        .select()
        .from(graceXlsSteps)
        .where(eq(graceXlsSteps.testCaseId, input.testCaseId))
        .orderBy(graceXlsSteps.stepNum);
    }),

  /** Queue a run for execution */
  startRun: protectedProcedure
    .input(z.object({
      runId: z.number().int(),
      targetBrowser: z.enum(["chromium", "firefox", "webkit", "chrome", "edge"]).optional(),
      targetEnvironment: z.enum(["DEV", "IST", "UAT", "STAGE", "PROD"]).optional(),
      targetBaseUrl: z.string().url().optional(),
      adoConnectionId: z.number().int().optional(),
      simulationMode: z.boolean().default(false),
      /** Where the test should execute: on the GRACE server or a registered remote PC agent */
      executionTarget: z.enum(["server", "remote_pc"]).default("server"),
      /** Required when executionTarget is remote_pc — the registered desktop agent id */
      desktopAgentId: z.number().int().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());

      const runs = await db
        .select()
        .from(graceXlsRuns)
        .where(and(eq(graceXlsRuns.id, input.runId), eq(graceXlsRuns.createdByUserId, ctx.user.id)))
        .limit(1);
      if (!runs[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });

      const patch: Partial<InsertGraceXlsRun> = {
        status: "queued",
        startedAt: new Date(),
      };
      if (input.targetBrowser) patch.targetBrowser = input.targetBrowser;
      if (input.targetEnvironment) patch.targetEnvironment = input.targetEnvironment;
      if (input.targetBaseUrl) patch.targetUrl = input.targetBaseUrl;
      if (input.adoConnectionId) patch.adoConnectionId = input.adoConnectionId;

      await db.update(graceXlsRuns).set(patch).where(eq(graceXlsRuns.id, input.runId));

      if (input.simulationMode) {
        simulateExecution(input.runId).catch(console.error);
      }

      return { runId: input.runId, status: "queued" };
    }),

  /** Poll run status and recent step results */
  pollRun: protectedProcedure
    .input(z.object({ runId: z.number().int() }))
    .query(async ({ input, ctx }) => {
      const db = requireDb(await getDb());
      const runs = await db
        .select()
        .from(graceXlsRuns)
        .where(and(eq(graceXlsRuns.id, input.runId), eq(graceXlsRuns.createdByUserId, ctx.user.id)))
        .limit(1);
      if (!runs[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });

      const testCases = await db
        .select()
        .from(graceXlsTestCases)
        .where(eq(graceXlsTestCases.runId, input.runId))
        .orderBy(graceXlsTestCases.orderNumber);

      const recentSteps = await db
        .select()
        .from(graceXlsSteps)
        .where(eq(graceXlsSteps.runId, input.runId))
        .orderBy(desc(graceXlsSteps.executedAt))
        .limit(20);

      return { run: runs[0], testCases, recentSteps };
    }),

  /** Regenerate XLS with results and upload to S3 */
  exportResults: protectedProcedure
    .input(z.object({ runId: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());

      const runs = await db
        .select()
        .from(graceXlsRuns)
        .where(and(eq(graceXlsRuns.id, input.runId), eq(graceXlsRuns.createdByUserId, ctx.user.id)))
        .limit(1);
      if (!runs[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });
      const run = runs[0];

      const testCases = await db
        .select()
        .from(graceXlsTestCases)
        .where(eq(graceXlsTestCases.runId, input.runId))
        .orderBy(graceXlsTestCases.orderNumber);

      const allSteps = await db
        .select()
        .from(graceXlsSteps)
        .where(eq(graceXlsSteps.runId, input.runId))
        .orderBy(graceXlsSteps.stepNum);

      const resultsData = testCases.map(tc => ({
        testCaseName: tc.testCaseName,
        status: tc.status,
        steps: allSteps
          .filter(s => s.testCaseId === tc.id)
          .map(s => ({
            stepNum: s.stepNum,
            actionOnObject: s.actionOnObject,
            object: s.object ?? "",
            value: s.value ?? "",
            comments: s.comments ?? "",
            testStepDescription: s.stepDescription ?? "",
            status: s.status,
            actualResult: s.actualResult ?? "",
            errorMessage: s.errorMessage ?? "",
            durationMs: s.durationMs ?? 0,
          })),
      }));

      // Build PFAAM-format conditions from stored steps
      // Each test case becomes a condition; its DB steps map 1:1 to PFAAM rows
      const pfaamConditions = resultsData.map(tc => ({
        title: tc.testCaseName,
        expected_result: tc.status,
        steps_json: tc.steps.map(s => ({
          action_type: s.actionOnObject,
          target: s.object,
          value: s.value,
          expected: s.actualResult || s.testStepDescription,
          stepNumber: s.stepNum,
        })),
      }));
      const { buffer: xlsBuf } = generatePfaamRegressionXlsx(pfaamConditions, {
        sheetName: "Database Data",
        release: run.releaseVersion ?? "",
      });

      const resultKey = `grace-xls-results/${ctx.user.id}/${run.id}-results-${randomSuffix()}.xlsx`;
      const { url: resultsS3Url } = await storagePut(
        resultKey,
        xlsBuf,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await db.update(graceXlsRuns)
        .set({ resultsS3Key: resultKey, resultsS3Url })
        .where(eq(graceXlsRuns.id, input.runId));

      return { resultsS3Url };
    }),

  /** Publish results to Azure DevOps Test Management */
  publishToAdo: protectedProcedure
    .input(z.object({
      runId: z.number().int(),
      adoConnectionId: z.number().int(),
      adoTestPlanId: z.number().int().optional(),
      runName: z.string().max(256).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = requireDb(await getDb());

      const runs = await db
        .select()
        .from(graceXlsRuns)
        .where(and(eq(graceXlsRuns.id, input.runId), eq(graceXlsRuns.createdByUserId, ctx.user.id)))
        .limit(1);
      if (!runs[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Run not found" });
      const run = runs[0];

      const conns = await db
        .select()
        .from(graceAdoConnections)
        .where(eq(graceAdoConnections.id, input.adoConnectionId))
        .limit(1);
      if (!conns[0]) throw new TRPCError({ code: "NOT_FOUND", message: "ADO connection not found" });
      const conn = conns[0];
      if (!conn.adoPatEncrypted) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "ADO connection has no PAT configured" });
      }

      const { decrypt } = await import("../grace/settings-crypto");
      const pat = decrypt(conn.adoPatEncrypted);
      const token = Buffer.from(`:${pat}`).toString("base64");
      const authHeader = `Basic ${token}`;
      const baseUrl = conn.adoOrgUrl.replace(/\/$/, "");
      const project = encodeURIComponent(conn.adoProject);

      const testCases = await db
        .select()
        .from(graceXlsTestCases)
        .where(eq(graceXlsTestCases.runId, input.runId))
        .orderBy(graceXlsTestCases.orderNumber);

      const runName = input.runName ?? `GRACE — ${run.fileName} — ${run.targetEnvironment ?? "IST"} — ${new Date().toISOString().slice(0, 10)}`;

      const createRunRes = await fetch(
        `${baseUrl}/${project}/_apis/test/runs?api-version=7.1`,
        {
          method: "POST",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: runName,
            isAutomated: true,
            state: "InProgress",
            ...(input.adoTestPlanId ? { plan: { id: input.adoTestPlanId } } : {}),
          }),
          signal: AbortSignal.timeout(15000),
        }
      );

      if (!createRunRes.ok) {
        const errText = await createRunRes.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `ADO create run failed: HTTP ${createRunRes.status} — ${errText.slice(0, 200)}`,
        });
      }

      const adoRun = await createRunRes.json() as { id: number; url: string };
      const adoRunId = adoRun.id;

      const results = testCases.map(tc => ({
        testCaseTitle: tc.testCaseName,
        outcome: tc.status === "passed" ? "Passed" : tc.status === "failed" ? "Failed" : "NotExecuted",
        state: "Completed",
        comment: `GRACE automated execution — ${tc.totalSteps} steps`,
      }));

      const publishRes = await fetch(
        `${baseUrl}/${project}/_apis/test/runs/${adoRunId}/results?api-version=7.1`,
        {
          method: "POST",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
          body: JSON.stringify(results),
          signal: AbortSignal.timeout(30000),
        }
      );

      if (!publishRes.ok) {
        const errText = await publishRes.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `ADO publish results failed: HTTP ${publishRes.status} — ${errText.slice(0, 200)}`,
        });
      }

      await fetch(
        `${baseUrl}/${project}/_apis/test/runs/${adoRunId}?api-version=7.1`,
        {
          method: "PATCH",
          headers: { Authorization: authHeader, "Content-Type": "application/json" },
          body: JSON.stringify({ state: "Completed" }),
          signal: AbortSignal.timeout(10000),
        }
      );

      await db.update(graceXlsRuns)
        .set({ adoTestRunId: String(adoRunId), adoTestRunUrl: adoRun.url })
        .where(eq(graceXlsRuns.id, input.runId));

      return {
        adoRunId,
        adoRunUrl: adoRun.url,
        publishedCases: results.length,
        passedCases: results.filter(r => r.outcome === "Passed").length,
        failedCases: results.filter(r => r.outcome === "Failed").length,
      };
    }),

  /**
   * analyzeLocatorFailure — LLM-assisted failure recovery
   *
   * Called when ALL locators in a step's locator chain have failed.
   * The LLM analyses the failure context (step purpose, all tried locators,
   * error messages, page URL, and optional screenshot) and determines whether:
   *   A) A locator update is needed (DOM changed, suggest new locator)
   *   B) The step/workflow needs redesign (requirement changed)
   *   C) A defect should be logged (application bug)
   *
   * The LLM decision is ALWAYS routed to the HITL queue for human confirmation
   * regardless of the LLM's confidence level. The HITL reviewer can:
   *   - Approve the LLM's suggested fix (locator update or step redesign)
   *   - Override and log a defect instead
   *   - Reject the LLM's analysis and provide their own resolution
   */
  analyzeLocatorFailure: protectedProcedure
    .input(z.object({
      stepId: z.number().int(),
      runId: z.number().int(),
      testCaseId: z.number().int(),
      stepNum: z.number().int(),
      action: z.string(),
      stepDescription: z.string(),
      /** All locators that were tried, in order */
      triedLocators: z.array(z.object({
        raw: z.string(),
        strategy: z.string(),
        strategyLabel: z.string(),
        errorMessage: z.string().optional(),
      })),
      /** The expected outcome of the step */
      expectedOutcome: z.string().optional(),
      /** Current page URL at time of failure */
      pageUrl: z.string().optional(),
      /** Optional screenshot URL (S3) captured at time of failure */
      screenshotUrl: z.string().optional(),
      /** The test case name for context */
      testCaseName: z.string().optional(),
      /** The overall test condition title for context */
      conditionTitle: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Build the LLM analysis prompt
      const locatorSummary = input.triedLocators
        .map((l, i) => `  ${i + 1}. ${l.strategyLabel}: \`${l.raw}\`${l.errorMessage ? ` → Error: ${l.errorMessage}` : " → Element not found"}`)
        .join("\n");

      const analysisPrompt = `You are the GRACE Failure Analysis Engine. A test step has failed after exhausting all locators in its locator chain.

Analyse the failure and determine the most likely cause and recommended action.

## Failed Step Context
- Test Case: ${input.testCaseName ?? "Unknown"}
- Condition: ${input.conditionTitle ?? "Unknown"}
- Step ${input.stepNum}: ${input.action} — ${input.stepDescription}
- Expected Outcome: ${input.expectedOutcome ?? "Not specified"}
- Page URL at failure: ${input.pageUrl ?? "Unknown"}

## Locators Tried (all failed)
${locatorSummary}

## Analysis Instructions
Determine which of the following applies:

**A. DOM Change (Locator Update Needed)**
  The element likely exists but its locator has changed (e.g., HTML ID renamed, class changed, data-testid removed).
  Suggest 2-3 replacement locators in priority order (data-testid first, XPath last).

**B. Workflow/Step Redesign Needed**
  The element no longer exists or the UI flow has fundamentally changed.
  The test step or the entire condition needs to be redesigned.

**C. Application Defect**
  The element should be present based on the expected outcome but is missing.
  This indicates a bug in the application that should be logged as a defect.

Respond with ONLY a valid JSON object:
{
  "decision": "locator_update" | "step_redesign" | "defect",
  "confidence": "high" | "medium" | "low",
  "reasoning": "Brief explanation of why this decision was made (2-3 sentences)",
  "suggestedLocators": ["locator1", "locator2"] // Only for locator_update decision
  "suggestedStepChange": "Description of how the step should change" // Only for step_redesign
  "defectTitle": "Short defect title" // Only for defect decision
  "defectDescription": "Detailed defect description" // Only for defect decision
  "hitlInstructions": "Clear instructions for the HITL reviewer on what to verify and confirm"
}`;

      // Invoke LLM analysis
      let llmDecision: {
        decision: "locator_update" | "step_redesign" | "defect";
        confidence: "high" | "medium" | "low";
        reasoning: string;
        suggestedLocators?: string[];
        suggestedStepChange?: string;
        defectTitle?: string;
        defectDescription?: string;
        hitlInstructions: string;
      };

      try {
        const llmResponse = await invokeLLM({
          messages: [
            { role: "system", content: "You are the GRACE Failure Analysis Engine. Respond only with valid JSON." },
            { role: "user", content: analysisPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "failure_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  decision: { type: "string", enum: ["locator_update", "step_redesign", "defect"] },
                  confidence: { type: "string", enum: ["high", "medium", "low"] },
                  reasoning: { type: "string" },
                  suggestedLocators: { type: "array", items: { type: "string" } },
                  suggestedStepChange: { type: "string" },
                  defectTitle: { type: "string" },
                  defectDescription: { type: "string" },
                  hitlInstructions: { type: "string" },
                },
                required: ["decision", "confidence", "reasoning", "hitlInstructions"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = llmResponse.choices?.[0]?.message?.content;
        llmDecision = typeof content === "string" ? JSON.parse(content) : content;
      } catch (err) {
        // LLM failed — create a fallback HITL item for manual review
        llmDecision = {
          decision: "locator_update",
          confidence: "low",
          reasoning: "LLM analysis failed. Manual review required.",
          hitlInstructions: "All locators for this step failed. Please inspect the current DOM and update the OBJECT column with valid locators.",
        };
      }

      // Build HITL item title and description based on LLM decision
      const decisionLabels = {
        locator_update: "Locator Update Required",
        step_redesign: "Step Redesign Required",
        defect: "Potential Application Defect",
      };

      const hitlTitle = `[${decisionLabels[llmDecision.decision]}] Step ${input.stepNum}: ${input.action} — ${input.stepDescription.slice(0, 100)}`;

      const hitlDescription = [
        `**Test Case:** ${input.testCaseName ?? "Unknown"}`,
        `**Step ${input.stepNum}:** ${input.action} — ${input.stepDescription}`,
        `**Page URL:** ${input.pageUrl ?? "Unknown"}`,
        ``,
        `**All Locators Tried (all failed):**`,
        ...input.triedLocators.map((l, i) => `${i + 1}. ${l.strategyLabel}: \`${l.raw}\` → ${l.errorMessage ?? "Element not found"}`),
        ``,
        `**LLM Analysis:**`,
        `Decision: **${decisionLabels[llmDecision.decision]}** (Confidence: ${llmDecision.confidence})`,
        `Reasoning: ${llmDecision.reasoning}`,
        llmDecision.suggestedLocators?.length
          ? `\n**Suggested Replacement Locators:**\n${llmDecision.suggestedLocators.map((l, i) => `${i + 1}. \`${l}\``).join("\n")}`
          : "",
        llmDecision.suggestedStepChange
          ? `\n**Suggested Step Change:**\n${llmDecision.suggestedStepChange}`
          : "",
        llmDecision.defectTitle
          ? `\n**Defect Title:** ${llmDecision.defectTitle}\n**Defect Description:** ${llmDecision.defectDescription}`
          : "",
        ``,
        `**HITL Instructions:**`,
        llmDecision.hitlInstructions,
        input.screenshotUrl ? `\n**Screenshot:** ${input.screenshotUrl}` : "",
      ].filter(Boolean).join("\n");

      // Create HITL item — ALWAYS route to human regardless of LLM confidence
      const hitlPriority = llmDecision.decision === "defect" ? 1
        : llmDecision.confidence === "low" ? 2
        : 3;

      await createHitlItem({
        itemType: llmDecision.decision === "defect" ? "defect_candidate" : "anomaly",
        priority: hitlPriority,
        title: hitlTitle,
        description: hitlDescription,
        relatedEntityType: "xls_step",
        relatedEntityId: input.stepId,
        payload: {
          stepId: input.stepId,
          runId: input.runId,
          testCaseId: input.testCaseId,
          stepNum: input.stepNum,
          action: input.action,
          triedLocators: input.triedLocators,
          pageUrl: input.pageUrl,
          screenshotUrl: input.screenshotUrl,
          llmDecision,
        },
        confidenceScore: llmDecision.confidence,
        suggestedAction: llmDecision.decision === "locator_update"
          ? `Update OBJECT column with: ${llmDecision.suggestedLocators?.join(" | ") ?? "(see description)"}`
          : llmDecision.decision === "step_redesign"
          ? `Redesign step: ${llmDecision.suggestedStepChange?.slice(0, 200) ?? "(see description)"}`
          : `Log defect: ${llmDecision.defectTitle ?? "(see description)"}`,
        ownedBy: ctx.user.email ?? ctx.user.name,
      });

      // Mark the step as failed with LLM analysis reference
      await db.update(graceXlsSteps)
        .set({
          status: "failed",
          errorMessage: `All ${input.triedLocators.length} locator(s) failed. LLM decision: ${decisionLabels[llmDecision.decision]} (${llmDecision.confidence} confidence). Routed to HITL queue.`,
          screenshotUrl: input.screenshotUrl ?? null,
        })
        .where(eq(graceXlsSteps.id, input.stepId));

      // Append audit log entry
      await appendAuditLog({
        actor: ctx.user.email ?? ctx.user.name ?? "system",
        action: "execution",
        entityType: "xls_step",
        entityId: input.stepId,
        result: "failure",
        errorDetail: `[Locator Failure] Step ${input.stepNum} locator chain exhausted (${input.triedLocators.length} tried). LLM decision: ${llmDecision.decision} (${llmDecision.confidence}). HITL item created.`,
        payload: { triedLocators: input.triedLocators, llmDecision },
      });

      return {
        decision: llmDecision.decision,
        confidence: llmDecision.confidence,
        reasoning: llmDecision.reasoning,
        suggestedLocators: llmDecision.suggestedLocators ?? [],
        suggestedStepChange: llmDecision.suggestedStepChange,
        defectTitle: llmDecision.defectTitle,
        hitlInstructions: llmDecision.hitlInstructions,
        hitlCreated: true,
      };
    }),
});

// ── Simulation executor ───────────────────────────────────────────────────────
async function simulateExecution(runId: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(graceXlsRuns)
    .set({ status: "running" })
    .where(eq(graceXlsRuns.id, runId));

  const testCases = await db
    .select()
    .from(graceXlsTestCases)
    .where(eq(graceXlsTestCases.runId, runId))
    .orderBy(graceXlsTestCases.orderNumber);

  let totalPassed = 0;
  let totalFailed = 0;

  for (const tc of testCases) {
    const steps = await db
      .select()
      .from(graceXlsSteps)
      .where(eq(graceXlsSteps.testCaseId, tc.id))
      .orderBy(graceXlsSteps.stepNum);

    let casePassed = 0;
    let caseFailed = 0;

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
      const passed = Math.random() > 0.1;
      const durationMs = Math.floor(200 + Math.random() * 800);

      await db.update(graceXlsSteps)
        .set({
          status: passed ? "passed" : "failed",
          durationMs,
          actualResult: passed
            ? `Completed in ${durationMs}ms`
            : `Assertion failed after ${durationMs}ms`,
          errorMessage: passed ? null : `Simulated: ${step.actionOnObject} on "${step.object ?? "target"}" failed`,
          executedAt: new Date(),
        })
        .where(eq(graceXlsSteps.id, step.id));

      if (passed) casePassed++; else caseFailed++;
    }

    const caseStatus: "passed" | "failed" = caseFailed === 0 ? "passed" : "failed";
    await db.update(graceXlsTestCases)
      .set({
        status: caseStatus,
        completedAt: new Date(),
        errorMessage: caseFailed > 0 ? `${caseFailed} step(s) failed` : null,
      })
      .where(eq(graceXlsTestCases.id, tc.id));

    if (caseStatus === "passed") totalPassed++; else totalFailed++;
  }

  await db.update(graceXlsRuns)
    .set({
      status: "complete",
      passedTestCases: totalPassed,
      failedTestCases: totalFailed,
      completedAt: new Date(),
    })
    .where(eq(graceXlsRuns.id, runId));
}
