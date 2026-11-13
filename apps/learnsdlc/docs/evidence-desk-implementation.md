# Evidence Desk v3 implementation contract

Approved scope: additive LearnSDLC integration, 12 November 2026. See the owner-approved architecture at `/home/ubuntu/portal_integration_observations/LEARNSDLC_QA_INTEGRATION_PLAN.md`. Existing academy authentication, courses, tables, layout and Hansen application remain unchanged.

## Data architecture

`ed_releases` stores immutable version/hash, public course/asset manifest and private bank/feedback JSON. Public procedures construct explicit DTOs; never return this row. Version is the primary key. Import rejects existing version with a different hash. The owner-only offline importer is not a public API and requires the private source package outside GitHub. Teaching JSON contains no protected answers; private bank and feedback are not committed.

`ed_attempts` stores UUID primary key, userId, contentVersion, assessmentKey, expected form JSON, response map JSON, integer revision, draft/submitted state, score, question count, pass flag, feedback-release flag, final-retake approval and UTC created/submitted milliseconds. Form JSON contains immutable question objects with server-side keys; only sanitized question ID/prompt/option ID/text leave the service. Selection is fixed at start. Updates use transactions and row locking; owner/revision checks precede mutation. Submission is idempotent on submitted attempts and never recalculates an old grade against a changed bank.

`ed_learning` stores one row per learner/version, a revisioned bounded resume object, topic learning records, practice records and midpoint history. New topic-learning records retain private prediction/recall and flexible return history; they do not establish verified competence. Resume records include approved route, topic section and scroll position, not credentials, source rows or answer keys. Unique primary key is learner/version. Transactions serialize progress/milestone changes.

`ed_submissions` stores UUID, learner/version, kind (`topic`, `course`, `technical`, `capstone`, `peer`), course/topic IDs, parent-revision UUID, minimized HTTPS evidence reference, connection mode, permitted notes, submitted timestamp and immutable learner revision. A new revision creates another row. An evidence pointer is not automatically fetched or publicly published. Core dataset absence must be indicated rather than fabricated.

`ed_reviews` stores UUID, submission UUID, assigned reviewer user ID, review type (`peer` or `instructor`), response, author response, normalized rubric levels/gates JSON, state, reviewer/author timestamps. Author cannot be assigned as own peer. Only assigned reviewer may respond; only instructor/admin may make instructor competence judgments. Owner and assigned reviewer may read scoped records; ordinary learners cannot enumerate others' artifacts. Instructor acceptance is immutable per submitted revision; a changed revision needs a new review. Records retain repair requests, original feedback and later author responses.

`ed_credentials` stores learner/version unique key, certificate UUID, issuer ID, immutable eligibility snapshot and UTC issue timestamp. Issuance requires a trusted instructor and all computed gates; client cannot supply score or completion. A repeated issue request returns the same certificate.

No new table stores file bytes. Private evidence is handled as a permissioned external reference in this implementation, not an upload through public Manus storage. The instruction explicitly requires recipient-controlled HTTPS links and disallows tokens/query credentials. Public diagrams and blank templates are hosted separately.

## Typed validation and errors

Canonical course IDs C01–C14 and authored topic IDs must resolve in the release. Version matches the immutable release. Kinds are closed enums. Attempt/review/submission UUIDs are validated. Responses map exact question IDs to four-option A–D values; reject missing/extra/invalid IDs. Rationale and key fields never enter draft payloads. Draft expected revision is a nonnegative integer. Notes/text have bounded length. Evidence references use HTTPS without embedded username/password, token-like query parameters or access credentials; no server fetching. JSON error returns use tRPC BAD_REQUEST, NOT_FOUND, FORBIDDEN, CONFLICT, PRECONDITION_FAILED or INTERNAL_SERVER_ERROR. Database/bank absence fails closed. Logging omits keys, tokens and source records.

Owner identity comes from ctx.user.id. Instructor role is ctx.user.role === admin, not a browser email check. Public endpoints are only catalogue/course/topic/resources. Signed-in operations preserve existing Manus auth; no framework authentication replacement.

## Endpoint signatures

`catalog(): {version, title, courses: {id,title,introduction,topics:[id,title],outcomes}[]}`

`course({courseId}): learner Course`; `topic({courseId,topicId}): learner Topic`; `resources(): hosted public template/graphic manifest`.

