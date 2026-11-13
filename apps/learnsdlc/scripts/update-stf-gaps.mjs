import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// ============================================================
// MODULE 1: Why We Test — Add SQA vs Testing, V&V, Generic Skills, Independence
// ============================================================
const module1Spark = `*If a bridge engineer told you, "We built it, but we never checked if it could hold any weight" — would you drive across it?*

Of course not. Yet every day, software ships to millions of users with exactly that level of confidence. The reason we test software is the same reason we test bridges, medicines, and parachutes: because the cost of failure is real, and the cost of ignorance is always higher than the cost of knowledge.

Software testing is not about proving that software works. Read that sentence again. Testing is about finding the ways in which software does not work — before your users find them for you. This distinction is fundamental. A test that passes tells you one thing; a test that fails tells you everything.

**The Economics of Defects**

Here is a number that should haunt every developer: a defect found in production costs 30 to 100 times more to fix than the same defect caught during requirements review. This is not opinion — it is decades of industry data from IBM, NIST, and the Standish Group.

| When Defect Is Found | Relative Cost to Fix |
|----------------------|---------------------|
| Requirements review | 1x (baseline) |
| Design phase | 3-6x |
| Coding / unit testing | 10x |
| Integration testing | 15-40x |
| System testing | 30-70x |
| Production | 40-1000x |

*Why do you think the cost multiplies so dramatically the later a defect is found?*

The answer is dependencies. A defect in a requirement corrupts the design, the code, the tests, the documentation, the training materials, and the user expectations. By the time you find it in production, you must unravel and repair every layer built on top of the flawed foundation.

**Real-World Disasters**

In 1999, NASA's Mars Climate Orbiter was lost because one team used metric units while another used imperial — a requirements mismatch that testing should have caught, resulting in a $327.6 million loss. In 2012, Knight Capital Group lost $440 million in 45 minutes due to a software deployment error that proper regression testing would have prevented. The Therac-25 radiation therapy machine delivered lethal doses to patients due to a race condition that was never properly tested.

**The Error-Fault-Failure Chain**

A person makes an Error (misreads a requirement) → the error creates a Fault in the code (wrong logic) → the fault causes a Failure when executed (system crashes). Not all faults cause failures — some faulty code paths may never be reached. But every failure traces back to a fault, and every fault traces back to a human error.

**The Testing Mindset**

Developers think constructively: "How do I build this to work?" Testers think destructively: "How might this fail?" This is not negativity — it is disciplined skepticism. A good tester asks: What happens if the user enters unexpected data? What if two users act simultaneously? What if the network drops mid-transaction?

**Software Quality Assurance (SQA) vs. Testing — The Critical Distinction**

Many people confuse testing with quality assurance. They are related but fundamentally different:

| Aspect | Software Quality Assurance (SQA) | Software Testing |
|--------|----------------------------------|-----------------|
| Focus | Process-oriented | Product-oriented |
| Goal | Prevent defects from being introduced | Find defects that were introduced |
| When | Throughout the entire SDLC | Primarily during and after implementation |
| How | Standards, audits, process improvement | Execution, analysis, verification |
| Scope | Organization-wide processes | Specific software products |

SQA asks: "Are we following the right processes to build quality in?" Testing asks: "Does this specific product actually work?" SQA is proactive (preventing defects); testing is reactive (finding defects). Both are essential — SQA without testing means you trust your process blindly; testing without SQA means you catch defects but never fix the process that creates them.

*If a factory produces defective parts, should you inspect every part (testing) or fix the manufacturing process (SQA)? The answer is both.*

**Verification vs. Validation — Are We Building It Right? Are We Building the Right Thing?**

These two V-words are the foundation of quality:

- **Verification:** "Are we building the product RIGHT?" — Checks that the product conforms to its specification. Reviews, inspections, walkthroughs, and static analysis are verification activities. You verify against the design.
- **Validation:** "Are we building the RIGHT product?" — Checks that the product meets the user's actual needs. User acceptance testing, beta testing, and usability testing are validation activities. You validate against the user's expectations.

A product can pass verification (built exactly to spec) but fail validation (the spec was wrong, and users hate it). This is why both are necessary.

**Generic Skills Required for Testing (ISTQB 1.5.1)**

Testing is not just a technical skill — it requires a specific set of human capabilities:

| Skill | Why It Matters |
|-------|---------------|
| Analytical thinking | Decompose complex systems into testable components |
| Critical thinking | Question assumptions, challenge "it works on my machine" |
| Attention to detail | Spot the one pixel off, the one edge case missed |
| Communication | Write clear defect reports, explain risks to stakeholders |
| Domain knowledge | Understand the business context to test meaningfully |
| Technical literacy | Read code, understand architectures, use tools effectively |
| Curiosity | Ask "what if?" relentlessly — the best testers are naturally curious |
| Empathy | Think like the user, not like the developer |

*A tester with perfect technical skills but poor communication will find defects that never get fixed. A tester with perfect communication but no analytical thinking will write beautiful reports about the wrong things. Which skill gap is more dangerous?*

**Independence of Testing (ISTQB 1.5.3)**

Who should test the software? The developer who wrote it? A separate test team? An external company? The ISTQB defines levels of testing independence:

| Level | Who Tests | Independence | Trade-off |
|-------|-----------|-------------|-----------|
| Level 0 | Developer tests own code | None | Fastest, but blind to own assumptions |
| Level 1 | Another developer tests | Low | Some fresh perspective |
| Level 2 | Dedicated test team in same org | Medium | Professional testing skills, shared context |
| Level 3 | Dedicated test team from different org | High | No organizational bias, but less domain knowledge |
| Level 4 | External test organization | Very High | Maximum objectivity, but expensive and slow |

**Benefits of independence:** Fresh eyes find defects the developer cannot see (cognitive bias). Independent testers challenge assumptions. They have no emotional attachment to the code.

**Drawbacks of independence:** Communication overhead increases. Independent testers may lack domain context. Developers may feel less responsible for quality ("that's the tester's job").

The best practice is a balanced approach: developers write unit tests (Level 0), a dedicated team handles system/integration testing (Level 2), and independent testers or users handle acceptance testing (Level 3-4).`;

const module1Imprint = `*Imagine you are testing a self-driving car. A defect in the braking algorithm is found during a real-world test drive at 60 mph. Now imagine that same defect had been found during a requirements review, when someone asked: "What should happen when the sensor detects an obstacle at 60 mph?" Which scenario would you prefer to live in?*

Now consider: Was the self-driving car failure a testing problem or an SQA problem? If the process required a requirements review with safety engineers present (SQA), the defect would have been caught before code was written. If the process only relied on testing after implementation, the defect was found at 60 mph. The answer is that both SQA and testing failed — the process should have caught it early (SQA), and testing should have caught it before a real car was involved (verification in simulation before validation on the road).`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 1",
  [module1Spark, module1Imprint]
);
console.log("Updated Module 1: Why We Test (added SQA vs Testing, V&V, Generic Skills, Independence)");


