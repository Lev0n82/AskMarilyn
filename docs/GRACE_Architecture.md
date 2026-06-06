# CSC-GRACE — Global Architecture Document

**Version:** 1.2 | **Date:** 2026-06-05 | **Status:** Current

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Module Map](#module-map)
3. [Data Flow](#data-flow)
4. [AI Pipeline Modules](#ai-pipeline-modules)
5. [Multi-Locator Strategy](#multi-locator-strategy)
6. [LLM Failure Analysis Pipeline](#llm-failure-analysis-pipeline)
7. [Post-Approval Pipeline](#post-approval-pipeline)
8. [Test Library and Versioning](#test-library-and-versioning)
9. [AUTONOMOUS.ML Agent](#autonomousml-agent)
10. [Database Schema Summary](#database-schema-summary)
11. [Acceptance Criteria](#acceptance-criteria)

---

## System Overview

CSC-GRACE (Generative Requirements and Conditions Engine) is a full-stack AI testing platform that automates the SDLC testing pipeline from ADO work item intake to regression execution. It implements the **DDD v5.1** methodology and the **PFAAM** (Playwright Framework Action-Attribute Matrix) regression format.

The system consists of three primary tiers:

| Tier | Technology | Responsibility |
|---|---|---|
| Portal (Cloud) | React 19 + tRPC 11 + Express 4 + MySQL | UI, AI pipeline, HITL queue, ADO integration |
| AUTONOMOUS.ML Agent | Node.js + Playwright CDP | QA workstation execution, multi-locator chain, LLM escalation |
| ADO / Git | Azure DevOps REST API v7.1 | Test Plan publish, Git commit, work item sync |

---

## Module Map

```
server/grace/
├── atomic-decomposer.ts      AI: Decomposes requirements into atomic test conditions
├── confidence-gate.ts        AI: Scores testability and confidence; gates low-quality conditions
├── duplicate-detector.ts     AI: Detects semantically duplicate conditions across suites
├── dag-scheduler.ts          Execution: Builds and schedules DAG of test conditions
├── xls-importer.ts           Import: Parses PFAAM XLSX → DB tables
├── xls-generator.ts          Export: Generates PFAAM-compliant XLSX from DB conditions
├── ado-test-plan-publisher.ts ADO: Creates Test Plans and Test Suites in Azure DevOps
├── ado-git-publisher.ts       ADO: Commits XLSX files to ADO Git repository
├── locator-parser.ts          Execution: Parses multi-locator OBJECT column into chain
├── playwright-executor.ts     Execution: Builds McpStepInstruction with locator chain
├── llm-router.ts              AI: Routes LLM calls to configured provider
├── release-parser.ts          ADO: Parses release definitions and work item links
├── settings-crypto.ts         Security: Encrypts/decrypts ADO credentials at rest
├── ssrf-protector.ts          Security: Validates URLs against SSRF allowlist
├── testability-scorer.ts      AI: Scores individual conditions for testability
├── learning-recorder.ts       AI: Records outcomes for model feedback loop
├── terminal-ws.ts             Agent: WebSocket terminal for remote agent control
└── azure-vault.ts             Security: Azure Key Vault integration (optional)

server/routers/
├── grace-hitl.ts             HITL queue procedures + post-approval pipeline trigger
├── grace-testsuite.ts        Suite CRUD, listLibrary, rerunFromLibrary
├── grace-xls-runner.ts       XLS import/run lifecycle + analyzeLocatorFailure
├── grace-abt.ts              ABT derivation from conditions
├── grace-audit.ts            Audit log procedures
├── grace-credentials.ts      Encrypted ADO credential management
├── grace-desktop-agent.ts    Desktop agent registration and polling
├── grace-feature-flags.ts    Feature flag management
├── grace-kiss.ts             KISS principle scoring
├── grace-release.ts          Release and ADO connection management
├── grace-settings.ts         GRACE settings (LLM, thresholds, ADO)
└── grace-workitems.ts        ADO work item intake and sync
```

---

## Data Flow

### 1. Intake → Condition Generation

```
ADO Work Items (grace-workitems.ts)
  → Release Parser (release-parser.ts)
  → Atomic Decomposer (atomic-decomposer.ts)
      LLM prompt: DDD v5.1 decomposition
      Output: test conditions with steps_json (multi-locator targets)
  → Confidence Gate (confidence-gate.ts)
      Filters: testability < 0.65, confidence < 0.70
  → Duplicate Detector (duplicate-detector.ts)
      Flags: semantic similarity > 0.85
  → grace_test_conditions (DB)
  → HITL Queue (scope_review item created)
```

### 2. HITL Review → Post-Approval Pipeline

```
HITL Approval (grace-hitl.ts → approveScopeReview)
  → XLS Generator (xls-generator.ts) → S3 upload
  → ADO Test Plan Publisher (ado-test-plan-publisher.ts)
      Creates: Test Plan (per release) + Test Suite (per GRACE suite)
      Stores: adoTestPlanId, adoTestSuiteId on grace_test_suites
  → ADO Git Publisher (ado-git-publisher.ts)
      Commits: XLSX to regression-tests/<release>.xlsx on main
      Stores: gitCommitSha, gitBranch on grace_test_suites
  → grace_test_suites.libraryStatus = "library"
```

### 3. Regression Execution

```
XLS Runner (grace-xls-runner.ts → startRun)
  → grace_xls_runs (DB) status: queued
  → AUTONOMOUS.ML Agent (polls grace_xls_steps)
      For each step:
        Locator Parser → locator chain []
        Playwright CDP → try locators in priority order
        Success → post result → grace_xls_steps status: passed
        All fail → analyzeLocatorFailure (tRPC)
          → LLM analysis → HITL item (defect/locator_update/step_redesign)
          → grace_xls_steps status: failed
  → exportResults → PFAAM XLSX with results
  → publishToAdo → ADO Test Run with results
```

---

## AI Pipeline Modules

### atomic-decomposer.ts

**Purpose:** Decomposes a work item's acceptance criteria into atomic, independently executable test conditions.

**Acceptance Criteria:**
- Each condition must have exactly one verifiable outcome.
- Each UI interaction step must include at least two locators in priority order.
- Output must pass the confidence gate before entering the HITL queue.

### confidence-gate.ts

**Purpose:** Scores each generated condition for testability and LLM confidence.

**Thresholds (configurable):**

| Threshold | Default | Description |
|---|---|---|
| `GRACE_TESTABILITY_THRESHOLD` | 0.65 | Minimum testability score |
| `GRACE_CONFIDENCE_THRESHOLD` | 0.70 | Minimum LLM confidence |
| `GRACE_DUPLICATE_THRESHOLD` | 0.85 | Maximum semantic similarity |

### duplicate-detector.ts

**Purpose:** Detects semantically duplicate conditions within and across suites using embedding similarity.

**Acceptance Criteria:**
- Conditions with similarity > threshold are flagged, not deleted.
- HITL reviewer can merge, keep both, or discard.

---

## Multi-Locator Strategy

### locator-parser.ts

Parses the OBJECT column of a PFAAM step into an ordered locator chain. Accepts pipe (`|`) or newline delimiters.

**Priority order (most stable → least stable):**

| Priority | Strategy | Detection Pattern |
|---|---|---|
| 1 | `data-testid` | `[data-testid="..."]` |
| 2 | ARIA role | `role=...` |
| 3 | HTML ID | `#...` |
| 4 | `name` attribute | `[name="..."]` |
| 5 | `aria-label` | `[aria-label="..."]` |
| 6 | Placeholder | `[placeholder="..."]` |
| 7 | CSS class | `.class-name` |
| 8 | Visible text | `text=...` |
| 9 | Relative XPath | `//...` (relative) |
| 10 | Absolute XPath ⚠️ | `/html/...` (absolute — warning logged) |

**Acceptance Criteria:**
- All locators in the OBJECT column are parsed and included in the chain.
- The chain is tried left-to-right; execution stops at the first successful locator.
- Absolute XPath locators are accepted but logged as a stability warning.
- An empty OBJECT column is treated as a non-UI step (no locator required).

### playwright-executor.ts

Builds `McpStepInstruction` payloads from parsed locator chains and sends them to the AUTONOMOUS.ML agent.

**Acceptance Criteria:**
- `McpStepInstruction.locators[]` contains all parsed locators in priority order.
- Legacy `locatorStrategy` / `locatorSelector` fields are populated from the first locator for backward compatibility.

---

## LLM Failure Analysis Pipeline

### grace-xls-runner.ts — analyzeLocatorFailure

Triggered by the AUTONOMOUS.ML agent when all locators in a step's chain have failed.

**Input:**
- Step context (action, description, expected outcome)
- All tried locators with individual error messages
- Current page URL
- Optional screenshot URL (S3)

**LLM Decision Schema:**

| Decision | Meaning | HITL Action |
|---|---|---|
| `locator_update` | DOM changed; element exists but locator stale | Reviewer updates OBJECT column with suggested locators |
| `step_redesign` | UI flow changed; step needs modification | Reviewer redesigns the step or condition |
| `defect` | Element missing; application bug | Reviewer logs defect in ADO |

**Acceptance Criteria:**
- A HITL item is **always** created regardless of LLM confidence.
- Defect decisions receive priority 1; low-confidence decisions receive priority 2.
- If the LLM call fails, a manual-review HITL item is created automatically.
- The step is marked `failed` with a message referencing the HITL item and LLM decision.
- An audit log entry is written with the full locator chain and LLM decision.

---

## Post-Approval Pipeline

### grace-hitl.ts — approveScopeReview

Triggered when a HITL reviewer approves a `scope_review` item.

**Steps (all non-blocking — failures logged to audit trail):**

1. **XLSX generation** — `xls-generator.ts` → S3 upload → URL stored on suite.
2. **ADO Test Plan publish** — `ado-test-plan-publisher.ts`:
   - Looks up ADO connection from the most recent release with a connection, or falls back to the default connection.
   - Creates one Test Plan per release (reuses existing if already created).
   - Creates one Test Suite per GRACE suite within that plan.
   - Stores `adoTestPlanId`, `adoTestSuiteId`, `adoPublishedAt` on the suite row.
3. **ADO Git commit** — `ado-git-publisher.ts`:
   - Commits XLSX to `regression-tests/<release-name>.xlsx` on `main`.
   - Stores `gitCommitSha`, `gitBranch`, `gitCommittedAt` on the suite row.
4. **Library status** — Sets `libraryStatus = "library"` and `libraryVersion = 1` on the suite row.

**Acceptance Criteria:**
- All four steps run in sequence after approval.
- A failure in any step does not block the approval or the remaining steps.
- All step outcomes (success or failure) are written to the audit log.
- The HITL item is marked `approved` regardless of pipeline step outcomes.

---

## Test Library and Versioning

### grace-testsuite.ts — listLibrary

Returns all suites with `libraryStatus = "library"`, including:
- ADO Test Plan / Suite IDs and publication timestamp.
- Git commit SHA, branch, PR URL, and commit timestamp.
- Full version chain (all suites sharing the same `parentSuiteId` root).

### grace-testsuite.ts — rerunFromLibrary

| Input | Behaviour |
|---|---|
| `changes: false` | Re-exports the original XLSX from S3; returns download URL immediately. No new HITL cycle. |
| `changes: true` + new environment | Creates a new suite with `libraryVersion = original + 1`, `parentSuiteId` pointing to the root, copies all conditions, queues a `scope_review` HITL item. |

**Acceptance Criteria:**
- Version chains are tracked via `parentSuiteId` — no separate versions table.
- Re-run without changes does not create a new suite row.
- Re-run with changes always increments `libraryVersion` by 1.
- The new version suite enters the standard HITL → approval → publish pipeline.

---

## AUTONOMOUS.ML Agent

The AUTONOMOUS.ML agent runs on QA workstations and connects to the GRACE portal via tRPC polling.

### Self-Test Framework

The agent runs a four-level self-test suite on every startup:

| Level | Scope | Failure Behaviour |
|---|---|---|
| Function | Individual methods | Log warning; continue |
| Class | Class + dependencies | Log warning; continue |
| Module | Complete modules | Log error; continue |
| System | End-to-end smoke test | Log error; report to portal |

### Configuration (`agent/appsettings.json`)

| Key | Description | Default |
|---|---|---|
| `GracePortal.BaseUrl` | GRACE portal URL | `https://grace.learnsdlc.org` |
| `GracePortal.PollIntervalMs` | Step polling interval | `2000` |
| `Playwright.Browser` | Browser for execution | `chromium` |
| `Playwright.Headless` | Run headless | `false` |
| `Playwright.CdpEndpoint` | Remote CDP WebSocket URL | `""` (local) |
| `MultiLocator.Enabled` | Enable multi-locator chain | `true` |
| `MultiLocator.FailureAnalysis.Enabled` | Call portal on exhaustion | `true` |
| `Scheduler.NightlyReboot.Enabled` | Nightly reboot | `true` |
| `SelfTest.RunOnStartup` | Run self-tests on start | `true` |

---

## Database Schema Summary

| Table | Key Columns | Purpose |
|---|---|---|
| `grace_test_suites` | `id`, `libraryStatus`, `libraryVersion`, `parentSuiteId`, `adoTestPlanId`, `adoTestSuiteId`, `gitCommitSha` | Test suite with ADO/Git/library metadata |
| `grace_test_conditions` | `id`, `suiteId`, `stepsJson`, `status`, `testabilityScore` | Individual test conditions with step chains |
| `grace_hitl_items` | `id`, `itemType`, `priority`, `status`, `payload` | HITL review queue items |
| `grace_audit_log` | `id`, `actor`, `action`, `entityType`, `entityId`, `result` | Immutable audit trail |
| `grace_xls_runs` | `id`, `status`, `targetEnvironment`, `adoConnectionId` | XLS regression run records |
| `grace_xls_steps` | `id`, `runId`, `status`, `object`, `errorMessage`, `screenshotUrl` | Individual step execution records |
| `grace_ado_connections` | `id`, `orgUrl`, `project`, `encryptedPat` | Encrypted ADO connection credentials |
| `grace_releases` | `id`, `name`, `adoConnectionId`, `status` | Release definitions |
| `grace_work_items` | `id`, `adoId`, `title`, `description`, `latestSuiteId` | ADO work items |

---

## Acceptance Criteria

### System-Level

1. A work item imported from ADO must produce at least one test condition within 30 seconds.
2. A HITL approval must trigger the full post-approval pipeline (XLSX + ADO Test Plan + Git commit + library status) within 60 seconds.
3. A regression run must execute all steps in a suite and report results within the configured `GRACE_TESTCASE_TIMEOUT_MS`.
4. All-locators-fail on a step must produce a HITL item within 10 seconds of the agent reporting exhaustion.
5. The Library tab must display all approved suites with correct ADO and Git status badges.
6. Re-run from library (no changes) must return a download URL without creating a new suite row.
7. Re-run from library (with changes) must create a new version suite and queue a HITL item.

### Security

1. ADO Personal Access Tokens must be stored encrypted at rest (`settings-crypto.ts`).
2. All outbound HTTP requests from GRACE server-side code must pass the SSRF allowlist check (`ssrf-protector.ts`).
3. All tRPC procedures that modify data must use `protectedProcedure` (authenticated user required).
