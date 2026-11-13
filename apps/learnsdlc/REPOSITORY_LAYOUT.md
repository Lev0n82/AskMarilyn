# LearnSDLC academy application

This directory contains the original LearnSDLC academy and its additive Evidence Desk Azure DevOps QA Measurement program. The existing repository-root Hansen chat/widget application is intentionally unchanged. The two applications have separate installation, authentication, database and deployment boundaries.

Build the academy from `apps/learnsdlc`, not from the repository root. Start with `README.EVIDENCE_DESK.md` for the delivered learning flows, owner-only private-bank installation, schema migration cautions, instructor roles, tests and publishing requirements.

```bash
cd apps/learnsdlc
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

The academy uses its original Manus-managed project and existing authentication. A GitHub checkout is not an automatic custom-domain deployment. Keep academy secrets and authentic source/learner records out of source control. Do not share the academy database with the Hansen application or adopt Hansen's standalone authentication for academy learners without a separately approved design.

The recovered academy history had no common ancestor with the Hansen root history; the additive directory arrangement avoids replacing either application or rewriting repository history. No root workflow, dependency manifest, application code or database configuration has been changed by this addition.