// ============================================================
// MODULE 9: Test Levels & Types — Add 15+ missing test types
// ============================================================
const module9Spark = `*If you only tested the individual bricks of a building but never tested whether the walls stood up together, would you trust the building?*

Test levels are layers of testing, each with a different scope and purpose. Skipping a level is like removing a safety net — the defects that level would have caught will fall through to the next level (or to production).

**The Four Test Levels (ISTQB):**

| Level | Scope | Who Tests | Catches |
|-------|-------|-----------|---------|
| Unit | Single function/method | Developer | Logic errors, boundary issues |
| Integration | Component interactions | Developer/Tester | Interface mismatches, data flow errors |
| System | Entire application | Test team | End-to-end workflow failures |
| Acceptance | Business requirements | Users/Stakeholders | Requirement misunderstandings |

**Test Types — What You Are Testing:**

| Type | Purpose | Example |
|------|---------|---------|
| Functional | Does it do what it should? | Login with valid credentials |
| Non-functional | How well does it do it? | Page loads in under 2 seconds |
| Structural (White-box) | Is the code well-constructed? | Code coverage analysis |
| Change-related | Did the fix break anything? | Regression testing after a patch |

**Confirmation Testing vs. Regression Testing**

These two are often confused but serve different purposes:

- **Confirmation Testing (Re-testing):** After a defect is fixed, you re-run the exact test that originally found the defect to confirm the fix works. It answers: "Is this specific bug actually fixed?"
- **Regression Testing:** After any change (bug fix, new feature, configuration change), you run a broader set of tests to ensure nothing else broke. It answers: "Did the change break anything that was working before?"

*A developer fixes a login bug. Confirmation testing re-runs the login test. Regression testing runs the entire test suite to make sure the fix did not break checkout, profile, or search. Why is regression testing more expensive?*

Because the regression suite grows with every feature. A system with 1000 features needs 1000+ regression tests. Without automation, this becomes unsustainable.

**Smoke Testing and Sanity Testing**

| Aspect | Smoke Testing | Sanity Testing |
|--------|--------------|----------------|
| Purpose | "Does the build even work?" | "Does the specific fix/feature work?" |
| Scope | Broad — tests critical paths | Narrow — tests specific area |
| When | After every new build | After a specific change |
| Depth | Shallow — surface-level checks | Moderate — focused but deeper |
| Analogy | Turning on a new appliance to see if it smokes | Checking if a repaired part works |

Smoke testing is the first gate: if the application cannot start, login, or display its main page, there is no point running deeper tests. Sanity testing is a focused check after a targeted change.

**Alpha Testing and Beta Testing**

| Aspect | Alpha Testing | Beta Testing |
|--------|--------------|-------------|
| Where | Developer's site/environment | User's real environment |
| Who | Internal testers, developers | Real external users |
| When | Before beta release | After alpha, before production |
| Goal | Find defects in controlled setting | Find defects in real-world conditions |
| Feedback | Immediate, detailed, technical | Varied, user-perspective, practical |

Alpha testing is like a dress rehearsal — performed internally, in a controlled environment. Beta testing is opening night — real users, real environments, real surprises.

**Installation Testing**

Does the software install correctly on all target platforms? Installation testing verifies: fresh installation works, upgrade from previous version works, uninstallation removes all components, installation with different configurations (custom paths, optional components) works, and installation handles insufficient disk space, missing prerequisites, and permission issues gracefully.

**Compatibility Testing**

Does the software work across different environments?

| Compatibility Dimension | Examples |
|------------------------|---------|
| Operating Systems | Windows 10/11, macOS 13/14, Ubuntu 22/24 |
| Browsers | Chrome, Firefox, Safari, Edge (multiple versions) |
| Devices | Desktop, tablet, mobile (various screen sizes) |
| Hardware | Different RAM, CPU, GPU configurations |
| Network | WiFi, 4G, 5G, slow connections, offline |
| Backward compatibility | Works with data from previous versions |

**Visual/GUI Testing**

GUI testing verifies the visual presentation and user interface elements: correct layout and alignment, proper rendering of fonts, colors, and images, responsive design across screen sizes, correct behavior of UI controls (buttons, dropdowns, modals), keyboard navigation and tab order, and visual consistency across pages.

**Destructive Testing and Recovery Testing**

| Aspect | Destructive Testing | Recovery Testing |
|--------|--------------------|-----------------| 
| Purpose | Deliberately break the system | Verify the system recovers from failure |
| Method | Overload, corrupt data, kill processes | Simulate crashes, pull plugs, corrupt files |
| Goal | Find the breaking point | Verify graceful recovery |
| Example | Send 1 million requests per second | Kill the database mid-transaction |

*If you never test what happens when things go catastrophically wrong, you will discover it in production — at 3 AM, on a holiday, with your biggest client watching.*

**Performance Testing — The Subtypes**

| Subtype | Purpose | Question It Answers |
|---------|---------|-------------------|
| Load Testing | Test under expected load | "Can it handle 1000 concurrent users?" |
| Stress Testing | Test beyond expected load | "What happens at 10,000 users? When does it break?" |
| Volume Testing | Test with large data volumes | "What happens with 10 million records?" |
| Endurance (Soak) Testing | Test under sustained load | "Does it degrade after running 72 hours?" |
| Spike Testing | Test sudden load increases | "What happens when traffic jumps 10x in 1 minute?" |
| Scalability Testing | Test ability to scale | "Does adding servers actually improve performance?" |

**Security Testing — The Six Core Concepts**

| Concept | What It Tests | Example |
|---------|--------------|---------|
| Confidentiality | Data is accessible only to authorized users | Encryption, access controls |
| Integrity | Data is not modified without authorization | Checksums, audit trails |
| Authentication | Users are who they claim to be | Login, MFA, biometrics |
| Authorization | Users can only do what they are allowed to do | Role-based access, permissions |
| Non-repudiation | Actions cannot be denied after the fact | Digital signatures, audit logs |
| Availability | System is accessible when needed | DDoS protection, redundancy |

**Accessibility Testing**

Accessibility testing ensures software is usable by people with disabilities, following WCAG (Web Content Accessibility Guidelines) standards:

- **Visual:** Screen reader compatibility, sufficient color contrast, text alternatives for images
- **Motor:** Keyboard-only navigation, adequate click target sizes, no time-dependent interactions
- **Auditory:** Captions for audio content, visual alternatives for sound alerts
- **Cognitive:** Clear language, consistent navigation, error prevention and recovery

*If 15% of the world's population has some form of disability, and your software is inaccessible, you have excluded over 1 billion potential users. Is that a quality issue or a business issue? Both.*

**Internationalization (i18n) and Localization (l10n) Testing**

| Aspect | Internationalization (i18n) | Localization (l10n) |
|--------|---------------------------|-------------------|
| Definition | Design software to support multiple locales | Adapt software for a specific locale |
| Tests | Character encoding (Unicode), date/time formats, text expansion, RTL layouts | Translated text accuracy, cultural appropriateness, local regulations |
| Example | Does the UI handle Japanese characters? | Is the French translation correct and natural? |

**Maintenance Testing**

When existing software is modified (bug fix, enhancement, migration), maintenance testing ensures the changes work and nothing else broke. Triggers include:

- **Corrective:** Bug fixes — verify the fix and run regression
- **Adaptive:** Environment changes (new OS, new database version) — verify compatibility
- **Perfective:** Enhancements and new features — full test cycle
- **Preventive:** Refactoring, technical debt reduction — regression testing

**Impact analysis** is critical for maintenance testing: before testing, analyze which parts of the system are affected by the change, and focus testing effort there.`;

