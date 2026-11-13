# Evidence Desk in LearnSDLC

This adds the approved Azure DevOps QA Measurement program to the original LearnSDLC academy. It preserves the academy’s existing courses, authentication, cream/navy editorial styling and domain configuration. The new instruction is an original evidence-led advice column, not impersonation of Marilyn vos Savant.

## What is implemented

Fourteen separate introductions lead into 43 individually titled topic pages. Every topic contains its approved lecture, a hosted diagram with full text equivalent, a source-bound tool walkthrough, a changed-scope individual task, two-pass self-review, an asynchronous reviewer challenge, immediate/delayed recall, targeted repair, a three-question check and two executable three-round practice games. C10 retains its twelve product-quality domain pages.

The resource desk supplies three Excel kits with all 18 exact-schema matrices and three collaboration/retrieval CSVs. Learners build their own matrices and four audience-specific QA/SDLC dashboards in Excel, Power Query and Power BI, using Azure Analytics/OData and operation-specific REST instructions. The portal is not a live Azure collector or an already-built analytical Power BI report.

Assessment now uses server-stored forms, saved response revisions, ownership checks and immutable submission. The approved 129 topic, 42 checkpoint, 70 course-final and 36 program-final questions remain distinct. Topic/checkpoint thresholds are 3/3; course final is 4/5; program final is 29/36. Final feedback stays held until instructor-authorized release. Only a clearly labelled low-stakes learning repeat is available until reviewed alternate forms exist.

Portfolio records use permission-controlled external HTTPS references. The portal does not fetch those links, host confidential source rows on a public CDN, or treat a successful submission as a verified build. An instructor assigns a real registered peer; only that peer can respond. Source-linked author responses, immutable revisions and instructor rubric/gate decisions are retained. Pending authentic-source mode cannot be accepted even if an instructor checks every gate.

Progress distinguishes knowledge, submitted evidence and individually verified competence. Each course midpoint is recorded after ceil(N/2) verified topic units; the program midpoint follows seven completed micro-courses. Static acknowledgement is the default. Original fictional Tally/Quillfin decoration is optional, up to 60 seconds, with Pause, Skip, Escape, reduced-motion support, a persisted disable-motion setting, mute and opt-in quiet cue. Navigation remains usable.

Credential issuance requires the approved 10/15/20/15/35/5 weighting, every course/assessment threshold, competent technical and capstone areas, all absolute gates, two real source-linked review cycles and 80% overall. It issues **Evidence Desk QA Measurement Certificate**, with issuer, date, version/hash and an immutable eligibility snapshot. It is training completion, not ISO certification, an accredited diploma or an auditor qualification.

The 43 approved memory scripts are available as post-topic-quiz text equivalents. No recorded narration, captioned MP4 or playable memory-video production is claimed. The inherited 66-hour applied planning estimate is not a measured self-paced duration; larger labs are resumable. Flexible +1/+7/+21-day returns have no expiry, grade penalty or external reminder automation.

## Application and repository boundary

