import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// Clear existing data
await conn.execute("DELETE FROM stf_quiz_questions");
await conn.execute("DELETE FROM stf_modules");
console.log("Cleared existing STF data");

const modules = [
  {
    moduleNumber: 1,
    track: "foundations",
    title: "Why We Test",
    subtitle: "The cost of ignorance — why testing exists",
    visualAidUrl: "/manus-storage/stf-module-1-infographic_a53534c0.png",
    infographicTakeaway: "Find it early or pay for it forever.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Drag each defect to the correct cost multiplier stage",
    crucibleConfig: JSON.stringify({
      gameName: "The Cost Calculator",
      type: "drag-match",
      items: [
        { defect: "Missing login validation found at Requirements review", answer: "1x", points: 20 },
        { defect: "Wrong database schema found at Design", answer: "5x", points: 20 },
        { defect: "Off-by-one error found at Unit testing", answer: "10x", points: 20 },
        { defect: "API wrong format found at Integration testing", answer: "30x", points: 20 },
        { defect: "Data corruption found in Production", answer: "100x", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If a bridge engineer told you, "We built it, but we never checked if it could hold any weight" — would you drive across it?*

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
|--------|----------------------------------|------------------|
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
|-------|-----------|-------------|----------|
| Level 0 | Developer tests own code | None | Fastest, but blind to own assumptions |
| Level 1 | Another developer tests | Low | Some fresh perspective |
| Level 2 | Dedicated test team in same org | Medium | Professional testing skills, shared context |
| Level 3 | Dedicated test team from different org | High | No organizational bias, but less domain knowledge |
| Level 4 | External test organization | Very High | Maximum objectivity, but expensive and slow |

**Benefits of independence:** Fresh eyes find defects the developer cannot see (cognitive bias). Independent testers challenge assumptions. They have no emotional attachment to the code.

**Drawbacks of independence:** Communication overhead increases. Independent testers may lack domain context. Developers may feel less responsible for quality ("that's the tester's job").

The best practice is a balanced approach: developers write unit tests (Level 0), a dedicated team handles system/integration testing (Level 2), and independent testers or users handle acceptance testing (Level 3-4).`,
    imprintContent: `*Imagine you are testing a self-driving car. A defect in the braking algorithm is found during a real-world test drive at 60 mph. Now imagine that same defect had been found during a requirements review, when someone asked: "What should happen when the sensor detects an obstacle at 60 mph?" Which scenario would you prefer to live in?*

Now consider: Was the self-driving car failure a testing problem or an SQA problem? If the process required a requirements review with safety engineers present (SQA), the defect would have been caught before code was written. If the process only relied on testing after implementation, the defect was found at 60 mph. The answer is that both SQA and testing failed — the process should have caught it early (SQA), and testing should have caught it before a real car was involved (verification in simulation before validation on the road).`
  },
  {
    moduleNumber: 2,
    track: "foundations",
    title: "The Seven Principles of Testing",
    subtitle: "Universal truths every tester must know",
    visualAidUrl: "/manus-storage/stf-module-2-infographic_30625490.png",
    infographicTakeaway: "Seven truths that separate amateur testers from professionals.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Match each scenario to the correct testing principle",
    crucibleConfig: JSON.stringify({
      gameName: "Principle Matcher",
      type: "drag-match",
      items: [
        { defect: "Tested happy path 500 times, never tested database down", answer: "Exhaustive Testing Is Impossible", points: 20 },
        { defect: "Payment module has 47 bugs; about page has zero", answer: "Defects Cluster Together", points: 20 },
        { defect: "Automated suite passes nightly but hasn't caught a bug in months", answer: "Pesticide Paradox", points: 20 },
        { defect: "App is technically perfect but users hate the interface", answer: "Absence-of-Errors Fallacy", points: 20 },
        { defect: "Found the requirement was wrong before code was written", answer: "Early Testing Saves Time and Money", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If you tested every possible input to a simple login form (username + password), how many test cases would you need?*

The answer is effectively infinite. If usernames can be up to 50 characters and passwords up to 100 characters, the combinations exceed the atoms in the observable universe. This impossibility is why we need principles — guiding truths that help us test smartly rather than exhaustively.

**Principle 1: Testing Shows the Presence of Defects, Not Their Absence.** A thousand passing tests do not prove software is defect-free. They prove only that those specific scenarios work under those specific conditions. You cannot prove a negative.

**Principle 2: Exhaustive Testing Is Impossible.** You cannot test everything. Instead, use risk analysis, prioritization, and test design techniques to focus effort where it matters most.

**Principle 3: Early Testing Saves Time and Money.** Testing activities should begin as early as possible. Reviewing requirements IS testing. The earlier you start, the cheaper the defects.

*If you cannot test everything, how do you decide what to test first?*

**Principle 4: Defects Cluster Together.** Roughly 80% of defects are found in 20% of modules (the Pareto principle). Focus effort on complex modules, frequently changed code, and areas with defect history.

**Principle 5: The Pesticide Paradox.** Running the same tests repeatedly will eventually stop finding new defects — like insects developing pesticide resistance. Tests must be regularly updated and supplemented.

**Principle 6: Testing Is Context-Dependent.** Testing a medical device is fundamentally different from testing a mobile game. Approach, rigor, and techniques must adapt to context.

**Principle 7: Absence-of-Errors Fallacy.** A perfectly bug-free product that nobody wants is still a failure. Testing must verify not just that software works correctly, but that it works usefully.`,
    imprintContent: `*A pharmaceutical company tests a new drug on 100 healthy volunteers and observes no side effects. They declare it "safe." What principles did they violate, and what could go wrong?*

They violated: testing shows presence not absence (no side effects observed ≠ none exist), exhaustive testing is impossible (100 people ≠ all human biology), and context-dependent (healthy volunteers ≠ sick patients).`
  },
  {
    moduleNumber: 3,
    track: "sdlc_models",
    title: "The Waterfall Model",
    subtitle: "Sequential development and its testing implications",
    visualAidUrl: "/manus-storage/stf-module-3-infographic_3e6b6a80.png",
    infographicTakeaway: "In Waterfall, you cannot swim upstream — find defects before the current carries them away.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Arrange the Waterfall phases in the correct sequential order",
    crucibleConfig: JSON.stringify({
      gameName: "Waterfall Sequencer",
      type: "ordering",
      items: [
        { item: "Requirements Analysis", correctPosition: 1, points: 20 },
        { item: "System Design", correctPosition: 2, points: 20 },
        { item: "Implementation (Coding)", correctPosition: 3, points: 20 },
        { item: "Testing & Verification", correctPosition: 4, points: 20 },
        { item: "Deployment & Maintenance", correctPosition: 5, points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If you were building a skyscraper, would you start pouring concrete before the architect finished the blueprints?*

That common-sense logic is exactly why the Waterfall model was the first formal SDLC. Created by Winston Royce in 1970, it organizes development into a strict sequence where each phase must complete before the next begins.

**The Phases:**

| Phase | Activity | Testing Involvement |
|-------|----------|-------------------|
| Requirements | Document what the system must do | Review for testability, ambiguity, completeness |
| Design | Architect the solution | Review design for testability, identify test approach |
| Implementation | Write the code | Unit testing by developers |
| Testing | Verify the built system | Integration, system, and acceptance testing |
| Deployment | Release to production | Smoke testing, production verification |
| Maintenance | Fix issues, add features | Regression testing |

**When Waterfall Works:** Waterfall excels when requirements are stable, well-understood, and unlikely to change — think regulatory systems, embedded firmware, or safety-critical applications where the cost of change is astronomical.

*Why would changing requirements be catastrophic in a Waterfall project?*

Because every phase depends on the output of the previous phase. Change a requirement, and you must redesign, recode, retest, and redeploy. The cost cascades.

**The Testing Trap:** In pure Waterfall, testing is a distinct phase that occurs after implementation. This means defects in requirements may not be discovered until months later, when the cost to fix them has multiplied exponentially.

**Waterfall's Legacy:** Despite its limitations, Waterfall gave us essential concepts: formal documentation, phase gates, sign-offs, and the idea that testing is a planned activity rather than an afterthought.`,
    imprintContent: `*A government agency spent 3 years building a tax system using Waterfall. When testing began in year 3, they discovered the core calculation formula was wrong — it had been misunderstood during requirements. The entire system had to be redesigned. What could they have done differently within the Waterfall model to catch this earlier?*

Answer: Requirements reviews, prototyping during design, and earlier verification activities (inspections, walkthroughs) could have caught the formula error before it was coded into every module.`
  },
  {
    moduleNumber: 4,
    track: "sdlc_models",
    title: "The V-Model",
    subtitle: "Testing's mirror — verification meets validation",
    visualAidUrl: "/manus-storage/stf-module-4-infographic_debd1813.png",
    infographicTakeaway: "Every development phase has a testing mirror — plan tests as you build, not after.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Match each development phase to its corresponding test level",
    crucibleConfig: JSON.stringify({
      gameName: "V-Model Mirror Match",
      type: "drag-match",
      items: [
        { defect: "Business Requirements", answer: "Acceptance Testing", points: 20 },
        { defect: "System Requirements", answer: "System Testing", points: 20 },
        { defect: "High-Level Design", answer: "Integration Testing", points: 20 },
        { defect: "Detailed Design", answer: "Unit Testing", points: 20 },
        { defect: "Coding", answer: "Code Review & Static Analysis", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*What if every time you wrote a requirement, you simultaneously wrote the test that would prove it was met?*

That is the genius of the V-Model. It takes Waterfall's sequential phases and adds a mirror: for every development phase on the left side, there is a corresponding testing phase on the right side.

**The V-Shape:**

The left side descends (development): Business Requirements → System Requirements → High-Level Design → Detailed Design → Coding.

The right side ascends (testing): Unit Testing → Integration Testing → System Testing → Acceptance Testing.

**Verification vs. Validation:**

| Concept | Question | Activities |
|---------|----------|------------|
| Verification | "Are we building the product RIGHT?" | Reviews, inspections, walkthroughs, static analysis |
| Validation | "Are we building the RIGHT product?" | Dynamic testing, user acceptance, demos |

*Can you think of a situation where software passes all verification checks but fails validation?*

Yes — a perfectly coded feature that nobody asked for. The code is correct (verification passes), but it does not meet the user's actual need (validation fails).

**The V-Model's Gift to Testing:** Test planning begins at the same time as development. When business requirements are written, acceptance test cases are designed. When system requirements are specified, system test cases are planned. This ensures that testing is not an afterthought but a parallel activity.

**Static Testing in the V-Model:** The V-Model introduced the concept that testing is not just running code. Reviews, inspections, and walkthroughs of documents ARE testing activities. A requirements review that finds an ambiguity is testing — and it is the cheapest testing you will ever do.`,
    imprintContent: `*A hospital is building a patient records system. Using the V-Model, at what point should they write the acceptance test for "the system must display drug allergies within 2 seconds of opening a patient record"? If they wait until the system is built, what is the risk?*

Answer: The acceptance test should be written when the business requirement is defined. If they wait, the architecture may not support the 2-second requirement, requiring a costly redesign.`
  },
  {
    moduleNumber: 5,
    track: "sdlc_models",
    title: "Iterative & Incremental Models",
    subtitle: "Breaking the sequence — testing in cycles",
    visualAidUrl: "/manus-storage/stf-module-5-infographic_525bb6a5.png",
    infographicTakeaway: "Each iteration is a mini-lifecycle — test early, test often, test everything that changed.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Classify each statement as Iterative, Incremental, or Both",
    crucibleConfig: JSON.stringify({
      gameName: "Model Classifier",
      type: "drag-match",
      items: [
        { defect: "Build the login module completely, then build the dashboard module", answer: "Incremental", points: 20 },
        { defect: "Build a rough version of everything, then refine in cycles", answer: "Iterative", points: 20 },
        { defect: "Each cycle includes requirements, design, code, and test", answer: "Both", points: 20 },
        { defect: "Deliver working software at the end of each cycle", answer: "Both", points: 20 },
        { defect: "Refine the UI based on user feedback from the previous version", answer: "Iterative", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*Would you rather see a rough draft of your house after 2 weeks, or wait 2 years for the finished product — only to discover the kitchen is in the wrong place?*

Iterative and incremental models break the monolithic Waterfall approach into smaller, manageable cycles. Each cycle produces working software that can be evaluated, tested, and refined.

**Iterative vs. Incremental — What is the Difference?**

| Approach | Analogy | How It Works |
|----------|---------|-------------|
| Iterative | Painting a portrait — rough sketch first, then refine details | Build a rough version of the whole system, then improve it in cycles |
| Incremental | Building a house room by room | Build one complete feature at a time, adding to the system |
| Combined | Most real projects | Each increment is refined through iterations |

**Testing in Iterative Models:**

Every iteration is a mini-lifecycle. In each cycle, you: gather/refine requirements → design → code → test → review. This means testing happens continuously, not just at the end.

*What happens to your regression test suite as iterations accumulate?*

It grows. Every iteration adds new features and new tests. Previous tests must be re-run to ensure new code has not broken existing functionality. This is why automated regression testing becomes essential in iterative models.

**The Spiral Model:** Barry Boehm's Spiral Model (1986) added risk analysis to each iteration. Before building anything, you identify and mitigate the biggest risks first. This is particularly valuable for large, complex projects where uncertainty is high.

**Static Testing and Reviews:** Iterative models introduced the practice of reviewing work products at the end of each iteration. Sprint reviews, retrospectives, and demo sessions are all forms of testing — they validate that the increment meets expectations before the next cycle begins.`,
    imprintContent: `*A startup is building a social media app. After 3 iterations, users report that the notification system is annoying. In a Waterfall model, this feedback would arrive after the entire system was built. In an iterative model, what can the team do immediately?*

Answer: Refine the notification system in the next iteration based on real user feedback, while the rest of the system continues to evolve. The cost of change is contained to one iteration rather than a full system rework.`
  },
  {
    moduleNumber: 6,
    track: "methodologies",
    title: "Agile Testing",
    subtitle: "Scrum, Kanban, and the Whole Team approach",
    visualAidUrl: "/manus-storage/stf-module-6-infographic_f1047c68.png",
    infographicTakeaway: "In Agile, testing is not a phase — it is everyone's responsibility, every day.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Match each Agile concept to its correct definition",
    crucibleConfig: JSON.stringify({
      gameName: "Agile Concept Matcher",
      type: "drag-match",
      items: [
        { defect: "Time-boxed development cycle (usually 2 weeks)", answer: "Sprint", points: 16 },
        { defect: "Daily 15-minute synchronization meeting", answer: "Daily Standup", points: 16 },
        { defect: "Visual board limiting work in progress", answer: "Kanban Board", points: 16 },
        { defect: "Working software is the primary measure of progress", answer: "Agile Manifesto Principle", points: 16 },
        { defect: "Quality is everyone's responsibility, not just testers", answer: "Whole Team Approach", points: 16 },
        { defect: "Continuous improvement through reflection", answer: "Retrospective", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*What if the people who build the software and the people who test it were the same team — not separate departments throwing work over a wall?*

That is the Agile revolution. The Agile Manifesto (2001) fundamentally changed how we think about testing by making quality a shared responsibility rather than a separate phase.

**The Agile Manifesto's Four Values:**
1. Individuals and interactions over processes and tools
2. Working software over comprehensive documentation
3. Customer collaboration over contract negotiation
4. Responding to change over following a plan

**Scrum — The Most Popular Agile Framework:**

| Scrum Element | Purpose | Testing Connection |
|--------------|---------|-------------------|
| Sprint (2 weeks) | Time-boxed development cycle | All testing within the sprint |
| Product Backlog | Prioritized feature list | Test cases derived from user stories |
| Sprint Planning | Select work for the sprint | Include testing effort in estimates |
| Daily Standup | 15-min sync | Surface testing blockers early |
| Sprint Review | Demo working software | Acceptance testing with stakeholders |
| Retrospective | Continuous improvement | Improve testing process |

*In Scrum, a user story is not "done" until it is tested. What happens if testing is not included in the Definition of Done?*

Technical debt accumulates. Untested features pile up, creating a "testing debt" that eventually overwhelms the team.

**Kanban for Testing:** Kanban visualizes workflow and limits work in progress (WIP). For testing, this means: you cannot start testing a new feature until you finish testing the current one. WIP limits prevent the "everything is in progress, nothing is done" trap.

**The Whole Team Approach:** In Agile, there are no "testers" and "developers" — there is one team responsible for quality. Developers write unit tests. Testers pair with developers. Business analysts review acceptance criteria. Everyone owns quality.

**The Testing Quadrants (Brian Marick):**

| | Business-Facing | Technology-Facing |
|---|---|---|
| **Supporting the Team** | Q2: Functional tests, examples, story tests | Q1: Unit tests, component tests |
| **Critiquing the Product** | Q3: Exploratory, usability, UAT | Q4: Performance, security, -ility tests |`,
    imprintContent: `*A Scrum team has been delivering features for 6 sprints, but they never included "testing" in their Definition of Done. Now they have 47 untested features and a release deadline in 2 weeks. What went wrong, and what would the Whole Team Approach have prevented?*

Answer: By excluding testing from the Definition of Done, they created a massive testing debt. The Whole Team Approach would have ensured every feature was tested within its sprint, preventing the accumulation of untested work.`
  },
  {
    moduleNumber: 7,
    track: "methodologies",
    title: "DevOps & Continuous Testing",
    subtitle: "CI/CD pipelines and testing at every stage",
    visualAidUrl: "/manus-storage/stf-module-7-infographic_8ebce184.png",
    infographicTakeaway: "In DevOps, every code commit triggers a gauntlet of automated tests — no human bottleneck.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Place each testing activity at the correct CI/CD pipeline stage",
    crucibleConfig: JSON.stringify({
      gameName: "Pipeline Builder",
      type: "ordering",
      items: [
        { item: "Static Analysis & Linting", correctPosition: 1, points: 20 },
        { item: "Unit Tests", correctPosition: 2, points: 20 },
        { item: "Integration Tests", correctPosition: 3, points: 20 },
        { item: "End-to-End / UI Tests", correctPosition: 4, points: 20 },
        { item: "Performance & Security Tests", correctPosition: 5, points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*What if every time a developer pushed code, an army of automated tests ran within minutes — and blocked the release if anything failed?*

That is DevOps. It merges Development and Operations into a continuous pipeline where code flows from commit to production through automated gates of quality.

**The CI/CD Pipeline:**

| Stage | What Happens | Testing Activity |
|-------|-------------|-----------------|
| Commit | Developer pushes code | Pre-commit hooks, linting |
| Build | Code compiles | Static analysis, compilation checks |
| Unit Test | Automated unit tests run | Fast feedback (seconds to minutes) |
| Integration Test | Components tested together | API tests, database tests |
| Staging | Deploy to test environment | E2E tests, smoke tests |
| Production | Deploy to users | Canary testing, monitoring |

**Shift Left and Shift Right:**

"Shift Left" means moving testing earlier in the pipeline — catch defects at commit time, not deployment time. "Shift Right" means testing in production — monitoring, A/B testing, chaos engineering.

*If your unit tests take 30 minutes to run, what happens to the CI/CD pipeline?*

It becomes a bottleneck. Developers wait, batch their commits, and the pipeline backs up. Fast tests are essential for continuous delivery.

**The Test Automation Pyramid:**

| Level | Speed | Quantity | Cost |
|-------|-------|----------|------|
| Unit Tests (base) | Milliseconds | Thousands | Low |
| Integration Tests (middle) | Seconds | Hundreds | Medium |
| E2E/UI Tests (top) | Minutes | Dozens | High |

The pyramid shape is intentional: many fast, cheap unit tests at the base; fewer slow, expensive E2E tests at the top.

**Infrastructure as Code (IaC):** In DevOps, test environments are defined in code (Docker, Terraform, Kubernetes). This means every developer gets an identical test environment, eliminating "works on my machine" problems.

**Continuous Testing ≠ Continuous Automation:** Continuous testing includes exploratory testing, security audits, and usability reviews — not just automated scripts. The pipeline automates what can be automated; humans handle what requires judgment.`,
    imprintContent: `*A company deploys to production 50 times per day. Their pipeline has no automated tests — just a manual QA team of 3 people. What will happen within a week?*

Answer: The QA team becomes an impossible bottleneck. With 50 deploys/day, they cannot manually test each one. Defects will reach production. The solution is automated testing at every pipeline stage, with manual testing reserved for exploratory and usability work.`
  },
  {
    moduleNumber: 8,
    track: "methodologies",
    title: "Choosing Your Test Approach",
    subtitle: "Risk, product type, team maturity, and budget",
    visualAidUrl: "/manus-storage/stf-module-8-infographic_53edb717.png",
    infographicTakeaway: "Your test approach is a strategic decision — match your testing to your risks, not your habits.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Match each project scenario to the most appropriate test approach",
    crucibleConfig: JSON.stringify({
      gameName: "Strategy Selector",
      type: "drag-match",
      items: [
        { defect: "Medical device with FDA regulations", answer: "Analytical/Risk-Based with full documentation", points: 20 },
        { defect: "Startup MVP with 2-week deadline", answer: "Heuristic/Exploratory with minimal documentation", points: 20 },
        { defect: "Banking system processing millions daily", answer: "Analytical/Requirements-Based with regression suite", points: 20 },
        { defect: "Mobile game for casual users", answer: "Reactive/Session-Based with usability focus", points: 20 },
        { defect: "Legacy system migration", answer: "Consultative/Risk-Based with comparison testing", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*A doctor does not prescribe the same medicine to every patient. Why would you apply the same test approach to every project?*

The AT*SQA Test Approaches micro-credential identifies four fundamental approaches to testing, each suited to different contexts:

**The Four Test Approaches:**

| Approach | Driven By | Best When |
|----------|----------|-----------|
| Analytical | Risk analysis, requirements | Requirements are stable, risks are quantifiable |
| Model-Based | System models, state diagrams | Complex state-dependent systems |
| Methodical | Checklists, standards | Compliance-driven, regulated industries |
| Reactive | Exploratory, session-based | Requirements are vague, time is short |

**Risk-Based Testing:** Not all features carry equal risk. A payment processing module failing is catastrophic; a tooltip being slightly misaligned is cosmetic. Risk-based testing prioritizes effort based on: Likelihood of failure × Impact of failure = Risk Priority.

*How would you prioritize testing for an e-commerce site with 1000 features and only 2 weeks of testing time?*

**Factors That Shape Your Approach:**
1. **Product type** — Safety-critical vs. consumer app
2. **Regulatory requirements** — FDA, PCI-DSS, HIPAA
3. **Team maturity** — Experienced testers vs. developers-who-test
4. **Budget and timeline** — Unlimited vs. "ship it Friday"
5. **Risk tolerance** — Zero tolerance vs. "we can hotfix"

**Documentation Level:** The AT*SQA framework distinguishes between heavy documentation (regulated industries) and light documentation (agile startups). Neither is universally correct — the right level depends on context.`,
    imprintContent: `*You are the test lead for two simultaneous projects: (1) a pacemaker firmware update, and (2) an internal company lunch-ordering app. How would your test approach differ for each, and why?*

Answer: The pacemaker requires analytical/risk-based testing with full documentation, regulatory compliance, and exhaustive coverage. The lunch app can use reactive/exploratory testing with minimal documentation. The consequence of failure determines the rigor.`
  },
  {
    moduleNumber: 9,
    track: "techniques",
    title: "Test Levels & Types",
    subtitle: "Unit, integration, system, acceptance — and beyond",
    visualAidUrl: "/manus-storage/stf-module-9-infographic_2d1f9e01.png",
    infographicTakeaway: "Each test level catches different defects — skip one, and those defects reach your users.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Classify each test scenario by its correct test level",
    crucibleConfig: JSON.stringify({
      gameName: "Level Sorter",
      type: "drag-match",
      items: [
        { defect: "Testing a single calculateTax() function with various inputs", answer: "Unit Testing", points: 20 },
        { defect: "Testing that the payment service correctly calls the bank API", answer: "Integration Testing", points: 20 },
        { defect: "Testing the complete checkout flow from cart to confirmation", answer: "System Testing", points: 20 },
        { defect: "Business users verify the system meets their requirements", answer: "Acceptance Testing", points: 20 },
        { defect: "Testing that a React component renders correctly in isolation", answer: "Component Testing", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If you only tested the individual bricks of a building but never tested whether the walls stood up together, would you trust the building?*

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

*Why is regression testing the most expensive type of testing in the long run?*

Because the regression suite grows with every feature. A system with 1000 features needs 1000+ regression tests. Without automation, this becomes unsustainable.

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
| Scope | Broad \u2014 tests critical paths | Narrow \u2014 tests specific area |
| When | After every new build | After a specific change |
| Depth | Shallow \u2014 surface-level checks | Moderate \u2014 focused but deeper |
| Analogy | Turning on a new appliance to see if it smokes | Checking if a repaired part works |

**Alpha Testing and Beta Testing**

| Aspect | Alpha Testing | Beta Testing |
|--------|--------------|-------------|
| Where | Developer's site/environment | User's real environment |
| Who | Internal testers, developers | Real external users |
| When | Before beta release | After alpha, before production |
| Goal | Find defects in controlled setting | Find defects in real-world conditions |

**Installation Testing, Compatibility Testing, GUI Testing**

Installation testing verifies fresh installs, upgrades, and uninstallation. Compatibility testing checks across OS, browsers, devices, and hardware. GUI testing verifies layout, alignment, responsive design, and keyboard navigation.

**Destructive Testing and Recovery Testing**

Destructive testing deliberately breaks the system to find the breaking point. Recovery testing verifies the system recovers gracefully from failures.

**Performance Testing Subtypes:**

| Subtype | Purpose |
|---------|---------|
| Load Testing | Test under expected load |
| Stress Testing | Test beyond expected load |
| Volume Testing | Test with large data volumes |
| Endurance (Soak) Testing | Test under sustained load |
| Spike Testing | Test sudden load increases |
| Scalability Testing | Test ability to scale |

**Security Testing \u2014 Six Core Concepts:** Confidentiality, Integrity, Authentication, Authorization, Non-repudiation, Availability.

**Accessibility Testing:** Ensures software is usable by people with disabilities following WCAG standards \u2014 visual (screen readers, color contrast), motor (keyboard navigation), auditory (captions), cognitive (clear language).

**Internationalization (i18n) and Localization (l10n) Testing:** i18n tests that software supports multiple locales (Unicode, date formats, RTL). l10n tests that translations and cultural adaptations are correct.

**Maintenance Testing:** When existing software is modified (bug fix, enhancement, migration), maintenance testing ensures the changes work and nothing else broke. Triggers include: corrective (bug fixes), adaptive (environment changes), perfective (enhancements), and preventive (refactoring). Impact analysis is critical before maintenance testing.`,
    imprintContent: `*A team ships a feature that passes all unit tests and system tests but fails acceptance testing because the business requirement was misunderstood. Which test level was missing from their process, and why?*

Answer: They likely skipped or poorly executed integration testing and requirement reviews. More importantly, acceptance test cases should have been written alongside the requirements (V-Model approach) to catch the misunderstanding before coding began.

Now consider this: Your e-commerce application works perfectly on Chrome/Windows but crashes on Safari/iOS. Your load tests pass with 100 users but the system collapses at 500. Your English interface is flawless but the Japanese version has overlapping text everywhere. Your login works for sighted users but is completely inaccessible to screen reader users. Each of these is a different test type that was skipped. Which ones would YOUR users encounter first?`
  },
  {
    moduleNumber: 10,
    track: "techniques",
    title: "Test Design Techniques",
    subtitle: "Equivalence partitioning, boundary values, decision tables",
    visualAidUrl: "/manus-storage/stf-module-10-infographic_946ccc29.png",
    infographicTakeaway: "Test design techniques turn infinite possibilities into a finite, powerful set of test cases.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Apply the correct test design technique to each scenario",
    crucibleConfig: JSON.stringify({
      gameName: "Technique Selector",
      type: "drag-match",
      items: [
        { defect: "Age field accepts 18-65: test with 17, 18, 40, 65, 66", answer: "Boundary Value Analysis", points: 20 },
        { defect: "Discount depends on member status AND order total AND coupon", answer: "Decision Table Testing", points: 20 },
        { defect: "ATM states: Idle → Card Inserted → PIN Entered → Transaction", answer: "State Transition Testing", points: 20 },
        { defect: "Input field accepts text: test with valid email, empty, special chars", answer: "Equivalence Partitioning", points: 20 },
        { defect: "Test all combinations of OS, browser, and screen resolution", answer: "Pairwise/Combinatorial Testing", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*A text field accepts ages 1-120. Do you need 120 test cases?*

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

**Statement Coverage vs. Branch Coverage \u2014 The Critical Difference**

Statement coverage measures: "Has every line of code been executed at least once?" Branch coverage measures: "Has every decision point (if/else, switch) taken both the true AND false paths?"

Consider this code:
\`\`\`
if (age >= 18) {
  grantAccess();
}
logAttempt();
\`\`\`

A single test with age=20 achieves 100% statement coverage (every line executes). But it achieves only 50% branch coverage \u2014 the false branch (age < 18) was never tested. Branch coverage is stronger because it forces you to test both outcomes of every decision.

| Coverage Type | Measures | Strength |
|--------------|----------|----------|
| Statement | Every line executed | Minimum baseline |
| Branch (Decision) | Every true/false path taken | Catches more defects |
| Condition | Every boolean sub-expression | Even stronger |
| Path | Every possible execution path | Strongest but often infeasible |

*100% statement coverage does NOT guarantee 100% branch coverage. But 100% branch coverage DOES guarantee 100% statement coverage.*

**Error Guessing \u2014 The Art of Experienced Intuition**

Error guessing is an experience-based technique where the tester uses knowledge of common mistakes, past defects, and system weaknesses to design tests. Common targets: boundary conditions, division by zero, empty collections, concurrent access, special characters, maximum values, date/time edge cases, network failures.

Error guessing works best when combined with formal techniques. Use EP and BVA for systematic coverage, then use error guessing to add tests for the "weird stuff" that formal techniques miss.

**Exploratory Testing \u2014 Simultaneous Design, Execution, and Learning**

Exploratory testing is NOT random clicking. It is a disciplined approach where the tester simultaneously designs tests, executes them, and learns about the system \u2014 all in real time.

Key elements: Test Charters (define the mission), Session-Based Test Management (SBTM) with timed sessions, and Heuristics like SFDPOT (Structure, Function, Data, Platform, Operations, Time).

| Aspect | Scripted Testing | Exploratory Testing |
|--------|-----------------|-------------------|
| Test design | Before execution | During execution |
| Repeatability | High | Low |
| Creativity | Low | High |
| Best for | Regression, compliance | New features, usability, edge cases |

*A scripted test will find the defects you predicted. An exploratory test will find the defects you never imagined.*

**Checklist-Based Testing (ISTQB 4.4.3)**

Checklist-based testing uses a high-level list of items to be checked, without detailed test steps. The tester uses the checklist as a guide but applies their own judgment on how to test each item. Checklists are more flexible than scripted test cases but more structured than pure exploratory testing.`,
    imprintContent: `*A login form has: username (1-50 chars), password (8-128 chars), and a "Remember Me" checkbox. Using equivalence partitioning and boundary value analysis, how many test cases would you design? Compare this to testing every possible combination.*

Answer: EP gives ~9 partitions (3 per field \u00d7 3 fields). BVA adds ~12 boundary values. With the checkbox (2 states), you get roughly 24-30 meaningful test cases \u2014 versus the trillions of possible character combinations.

Now add error guessing: What about Unicode usernames? Passwords with only spaces? The "Remember Me" checkbox on a shared computer? SQL injection in the username field? A session that is 30 days old? These are the tests that formal techniques miss but experienced testers instinctively add. The best test suites combine formal techniques (EP, BVA, decision tables) with experience-based techniques (error guessing, exploratory, checklists) for maximum coverage.`
  },
  {
    moduleNumber: 11,
    track: "techniques",
    title: "Requirement-to-Test-Case Traceability",
    subtitle: "The golden thread from requirement to evidence",
    visualAidUrl: "/manus-storage/stf-module-11-infographic_ed376d39.png",
    infographicTakeaway: "If you cannot trace a test back to a requirement, you do not know what you are testing or why.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Build a traceability matrix by connecting requirements to test cases",
    crucibleConfig: JSON.stringify({
      gameName: "Traceability Builder",
      type: "drag-match",
      items: [
        { defect: "REQ-001: User must log in with email and password", answer: "TC-001: Valid login, TC-002: Invalid password, TC-003: Empty fields", points: 20 },
        { defect: "REQ-002: System must display error for invalid input", answer: "TC-004: Special characters, TC-005: SQL injection attempt", points: 20 },
        { defect: "REQ-003: Session must expire after 30 minutes", answer: "TC-006: Session timeout test, TC-007: Activity resets timer", points: 20 },
        { defect: "REQ-004: Password must be at least 8 characters", answer: "TC-008: 7-char password rejected, TC-009: 8-char accepted", points: 20 },
        { defect: "REQ-005: User can reset password via email", answer: "TC-010: Reset email sent, TC-011: Reset link expires", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If a detective investigated a crime but could not connect any evidence to any suspect, would the case hold up in court?*

Traceability is the detective's evidence chain for software testing. It is the practice of linking every test case back to the requirement it verifies, and every requirement forward to the test cases that cover it.

**The Traceability Matrix:**

| Requirement ID | Requirement | Test Cases | Status |
|---------------|-------------|------------|--------|
| REQ-001 | User login with email/password | TC-001, TC-002, TC-003 | Covered |
| REQ-002 | Error display for invalid input | TC-004, TC-005 | Covered |
| REQ-003 | Session expires after 30 min | TC-006, TC-007 | Covered |
| REQ-004 | Password minimum 8 characters | TC-008, TC-009 | Covered |
| REQ-005 | Password reset via email | — | NOT COVERED |

*Look at REQ-005 in the matrix above. What does the empty test case column tell you?*

It tells you that a requirement exists with zero test coverage. If REQ-005 has a defect, you will never find it through testing. The traceability matrix makes this gap visible.

**Bidirectional Traceability:**
- **Forward traceability:** Requirement → Test Cases (ensures every requirement is tested)
- **Backward traceability:** Test Case → Requirement (ensures every test has a purpose)

A test case that cannot be traced to any requirement is an orphan — it may be testing something that does not matter, or it may be testing an undocumented requirement that needs to be formalized.

**Why Traceability Matters:**
1. **Coverage visibility** — instantly see which requirements lack tests
2. **Impact analysis** — when a requirement changes, find all affected tests
3. **Audit compliance** — regulators require proof that every requirement was tested
4. **Prioritization** — focus testing effort on high-risk, untested requirements
5. **Progress tracking** — measure testing progress against requirements, not just test count`,
    imprintContent: `*A team has 500 test cases and 200 requirements. They claim "100% test coverage." But when you build a traceability matrix, you discover that 50 requirements have zero test cases, and 150 test cases trace to requirements that were deleted months ago. What is their real coverage, and what should they do?*

Answer: Real coverage is 75% (150/200 requirements covered). The 150 orphan test cases are waste — testing deleted requirements. They should remove orphans, write tests for the 50 uncovered requirements, and maintain the matrix going forward.`
  },
  {
    moduleNumber: 12,
    track: "professional_practice",
    title: "Test Documentation & Evidence",
    subtitle: "What to write, when, and why it matters",
    visualAidUrl: "/manus-storage/stf-module-12-infographic_17379a01.png",
    infographicTakeaway: "Documentation is not bureaucracy — it is the evidence that testing happened and the knowledge that survives turnover.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Match each document to its purpose and when it is created",
    crucibleConfig: JSON.stringify({
      gameName: "Document Organizer",
      type: "drag-match",
      items: [
        { defect: "Defines overall test strategy, scope, resources, and schedule", answer: "Test Plan", points: 20 },
        { defect: "Step-by-step instructions for executing a specific test", answer: "Test Case", points: 20 },
        { defect: "Records actual results vs. expected results during execution", answer: "Test Execution Log", points: 20 },
        { defect: "Summarizes testing activities, defects found, and coverage achieved", answer: "Test Summary Report", points: 20 },
        { defect: "Describes a specific defect with steps to reproduce", answer: "Defect Report", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*If a surgeon performed an operation but kept no records — no notes, no imaging, no post-op report — would you trust the outcome?*

Test documentation serves the same purpose as medical records: it proves what was done, captures what was found, and enables others to understand and repeat the work.

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

**Writing Effective Test Cases:**

A good test case has: a unique ID, a clear title, preconditions, step-by-step actions, expected results for each step, and postconditions.

*What makes a test case "maintainable"?*

It is independent (does not depend on other test cases running first), it uses clear language (not "click the thing"), and it separates test data from test logic.

**Static Testing — Reviews and Inspections:**

| Review Type | Formality | Led By | Purpose |
|------------|-----------|--------|---------|
| Informal Review | Low | Anyone | Quick feedback |
| Walkthrough | Medium | Author | Explain and get feedback |
| Technical Review | High | Moderator | Find defects in work products |
| Inspection | Very High | Trained moderator | Formal defect detection with metrics |

**Test Estimation Techniques:**
- **Ratio-based:** Historical data (e.g., 3 test hours per requirement)
- **Wideband Delphi:** Expert consensus through rounds of estimation
- **Three-point:** (Optimistic + 4\u00d7Most Likely + Pessimistic) / 6

**Static Testing vs. Dynamic Testing \u2014 The Fundamental Divide**

| Aspect | Static Testing | Dynamic Testing |
|--------|---------------|----------------|
| Execution | Code is NOT executed | Code IS executed |
| When | Before compilation/deployment | After compilation/deployment |
| Finds | Defects in documents, code, designs | Failures in running software |
| Techniques | Reviews, walkthroughs, static analysis | Unit tests, integration tests, system tests |
| Cost | Very low (early detection) | Higher (requires running environment) |

Static testing can find defects that dynamic testing cannot: ambiguous requirements, coding standard violations, unreachable code, and security vulnerabilities in code patterns. Dynamic testing finds defects that static testing cannot: runtime errors, performance issues, and integration failures.

**Testware \u2014 The Artifacts of Testing**

Testware is everything produced during the testing process: test plans, test cases, test data, test scripts, test environments, test tools, test reports, and defect reports. Testware is a project asset that must be version-controlled, maintained, and managed just like source code.

**Review Success Factors (ISTQB 3.2.5)**

Reviews fail when they become blame sessions. Success factors include: clear objectives defined in advance, the right people with adequate preparation time, findings expressed objectively (about the product, not the author), management support for the review process, and a culture that treats defects as learning opportunities.

**Test Scenarios vs. Test Cases**

| Aspect | Test Scenario | Test Case |
|--------|--------------|----------|
| Detail | High-level | Step-by-step |
| Example | "Verify user login" | "1. Open /login 2. Enter admin@test.com 3. Enter Password123 4. Click Submit 5. Verify dashboard loads" |
| Purpose | Coverage planning | Execution guidance |
| Who writes | Test lead/analyst | Test designer |

**The 9-Phase Testing Cycle**

1. Requirements Analysis \u2192 2. Test Planning \u2192 3. Test Design \u2192 4. Test Environment Setup \u2192 5. Test Data Preparation \u2192 6. Test Execution \u2192 7. Defect Reporting \u2192 8. Test Closure \u2192 9. Lessons Learned

**Entry and Exit Criteria**

Entry criteria define when testing can begin (e.g., code deployed, test environment ready, test data loaded). Exit criteria define when testing is complete (e.g., all critical tests passed, defect density below threshold, coverage targets met). Without entry criteria, you test too early. Without exit criteria, you test forever.`,
    imprintContent: `*A tester leaves the company. Their replacement opens the test management tool and finds 2000 test cases with titles like "Test 1", "Test 2", "Login test", and "Check thing." No descriptions, no expected results, no traceability. How long will it take the new tester to become productive, and what should the team have done differently?*

Answer: Weeks to months of reverse-engineering. The team should have enforced test case standards: meaningful titles, clear steps, expected results, and traceability to requirements. Documentation is knowledge that survives turnover.

Now consider testware management: Those 2000 test cases ARE testware. But testware without standards is technical debt. The team should have treated testware like code: version-controlled, reviewed, maintained, and retired when obsolete. A static review of the test cases (static testing of testware!) would have caught the quality issues before they became a crisis.`
  },
  {
    moduleNumber: 13,
    track: "professional_practice",
    title: "Defect Management",
    subtitle: "Finding, reporting, and tracking bugs to resolution",
    visualAidUrl: "/manus-storage/stf-module-13-infographic_961928a8.png",
    infographicTakeaway: "A well-written defect report is a gift to the developer — a poorly written one is a time bomb.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Rate each defect report as Good, Needs Improvement, or Terrible",
    crucibleConfig: JSON.stringify({
      gameName: "Defect Report Reviewer",
      type: "drag-match",
      items: [
        { defect: "Title: 'Login broken.' Steps: 'Try to login.' Expected: 'Should work.'", answer: "Terrible — no specifics, no environment, no actual result", points: 20 },
        { defect: "Title: 'Login fails with valid credentials on Chrome 120/Windows 11.' Steps: '1. Navigate to /login 2. Enter admin@test.com / Password123 3. Click Submit.' Expected: 'Dashboard loads.' Actual: '500 error.'", answer: "Good — specific, reproducible, includes environment", points: 20 },
        { defect: "Title: 'Something wrong with payments.' Steps: 'I clicked pay and it didn't work.' Expected: 'Payment goes through.'", answer: "Needs Improvement — vague steps, no error details, no environment", points: 20 },
        { defect: "Title: 'Timeout on /api/users when >1000 records, PostgreSQL 15, 2GB RAM.' Steps: '1. Seed 1500 users 2. GET /api/users 3. Observe 30s timeout.' Actual: 'Query takes 45s, connection drops.'", answer: "Good — includes data conditions, infrastructure details, measurable result", points: 20 },
        { defect: "Title: 'The app is slow.' Steps: 'Open the app.' Expected: 'Fast.'", answer: "Terrible — subjective, no measurements, no specific page or action", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*"It doesn't work." — the three most useless words in software development.*

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

**Test Execution Metrics (ISTQB 5.3)**

Beyond defect metrics, test execution metrics track the testing process itself:

| Metric | Formula | Purpose |
|--------|---------|--------|
| Test Case Pass Rate | (Passed / Total Executed) \u00d7 100 | Overall quality indicator |
| Test Case Execution Rate | (Executed / Total Planned) \u00d7 100 | Progress tracking |
| Test Coverage | (Requirements with tests / Total Requirements) \u00d7 100 | Completeness |
| Defect Removal Efficiency | (Defects found before release / Total defects) \u00d7 100 | Testing effectiveness |
| Defect Rejection Rate | (Rejected defects / Total reported) \u00d7 100 | Report quality |

*If your test case pass rate is 100%, should you celebrate? Not necessarily \u2014 it might mean your tests are not challenging enough, or you are only testing the easy paths.*

**Configuration Management for Testing (ISTQB 5.4)**

Configuration management ensures that all test artifacts are versioned, tracked, and reproducible:

- **Version control** for test scripts, test data, and test environments
- **Baseline management** \u2014 snapshot of all artifacts at a point in time
- **Change control** \u2014 formal process for modifying test artifacts
- **Traceability** \u2014 linking test artifacts to requirements and code versions

Without configuration management, you cannot answer: "Which version of the test was run against which version of the code in which environment?" This makes defect reproduction impossible and audit compliance a nightmare.`,
    imprintContent: `*Two testers find the same bug. Tester A writes: "Payment broken." Tester B writes: "Payment fails with error 'INSUFFICIENT_FUNDS' when processing $0.01 charge on Stripe test mode, Visa ending 4242, Chrome 120, macOS 14.2. Steps: 1. Add item ($0.01) to cart 2. Proceed to checkout 3. Enter test card 4. Click Pay. Expected: Success. Actual: Error modal with code INSUFFICIENT_FUNDS." Which report gets fixed faster, and why?*

Answer: Tester B's report gets fixed immediately because the developer can reproduce it in minutes. Tester A's report requires a conversation, wasting everyone's time.

Now consider configuration management: Three months later, the same bug reappears. Without configuration management, nobody knows which version of the code was tested, which test environment was used, or which test data was loaded. With configuration management, you can trace: "Version 2.3.1 was tested on 2024-01-15 in staging environment v4 with test data set 7 \u2014 and the bug was verified fixed. The regression happened in version 2.4.0 when the payment module was refactored." That is the power of configuration management.`
  },
  {
    moduleNumber: 14,
    track: "professional_practice",
    title: "Test Automation Fundamentals",
    subtitle: "TDD, BDD, and the automation pyramid",
    visualAidUrl: "/manus-storage/stf-module-14-infographic_c2e4d6b2.png",
    infographicTakeaway: "Automate the boring, repeat the creative — let machines run regressions while humans explore.",
    estimatedMinutes: 15,
    crucibleType: "game",
    cruciblePrompt: "Classify each statement as TDD, BDD, or Neither",
    crucibleConfig: JSON.stringify({
      gameName: "TDD vs BDD Classifier",
      type: "drag-match",
      items: [
        { defect: "Write a failing test first, then write code to make it pass", answer: "TDD", points: 20 },
        { defect: "Given/When/Then scenarios written in plain English", answer: "BDD", points: 20 },
        { defect: "Red → Green → Refactor cycle", answer: "TDD", points: 20 },
        { defect: "Business stakeholders collaborate on acceptance criteria", answer: "BDD", points: 20 },
        { defect: "Record user actions in the browser and replay them", answer: "Neither — Record & Playback", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*What if you wrote the test before you wrote the code?*

That counterintuitive idea is the foundation of Test-Driven Development (TDD), and it has transformed how modern software is built.

**Test-Driven Development (TDD):**

The TDD cycle is three steps, repeated hundreds of times per day:
1. **Red:** Write a failing test for the next small piece of functionality
2. **Green:** Write the minimum code to make the test pass
3. **Refactor:** Clean up the code while keeping all tests green

*Why would writing the test first produce better code than writing the code first?*

Because the test forces you to think about the interface before the implementation. You design how the code should be used before you decide how it works internally. This produces cleaner, more testable, more modular code.

**Behavior-Driven Development (BDD):**

BDD extends TDD by writing tests in natural language that business stakeholders can understand:

\`\`\`
Given a registered user with valid credentials
When they enter their email and password and click Login
Then they should see the Dashboard page
\`\`\`

Tools like Cucumber, SpecFlow, and Behave translate these scenarios into executable tests.

**The Automation Pyramid (Revisited):**

| Level | Examples | Run Time | Maintenance |
|-------|----------|----------|-------------|
| Unit (70%) | Jest, JUnit, pytest | Milliseconds | Low |
| Integration (20%) | Supertest, Postman, REST Assured | Seconds | Medium |
| E2E (10%) | Cypress, Playwright, Selenium | Minutes | High |

**What NOT to Automate:**
- Exploratory testing (requires human creativity)
- Usability testing (requires human judgment)
- One-time tests (automation ROI requires repetition)
- Tests for frequently changing features (maintenance cost exceeds benefit)

**Continuous Integration + Test Automation:** In a CI pipeline, automated tests run on every commit. If any test fails, the build is "broken" and the team stops to fix it before adding new code. This discipline ensures the codebase is always in a releasable state.`,
    imprintContent: `*A team automates 100% of their tests — unit, integration, E2E, everything. They have zero manual testing. Six months later, users report that the app "feels wrong" — buttons are in confusing places, workflows are unintuitive, and the color scheme causes eye strain. All automated tests pass. What went wrong?*

Answer: Automated tests verify functional correctness but cannot evaluate user experience, usability, or aesthetic quality. The team needed exploratory testing and usability reviews — activities that require human judgment and cannot be automated.`
  },
  {
    moduleNumber: 15,
    track: "professional_practice",
    title: "Putting It All Together",
    subtitle: "Building a complete test strategy from scratch",
    visualAidUrl: "/manus-storage/stf-module-15-infographic_b5eb67b2.png",
    infographicTakeaway: "A test strategy is not a document — it is a living decision framework that evolves with your project.",
    estimatedMinutes: 15,
    crucibleType: "exercise",
    cruciblePrompt: "Build a complete test strategy for a given project scenario",
    crucibleConfig: JSON.stringify({
      gameName: "Strategy Architect",
      type: "drag-match",
      items: [
        { defect: "Step 1: Understand the project context and constraints", answer: "Context Analysis", points: 20 },
        { defect: "Step 2: Identify and prioritize risks", answer: "Risk Assessment", points: 20 },
        { defect: "Step 3: Select test levels, types, and techniques", answer: "Test Design", points: 20 },
        { defect: "Step 4: Define entry/exit criteria and metrics", answer: "Quality Gates", points: 20 },
        { defect: "Step 5: Build traceability from requirements to test evidence", answer: "Traceability Matrix", points: 20 }
      ],
      maxScore: 100
    }),
    sparkContent: `*You have learned the principles, the models, the techniques, and the tools. Now it is time to assemble them into a coherent strategy.*

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

**The Complete Picture:**

| SDLC Phase | Testing Activity | Documents | Traceability |
|-----------|-----------------|-----------|-------------|
| Requirements | Reviews, testability analysis | Test plan | REQ → Test Plan |
| Design | Test case design, review | Test cases | REQ → Test Cases |
| Implementation | Unit testing, code review | Unit test results | Code → Unit Tests |
| Testing | Execution, defect reporting | Execution logs, defect reports | Test Cases → Results |
| Release | Acceptance, regression | Test summary report | REQ → Evidence |

**Test Estimation Techniques (ISTQB 5.1.3) \u2014 Detailed**

Estimation is one of the hardest skills in testing. Here are the four key techniques:

| Technique | How It Works | Best For |
|-----------|-------------|----------|
| Wideband Delphi | Multiple experts estimate independently, then discuss and re-estimate in rounds until consensus | Complex projects with experienced team |
| Three-Point Estimation | (Optimistic + 4\u00d7Most Likely + Pessimistic) / 6 | Individual task estimation |
| Ratio-Based | Use historical data ratios (e.g., 3 test hours per requirement, 1 tester per 3 developers) | Organizations with historical data |
| Extrapolation | Measure actual effort for a sample, then extrapolate to the full scope | Mid-project re-estimation |

**Maintenance Testing (ISTQB 2.4) \u2014 Detailed**

Maintenance testing is triggered whenever existing software is modified. The four types of maintenance:

- **Corrective:** Fixing defects found in production
- **Adaptive:** Adapting to environment changes (new OS, new database, new regulations)
- **Perfective:** Adding new features or improving performance
- **Preventive:** Refactoring to prevent future problems

Impact analysis is critical before maintenance testing: What was changed? What depends on what was changed? What tests need to be re-run? Without impact analysis, you either test everything (expensive) or test too little (risky).

**Shift-Left Testing \u2014 The Modern Imperative**

Shift-left means moving testing activities earlier in the SDLC:

| Traditional (Right) | Shift-Left |
|-------------------|------------|
| Test after coding | Test during/before coding |
| Find defects in system testing | Find defects in requirements review |
| Testers write test cases after code | Testers write test cases during design |
| Automation after manual testing | Automation from day one |

Shift-left practices include: TDD, BDD, static analysis in CI/CD, pair programming, requirement reviews with testers, and three amigos sessions (developer + tester + business analyst).

*You now have every tool in the testing toolbox. The question is no longer "What should I test?" but "How do I orchestrate all of these tools to deliver confidence that the software works?"*`,
    imprintContent: `*Final thought experiment: You are hired as the first QA engineer at a 50-person startup that has never had formal testing. They ship daily, have no test documentation, no traceability, and defects are found by customers. You have 90 days to transform their quality practice. Using everything you have learned in this course, what is your 90-day plan?*

Week 1-2: Context analysis \u2014 understand the product, team, and biggest pain points. Apply shift-left thinking from day one.
Week 3-4: Implement basic defect tracking and start a traceability matrix for the top 20 critical requirements. Use ratio-based estimation to plan effort.
Week 5-8: Introduce automated unit tests for new code (TDD), set up CI pipeline with basic smoke tests. Apply three-point estimation for sprint planning.
Week 9-10: Establish test levels (unit, integration, system) with clear entry/exit criteria. Implement configuration management for all testware.
Week 11-12: Train the team on the Whole Team Approach, implement sprint-level testing in their Agile process. Establish maintenance testing procedures.
Week 13: Present metrics (defect density trend, coverage growth, production defect reduction, defect removal efficiency) to leadership. Use Wideband Delphi for next quarter's estimation.`
  }
];

// Insert modules
for (const mod of modules) {
  await conn.execute(
    `INSERT INTO stf_modules (moduleNumber, stfTrack, title, subtitle, sparkContent, imprintContent, crucibleType, cruciblePrompt, crucibleConfig, visualAidUrl, infographicTakeaway, estimatedMinutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [mod.moduleNumber, mod.track, mod.title, mod.subtitle, mod.sparkContent, mod.imprintContent, mod.crucibleType, mod.cruciblePrompt, mod.crucibleConfig, mod.visualAidUrl, mod.infographicTakeaway, mod.estimatedMinutes]
  );
  console.log(`Inserted module ${mod.moduleNumber}: ${mod.title}`);
}

// Get module IDs
const [moduleRows] = await conn.execute("SELECT id, moduleNumber FROM stf_modules ORDER BY moduleNumber");
const moduleIdMap = {};
for (const row of moduleRows) {
  moduleIdMap[row.moduleNumber] = row.id;
}

// Quiz questions - variable per module, 95 total
const quizzes = [
  // Module 1: Why We Test
  { mod: 1, q: 1, question: "A defect found in production costs approximately how many times more to fix than one found during requirements?", options: JSON.stringify(["2-5x", "10-15x", "30-100x", "About the same"]), correct: 2, explanation: "Industry data from IBM, NIST, and the Standish Group consistently shows that production defects cost 30-100x more due to the cascade of dependencies that must be unraveled." },
  { mod: 1, q: 2, question: "The PRIMARY purpose of software testing is:", options: JSON.stringify(["To prove software works correctly", "To find ways software does NOT work", "To delay release", "To satisfy management"]), correct: 1, explanation: "Testing is about finding defects, not proving their absence. A test that passes tells you one thing; a test that fails tells you everything." },
  { mod: 1, q: 3, question: "The correct chain is:", options: JSON.stringify(["Failure → Fault → Error", "Error → Fault → Failure", "Fault → Error → Failure", "Error → Failure → Fault"]), correct: 1, explanation: "A human Error creates a Fault in the code, which causes a Failure when executed. The chain always starts with a human mistake." },
  { mod: 1, q: 4, question: "Why does defect cost increase later in the lifecycle?", options: JSON.stringify(["Developers cost more over time", "Each layer built on a flaw must be unraveled", "Tools cost more", "Management overhead"]), correct: 1, explanation: "A defect in a requirement corrupts the design, code, tests, documentation, and user expectations. Later discovery means more layers to repair." },
  { mod: 1, q: 5, question: "Testing is best described as:", options: JSON.stringify(["A phase at the end of development", "An investigation and mindset throughout the lifecycle", "Running automated scripts", "Checking compliance boxes"]), correct: 1, explanation: "Testing is a continuous activity and mindset — from reviewing requirements to monitoring production — not just a phase." },
  { mod: 1, q: 6, question: "SQA is primarily focused on:", options: JSON.stringify(["Finding defects in the product", "Preventing defects through process improvement", "Writing test cases", "Executing test scripts"]), correct: 1, explanation: "SQA is process-oriented and proactive — it focuses on preventing defects by improving the processes that create software." },
  { mod: 1, q: 7, question: "Verification asks 'Are we building the product RIGHT?' while Validation asks:", options: JSON.stringify(["Are we building it fast enough?", "Are we building the RIGHT product?", "Are we using the right tools?", "Are we building it cheaply?"]), correct: 1, explanation: "Verification checks conformance to specification; Validation checks that the product meets actual user needs." },
  { mod: 1, q: 8, question: "Which level of testing independence has the HIGHEST objectivity?", options: JSON.stringify(["Developer tests own code", "Another developer tests", "Dedicated internal test team", "External test organization"]), correct: 3, explanation: "External test organizations (Level 4) have maximum objectivity — no organizational bias — but may lack domain knowledge." },
  { mod: 1, q: 9, question: "Which skill is MOST critical for a tester to ensure defects actually get fixed?", options: JSON.stringify(["Technical literacy", "Communication", "Curiosity", "Domain knowledge"]), correct: 1, explanation: "A tester with perfect technical skills but poor communication will find defects that never get fixed. Clear defect reports are essential." },

  // Module 2: Seven Principles
  { mod: 2, q: 1, question: "'We ran 10,000 tests and they all passed, so the software is defect-free.' This violates:", options: JSON.stringify(["Pesticide Paradox", "Testing shows presence, not absence", "Defects cluster", "Context-dependent"]), correct: 1, explanation: "Principle 1: Testing can show the presence of defects but cannot prove their absence. Passing tests only prove those specific scenarios work." },
  { mod: 2, q: 2, question: "Same regression suite for 6 months, no new defects found. Which principle?", options: JSON.stringify(["Exhaustive impossible", "Pesticide Paradox", "Early testing", "Absence-of-errors"]), correct: 1, explanation: "The Pesticide Paradox: running the same tests repeatedly stops finding new defects, like insects developing resistance. Tests must be updated." },
  { mod: 2, q: 3, question: "80% of defects in 3 out of 30 modules illustrates:", options: JSON.stringify(["Defects cluster together", "Context-dependent", "Exhaustive impossible", "Early testing"]), correct: 0, explanation: "Principle 4: Defects Cluster Together (Pareto principle). ~80% of defects are found in ~20% of modules." },
  { mod: 2, q: 4, question: "Flawless e-commerce site but users cannot check out. Which principle?", options: JSON.stringify(["Pesticide Paradox", "Defects cluster", "Absence-of-errors fallacy", "Early testing"]), correct: 2, explanation: "Principle 7: A bug-free product that doesn't meet user needs is still a failure. Testing must verify usefulness, not just correctness." },
  { mod: 2, q: 5, question: "Pacemaker vs. to-do app requires different rigor. Which principle?", options: JSON.stringify(["Context-dependent", "Exhaustive impossible", "Early testing", "Defects cluster"]), correct: 0, explanation: "Principle 6: Testing is context-dependent. The approach, rigor, and techniques must adapt to the product's risk profile." },

  // Module 3: Waterfall
  { mod: 3, q: 1, question: "In the Waterfall model, when does formal testing primarily occur?", options: JSON.stringify(["During requirements", "During design", "After implementation", "Continuously"]), correct: 2, explanation: "In pure Waterfall, testing is a distinct phase that occurs after implementation is complete." },
  { mod: 3, q: 2, question: "Waterfall is BEST suited for projects where:", options: JSON.stringify(["Requirements change frequently", "Requirements are stable and well-understood", "The team is new to the domain", "Rapid prototyping is needed"]), correct: 1, explanation: "Waterfall excels when requirements are stable because changing them later requires cascading rework through all subsequent phases." },
  { mod: 3, q: 3, question: "The biggest testing risk in Waterfall is:", options: JSON.stringify(["Too many testers", "Defects in requirements not found until testing phase", "Tests run too fast", "Too much automation"]), correct: 1, explanation: "Requirements defects may not be discovered until months later during the testing phase, when the cost to fix has multiplied exponentially." },
  { mod: 3, q: 4, question: "Who created the Waterfall model and when?", options: JSON.stringify(["Kent Beck, 2001", "Winston Royce, 1970", "Barry Boehm, 1986", "Martin Fowler, 1999"]), correct: 1, explanation: "Winston Royce described the Waterfall model in his 1970 paper, though he actually warned against using it without iteration." },
  { mod: 3, q: 5, question: "What concept did Waterfall introduce to testing?", options: JSON.stringify(["Continuous integration", "Formal documentation and phase gates", "Pair programming", "Sprint retrospectives"]), correct: 1, explanation: "Waterfall gave us formal documentation, phase gates, sign-offs, and the idea that testing is a planned activity." },

  // Module 4: V-Model
  { mod: 4, q: 1, question: "In the V-Model, acceptance tests are designed during which phase?", options: JSON.stringify(["Coding", "System design", "Business requirements", "Integration testing"]), correct: 2, explanation: "The V-Model pairs each development phase with a testing phase. Acceptance tests mirror business requirements." },
  { mod: 4, q: 2, question: "Verification asks:", options: JSON.stringify(["Are we building the right product?", "Are we building the product right?", "Is the product fast enough?", "Do users like the product?"]), correct: 1, explanation: "Verification = 'Are we building the product RIGHT?' (reviews, inspections). Validation = 'Are we building the RIGHT product?' (dynamic testing)." },
  { mod: 4, q: 3, question: "Which testing level corresponds to High-Level Design in the V-Model?", options: JSON.stringify(["Unit testing", "Integration testing", "System testing", "Acceptance testing"]), correct: 1, explanation: "High-Level Design (architecture) maps to Integration Testing, which verifies that components work together as designed." },
  { mod: 4, q: 4, question: "Static testing in the V-Model includes:", options: JSON.stringify(["Running unit tests", "Reviews and inspections of documents", "Performance testing", "User acceptance testing"]), correct: 1, explanation: "Static testing means examining work products without executing code — reviews, inspections, and walkthroughs of requirements and design documents." },
  { mod: 4, q: 5, question: "The V-Model's main advantage over Waterfall is:", options: JSON.stringify(["Faster delivery", "Test planning begins alongside development", "No documentation needed", "Cheaper to implement"]), correct: 1, explanation: "The V-Model's key innovation is that test planning is a parallel activity to development, not a sequential afterthought." },

  // Module 5: Iterative & Incremental
  { mod: 5, q: 1, question: "The key difference between iterative and incremental development is:", options: JSON.stringify(["Iterative is faster", "Iterative refines the whole; incremental adds parts", "Incremental has no testing", "They are the same thing"]), correct: 1, explanation: "Iterative = refine the whole system in cycles. Incremental = build one complete feature at a time. Most projects combine both." },
  { mod: 5, q: 2, question: "In iterative models, regression testing becomes essential because:", options: JSON.stringify(["Management requires it", "Each iteration may break previously working features", "It is the cheapest type of testing", "Regulators demand it"]), correct: 1, explanation: "Each iteration adds new code that may break existing functionality. Regression tests verify that previous features still work." },
  { mod: 5, q: 3, question: "The Spiral Model added which concept to iterative development?", options: JSON.stringify(["Pair programming", "Risk analysis before each iteration", "Continuous deployment", "Test automation"]), correct: 1, explanation: "Barry Boehm's Spiral Model (1986) added risk analysis to each iteration — identify and mitigate the biggest risks first." },
  { mod: 5, q: 4, question: "Sprint reviews and retrospectives are forms of:", options: JSON.stringify(["Automated testing", "Static testing and validation", "Performance testing", "Security testing"]), correct: 1, explanation: "Reviews and retrospectives validate that the increment meets expectations and improve the process — both are testing activities." },
  { mod: 5, q: 5, question: "What happens to the test suite size in iterative development?", options: JSON.stringify(["It stays the same", "It shrinks each iteration", "It grows with each iteration", "It is replaced each iteration"]), correct: 2, explanation: "Every iteration adds new features and new tests. The regression suite accumulates, making automation increasingly important." },

  // Module 6: Agile Testing
  { mod: 6, q: 1, question: "The Agile Manifesto values:", options: JSON.stringify(["Comprehensive documentation over working software", "Working software over comprehensive documentation", "Processes over individuals", "Contract negotiation over collaboration"]), correct: 1, explanation: "The Agile Manifesto values working software over comprehensive documentation, though documentation still has value." },
  { mod: 6, q: 2, question: "In Scrum, a user story is 'done' when:", options: JSON.stringify(["Code is written", "Code is written and tested per Definition of Done", "The developer says so", "It is in the backlog"]), correct: 1, explanation: "The Definition of Done must include testing. A story without testing is not done — it is technical debt." },
  { mod: 6, q: 3, question: "The 'Whole Team Approach' means:", options: JSON.stringify(["Everyone writes code", "Quality is everyone's responsibility", "No dedicated testers", "Everyone attends all meetings"]), correct: 1, explanation: "In Agile, there are no separate 'testers' and 'developers' — one team owns quality. Everyone contributes to testing." },
  { mod: 6, q: 4, question: "Kanban's WIP limits help testing by:", options: JSON.stringify(["Making tests run faster", "Preventing 'everything in progress, nothing done'", "Eliminating the need for testing", "Reducing team size"]), correct: 1, explanation: "WIP limits ensure you finish testing current work before starting new work, preventing the accumulation of untested features." },
  { mod: 6, q: 5, question: "Testing Quadrant Q3 (Business-facing, Critiquing) includes:", options: JSON.stringify(["Unit tests", "Performance tests", "Exploratory and usability testing", "Component tests"]), correct: 2, explanation: "Q3 is business-facing and critiques the product: exploratory testing, usability testing, and user acceptance testing." },

  // Module 7: DevOps & Continuous Testing
  { mod: 7, q: 1, question: "'Shift Left' in DevOps means:", options: JSON.stringify(["Move testing later", "Move testing earlier in the pipeline", "Shift the team left", "Use left-aligned code"]), correct: 1, explanation: "Shift Left = move testing earlier. Catch defects at commit time, not deployment time." },
  { mod: 7, q: 2, question: "The base of the Test Automation Pyramid should be:", options: JSON.stringify(["E2E/UI tests", "Integration tests", "Unit tests", "Manual tests"]), correct: 2, explanation: "Unit tests form the base: many, fast, cheap. Integration in the middle. Few, slow, expensive E2E tests at the top." },
  { mod: 7, q: 3, question: "If unit tests take 30 minutes to run, the CI/CD pipeline:", options: JSON.stringify(["Works perfectly", "Becomes a bottleneck", "Needs more testers", "Should skip unit tests"]), correct: 1, explanation: "Slow tests create bottlenecks. Developers wait, batch commits, and the pipeline backs up. Fast tests are essential for CI/CD." },
  { mod: 7, q: 4, question: "'Shift Right' testing includes:", options: JSON.stringify(["Requirements reviews", "Unit testing", "Monitoring and canary testing in production", "Sprint planning"]), correct: 2, explanation: "Shift Right = testing in production: monitoring, A/B testing, canary releases, and chaos engineering." },
  { mod: 7, q: 5, question: "Infrastructure as Code (IaC) helps testing by:", options: JSON.stringify(["Making tests run faster", "Ensuring identical test environments for everyone", "Eliminating the need for testing", "Reducing code complexity"]), correct: 1, explanation: "IaC (Docker, Terraform) ensures every developer gets an identical test environment, eliminating 'works on my machine' problems." },

  // Module 8: Choosing Test Approach
  { mod: 8, q: 1, question: "Risk-based testing prioritizes effort based on:", options: JSON.stringify(["Alphabetical order of features", "Likelihood of failure × Impact of failure", "Developer preference", "Random selection"]), correct: 1, explanation: "Risk Priority = Likelihood × Impact. High-risk features get more testing effort." },
  { mod: 8, q: 2, question: "A reactive test approach is best when:", options: JSON.stringify(["Requirements are detailed and stable", "Requirements are vague and time is short", "The project is safety-critical", "Full documentation is required"]), correct: 1, explanation: "Reactive approaches (exploratory, session-based) work best when requirements are unclear and rapid feedback is needed." },
  { mod: 8, q: 3, question: "Testing a medical device requires which approach?", options: JSON.stringify(["Reactive with minimal documentation", "Analytical/risk-based with full documentation", "No formal testing needed", "Only automated testing"]), correct: 1, explanation: "Medical devices require analytical, risk-based testing with full documentation for regulatory compliance (FDA, ISO)." },
  { mod: 8, q: 4, question: "The level of test documentation should depend on:", options: JSON.stringify(["Personal preference", "Project context, risk, and regulatory requirements", "How much time is left", "The testing tool used"]), correct: 1, explanation: "Documentation level is context-dependent: regulated industries need heavy documentation; agile startups may need light documentation." },
  { mod: 8, q: 5, question: "Which factor does NOT typically influence test approach selection?", options: JSON.stringify(["Product type", "Team maturity", "The color of the office walls", "Regulatory requirements"]), correct: 2, explanation: "Test approach is influenced by product type, team maturity, regulations, budget, and risk tolerance — not irrelevant factors." },

  // Module 9: Test Levels & Types
  { mod: 9, q: 1, question: "Unit testing primarily catches:", options: JSON.stringify(["Requirements misunderstandings", "Logic errors and boundary issues in individual functions", "Performance problems", "Usability issues"]), correct: 1, explanation: "Unit tests verify individual functions/methods, catching logic errors, boundary issues, and calculation mistakes." },
  { mod: 9, q: 2, question: "Integration testing verifies:", options: JSON.stringify(["Individual functions", "Component interactions and data flow", "User satisfaction", "System performance"]), correct: 1, explanation: "Integration testing verifies that components work together correctly — interface mismatches, data flow errors, and API contracts." },
  { mod: 9, q: 3, question: "Regression testing is expensive long-term because:", options: JSON.stringify(["It requires expensive tools", "The suite grows with every feature", "It needs many testers", "It only runs once"]), correct: 1, explanation: "The regression suite grows with every feature. A system with 1000 features needs 1000+ regression tests, making automation essential." },
  { mod: 9, q: 4, question: "Non-functional testing includes:", options: JSON.stringify(["Login with valid credentials", "Page loads in under 2 seconds", "Adding items to cart", "Submitting a form"]), correct: 1, explanation: "Non-functional testing asks 'how well does it work?' — performance, security, usability, reliability, scalability." },
  { mod: 9, q: 5, question: "Maintenance testing is triggered by:", options: JSON.stringify(["New feature development only", "Patches, upgrades, environment changes, and migrations", "User complaints only", "Annual reviews only"]), correct: 1, explanation: "Maintenance testing ensures that changes to existing software (patches, upgrades, migrations) work and don't break anything." },
  { mod: 9, q: 6, question: "Smoke testing is BEST described as:", options: JSON.stringify(["Deep testing of one feature", "Broad, shallow testing of critical paths after a new build", "Testing under heavy load", "Testing by end users"]), correct: 1, explanation: "Smoke testing checks 'does the build even work?' by running broad, shallow tests on critical paths immediately after a new build." },
  { mod: 9, q: 7, question: "The difference between confirmation testing and regression testing is:", options: JSON.stringify(["They are the same thing", "Confirmation re-tests the specific fix; regression tests broader impact", "Regression is cheaper", "Confirmation is automated; regression is manual"]), correct: 1, explanation: "Confirmation testing re-runs the exact test that found the bug. Regression testing runs a broader suite to check nothing else broke." },
  { mod: 9, q: 8, question: "Alpha testing differs from beta testing in that:", options: JSON.stringify(["Alpha is done by external users", "Alpha is done at the developer's site by internal testers", "Beta is done before alpha", "They test different features"]), correct: 1, explanation: "Alpha testing is done internally at the developer's site. Beta testing is done by real external users in their own environments." },
  { mod: 9, q: 9, question: "Which performance testing subtype tests behavior under SUSTAINED load over time?", options: JSON.stringify(["Spike testing", "Stress testing", "Endurance (soak) testing", "Volume testing"]), correct: 2, explanation: "Endurance (soak) testing runs the system under sustained load for extended periods to find memory leaks and performance degradation." },
  { mod: 9, q: 10, question: "Security testing covers all EXCEPT:", options: JSON.stringify(["Confidentiality and integrity", "Authentication and authorization", "Page load speed", "Non-repudiation and availability"]), correct: 2, explanation: "Page load speed is a performance concern. Security testing covers: Confidentiality, Integrity, Authentication, Authorization, Non-repudiation, Availability." },

  // Module 10: Test Design Techniques
  { mod: 10, q: 1, question: "Equivalence Partitioning reduces test cases by:", options: JSON.stringify(["Testing everything", "Grouping inputs that should behave the same way", "Skipping invalid inputs", "Only testing boundaries"]), correct: 1, explanation: "EP divides inputs into partitions where all values should behave identically. Test one value per partition instead of every value." },
  { mod: 10, q: 2, question: "Boundary Value Analysis focuses on edges because:", options: JSON.stringify(["Edges look nice", "Off-by-one errors are the most common coding mistakes", "Boundaries are faster to test", "Managers prefer boundary tests"]), correct: 1, explanation: "Developers write conditions like 'if (age >= 18)' and off-by-one errors (>=  vs >) are extremely common at boundaries." },
  { mod: 10, q: 3, question: "Decision Table Testing is best for:", options: JSON.stringify(["Simple input fields", "Combinations of conditions that affect outcomes", "Performance testing", "Usability testing"]), correct: 1, explanation: "Decision tables map all combinations of conditions to their expected outcomes — ideal for complex business rules." },
  { mod: 10, q: 4, question: "State Transition Testing is used when:", options: JSON.stringify(["There are many input fields", "A system has distinct states and transitions", "The system has no UI", "Only for mobile apps"]), correct: 1, explanation: "State transition testing verifies that the system moves correctly between states (e.g., Idle → Active → Suspended → Closed)." },
  { mod: 10, q: 5, question: "Exploratory testing is:", options: JSON.stringify(["Random clicking", "Simultaneous test design, execution, and learning", "Only for beginners", "A replacement for all other techniques"]), correct: 1, explanation: "Exploratory testing is a skilled activity where the tester simultaneously designs, executes, and learns — guided by charters, not scripts." },
  { mod: 10, q: 6, question: "100% statement coverage guarantees:", options: JSON.stringify(["100% branch coverage", "All defects are found", "Every line was executed at least once, but NOT every branch", "The software is ready for release"]), correct: 2, explanation: "100% statement coverage means every line executed, but branches (if/else paths) may be missed. Branch coverage is stronger." },
  { mod: 10, q: 7, question: "Error guessing is MOST effective when:", options: JSON.stringify(["Used alone as the only technique", "Combined with formal techniques like EP and BVA", "Used by junior testers", "Applied only to UI testing"]), correct: 1, explanation: "Error guessing works best combined with formal techniques — use EP/BVA for systematic coverage, then error guessing for the 'weird stuff.'" },
  { mod: 10, q: 8, question: "Checklist-based testing differs from scripted testing in that:", options: JSON.stringify(["It has no structure at all", "It provides high-level items without detailed steps", "It is always automated", "It replaces all other techniques"]), correct: 1, explanation: "Checklist-based testing uses a high-level list of items to check, but the tester applies their own judgment on how to test each item." },

  // Module 11: Traceability
  { mod: 11, q: 1, question: "A traceability matrix connects:", options: JSON.stringify(["Developers to managers", "Requirements to test cases", "Bugs to features", "Sprints to releases"]), correct: 1, explanation: "A traceability matrix links every requirement to its test cases (forward) and every test case to its requirement (backward)." },
  { mod: 11, q: 2, question: "A test case with no traceable requirement is called:", options: JSON.stringify(["A bonus test", "An orphan test", "A regression test", "A smoke test"]), correct: 1, explanation: "An orphan test has no traceable requirement — it may test something irrelevant or an undocumented requirement that needs formalization." },
  { mod: 11, q: 3, question: "Forward traceability ensures:", options: JSON.stringify(["Every test has a requirement", "Every requirement has at least one test", "Tests run in order", "Requirements are well-written"]), correct: 1, explanation: "Forward traceability: Requirement → Test Cases. It ensures every requirement is covered by at least one test." },
  { mod: 11, q: 4, question: "When a requirement changes, traceability helps by:", options: JSON.stringify(["Automatically fixing tests", "Identifying all affected test cases for update", "Deleting the requirement", "Notifying management"]), correct: 1, explanation: "Traceability enables impact analysis — when a requirement changes, you can immediately find all test cases that need updating." },
  { mod: 11, q: 5, question: "A team claims '100% coverage' with 500 tests for 200 requirements. The matrix shows 50 requirements with zero tests. Real coverage is:", options: JSON.stringify(["100%", "75%", "50%", "25%"]), correct: 1, explanation: "150/200 requirements are covered = 75%. The 150 extra test cases likely trace to deleted or irrelevant requirements." },

  // Module 12: Test Documentation
  { mod: 12, q: 1, question: "A Test Plan defines:", options: JSON.stringify(["Individual test steps", "Overall scope, schedule, resources, and risks", "Defect details", "Code structure"]), correct: 1, explanation: "A Test Plan is the strategic document defining what will be tested, how, when, by whom, and what the risks are." },
  { mod: 12, q: 2, question: "The most formal type of review is:", options: JSON.stringify(["Informal review", "Walkthrough", "Technical review", "Inspection"]), correct: 3, explanation: "Inspections are the most formal: trained moderator, defined roles, metrics collected, and documented outcomes." },
  { mod: 12, q: 3, question: "A maintainable test case should be:", options: JSON.stringify(["Dependent on other test cases", "Independent, with clear language and separated test data", "As long as possible", "Written in code only"]), correct: 1, explanation: "Good test cases are independent, use clear language, separate test data from logic, and can be understood by anyone." },
  { mod: 12, q: 4, question: "The Wideband Delphi estimation technique uses:", options: JSON.stringify(["A single expert's guess", "Expert consensus through rounds of estimation", "Lines of code counting", "Random numbers"]), correct: 1, explanation: "Wideband Delphi gathers estimates from multiple experts, discusses differences, and converges through rounds until consensus." },
  { mod: 12, q: 5, question: "Test documentation is important because:", options: JSON.stringify(["Managers like paperwork", "It proves testing happened and survives team turnover", "It makes testing slower", "Regulators always require it"]), correct: 1, explanation: "Documentation is evidence that testing happened, knowledge that survives turnover, and the basis for audit compliance." },
  { mod: 12, q: 6, question: "Static testing differs from dynamic testing in that:", options: JSON.stringify(["Static testing executes the code", "Static testing examines artifacts WITHOUT executing code", "Dynamic testing is cheaper", "They are the same thing"]), correct: 1, explanation: "Static testing examines work products (code, documents, designs) without executing them. Dynamic testing requires running the software." },
  { mod: 12, q: 7, question: "Testware includes all EXCEPT:", options: JSON.stringify(["Test plans and test cases", "Test data and test scripts", "The production database", "Test reports and defect reports"]), correct: 2, explanation: "Testware is everything produced during testing: plans, cases, data, scripts, environments, tools, and reports. Production databases are not testware." },
  { mod: 12, q: 8, question: "Entry criteria define when testing can BEGIN. Which is NOT a typical entry criterion?", options: JSON.stringify(["Code deployed to test environment", "Test data loaded", "All defects fixed", "Test environment ready"]), correct: 2, explanation: "'All defects fixed' is an exit criterion (when testing ends), not an entry criterion (when testing begins)." },

  // Module 13: Defect Management
  { mod: 13, q: 1, question: "The difference between severity and priority is:", options: JSON.stringify(["They are the same thing", "Severity = technical impact; Priority = business urgency", "Severity = business urgency; Priority = technical impact", "Neither matters"]), correct: 1, explanation: "Severity = technical impact (crash vs. typo). Priority = business urgency (fix now vs. fix later). A CEO name typo is low severity, high priority." },
  { mod: 13, q: 2, question: "A good defect report must include:", options: JSON.stringify(["Just the title 'It's broken'", "Steps to reproduce, expected result, actual result, environment", "Only a screenshot", "The developer's name"]), correct: 1, explanation: "A complete defect report includes: title, environment, steps to reproduce, expected result, actual result, severity, and attachments." },
  { mod: 13, q: 3, question: "Defect Density measures:", options: JSON.stringify(["How fast defects are fixed", "Defects per 1000 lines of code", "Total defects found", "Developer productivity"]), correct: 1, explanation: "Defect Density = defects per unit of code size (typically per 1000 LOC). It indicates code quality across modules." },
  { mod: 13, q: 4, question: "A defect is 'Reopened' when:", options: JSON.stringify(["A new defect is found", "The fix did not work or introduced new issues", "The tester disagrees with the developer", "The sprint ends"]), correct: 1, explanation: "A defect is reopened when the tester verifies the fix and finds it doesn't work, or the fix introduced new problems." },
  { mod: 13, q: 5, question: "Defect Leakage refers to:", options: JSON.stringify(["Defects found during testing", "Defects that escaped to production", "Defects in documentation", "Defects in test cases"]), correct: 1, explanation: "Defect Leakage = defects that were not caught during testing and reached production. Lower leakage = better testing effectiveness." },
  { mod: 13, q: 6, question: "Test Case Pass Rate is calculated as:", options: JSON.stringify(["Total tests / Total defects", "(Passed tests / Total executed) × 100", "Defects / Lines of code", "Time spent / Tests run"]), correct: 1, explanation: "Test Case Pass Rate = (Passed / Total Executed) × 100. It is a key indicator of overall quality." },
  { mod: 13, q: 7, question: "Configuration management for testing ensures:", options: JSON.stringify(["Tests run faster", "All test artifacts are versioned, tracked, and reproducible", "Fewer testers are needed", "Defects are automatically fixed"]), correct: 1, explanation: "Configuration management tracks versions of test scripts, data, and environments so you can answer 'which test version ran against which code version.'" },

  // Module 14: Test Automation
  { mod: 14, q: 1, question: "TDD's cycle is:", options: JSON.stringify(["Green → Red → Refactor", "Red → Green → Refactor", "Refactor → Red → Green", "Code → Test → Deploy"]), correct: 1, explanation: "TDD: Red (write failing test) → Green (write minimum code to pass) → Refactor (clean up while keeping tests green)." },
  { mod: 14, q: 2, question: "BDD scenarios are written in:", options: JSON.stringify(["Machine code", "Given/When/Then natural language", "SQL", "Binary"]), correct: 1, explanation: "BDD uses Given/When/Then format in natural language that business stakeholders can understand and validate." },
  { mod: 14, q: 3, question: "What should NOT be automated?", options: JSON.stringify(["Regression tests", "Smoke tests", "Exploratory testing", "Unit tests"]), correct: 2, explanation: "Exploratory testing requires human creativity, intuition, and judgment — it cannot be scripted or automated." },
  { mod: 14, q: 4, question: "The automation pyramid recommends:", options: JSON.stringify(["Equal amounts of each test type", "Many unit tests, fewer integration, fewest E2E", "Only E2E tests", "No unit tests"]), correct: 1, explanation: "The pyramid: many fast/cheap unit tests at the base, fewer integration tests in the middle, fewest slow/expensive E2E tests at the top." },
  { mod: 14, q: 5, question: "In CI, a 'broken build' means:", options: JSON.stringify(["The server crashed", "An automated test failed and the team must fix it before continuing", "The code won't compile", "The deployment failed"]), correct: 1, explanation: "A broken build means a test failed. The team stops adding new code and fixes the failure first, keeping the codebase releasable." },

  // Module 15: Putting It All Together
  { mod: 15, q: 1, question: "The first step in building a test strategy is:", options: JSON.stringify(["Writing test cases", "Context analysis — understanding the project", "Buying testing tools", "Hiring testers"]), correct: 1, explanation: "Always start with context: What is the product? What is the SDLC? What are the constraints and regulations?" },
  { mod: 15, q: 2, question: "Entry criteria define:", options: JSON.stringify(["When testing is complete", "What must be true before testing begins", "How many testers are needed", "Which tools to use"]), correct: 1, explanation: "Entry criteria are preconditions that must be met before testing can start (e.g., build deployed, test data ready, environment stable)." },
  { mod: 15, q: 3, question: "A complete test strategy includes all EXCEPT:", options: JSON.stringify(["Risk assessment", "Test levels and types", "The developer's favorite IDE", "Traceability matrix"]), correct: 2, explanation: "A test strategy includes context analysis, risk assessment, test design, quality gates, and traceability — not personal tool preferences." },
  { mod: 15, q: 4, question: "Exit criteria define:", options: JSON.stringify(["When to start testing", "What must be true before testing ends", "How to write test cases", "Which bugs to fix"]), correct: 1, explanation: "Exit criteria are conditions that must be met to consider testing complete (e.g., 95% pass rate, all critical defects fixed, coverage targets met)." },
  { mod: 15, q: 5, question: "The most important outcome of this entire course is:", options: JSON.stringify(["Memorizing all testing terms", "Understanding how to orchestrate testing tools and techniques into a coherent strategy", "Passing the quiz", "Getting a certificate"]), correct: 1, explanation: "The goal is not memorization but understanding how to combine principles, models, techniques, and tools into an effective testing practice." },
  { mod: 15, q: 6, question: "The Wideband Delphi estimation technique works by:", options: JSON.stringify(["One expert guesses", "Multiple experts estimate independently, then discuss and converge", "Counting lines of code", "Using a formula with no human input"]), correct: 1, explanation: "Wideband Delphi gathers independent estimates from multiple experts, discusses differences, and converges through rounds until consensus." },
  { mod: 15, q: 7, question: "Shift-left testing means:", options: JSON.stringify(["Moving testing later in the SDLC", "Moving testing earlier in the SDLC", "Shifting the team structure", "Using left-aligned code formatting"]), correct: 1, explanation: "Shift-left moves testing activities earlier: TDD, BDD, static analysis in CI/CD, requirement reviews with testers, three amigos sessions." },
  { mod: 15, q: 8, question: "Impact analysis before maintenance testing answers:", options: JSON.stringify(["How much will the fix cost?", "What was changed and what depends on it?", "Who caused the defect?", "When will the release happen?"]), correct: 1, explanation: "Impact analysis determines what was changed, what depends on the change, and what tests need to be re-run to avoid testing too little or too much." }
];

for (const q of quizzes) {
  const moduleId = moduleIdMap[q.mod];
  await conn.execute(
    `INSERT INTO stf_quiz_questions (moduleId, questionNumber, question, options, correctAnswer, explanation) VALUES (?, ?, ?, ?, ?, ?)`,
    [moduleId, q.q, q.question, q.options, q.correct, q.explanation]
  );
}
console.log(`Inserted ${quizzes.length} quiz questions`);

await conn.end();
console.log(`\nSTF seed complete! 15 modules + ${quizzes.length} quiz questions.`);