const module9Imprint = `*A team ships a feature that passes all unit tests and system tests but fails acceptance testing because the business requirement was misunderstood. Which test level was missing from their process, and why?*

They likely skipped or poorly executed integration testing and requirement reviews. More importantly, acceptance test cases should have been written alongside the requirements (V-Model approach) to catch the misunderstanding before coding began.

Now consider this: Your e-commerce application works perfectly on Chrome/Windows but crashes on Safari/iOS. Your load tests pass with 100 users but the system collapses at 500. Your English interface is flawless but the Japanese version has overlapping text everywhere. Your login works for sighted users but is completely inaccessible to screen reader users. Each of these is a different test type that was skipped. Which ones would YOUR users encounter first?`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 9",
  [module9Spark, module9Imprint]
);
console.log("Updated Module 9: Test Levels & Types (added 15+ missing test types)");


// ============================================================
// MODULE 10: Test Design Techniques — Add branch coverage, error guessing, exploratory, checklist-based
// ============================================================
const module10Spark = `*A text field accepts ages 1-120. Do you need 120 test cases?*

No. Test design techniques are the intellectual tools that transform infinite input spaces into a manageable, effective set of test cases.

**Equivalence Partitioning (EP):** Divide inputs into groups (partitions) where all values in a group should behave the same way. Test one value from each partition.

For age 1-120: Partition 1 (invalid): < 1 | Partition 2 (valid): 1-120 | Partition 3 (invalid): > 120
Three test cases instead of 120.

**Boundary Value Analysis (BVA):** Defects love boundaries. Test the edges of each partition: 0, 1, 2, 119, 120, 121.

*Why do defects cluster at boundaries?*

Because developers write conditions like \`if (age >= 1 && age <= 120)\` and off-by-one errors are the most common coding mistakes.

**Decision Table Testing:** When behavior depends on combinations of conditions, create a table of all condition combinations and their expected outcomes.

| Member? | Order > $100? | Coupon? | Discount |
|---------|--------------|---------|----------|
| Yes | Yes | Yes | 30% |
| Yes | Yes | No | 20% |
| Yes | No | Yes | 15% |
| Yes | No | No | 10% |
| No | Yes | Yes | 15% |
| No | Yes | No | 5% |
| No | No | Yes | 5% |
| No | No | No | 0% |

**State Transition Testing:** When a system has distinct states and transitions between them, test each valid transition and attempt invalid transitions.

**Statement Coverage vs. Branch Coverage — The Critical Difference**

Statement coverage measures: "Has every line of code been executed at least once?" Branch coverage measures: "Has every decision point (if/else, switch) taken both the true AND false paths?"

Consider this code:
\`\`\`
if (age >= 18) {
  grantAccess();
}
logAttempt();
\`\`\`

A single test with age=20 achieves 100% statement coverage (every line executes). But it achieves only 50% branch coverage — the false branch (age < 18) was never tested. Branch coverage is stronger because it forces you to test both outcomes of every decision.

| Coverage Type | Measures | Strength | ISTQB Requirement |
|--------------|----------|----------|-------------------|
| Statement | Every line executed | Minimum baseline | Foundation Level |
| Branch (Decision) | Every true/false path taken | Catches more defects | Foundation Level |
| Condition | Every boolean sub-expression | Even stronger | Advanced Level |
| Path | Every possible execution path | Strongest but often infeasible | Theoretical ideal |

*100% statement coverage does NOT guarantee 100% branch coverage. But 100% branch coverage DOES guarantee 100% statement coverage. Why?*

Because to take both branches of every decision, you must execute every statement. But executing every statement does not require taking both branches.

**Error Guessing — The Art of Experienced Intuition**

Error guessing is an experience-based technique where the tester uses knowledge of common mistakes, past defects, and system weaknesses to design tests. It is not random — it is systematic intuition.

Common error-guessing targets:
- **Boundary conditions:** Zero, negative numbers, empty strings, null values
- **Division by zero:** Any calculation that could have a zero denominator
- **Empty collections:** What happens when a list, table, or queue is empty?
- **Concurrent access:** Two users editing the same record simultaneously
- **Special characters:** Unicode, emojis, SQL injection characters, HTML tags
- **Maximum values:** Integer overflow, maximum string length, disk full
- **Date/time edge cases:** Leap years, daylight saving transitions, midnight, year 2038
- **Network failures:** Timeout, disconnect mid-operation, slow connection

Error guessing works best when combined with formal techniques. Use EP and BVA for systematic coverage, then use error guessing to add tests for the "weird stuff" that formal techniques miss.

**Exploratory Testing — Simultaneous Design, Execution, and Learning**

Exploratory testing is NOT random clicking. It is a disciplined approach where the tester simultaneously designs tests, executes them, and learns about the system — all in real time.

Key elements of exploratory testing:
- **Test Charters:** A charter defines the mission: "Explore the checkout process with focus on payment error handling using various card types for 60 minutes."
- **Session-Based Test Management (SBTM):** Organize exploratory testing into timed sessions (typically 60-90 minutes) with defined charters, notes, and debriefs.
- **Heuristics:** Experienced testers use mental models like SFDPOT (Structure, Function, Data, Platform, Operations, Time) to guide exploration.

| Aspect | Scripted Testing | Exploratory Testing |
|--------|-----------------|-------------------|
| Test design | Before execution | During execution |
| Repeatability | High — same steps every time | Low — depends on tester's path |
| Creativity | Low — follows the script | High — adapts in real time |
| Best for | Regression, compliance | New features, usability, edge cases |
| Documentation | Detailed test cases | Session notes, charters |

*A scripted test will find the defects you predicted. An exploratory test will find the defects you never imagined.*

**Checklist-Based Testing (ISTQB 4.4.3)**

Checklist-based testing is an experience-based technique that uses a high-level list of items to be checked, without detailed test steps. The tester uses the checklist as a guide but applies their own judgment on how to test each item.

Example checklist for a login page:
- [ ] Valid credentials → successful login
- [ ] Invalid password → appropriate error message
- [ ] Empty fields → validation message
- [ ] SQL injection attempt → rejected safely
- [ ] Password masking → characters hidden
- [ ] "Remember me" → session persists
- [ ] Account lockout after N failed attempts
- [ ] Password reset link works
- [ ] Session timeout after inactivity
- [ ] Concurrent login handling

Checklists are more flexible than scripted test cases but more structured than pure exploratory testing. They are especially useful for experienced testers who need guidance without rigid scripts, and for testing non-functional aspects like usability and accessibility.`;