In `Lev0n82/AskMarilyn`, this academy belongs under **apps/learnsdlc/**. The repository root remains the separate Hansen chat/widget app. Install/build/test from the correct directory. No workspace conversion, root deployment workflow or shared database/authentication configuration has been introduced.

```bash
cd apps/learnsdlc
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

The academy retains its original Manus-managed environment. Copy required environment values privately from the owner’s academy configuration; never commit `.env`, JWT/OAuth/forge keys, source exports or learner records. Hansen must use its own independent configuration. Do not point it at the academy database merely to make a test pass.

## Schema and private content installation

The new schema is isolated in `drizzle/evidence-schema.ts` and migration `0010_fresh_hannibal_king.sql`. It adds only `ed_releases`, `ed_attempts`, `ed_learning`, `ed_submissions`, `ed_reviews` and `ed_credentials`, plus owner/version indexes. Legacy tables and rows were not reseeded, dropped or repurposed.

The existing managed academy has already received the reviewed migration through its SQL execution flow. Its application-level Drizzle migration journal should not be assumed synchronized by manual SQL execution. Before using a general migration command on an existing instance, inspect its journal/table state and reconcile this applied migration. Do not blindly rerun a CREATE TABLE migration or replay the old academy’s migration history. For a new isolated installation, use the complete reviewed schema/migration history against that installation’s own empty database.

Protected banks and formative solutions are deliberately absent from public GitHub source and client bundles. The owner-only installer takes the approved private v3 authoring workspace:

```bash
cd apps/learnsdlc
pnpm exec tsx scripts/import-evidence.ts /private/path/to/evidence_desk_self_paced_v3
```

The installer checks canonical IDs, the 43/277 inventory, all question option IDs/keys, both games per topic, public/private separation and version/hash immutability. It writes only the approved release row. Repeating an identical import is harmless; replacing the same version with different content is rejected. A missing private release or unavailable database fails closed. Public instructions/resources live in `course-content/evidence-desk/`; audience-safe teaching files use the academy’s hosted storage references.

## Instructor operation

A real authorized instructor must hold the existing server-side `admin` role. Browser email checks are not sufficient. Learners see their own submissions and registered reviewer ID. Instructor intake assigns an actual existing reviewer by registered ID, then records source-limited rubric levels and all absolute gates. The learner responds to the real peer challenge and submits a traceable repair/revision. Two complete real review cycles still need instructor verification for credential credit.

Protected-final intake records feedback release and remediation authorization. The source supplies one form only; instructor approval authorizes a learning repeat, not a falsely claimed secure alternate exam. Credential issuance computes eligibility from accepted records and accepts no client-supplied grade or self-declared completion.

## Verification and known limits

New unit/service tests exercise safe imports, ID-based grading, exact thresholds, held keys, ownership, stale-save rejection, idempotency, serialized changes, registered reviewers, pending-source gates, authentic review/repair, same-millisecond revision ordering, once-only midpoints and complete certificate gating. Existing 91 academy tests are also retained; the final suite passes 131 tests, including 40 new Evidence Desk tests. Nine final browser tests pass. Scoped core/service/import coverage is 98.3% statements/lines, 90.4% branches and 100% functions. Browser tests visit every introduction/topic, exercise public privacy/auth boundaries, and use isolated in-memory storage plus the actual service for authenticated draft/reload, repair/review and sensory controls. They create no production learner/test records.

```bash
pnpm exec vitest run server/evidence --coverage \
  --coverage.include='server/evidence/{core,service,import}.ts'
pnpm exec playwright install chromium
pnpm exec playwright test --config=playwright.evidence.config.ts
```

Coverage numbers are scoped to those named business-logic files, not all legacy code, SQL-driver integration, every tRPC error branch or an accessibility certification. The browser suite uses native keyboard/control checks and mobile reflow observations. Real assistive-technology testing and instructor/source quality review remain necessary.

The Hansen root type-check and production build pass without source changes. In a deliberately database-disconnected root test run, 17 of 18 tests pass; its existing password-reset success test fails with “Database not available.” This is the unchanged root’s dependency, not a new academy failure. It was not “fixed” by sharing the academy database or changing Hansen files.

## Publishing and remaining owner provisions

A GitHub merge does not publish the original Manus academy or restore its hosting. Use the final tested checkpoint’s existing Publish control. The learnsdlc.org billing/hosting notice must be resolved by the owner through the normal support/account process; no billing, domain or hosting-account changes have been performed.

Provide authorized authentic Azure sources/exports, frozen inventories, independent reconciliation controls, required supplementary product/security/incident/user-study evidence and actual reviewers. Recorded memory videos, expert interviews and an approved alternate-form bank can be added later. Missing evidence stays Not Measured or assessment pending. No automatic reminder service, tenant connection, fabricated organization dataset or paid media generation is part of this release.