`start({kind:topic|checkpoint|final|program,courseId?,topicId?}): sanitized Attempt`; `getAttempt({attemptId}): sanitized Attempt`; `saveAttempt({attemptId,revision,responses}): sanitized Attempt`; `submitAttempt({attemptId,revision}): sanitized scored Attempt`. Final/program retries require previous final remediation approval. Topic/checkpoint retries are unlimited. Submitted attempts return existing result regardless of repeated operation, but never accept changed responses.

`practice({courseId,topicId,feedbackId,response}): {expected,correction,evaluation:reflection|matched|compare}`. Evaluation handles unambiguous authored choice labels only; complex free responses receive compare-to-exemplar feedback, never a falsely asserted automatic correctness grade. All 86 three-round activities remain executable through committed responses and disclosed feedback. No practice grade enters certification.

`saveLearning({topicId,prediction?,recall?,returnDay?}): revisioned record`; `saveResume({route,section,scrollY,revision}): saved record`; `progress(): computed learner Progress`. The +1/+7/+21 panel is internal flexible practice only, not an external reminder automation.

`submitEvidence({kind,courseId?,topicId?,parentId?,url,connectionMode,notes}): Submission`; `mySubmissions(): permitted author records`; `reviewQueue(): assigned reviews plus instructor intake for admins`; `assignReview({submissionId,reviewerId,type}): Review`; `respondReview({reviewId,response}): Review`; `authorResponse({reviewId,response}): Review`. Admin assigns a real reviewer by registered user ID, not inventing a peer. Author may respond after peer feedback; peer-credit acceptance additionally requires instructor verification.

`judge({submissionId,levels:number[],gates:{truthful,authorized,reconciled,accessible,authentic},reason}): instructor review`. All five absolute gates and every required level >=2 are necessary. Course rubric labels use the approved local reviewer criteria. Topic review uses one individual-competence criterion. Technical rubric uses five equal areas. Capstone uses seven areas with weights [15,10,25,15,15,10,10]. Peer credit uses a source-linked complete review cycle criterion. Missing authentic evidence cannot be marked accepted merely from a URL.

`releaseFeedback({attemptId,reason})`, `allowRetake({attemptId,reason,mode:learning_repeat})` and `issueCredential({learnerId}): Credential` are instructor-only. This edition supplies only one form; low-stakes repeats must be labelled honestly. No secure alternate-form claim.

## Eligibility calculation

A topic is knowledge-passed after latest qualifying 3/3 topic attempt and individually verified after accepted authentic topic evidence. A course is complete after every topic is verified, checkpoint 3/3, final >=4/5 and competent course evidence. Midpoint counts ceil(N/2) verified topic IDs per course; program midpoint counts seven distinct completed courses. Historical once-only records survive later revisions.

The six weighted components are topic checks 10%, course tests 15%, technical 20%, program exam 15%, capstone 35%, two verified peer cycles 5%. Latest qualifying accepted scores and instructor revisions are used. Every course, every assessment threshold, technical/capstone >=80%, all rubric areas >=2 and all absolute gates must pass; games/video watches/visits do not compensate. Program final needs 29/36. Rubric mapping [0,50,80,100] applies; capstone weighted mean and five-area technical equal mean are explicit. Pending authentic source assessment is shown as pending, not as observed zero data.

## Acceptance and test strategy

Function tests exercise malformed imports, public DTO stripping, exact option membership, deterministic stored-form grading, zero/missing inputs, rubric area gates, credential weights and midpoint boundaries. Service tests exercise real business logic against an isolated in-memory repository implementing transaction semantics; database SQL is separately tested with an isolated local MySQL instance or dedicated test-only database, not production learner records. Module tests exercise all authored topics and bank mappings. End-to-end tests exercise public navigation, authenticated save/reload, failed/passed knowledge checks, assignment authorization, private review boundaries, final feedback hold, certificate rejection and user-controlled celebration. Existing 91 tests remain regression coverage, not proof of new behavior.

Public content self-validates at startup/import. Every mutation validates the current version and ownership; progress recomputes from authoritative accepted records. No background worker or persistent CPU service is needed. Production remains the existing managed Node server. Complete schema migrations are additive, reviewed before application, and independent of Hansen's root database. Rollbacks use checkpoints and preserve learner history.