const module10Imprint = `*A login form has: username (1-50 chars), password (8-128 chars), and a "Remember Me" checkbox. Using equivalence partitioning and boundary value analysis, how many test cases would you design? Compare this to testing every possible combination.*

Answer: EP gives ~9 partitions (3 per field x 3 fields). BVA adds ~12 boundary values. With the checkbox (2 states), you get roughly 24-30 meaningful test cases — versus the trillions of possible character combinations.

Now add error guessing: What about Unicode usernames? Passwords with only spaces? The "Remember Me" checkbox on a shared computer? SQL injection in the username field? A session that is 30 days old? These are the tests that formal techniques miss but experienced testers instinctively add. The best test suites combine formal techniques (EP, BVA, decision tables) with experience-based techniques (error guessing, exploratory, checklists) for maximum coverage.`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 10",
  [module10Spark, module10Imprint]
);
console.log("Updated Module 10: Test Design Techniques (added branch coverage, error guessing, exploratory, checklist-based)");


// ============================================================
// MODULE 12: Test Documentation — Add static vs dynamic, testware, review success factors, test scenarios, basic testing cycle
// ============================================================
const module12Spark = `*If a surgeon performed an operation but kept no records — no notes, no imaging, no post-op report — would you trust the outcome?*

Test documentation serves the same purpose as medical records: it proves what was done, captures what was found, and enables others to understand and repeat the work.

**Testware — The Complete Set of Testing Artifacts**

Testware is the collective term for all artifacts produced during the test process. Just as software is the output of development, testware is the output of testing:

| Testware Category | Examples |
|-------------------|---------|
| Planning | Test policy, test strategy, test plan, test schedule |
| Design | Test conditions, test cases, test data, test procedures |
| Execution | Test logs, defect reports, test scripts |
| Reporting | Test progress reports, test summary reports |
| Environment | Test environment configurations, test tools setup |
| Automation | Automated test scripts, test frameworks, CI/CD configs |

Testware must be maintained, version-controlled, and treated with the same care as production code. Neglected testware becomes a liability — outdated tests give false confidence.

**The Essential Test Documents (IEEE 829 / ISTQB):**

| Document | When Created | Purpose |
|----------|-------------|---------|
| Test Policy | Organization level | Defines testing principles and goals |
| Test Strategy | Project level | Overall approach, tools, environments |
| Test Plan | Phase level | Scope, schedule, resources, risks |
| Test Case | Design phase | Step-by-step test instructions |
| Test Execution Log | Execution phase | Actual results, pass/fail status |
| Defect Report | When defect found | Detailed defect description |
| Test Summary Report | End of phase/project | Coverage, metrics, recommendations |

**Test Scenarios vs. Test Cases — Know the Difference**

| Aspect | Test Scenario | Test Case |
|--------|--------------|-----------|
| Level of detail | High-level, what to test | Detailed, how to test |
| Format | One-line description | Step-by-step instructions |
| Example | "Verify user can login" | "1. Open /login 2. Enter admin@test.com 3. Enter Password123 4. Click Submit 5. Verify dashboard loads" |
| Purpose | Coverage planning | Execution guidance |
| Maintenance | Easy — few words to update | Hard — many steps to update |

Test scenarios come first (what to test), then test cases are derived from scenarios (how to test each scenario). One scenario may produce multiple test cases.

**The Basic Testing Cycle — 9 Phases**

The complete testing process follows these phases:

| Phase | Activity | Key Output |
|-------|----------|-----------|
| 1. Test Planning | Define scope, approach, resources, schedule | Test Plan |
| 2. Test Analysis | Analyze test basis (requirements, design) to identify test conditions | Test conditions |
| 3. Test Design | Create test cases and test data from test conditions | Test cases, test data |
| 4. Test Implementation | Organize test cases into procedures, prepare test environment | Test procedures, environment |
| 5. Test Execution | Run tests, compare actual vs. expected results | Test logs, defect reports |
| 6. Evaluating Exit Criteria | Check if exit criteria are met (coverage, pass rate) | Test progress report |
| 7. Test Reporting | Summarize results, coverage, and recommendations | Test summary report |
| 8. Test Closure | Archive testware, document lessons learned | Test closure report |
| 9. Test Monitoring & Control | Ongoing throughout — track progress, take corrective action | Status updates |

*Phase 9 is not sequential — it runs continuously throughout all other phases, like a heartbeat monitor during surgery.*

**Entry Criteria and Exit Criteria — The Quality Gates**

| Criteria Type | Purpose | Examples |
|--------------|---------|---------|
| Entry Criteria | Conditions that must be met BEFORE testing begins | Test environment ready, test data loaded, build deployed, test plan approved |
| Exit Criteria | Conditions that must be met BEFORE testing ends | 95% test cases executed, all critical defects fixed, coverage targets met, test summary report approved |

Without entry criteria, you waste time testing unstable builds. Without exit criteria, testing never ends — or ends too early.

**Writing Effective Test Cases:**

A good test case has: a unique ID, a clear title, preconditions, step-by-step actions, expected results for each step, and postconditions.

*What makes a test case "maintainable"?*

It is independent (does not depend on other test cases running first), it uses clear language (not "click the thing"), and it separates test data from test logic.

**Static Testing vs. Dynamic Testing — The Fundamental Comparison**

| Aspect | Static Testing | Dynamic Testing |
|--------|---------------|----------------|
| Code execution | No — examines artifacts without running them | Yes — executes the software |
| What is examined | Requirements, design docs, code, test plans | Running software |
| When | Can start very early (requirements phase) | Requires executable code |
| Techniques | Reviews, inspections, walkthroughs, static analysis | Functional testing, performance testing, etc. |
| Defects found | Ambiguities, inconsistencies, deviations from standards | Functional failures, performance issues, crashes |
| Cost | Very low — no execution environment needed | Higher — requires test environment, data, tools |

Static testing finds defects directly (the defect itself in the document or code). Dynamic testing finds failures (symptoms of defects during execution), which must then be traced back to the underlying defect.

*Static testing can find defects that dynamic testing cannot — such as unreachable code, missing requirements, and documentation inconsistencies. Dynamic testing can find defects that static testing cannot — such as race conditions, memory leaks, and performance bottlenecks. This is why you need both.*

**Static Testing — Reviews and Inspections:**

| Review Type | Formality | Led By | Purpose |
|------------|-----------|--------|---------|
| Informal Review | Low | Anyone | Quick feedback |
| Walkthrough | Medium | Author | Explain and get feedback |
| Technical Review | High | Moderator | Find defects in work products |
| Inspection | Very High | Trained moderator | Formal defect detection with metrics |

**Success Factors for Reviews (ISTQB 3.2.5)**

Reviews fail when they become blame sessions or rubber-stamp exercises. Successful reviews require:

1. **Clear objectives** — Everyone knows what the review is trying to achieve
2. **Appropriate review type** — Match formality to the work product's criticality
3. **Small chunks** — Review manageable portions (not 500-page documents)
4. **Adequate preparation** — Reviewers must read the material BEFORE the meeting
5. **Management support** — Time for reviews is allocated, not stolen from "real work"
6. **Trained participants** — Reviewers know how to give constructive, specific feedback
7. **Focus on defects, not people** — "This requirement is ambiguous" not "You wrote a bad requirement"
8. **Follow-up** — Defects found in reviews are tracked and resolved, not forgotten
9. **Continuous improvement** — Review process itself is reviewed and improved

*A review where nobody prepared is worse than no review at all — it creates false confidence that the document was "reviewed and approved."*

**Test Estimation Techniques:**
- **Ratio-based:** Historical data (e.g., 3 test hours per requirement)
- **Wideband Delphi:** Expert consensus through rounds of estimation
- **Three-point:** (Optimistic + 4xMost Likely + Pessimistic) / 6`;

