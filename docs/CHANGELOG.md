# CSC-GRACE Platform — CHANGELOG

All notable changes to the CSC-GRACE platform are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.2.0] — 2026-06-05

### Fixed
- **`/grace/suite/:id` 404** — The singular route `/grace/suite/:id` was not registered in the React router. It now redirects to `/grace/suites?suiteId=:id`, which is consistent with how the HITL queue deep-links to suites. Affects all intake-page suite links (e.g., `/grace/suite/30006`).

### Added
- **Post-Approval Pipeline** — When a HITL reviewer approves a `scope_review` item, the following pipeline now runs automatically and non-blockingly:
  1. PFAAM XLSX generated and uploaded to S3.
  2. ADO Test Plan created (one per release) with one ADO Test Suite per GRACE suite. `adoTestPlanId` and `adoTestSuiteId` stored on the suite row.
  3. XLSX committed to `regression-tests/<release-name>.xlsx` on the `main` branch of the linked ADO Git repository. `gitCommitSha`, `gitBranch`, and `gitCommittedAt` stored on the suite row.
  4. Suite `libraryStatus` set to `"library"` and `libraryVersion` set to `1`.

- **Test Library Tab** — A **Library** tab now appears alongside **Active Suites** on `/grace/suites`. It shows:
  - All approved suites with `libraryStatus = "library"`.
  - ADO Test Plan / Suite ID badges and Git commit SHA / PR link badges.
  - Expandable version history table showing all versions in a suite's chain.
  - **Re-run dialog** with two options: re-export original XLSX immediately (no new HITL cycle), or create a new version (v+1) that re-enters the HITL review queue.

- **Suite Versioning** — `rerunFromLibrary` tRPC procedure:
  - No changes: re-exports original XLSX, returns download URL.
  - Changes: creates new suite with `libraryVersion = original + 1`, `parentSuiteId` pointing to the root, copies all conditions, queues `scope_review` HITL item.

- **`listLibrary` procedure** — Returns all library suites with version chains and ADO/Git metadata.

- **Single-Click Installers** — `scripts/install.sh` (Linux/macOS) and `scripts/install.ps1` (Windows) automate the full setup: prerequisite checks, dependency install, `.env` configuration, `db:push`, optional module seeding, and dev server start.

- **`.env.template`** — Comprehensive environment variable template with all GRACE-specific variables documented inline.

- **`agent/deploy-unix.sh`** — Linux/macOS agent installer supporting `install` (systemd/launchd), `uninstall`, `start`, `stop`, `status`, and `run` (foreground) actions.

- **`agent/appsettings.json`** — Updated with full `MultiLocator`, `SelfTest`, and `FailureAnalysis` configuration sections.

- **`docs/GRACE_Architecture.md`** — Global architecture document covering all modules, data flows, acceptance criteria, and database schema summary.

---

## [1.1.0] — prior

### Added
- **Multi-Locator OBJECT Column** — PFAAM OBJECT column accepts multiple locators per cell, pipe (`|`) or newline delimited. Strategy auto-detected from syntax. Priority order: `data-testid` → ARIA role → HTML ID → `name` → `aria-label` → placeholder → CSS class → visible text → relative XPath → absolute XPath (warning).
- **LLM Failure Analysis Pipeline** — `analyzeLocatorFailure` tRPC procedure. When all locators fail, the LLM determines `locator_update`, `step_redesign`, or `defect`. A HITL item is always created regardless of confidence. Fallback to manual-review HITL item if LLM call fails.
- **AUTONOMOUS.ML MCP Agent** — Node.js + Playwright CDP agent for QA workstations. Multi-level self-test on startup (function, class, module, system). Windows Service installer (`deploy-windows.ps1`).
- **GRACE Academy Learning Portal** — Full diploma program with ABT fundamentals, bonus courses, gamification, and certificates.
- **ABT Multi-Locator Generation** — When GRACE generates ABT steps from conditions, the LLM is instructed to provide at least two locators per UI interaction step in priority order.
- **ADO Connection Management** — Encrypted PAT storage, connection test, and per-release ADO connection assignment.
- **HITL Queue** — Full review queue with `scope_review`, `anomaly`, `defect_candidate`, and `locator_update` item types. Priority-based routing. Audit trail on every action.
- **DAG Scheduler** — Dependency-aware execution scheduling for test conditions.
- **Confidence Gate + Duplicate Detector** — Configurable thresholds for testability, confidence, and semantic similarity.

---

## [1.0.0] — initial

- Initial GRACE platform release.
- ADO work item intake, atomic decomposition, PFAAM XLSX export.
- Basic HITL queue and audit log.
- GRACE Academy course content.
