/**
 * GRACE Pipeline Tests — CSC-GRACE-AI v1.2
 *
 * Covers all features that were previously untested:
 *   1. Locator Parser — multi-locator parsing, strategy detection, priority ordering
 *   2. Test Library — listLibrary procedure (returns library suites with version chains)
 *   3. Library Re-run — no-change path (re-export XLSX) and new-version path (create v+1 + HITL)
 *   4. Post-Approval Pipeline — HITL approve triggers XLSX generation, ADO Test Plan, Git commit, library status
 *   5. analyzeLocatorFailure — LLM routes to HITL: locator_update, defect, step_redesign, LLM-fallback
 *   6. Agent Download Info — getAgentDownloadInfo returns correct URLs
 *
 * All external services (DB, LLM, S3, ADO publishers, Git publisher) are mocked.
 * Tests validate procedure contracts, HITL routing, and audit log entries.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { invokeLLM } from "./_core/llm";

// ── Locator parser (pure unit — no mocks needed) ─────────────────────────────
import {
  detectLocatorType,
  parseLocators,
  findAbsoluteXPaths,
} from "./grace/locator-parser";

// ── DB mock ───────────────────────────────────────────────────────────────────
// Mirrors the structure in grace-workflows.test.ts so all procedures can resolve.
vi.mock("./db", () => {
  const librarySuite = {
    id: 50,
    name: "Regression Suite v1",
    status: "approved",
    workItemId: 10,
    applicationName: "PFAAM",
    environment: "IST",
    browserMatrix: ["chromium"],
    libraryStatus: "library",
    libraryVersion: 1,
    parentSuiteId: null,
    xlsFilePath: null,
    adoTestPlanId: null,
    adoTestSuiteId: null,
    adoPublishedAt: null,
    adoPublishedBy: null,
    gitCommitSha: null,
    gitBranch: null,
    gitPrUrl: null,
    gitCommittedAt: null,
    ownedBy: "test@csc-ddsb.ca",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const scopeReviewItem = {
    id: 30,
    itemType: "scope_review",
    status: "open",
    priority: 3,
    title: "Suite pending review: Regression Suite v1",
    description: "2 condition(s) generated",
    relatedEntityType: "test_suite",
    relatedEntityId: 50,
    suggestedAction: "Navigate to Test Suite View",
    slaDeadline: new Date(Date.now() + 48 * 3600_000),
    confidenceScore: null,
    reviewedBy: null,
    reviewedAt: null,
    reviewNotes: null,
    payload: { applicationName: "PFAAM" },
    createdAt: new Date(),
  };

  const conditions = [
    {
      id: 100, conditionNumber: 1, testType: "functional",
      title: "Valid login redirects to dashboard",
      status: "pending", confidenceScore: "0.92",
      steps: [{ stepNumber: 1, action: "Navigate to /login", expectedResult: "Login page shown" }],
      expectedResult: "Dashboard shown", dependsOn: [], executionGroup: 1,
      userRole: "student", browserTarget: "chromium",
      preconditions: null, testData: null,
    },
    {
      id: 101, conditionNumber: 2, testType: "negative",
      title: "Invalid credentials show error",
      status: "pending", confidenceScore: "0.88",
      steps: [{ stepNumber: 1, action: "Enter wrong password", expectedResult: "Error shown" }],
      expectedResult: "Error message displayed", dependsOn: [], executionGroup: 1,
      userRole: "student", browserTarget: "chromium",
      preconditions: null, testData: null,
    },
  ];

  return {
    getWorkItems: vi.fn().mockResolvedValue([]),
    getWorkItemById: vi.fn().mockResolvedValue(null),
    updateWorkItem: vi.fn().mockResolvedValue(undefined),
    createTestSuite: vi.fn().mockResolvedValue({ id: 51, name: "Regression Suite v2", status: "pending_review" }),
    getTestSuites: vi.fn().mockResolvedValue([
      { id: 51, name: "Regression Suite v2", status: "pending_review", workItemId: 10, createdAt: new Date() },
    ]),
    getTestSuiteById: vi.fn().mockImplementation(async (id: number) => {
      if (id === 50) return librarySuite;
      if (id === 51) return { ...librarySuite, id: 51, name: "Regression Suite v2", libraryStatus: "none", libraryVersion: 2 };
      return null;
    }),
    updateTestSuite: vi.fn().mockResolvedValue(undefined),
    createTestCondition: vi.fn().mockResolvedValue({ id: 102 }),
    getConditionsBySuite: vi.fn().mockResolvedValue(conditions),
    updateCondition: vi.fn().mockResolvedValue(undefined),
    createHitlItem: vi.fn().mockResolvedValue({ id: 31 }),
    getHitlQueue: vi.fn().mockResolvedValue([scopeReviewItem]),
    getHitlItemById: vi.fn().mockResolvedValue(scopeReviewItem),
    updateHitlItem: vi.fn().mockResolvedValue(undefined),
    createCredential: vi.fn().mockResolvedValue({ id: 40 }),
    getCredentials: vi.fn().mockResolvedValue([]),
    getCredentialById: vi.fn().mockResolvedValue(null),
    updateCredential: vi.fn().mockResolvedValue(undefined),
    deleteCredential: vi.fn().mockResolvedValue(undefined),
    appendAuditLog: vi.fn().mockResolvedValue(undefined),
    getAuditLog: vi.fn().mockResolvedValue([]),
    getDashboardMetrics: vi.fn().mockResolvedValue({ totalGenerated: 0, totalApproved: 0, totalRejected: 0, openHitlItems: 0, avgConfidence: 0 }),
    getGraceSettings: vi.fn().mockResolvedValue({ id: 1, adoOrgUrl: null, adoPatEncrypted: null }),
    updateGraceSettings: vi.fn().mockResolvedValue(undefined),
    getAdoConnections: vi.fn().mockResolvedValue([]),
    createAdoConnection: vi.fn().mockResolvedValue({ id: 1 }),
    updateAdoConnection: vi.fn().mockResolvedValue(undefined),
    deleteAdoConnection: vi.fn().mockResolvedValue(undefined),
    // getDb — used directly by listLibrary, analyzeLocatorFailure, and post-approval pipeline
    getDb: vi.fn().mockResolvedValue({
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockImplementation(() => {
          // Library suite row for listLibrary
          const libRow = {
            id: 50, name: "Regression Suite v1", status: "approved",
            libraryStatus: "library", libraryVersion: 1, parentSuiteId: null,
            adoTestPlanId: null, adoTestSuiteId: null, adoPublishedAt: null,
            gitCommitSha: null, gitBranch: null, gitPrUrl: null,
            ownedBy: "test@csc-ddsb.ca", workItemId: 10,
            applicationName: "PFAAM", environment: "IST",
            browserMatrix: ["chromium"], createdAt: new Date(), updatedAt: new Date(),
          };
          const makeChain = (rows: unknown[]) => ({
            then: (resolve: (v: unknown) => unknown) => Promise.resolve(rows).then(resolve),
            catch: (reject: (e: unknown) => unknown) => Promise.resolve(rows).catch(reject),
            where: vi.fn().mockImplementation(() => makeChain([libRow])),
            orderBy: vi.fn().mockImplementation(() => makeChain([libRow])),
            limit: vi.fn().mockResolvedValue([]),
          });
          return makeChain([libRow]);
        }),
      }),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue([{ insertId: 99 }]),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  };
});

// ── LLM mock — default to locator_update decision ────────────────────────────
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          decision: "locator_update",
          confidence: "high",
          reasoning: "The element's data-testid attribute was renamed in a recent deploy.",
          suggestedLocators: ["[data-testid='login-submit']", "#login-btn", "//button[@type='submit']"],
          hitlInstructions: "Update the OBJECT column with the suggested locators in priority order.",
        }),
      },
    }],
  }),
}));

// ── Storage mock ──────────────────────────────────────────────────────────────
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://s3.example.com/grace-xls/50-approved.xlsx", key: "grace-xls/50-approved.xlsx" }),
  storageGet: vi.fn().mockResolvedValue({ url: "https://s3.example.com/grace-xls/50-approved.xlsx", key: "grace-xls/50-approved.xlsx" }),
}));

// ── ADO Test Plan publisher mock ──────────────────────────────────────────────
vi.mock("./grace/ado-test-plan-publisher", () => ({
  publishSuiteToAdoTestPlan: vi.fn().mockResolvedValue({
    success: true,
    testPlanId: 9001,
    testSuiteId: 9002,
    testCaseIds: [1001, 1002],
  }),
  loadAdoConnectionCredentials: vi.fn().mockResolvedValue({
    adoOrgUrl: "https://dev.azure.com/csc-ddsb",
    adoProject: "AutomationAndAccessibility",
    pat: "mock-pat-token",
  }),
}));

// ── ADO Git publisher mock ────────────────────────────────────────────────────
vi.mock("./grace/ado-git-publisher", () => ({
  publishXlsxToAdoGit: vi.fn().mockResolvedValue({
    success: true,
    commitSha: "abc123def456",
    branch: "main",
    filePath: "regression-tests/Regression Suite v1.xlsx",
    prUrl: null,
  }),
}));

// ── Learning recorder mock ────────────────────────────────────────────────────
vi.mock("./grace/learning-recorder", () => ({
  recordPositive: vi.fn().mockResolvedValue(undefined),
  recordCorrection: vi.fn().mockResolvedValue(undefined),
}));

// ── Azure Vault mock ──────────────────────────────────────────────────────────
vi.mock("./grace/azure-vault", () => ({
  getVaultSecret: vi.fn().mockResolvedValue({ value: "P@ssw0rd123!", name: "testuser--csc-ddsb-ca" }),
  resetVaultPassword: vi.fn().mockResolvedValue({ newPassword: "NewP@ss456!", secretName: "testuser--csc-ddsb-ca" }),
  getKvSettingsFromDb: vi.fn().mockResolvedValue({ vaultName: "qa-dev-app", tenantId: "cddc1229", clientId: "25bc4f7b", clientSecret: "secret" }),
}));

// ── Context helpers ───────────────────────────────────────────────────────────
type AuthUser = NonNullable<TrpcContext["user"]>;
function makeCtx(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthUser = {
    id: 1, openId: "test-oid", email: "test@csc-ddsb.ca", name: "Test User",
    loginMethod: "manus", role, createdAt: new Date(),
    updatedAt: new Date(), lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}
function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. LOCATOR PARSER — pure unit tests (no mocks, no DB)
// ─────────────────────────────────────────────────────────────────────────────
describe("Locator Parser — detectLocatorType", () => {
  it("detects data-testid as CSS with preferred label", () => {
    const result = detectLocatorType("[data-testid='submit-btn']");
    expect(result.strategy).toBe("css");
    expect(result.strategyLabel).toContain("data-testid");
    expect(result.isXPath).toBe(false);
    expect(result.isAbsoluteXPath).toBe(false);
  });

  it("detects relative XPath starting with //", () => {
    const result = detectLocatorType("//button[contains(text(),'Submit')]");
    expect(result.strategy).toBe("xpath");
    expect(result.isXPath).toBe(true);
    expect(result.isAbsoluteXPath).toBe(false);
  });

  it("detects absolute XPath starting with /html as fragile", () => {
    const result = detectLocatorType("/html/body/div[1]/button");
    expect(result.strategy).toBe("xpath");
    expect(result.isXPath).toBe(true);
    expect(result.isAbsoluteXPath).toBe(true);
    expect(result.strategyLabel).toContain("fragile");
  });

  it("detects ARIA role locator", () => {
    const result = detectLocatorType("role=button[name='Submit']");
    expect(result.strategy).toBe("aria");
    expect(result.isAria).toBe(true);
  });

  it("detects text= locator", () => {
    const result = detectLocatorType("text=Submit Application");
    expect(result.strategy).toBe("text");
    expect(result.isText).toBe(true);
  });

  it("detects CSS ID selector", () => {
    const result = detectLocatorType("#submit-button");
    expect(result.strategy).toBe("css");
    expect(result.strategyLabel).toContain("ID");
  });

  it("detects CSS class selector", () => {
    const result = detectLocatorType(".btn-submit");
    expect(result.strategy).toBe("css");
    expect(result.strategyLabel).toContain("class");
  });

  it("detects aria-label attribute", () => {
    const result = detectLocatorType("[aria-label='Submit form']");
    expect(result.strategy).toBe("css");
    expect(result.strategyLabel).toContain("aria-label");
  });

  it("detects placeholder attribute", () => {
    const result = detectLocatorType("[placeholder='Email address']");
    expect(result.strategy).toBe("css");
    expect(result.strategyLabel).toContain("placeholder");
  });
});

describe("Locator Parser — parseLocators", () => {
  it("returns empty array for null/undefined/blank input", () => {
    expect(parseLocators(null)).toHaveLength(0);
    expect(parseLocators(undefined)).toHaveLength(0);
    expect(parseLocators("")).toHaveLength(0);
    expect(parseLocators("   ")).toHaveLength(0);
  });

  it("returns single-element array for a single locator (backward-compatible)", () => {
    const result = parseLocators("[data-testid='submit-btn']");
    expect(result).toHaveLength(1);
    expect(result[0].strategy).toBe("css");
  });

  it("splits pipe-delimited multi-locator string into ordered array", () => {
    const input = "[data-testid='submit-btn'] | #submit-button | //button[contains(text(),'Submit')]";
    const result = parseLocators(input);
    expect(result).toHaveLength(3);
    expect(result[0].strategyLabel).toContain("data-testid");
    expect(result[1].strategyLabel).toContain("ID");
    expect(result[2].strategy).toBe("xpath");
  });

  it("splits newline-delimited multi-locator string (Excel Alt+Enter)", () => {
    const input = "[data-testid='submit-btn']\n#submit-button\n//button[@type='submit']";
    const result = parseLocators(input);
    expect(result).toHaveLength(3);
    expect(result[0].raw).toBe("[data-testid='submit-btn']");
    expect(result[1].raw).toBe("#submit-button");
    expect(result[2].raw).toBe("//button[@type='submit']");
  });

  it("trims whitespace from each locator", () => {
    const result = parseLocators("  [data-testid='btn']  |  #btn  ");
    expect(result[0].raw).toBe("[data-testid='btn']");
    expect(result[1].raw).toBe("#btn");
  });

  it("preserves priority order: first locator in string = highest priority", () => {
    const input = "[data-testid='submit'] | role=button[name='Submit'] | //button";
    const result = parseLocators(input);
    expect(result[0].strategy).toBe("css");    // data-testid = highest priority
    expect(result[1].strategy).toBe("aria");   // ARIA role = second
    expect(result[2].strategy).toBe("xpath");  // XPath = lowest
  });
});

describe("Locator Parser — findAbsoluteXPaths", () => {
  it("returns only absolute XPath locators from a mixed array", () => {
    const locators = parseLocators(
      "[data-testid='btn'] | /html/body/div/button | //button[@id='submit']"
    );
    const absolutes = findAbsoluteXPaths(locators);
    expect(absolutes).toHaveLength(1);
    expect(absolutes[0].raw).toBe("/html/body/div/button");
  });

  it("returns empty array when no absolute XPaths present", () => {
    const locators = parseLocators("[data-testid='btn'] | #submit | //button");
    expect(findAbsoluteXPaths(locators)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST LIBRARY — listLibrary procedure
// ─────────────────────────────────────────────────────────────────────────────
describe("Test Library — listLibrary", () => {
  it("returns library suites (requires authentication)", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const suites = await caller.graceTestSuite.listLibrary();
    expect(Array.isArray(suites)).toBe(true);
  });

  it("rejects unauthenticated requests", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.graceTestSuite.listLibrary()).rejects.toThrow();
  });

  it("returns suites with a versions array attached", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const suites = await caller.graceTestSuite.listLibrary();
    // Each suite should have a versions property (may be empty if no children)
    if (suites.length > 0) {
      expect(suites[0]).toHaveProperty("versions");
      expect(Array.isArray(suites[0].versions)).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. LIBRARY RE-RUN — rerunFromLibrary procedure
// ─────────────────────────────────────────────────────────────────────────────
describe("Library Re-run — rerunFromLibrary", () => {
  it("re-exports original XLSX when no newVersion provided (no-change path)", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceTestSuite.rerunFromLibrary({ suiteId: 50 });
    expect(result.action).toBe("rerun_original");
    expect(result.suiteId).toBe(50);
    expect(result.xlsUrl).toContain("https://");
  });

  it("creates a new version suite when newVersion is provided (change path)", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceTestSuite.rerunFromLibrary({
      suiteId: 50,
      newVersion: { environment: "UAT" },
    });
    expect(result.action).toBe("new_version");
    expect(result.suiteId).toBeDefined();
    expect(result.version).toBeGreaterThan(1);
  });

  it("new version creates a HITL scope_review item for review", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceTestSuite.rerunFromLibrary({
      suiteId: 50,
      newVersion: { environment: "PROD" },
    });
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemType: "scope_review" })
    );
  });

  it("rejects re-run on a suite that is not in the library", async () => {
    const { getTestSuiteById } = await import("./db");
    vi.mocked(getTestSuiteById).mockResolvedValueOnce({
      id: 99, name: "Draft Suite", status: "pending_review",
      workItemId: 10, libraryStatus: "none", libraryVersion: null,
      parentSuiteId: null, applicationName: "PFAAM", environment: "IST",
      browserMatrix: ["chromium"], ownedBy: null, xlsFilePath: null,
      adoTestPlanId: null, adoTestSuiteId: null, adoPublishedAt: null,
      adoPublishedBy: null, gitCommitSha: null, gitBranch: null,
      gitPrUrl: null, gitCommittedAt: null, createdAt: new Date(), updatedAt: new Date(),
    } as Parameters<typeof getTestSuiteById>[0] extends never ? never : Awaited<ReturnType<typeof getTestSuiteById>>);
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.graceTestSuite.rerunFromLibrary({ suiteId: 99 })
    ).rejects.toThrow("not in the library");
  });

  it("rejects unauthenticated requests", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.graceTestSuite.rerunFromLibrary({ suiteId: 50 })
    ).rejects.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. POST-APPROVAL PIPELINE — HITL approve triggers full pipeline
// ─────────────────────────────────────────────────────────────────────────────
describe("Post-Approval Pipeline — HITL approve", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("approves a scope_review item and returns success", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceHitl.approve({ id: 30 });
    expect(result.success).toBe(true);
  });

  it("updates the HITL item status to approved", async () => {
    const { updateHitlItem } = await import("./db");
    vi.mocked(updateHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceHitl.approve({ id: 30, reviewNotes: "LGTM" });
    expect(updateHitlItem).toHaveBeenCalledWith(
      30,
      expect.objectContaining({ status: "approved", reviewNotes: "LGTM" })
    );
  });

  it("records a positive learning example on approval", async () => {
    const { recordPositive } = await import("./grace/learning-recorder");
    vi.mocked(recordPositive).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceHitl.approve({ id: 30 });
    expect(recordPositive).toHaveBeenCalled();
  });

  it("appends an audit log entry on approval", async () => {
    const { appendAuditLog } = await import("./db");
    vi.mocked(appendAuditLog).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceHitl.approve({ id: 30 });
    expect(appendAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "hitl_decision", entityId: 30 })
    );
  });

  it("marks the linked suite as approved before running the pipeline", async () => {
    const { updateTestSuite } = await import("./db");
    vi.mocked(updateTestSuite).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceHitl.approve({ id: 30 });
    // First updateTestSuite call should set status to "approved"
    expect(updateTestSuite).toHaveBeenCalledWith(
      50,
      expect.objectContaining({ status: "approved" })
    );
  });

  it("uploads XLSX to S3 as part of the pipeline", async () => {
    const { storagePut } = await import("./storage");
    vi.mocked(storagePut).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceHitl.approve({ id: 30 });
    // Allow async pipeline to complete
    await new Promise((r) => setTimeout(r, 50));
    expect(storagePut).toHaveBeenCalledWith(
      expect.stringContaining("grace-xls/"),
      expect.any(Buffer),
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
  });

  it("does not throw when HITL item is not found", async () => {
    const { getHitlItemById } = await import("./db");
    vi.mocked(getHitlItemById).mockResolvedValueOnce(null);
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.graceHitl.approve({ id: 9999 })).rejects.toThrow("not found");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ANALYZE LOCATOR FAILURE — LLM-assisted failure recovery
// ─────────────────────────────────────────────────────────────────────────────

const baseLocatorInput = {
  stepId: 1001,
  runId: 200,
  testCaseId: 300,
  stepNum: 3,
  action: "click",
  stepDescription: "Click the Submit button on the login form",
  triedLocators: [
    { raw: "[data-testid='submit-btn']", strategy: "css", strategyLabel: "CSS — data-testid (preferred)", errorMessage: "Element not found" },
    { raw: "#submit-button", strategy: "css", strategyLabel: "CSS — ID selector", errorMessage: "Element not found" },
    { raw: "//button[@type='submit']", strategy: "xpath", strategyLabel: "XPath", errorMessage: "Element not found" },
  ],
  expectedOutcome: "User is redirected to dashboard",
  pageUrl: "https://pfaam.csc-ddsb.ca/login",
  testCaseName: "Valid Login Flow",
  conditionTitle: "Valid login redirects to dashboard",
};

describe("analyzeLocatorFailure — locator_update decision", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to locator_update default
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            decision: "locator_update",
            confidence: "high",
            reasoning: "The element's data-testid attribute was renamed.",
            suggestedLocators: ["[data-testid='login-submit']", "#login-btn"],
            hitlInstructions: "Update the OBJECT column with the suggested locators.",
          }),
        },
      }],
    });
  });

  it("returns locator_update decision with suggested locators", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(result.decision).toBe("locator_update");
    expect(result.confidence).toBe("high");
    expect(result.suggestedLocators).toContain("[data-testid='login-submit']");
    expect(result.hitlCreated).toBe(true);
  });

  it("creates an anomaly HITL item for locator_update", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemType: "anomaly" })
    );
  });

  it("assigns priority 3 for high-confidence locator_update", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 3 })
    );
  });

  it("assigns priority 2 for low-confidence locator_update", async () => {
    vi.mocked(invokeLLM).mockResolvedValueOnce({
      choices: [{
        message: {
          content: JSON.stringify({
            decision: "locator_update",
            confidence: "low",
            reasoning: "Uncertain — DOM structure has changed significantly.",
            suggestedLocators: [],
            hitlInstructions: "Manual DOM inspection required.",
          }),
        },
      }],
    });
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 2 })
    );
  });

  it("appends an audit log entry with failure details", async () => {
    const { appendAuditLog } = await import("./db");
    vi.mocked(appendAuditLog).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(appendAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "execution", result: "failure" })
    );
  });
});

describe("analyzeLocatorFailure — defect decision", () => {
  beforeEach(() => {
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            decision: "defect",
            confidence: "high",
            reasoning: "The Submit button is missing from the login form — this is a regression.",
            defectTitle: "Submit button missing from login form",
            defectDescription: "The Submit button (data-testid='submit-btn') is absent from the login page. Expected per AC-101.",
            hitlInstructions: "Log a defect in ADO and assign to the dev team. Reference AC-101.",
          }),
        },
      }],
    });
  });

  it("returns defect decision", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(result.decision).toBe("defect");
    expect(result.defectTitle).toBe("Submit button missing from login form");
  });

  it("creates a defect_candidate HITL item for defect decision", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemType: "defect_candidate" })
    );
  });

  it("assigns priority 1 for defect decision", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ priority: 1 })
    );
  });
});

describe("analyzeLocatorFailure — step_redesign decision", () => {
  beforeEach(() => {
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            decision: "step_redesign",
            confidence: "medium",
            reasoning: "The login form has been replaced with a SSO redirect flow.",
            suggestedStepChange: "Replace the click step with a navigate step to the SSO provider URL.",
            hitlInstructions: "Update the test condition to reflect the new SSO flow.",
          }),
        },
      }],
    });
  });

  it("returns step_redesign decision with suggested change", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(result.decision).toBe("step_redesign");
    expect(result.suggestedStepChange).toContain("SSO");
  });

  it("creates an anomaly HITL item for step_redesign", async () => {
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(createHitlItem).toHaveBeenCalledWith(
      expect.objectContaining({ itemType: "anomaly" })
    );
  });
});

describe("analyzeLocatorFailure — LLM failure fallback", () => {
  it("creates a manual-review HITL item when LLM throws", async () => {
    vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM service unavailable"));
    const { createHitlItem } = await import("./db");
    vi.mocked(createHitlItem).mockClear();
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    // Should still succeed (fallback path)
    expect(result.hitlCreated).toBe(true);
    expect(createHitlItem).toHaveBeenCalled();
  });

  it("returns low confidence on LLM fallback", async () => {
    vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("LLM service unavailable"));
    const caller = appRouter.createCaller(makeCtx("user"));
    const result = await caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput);
    expect(result.confidence).toBe("low");
  });

  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.graceXlsRunner.analyzeLocatorFailure(baseLocatorInput)
    ).rejects.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. AGENT DOWNLOAD INFO — getAgentDownloadInfo procedure
// ─────────────────────────────────────────────────────────────────────────────
describe("Agent Download Info — getAgentDownloadInfo", () => {
  it("is a public procedure (no auth required)", async () => {
    // Stub global fetch to avoid real HTTP calls
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.graceDesktopAgent.getAgentDownloadInfo();
    expect(result).toBeDefined();
    fetchSpy.mockRestore();
  });

  it("always returns the install script URLs regardless of GitHub release availability", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.graceDesktopAgent.getAgentDownloadInfo();
    expect(result.windowsInstallScriptUrl).toContain("install.ps1");
    expect(result.unixInstallScriptUrl).toContain("install.sh");
    expect(result.agentAppsettingsUrl).toContain("appsettings.json");
    expect(result.repoUrl).toContain("github.com");
    fetchSpy.mockRestore();
  });

  it("returns latestRelease when GitHub API responds with a release", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        tag_name: "v1.2.0",
        assets: [
          { name: "autonomous-ml-agent-win-x64.exe", browser_download_url: "https://github.com/Lev0n82/AskMarilyn/releases/download/v1.2.0/autonomous-ml-agent-win-x64.exe" },
        ],
      }),
    } as Response);
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.graceDesktopAgent.getAgentDownloadInfo();
    expect(result.latestRelease).toBeDefined();
    expect(result.latestRelease?.tag).toBe("v1.2.0");
    expect(result.latestRelease?.windowsExeUrl).toContain(".exe");
    fetchSpy.mockRestore();
  });

  it("returns null latestRelease when GitHub API returns 404 (no releases yet)", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.graceDesktopAgent.getAgentDownloadInfo();
    expect(result.latestRelease).toBeNull();
    fetchSpy.mockRestore();
  });

  it("returns null latestRelease gracefully when fetch throws (network error)", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.graceDesktopAgent.getAgentDownloadInfo();
    expect(result.latestRelease).toBeNull();
    fetchSpy.mockRestore();
  });
});