const module12Imprint = `*A tester leaves the company. Their replacement opens the test management tool and finds 2000 test cases with titles like "Test 1", "Test 2", "Login test", and "Check thing." No descriptions, no expected results, no traceability. How long will it take the new tester to become productive, and what should the team have done differently?*

Answer: Weeks to months of reverse-engineering. The team should have enforced test case standards, maintained their testware like production code, and ensured every test case had clear titles, steps, expected results, and traceability to requirements.

Consider also: If those 2000 test cases had been organized as test scenarios first ("Verify login," "Verify checkout," "Verify password reset"), the new tester could have understood the coverage in minutes, even without detailed steps. Scenarios provide the map; test cases provide the directions. You need both, but the map comes first.`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 12",
  [module12Spark, module12Imprint]
);
console.log("Updated Module 12: Test Documentation (added static vs dynamic, testware, review success factors, test scenarios, testing cycle)");


// ============================================================
// MODULE 13: Defect Management — Add test execution metrics, configuration management
// ============================================================
const module13Spark = `*"It doesn't work." — the three most useless words in software development.*

A defect report is a communication tool. Its purpose is to give the developer everything they need to understand, reproduce, and fix the problem — without asking a single follow-up question.

**The Defect Lifecycle:**

New → Assigned → In Progress → Fixed → Verified → Closed (or Reopened)

| Status | Meaning |
|--------|---------|
| New | Defect reported, not yet reviewed |
| Assigned | Triaged and assigned to a developer |
| In Progress | Developer is working on the fix |
| Fixed | Developer believes it is resolved |
| Verified | Tester confirms the fix works |
| Closed | Defect is resolved and verified |
| Reopened | Fix did not work or introduced new issues |

**Anatomy of a Good Defect Report:**

1. **Title:** Clear, specific summary (not "bug" or "broken")
2. **Environment:** OS, browser, version, database, network
3. **Steps to Reproduce:** Numbered, precise, repeatable
4. **Expected Result:** What should happen
5. **Actual Result:** What actually happens
6. **Severity:** Critical / Major / Minor / Cosmetic
7. **Priority:** Must fix now / Should fix soon / Can wait
8. **Attachments:** Screenshots, logs, videos

*What is the difference between severity and priority?*

Severity is the technical impact (crash vs. typo). Priority is the business urgency (fix before release vs. fix eventually). A typo in the CEO's name on the homepage is low severity but high priority. A crash in an unused feature is high severity but low priority.

**Defect Metrics:**
- **Defect Density:** Defects per 1000 lines of code
- **Defect Detection Rate:** Defects found in testing / Total defects (including production)
- **Mean Time to Resolve:** Average time from report to fix
- **Defect Leakage:** Defects that escaped to production

**Test Execution Metrics — Measuring Testing Progress and Effectiveness**

Beyond defect metrics, test execution metrics tell you how testing itself is performing:

| Metric | Formula | What It Tells You |
|--------|---------|-------------------|
| Test Case Pass Rate | (Passed / Total Executed) x 100 | Overall quality trend |
| Test Case Execution Rate | (Executed / Total Planned) x 100 | Testing progress |
| Test Case Blocked Rate | (Blocked / Total Planned) x 100 | Environment/dependency issues |
| Defect Discovery Rate | Defects found per test hour | Testing efficiency |
| Defect Fix Rate | Defects fixed per day/week | Development responsiveness |
| Requirements Coverage | (Requirements with tests / Total Requirements) x 100 | Coverage completeness |
| Automation Rate | (Automated tests / Total tests) x 100 | Automation maturity |

*If your test case pass rate is 98% but your defect leakage is high, what does that tell you? Your tests are passing but they are not testing the right things. High pass rates with high leakage means your test suite has gaps.*

**Communicating Test Status — Test Progress Reports**

Test progress reports should answer these questions for stakeholders:
1. How much testing is complete? (execution rate)
2. How many defects have been found? (by severity and priority)
3. Are we on track to meet exit criteria? (coverage, pass rate targets)
4. What are the risks? (blocked tests, open critical defects)
5. What is the recommendation? (release, delay, or conditional release)

Use visual dashboards: burn-down charts for test execution, trend charts for defect discovery/closure, and heat maps for risk areas.

**Configuration Management (ISTQB 5.4)**

Configuration management (CM) is the discipline of controlling and tracking changes to all project artifacts — code, test cases, test data, environments, and documentation.

*Imagine two testers running the same test case against different versions of the software without knowing it. One passes, one fails. Without configuration management, you cannot even diagnose the problem.*

| CM Concept | Purpose | Example |
|-----------|---------|---------|
| Configuration Item (CI) | Any artifact under CM control | Source code, test cases, test data, requirements docs |
| Baseline | A fixed reference point | "Release 2.1 baseline" — all artifacts at a specific point in time |
| Version Control | Track changes to CIs over time | Git for code, test management tool for test cases |
| Change Control | Formal process for approving changes | Change request → review → approve → implement → verify |
| Build Management | Ensure correct versions are assembled | CI/CD pipeline builds from tagged versions |
| Audit Trail | Record of all changes, who made them, and why | Git log, change request history |

**Why CM Matters for Testing:**
1. **Reproducibility:** You can recreate any test environment from any point in time
2. **Traceability:** Every test result links to a specific build version
3. **Consistency:** All testers test the same version of the software
4. **Accountability:** Every change is tracked — who changed what, when, and why
5. **Rollback:** If a change causes problems, you can revert to a known good state

Without configuration management, testing is chaos — you cannot trust your results because you cannot be sure what you tested.`;

const module13Imprint = `*Two testers find the same bug. Tester A writes: "Payment broken." Tester B writes: "Payment fails with error 'INSUFFICIENT_FUNDS' when processing $0.01 charge on Stripe test mode, Visa ending 4242, Chrome 120, macOS 14.2. Steps: 1. Add item ($0.01) to cart 2. Proceed to checkout 3. Enter test card 4. Click Pay. Expected: Success. Actual: Error modal with code INSUFFICIENT_FUNDS." Which report gets fixed faster, and why?*

Answer: Tester B's report gets fixed immediately because the developer can reproduce it in minutes. Tester A's report requires a conversation, wasting everyone's time.

Now consider the configuration management angle: Tester B included the exact environment (Chrome 120, macOS 14.2, Stripe test mode). If the bug only occurs on Chrome 120 but not Chrome 119, that environment detail is the key to diagnosis. Without CM discipline, that detail is lost, and the developer spends hours trying to reproduce a bug that "works on my machine."`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 13",
  [module13Spark, module13Imprint]
);
console.log("Updated Module 13: Defect Management (added test execution metrics, configuration management)");


// ============================================================
// MODULE 15: Strategy — Add estimation techniques, maintenance testing detail, shift-left
// ============================================================
const module15Spark = `*You have learned the principles, the models, the techniques, and the tools. Now it is time to assemble them into a coherent strategy.*

Building a test strategy is like conducting an orchestra — every instrument (technique, level, type) has its role, and the conductor (you) must ensure they play in harmony.

**The Five Steps to a Complete Test Strategy:**

**Step 1: Context Analysis**
- What is the product? (Web app, mobile, embedded, API)
- What is the SDLC model? (Waterfall, Agile, DevOps)
- What are the constraints? (Budget, timeline, team size)
- What are the regulatory requirements? (FDA, PCI, HIPAA, none)

**Step 2: Risk Assessment**
- Identify risks: What could go wrong?
- Assess likelihood and impact
- Prioritize: High risk = more testing effort

**Step 3: Test Design**
- Select test levels: Unit → Integration → System → Acceptance
- Select test types: Functional, performance, security, usability
- Select techniques: EP, BVA, decision tables, exploratory
- Determine automation strategy: What to automate, what to test manually

**Step 4: Quality Gates**
- Entry criteria: What must be true before testing begins?
- Exit criteria: What must be true before testing ends?
- Metrics: Defect density, coverage, pass rate

**Step 5: Traceability**
- Build the Requirements Traceability Matrix
- Ensure every requirement has at least one test case
- Ensure every test case traces to a requirement

**Test Estimation Techniques (ISTQB 5.1.4) — How Long Will Testing Take?**

One of the hardest questions in testing is "How long will it take?" These four techniques provide structured answers:

| Technique | Method | Best When |
|-----------|--------|-----------|
| Ratio-Based | Use historical ratios (e.g., 3 test hours per requirement, 2 test cases per function point) | Historical data is available and project is similar to past projects |
| Extrapolation | Measure actual effort for early work, then project forward | Project is underway and early data is available |
| Wideband Delphi | Multiple experts estimate independently, discuss differences, re-estimate until consensus | No historical data; need expert judgment |
| Three-Point | (Optimistic + 4 x Most Likely + Pessimistic) / 6 | Need to account for uncertainty and risk |

**Wideband Delphi in Detail:**
1. Present the testing scope to 3-5 experts
2. Each expert estimates independently (no discussion)
3. Collect estimates — reveal the range (e.g., 40 hours to 200 hours)
4. Discuss: Why does Expert A think 40 hours? Why does Expert C think 200?
5. Re-estimate after discussion
6. Repeat until estimates converge (typically 2-3 rounds)

**Three-Point Estimation Example:**
- Optimistic: 40 hours (everything goes perfectly)
- Most Likely: 80 hours (normal conditions)
- Pessimistic: 200 hours (everything goes wrong)
- Estimate = (40 + 4(80) + 200) / 6 = (40 + 320 + 200) / 6 = 93.3 hours

*Why is the three-point estimate (93.3 hours) higher than the "most likely" (80 hours)? Because risk is asymmetric — things go wrong more dramatically than they go right.*

**Maintenance Testing — Testing After Release (ISTQB 2.3)**

Software does not stop being tested after release. Maintenance testing is triggered by:

| Trigger | Type | Testing Focus |
|---------|------|--------------|
| Bug fix (hot fix) | Corrective | Confirmation testing of fix + regression |
| New OS/browser/database version | Adaptive | Compatibility and regression |
| New feature or enhancement | Perfective | Full test cycle for new feature + regression |
| Code refactoring, tech debt reduction | Preventive | Regression testing (behavior should not change) |
| Data migration | Conversion | Data integrity, completeness, and functionality |
| System retirement | End-of-life | Data archival, migration to replacement system |

**Impact Analysis for Maintenance Testing:**

Before testing a change, analyze its impact:
1. What code was changed? (direct impact)
2. What code calls the changed code? (indirect impact)
3. What data does the changed code use? (data impact)
4. What configuration was changed? (environment impact)

The scope of regression testing should be proportional to the impact analysis results — a small, isolated fix needs less regression than a database schema change.

**Shift-Left Testing — The Modern Imperative**

Shift-Left means moving testing activities earlier in the SDLC:

| Traditional (Right) | Shift-Left (Earlier) |
|--------------------|---------------------|
| Test after coding | Test during/before coding |
| Find defects in testing phase | Find defects in requirements/design |
| Testers write test cases after development | Testers participate in requirements reviews |
| Automation after manual testing | Automation from day one (TDD) |
| Performance testing before release | Performance testing in CI pipeline |
| Security testing before release | Security scanning on every commit |

Shift-Left is not just about testing earlier — it is about building quality in from the start. When testers participate in requirements reviews, they find ambiguities before they become defects. When developers practice TDD, they design for testability. When security scanning runs on every commit, vulnerabilities are found in minutes, not months.

*The ultimate Shift-Left is preventing defects entirely through better processes (SQA), better requirements (reviews), and better design (testability). The cheapest defect is the one that was never introduced.*

**The Complete Picture:**

| SDLC Phase | Testing Activity | Documents | Traceability |
|-----------|-----------------|-----------|-------------|
| Requirements | Reviews, testability analysis | Test plan | REQ → Test Plan |
| Design | Test case design, review | Test cases | REQ → Test Cases |
| Implementation | Unit testing, code review | Unit test results | Code → Unit Tests |
| Testing | Execution, defect reporting | Execution logs, defect reports | Test Cases → Results |
| Release | Acceptance, regression | Test summary report | REQ → Evidence |
| Maintenance | Impact analysis, regression | Change request, updated tests | Change → Impact → Tests |

*You now have every tool in the testing toolbox. The question is no longer "What should I test?" but "How do I orchestrate all of these tools to deliver confidence that the software works?"*`;

const module15Imprint = `*Final thought experiment: You are hired as the first QA engineer at a 50-person startup that has never had formal testing. They ship daily, have no test documentation, no traceability, and defects are found by customers. You have 90 days to transform their quality practice. Using everything you have learned in this course, what is your 90-day plan?*

Week 1-2: Context analysis — understand the product, team, and biggest pain points. Perform impact analysis on the most critical modules.
Week 3-4: Implement basic defect tracking and start a traceability matrix for the top 20 critical requirements. Introduce configuration management for test artifacts.
Week 5-8: Introduce automated unit tests for new code (TDD), set up CI pipeline with basic smoke tests. Shift-Left by having testers join requirements reviews.
Week 9-10: Establish test levels (unit, integration, system) with clear entry/exit criteria. Use Wideband Delphi to estimate testing effort for the next release.
Week 11-12: Train the team on the Whole Team Approach, implement sprint-level testing in their Agile process. Begin maintenance testing discipline for all patches.
Week 13: Present metrics (defect density trend, coverage growth, production defect reduction, test execution rates) to leadership. Celebrate the transformation — but remember, quality is a journey, not a destination.`;

await conn.execute(
  "UPDATE stf_modules SET sparkContent = ?, imprintContent = ? WHERE moduleNumber = 15",
  [module15Spark, module15Imprint]
);
console.log("Updated Module 15: Strategy (added estimation techniques, maintenance testing, shift-left)");


// ============================================================
// ADD NEW QUIZ QUESTIONS for enriched modules
// ============================================================

// Get module IDs
const [moduleRows] = await conn.execute("SELECT id, moduleNumber FROM stf_modules ORDER BY moduleNumber");
const moduleIdMap = {};
for (const row of moduleRows) {
  moduleIdMap[row.moduleNumber] = row.id;
}

// Get current max question numbers per module
const [maxQRows] = await conn.execute(
  "SELECT moduleId, MAX(questionNumber) as maxQ FROM stf_quiz_questions GROUP BY moduleId"
);
const maxQMap = {};
for (const row of maxQRows) {
  maxQMap[row.moduleId] = row.maxQ;
}

const newQuizzes = [
  // Module 1: New questions for SQA vs Testing, V&V, Generic Skills, Independence
  { mod: 1, question: "Software Quality Assurance (SQA) is primarily:", options: JSON.stringify(["Product-oriented — finding defects in software", "Process-oriented — preventing defects through better processes", "Tool-oriented — selecting the right testing tools", "Document-oriented — writing test plans"]), correct: 1, explanation: "SQA is process-oriented: it focuses on preventing defects by improving the processes used to build software. Testing is product-oriented: it focuses on finding defects in the specific product." },
  { mod: 1, question: "Verification asks 'Are we building the product RIGHT?' while Validation asks:", options: JSON.stringify(["'Are we building it fast enough?'", "'Are we building the RIGHT product?'", "'Are we building it cheaply?'", "'Are we building it securely?'"]), correct: 1, explanation: "Verification = conformance to specification (built right). Validation = meeting user needs (right product). A product can pass verification but fail validation if the spec was wrong." },
  { mod: 1, question: "Which level of testing independence has the HIGHEST objectivity but also the HIGHEST cost?", options: JSON.stringify(["Developer tests own code", "Another developer tests", "Dedicated internal test team", "External test organization"]), correct: 3, explanation: "External test organizations (Level 4) have maximum objectivity — no organizational bias — but are the most expensive and may lack domain knowledge." },
  { mod: 1, question: "Which generic testing skill helps a tester write clear defect reports that developers can act on?", options: JSON.stringify(["Analytical thinking", "Communication", "Technical literacy", "Domain knowledge"]), correct: 1, explanation: "Communication is essential for writing clear, actionable defect reports. A tester who finds defects but cannot communicate them effectively wastes the discovery." },

  // Module 9: New questions for smoke/sanity, alpha/beta, compatibility, accessibility, etc.
  { mod: 9, question: "Smoke testing is BEST described as:", options: JSON.stringify(["Deep testing of a specific feature", "Broad, shallow testing to verify the build is stable enough for further testing", "Testing performed by end users", "Testing performed after every code change"]), correct: 1, explanation: "Smoke testing is broad and shallow — it checks critical paths (can the app start? can users login?) to determine if the build is stable enough for deeper testing." },
  { mod: 9, question: "Alpha testing differs from Beta testing primarily in:", options: JSON.stringify(["Alpha uses automation, Beta is manual", "Alpha is at the developer's site, Beta is in the user's environment", "Alpha tests functionality, Beta tests performance", "Alpha is faster than Beta"]), correct: 1, explanation: "Alpha testing is performed internally at the developer's site. Beta testing is performed by real users in their own environments, revealing real-world issues." },
  { mod: 9, question: "Accessibility testing ensures software is usable by:", options: JSON.stringify(["Only technical users", "People with disabilities, following WCAG standards", "Only mobile users", "Only English-speaking users"]), correct: 1, explanation: "Accessibility testing verifies that software is usable by people with visual, motor, auditory, and cognitive disabilities, following WCAG guidelines." },
  { mod: 9, question: "Which performance testing subtype answers 'What happens when the system runs for 72 hours under sustained load?'", options: JSON.stringify(["Load testing", "Stress testing", "Endurance (soak) testing", "Spike testing"]), correct: 2, explanation: "Endurance (soak) testing runs the system under sustained load for extended periods to detect memory leaks, resource exhaustion, and gradual degradation." },
  { mod: 9, question: "Confirmation testing (re-testing) specifically verifies that:", options: JSON.stringify(["No new defects were introduced", "A specific reported defect has been fixed", "The system meets performance requirements", "All test cases pass"]), correct: 1, explanation: "Confirmation testing re-runs the exact test that found the defect to confirm the fix works. Regression testing (separate activity) checks that nothing else broke." },

  // Module 10: New questions for branch coverage, error guessing, checklist-based
  { mod: 10, question: "100% statement coverage guarantees 100% branch coverage:", options: JSON.stringify(["True — if every statement is executed, every branch is covered", "False — you can execute every statement without taking both paths of every decision", "True — they are the same thing", "It depends on the programming language"]), correct: 1, explanation: "False. A single test path can execute every statement but only take the 'true' branch of an if-statement, missing the 'false' branch entirely. Branch coverage is strictly stronger than statement coverage." },
  { mod: 10, question: "Error guessing is BEST described as:", options: JSON.stringify(["Random testing with no structure", "Using experience and knowledge of common mistakes to design targeted tests", "Only testing boundary values", "Automated testing of all inputs"]), correct: 1, explanation: "Error guessing uses the tester's experience, knowledge of common mistakes (null values, empty strings, concurrency), and past defect patterns to design targeted tests." },
  { mod: 10, question: "Checklist-based testing provides:", options: JSON.stringify(["Detailed step-by-step test procedures", "A high-level guide of items to check, with tester judgment on how to test each", "Only automated test scripts", "Random test ideas"]), correct: 1, explanation: "Checklist-based testing uses a high-level list of items to verify, giving testers flexibility in how they test each item. It's more structured than exploratory but less rigid than scripted testing." },

  // Module 12: New questions for static vs dynamic, testware, review success factors
  { mod: 12, question: "Static testing differs from dynamic testing because static testing:", options: JSON.stringify(["Requires code execution", "Examines artifacts WITHOUT executing the software", "Is only performed by developers", "Is less effective than dynamic testing"]), correct: 1, explanation: "Static testing examines work products (requirements, design, code) without executing them. Dynamic testing requires running the software. Both find different types of defects." },
  { mod: 12, question: "Testware includes:", options: JSON.stringify(["Only automated test scripts", "Only test plans", "ALL artifacts produced during the test process", "Only defect reports"]), correct: 2, explanation: "Testware is the collective term for all testing artifacts: plans, strategies, test cases, test data, scripts, logs, reports, environment configs, and automation frameworks." },
  { mod: 12, question: "Which is NOT a success factor for reviews?", options: JSON.stringify(["Clear objectives for the review", "Reviewers prepare by reading material beforehand", "Focusing criticism on the person who wrote the document", "Management allocating time for review activities"]), correct: 2, explanation: "Reviews must focus on defects in the work product, not blame the author. 'This requirement is ambiguous' is constructive; 'You wrote a bad requirement' is destructive and kills review culture." },

  // Module 13: New questions for test execution metrics, configuration management
  { mod: 13, question: "If test case pass rate is 98% but defect leakage to production is high, this indicates:", options: JSON.stringify(["Testing is excellent", "The test suite has gaps — tests pass but don't cover the right scenarios", "The development team is poor", "The tools are inadequate"]), correct: 1, explanation: "High pass rate + high leakage = tests are passing but not testing the right things. The test suite has coverage gaps in areas where real defects exist." },
  { mod: 13, question: "Configuration Management ensures:", options: JSON.stringify(["Tests run faster", "All testers test the same version and results are reproducible", "Defects are fixed automatically", "Test cases write themselves"]), correct: 1, explanation: "CM ensures consistency (same version), reproducibility (recreate any environment), traceability (results linked to specific builds), and accountability (who changed what, when)." },

  // Module 15: New questions for estimation techniques, maintenance testing, shift-left
  { mod: 15, question: "The Wideband Delphi estimation technique works by:", options: JSON.stringify(["One expert guesses the effort", "Multiple experts estimate independently, then discuss and re-estimate until consensus", "Counting lines of code", "Using a fixed ratio of development hours"]), correct: 1, explanation: "Wideband Delphi gathers independent estimates from multiple experts, reveals the range, facilitates discussion of differences, and repeats until estimates converge." },
  { mod: 15, question: "Three-Point Estimation uses the formula:", options: JSON.stringify(["(Optimistic + Pessimistic) / 2", "(Optimistic + 4 x Most Likely + Pessimistic) / 6", "Optimistic x Pessimistic", "Most Likely x 1.5"]), correct: 1, explanation: "Three-Point: (O + 4M + P) / 6. The formula weights the most likely estimate heavily while accounting for optimistic and pessimistic scenarios." },
  { mod: 15, question: "Shift-Left testing means:", options: JSON.stringify(["Moving testing to the end of the project", "Moving testing activities EARLIER in the SDLC", "Shifting the test team to a different department", "Using only left-to-right test execution"]), correct: 1, explanation: "Shift-Left = test earlier. Participate in requirements reviews, practice TDD, run security scans on every commit. The earlier you find defects, the cheaper they are to fix." }
];

let insertCount = 0;
for (const q of newQuizzes) {
  const moduleId = moduleIdMap[q.mod];
  const currentMax = maxQMap[moduleId] || 0;
  const nextQ = currentMax + 1 + insertCount; // This won't work correctly for multiple per module
  // Actually, let's track per-module
}

// Better approach: track next question number per module
const nextQNum = {};
for (const modNum of [1, 9, 10, 12, 13, 15]) {
  const moduleId = moduleIdMap[modNum];
  const [rows] = await conn.execute(
    "SELECT MAX(questionNumber) as maxQ FROM stf_quiz_questions WHERE moduleId = ?",
    [moduleId]
  );
  nextQNum[modNum] = (rows[0].maxQ || 0) + 1;
}

for (const q of newQuizzes) {
  const moduleId = moduleIdMap[q.mod];
  const qNum = nextQNum[q.mod];
  nextQNum[q.mod]++;
  
  await conn.execute(
    `INSERT INTO stf_quiz_questions (moduleId, questionNumber, question, options, correctAnswer, explanation) VALUES (?, ?, ?, ?, ?, ?)`,
    [moduleId, qNum, q.question, q.options, q.correct, q.explanation]
  );
  insertCount++;
}

console.log(`\nInserted ${insertCount} new quiz questions across modules 1, 9, 10, 12, 13, 15`);

// Print summary
const [totalModules] = await conn.execute("SELECT COUNT(*) as c FROM stf_modules");
const [totalQuiz] = await conn.execute("SELECT COUNT(*) as c FROM stf_quiz_questions");
console.log(`\nFinal totals: ${totalModules[0].c} modules, ${totalQuiz[0].c} quiz questions`);

// Per-module quiz count
const [perModule] = await conn.execute(
  `SELECT m.moduleNumber, m.title, COUNT(q.id) as qCount 
   FROM stf_modules m 
   LEFT JOIN stf_quiz_questions q ON m.id = q.moduleId 
   GROUP BY m.id ORDER BY m.moduleNumber`
);
for (const row of perModule) {
  console.log(`  Module ${row.moduleNumber} (${row.title}): ${row.qCount} questions`);
}

await conn.end();
console.log("\nGap-filling update complete!");
