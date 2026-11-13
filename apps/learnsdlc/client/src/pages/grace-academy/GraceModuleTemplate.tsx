import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Brain, Lightbulb, BookOpen, Cpu, Target, Sparkles, Settings, Wrench, Code, Zap, BarChart3, FileText, Award, Users, Scale, Shield, Rocket, Crown, Building2, Trophy } from "lucide-react";
import { ModuleProgress } from "@/components/ModuleProgress";
import { getModuleImages } from "@/data/moduleImages";

const TOTAL_GRACE_MODULES = 30;

// Module content definitions
export interface GraceModuleContent {
  moduleNumber: number;
  title: string;
  subtitle: string;
  track: "foundation" | "intermediate" | "advanced";
  guestLecturer?: {
    name: string;
    quote: string;
  };
  readerQuestion: {
    question: string;
    signature: string;
  };
  marilynResponse: string[];
  coreConceptTitle: string;
  coreConceptContent: React.ReactNode;
  challenge?: string;
  quizQuestion?: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  };
  prevModule: { path: string; label: string };
  nextModule: { path: string; label: string };
  estimatedMinutes?: number;
}

// Module content data for all 30 modules
export const graceModules: Record<number, GraceModuleContent> = {
  1: {
    moduleNumber: 1,
    title: "Introduction to Action-Based Testing",
    subtitle: "The foundation of structured test automation",
    track: "foundation",
    guestLecturer: {
      name: "A Philosopher of Testing",
      quote: "The question is not whether machines can think, but whether humans can think clearly enough to teach them."
    },
    readerQuestion: {
      question: "I spend more time maintaining my automated tests than I do writing new ones. Every time the UI changes, half my tests break. I feel like I'm running on a treadmill, getting nowhere. Is there a better way?",
      signature: "Exhausted in Edmonton"
    },
    marilynResponse: [
      "Your frustration is not a personal failing; it is a symptom of a systemic disease. You are not alone. Across the industry, QA engineers are trapped in the same cycle: write tests, watch them break, fix them, repeat.",
      "The problem is not your tests. The problem is the philosophy behind your tests. You have been taught to automate the mechanics of testing—the clicks, the keystrokes, the element IDs. But mechanics are fragile.",
      "What if, instead of telling the machine how to test, you could tell it what to test? This is the foundation of Action-Based Testing."
    ],
    coreConceptTitle: "Intent Over Mechanics",
    coreConceptContent: (
      <p className="text-muted-foreground">
        Action-Based Testing separates the <em>what</em> from the <em>how</em>. You define actions at a business level, 
        and the framework handles the implementation details. When the UI changes, you update one action—not hundreds of tests.
      </p>
    ),
    challenge: "If we abstract away the mechanics, how do we ensure our tests still catch real bugs? This tension between abstraction and precision is what we'll explore throughout this track.",
    quizQuestion: {
      question: "What is the primary benefit of Action-Based Testing?",
      options: [
        "a) Tests run faster",
        "b) Tests are more maintainable because they focus on intent, not mechanics",
        "c) Tests require no programming knowledge",
        "d) Tests automatically fix themselves"
      ],
      answer: "b",
      explanation: "ABT separates business logic from implementation details, making tests resilient to UI changes."
    },
    prevModule: { path: "/grace-academy", label: "Course Overview" },
    nextModule: { path: "/grace-academy/module-2", label: "The Philosophy of ABT" },
    estimatedMinutes: 15
  },
  2: {
    moduleNumber: 2,
    title: "The Philosophy of ABT",
    subtitle: "Understanding the mindset behind effective test automation",
    track: "foundation",
    guestLecturer: {
      name: "A Software Architect",
      quote: "Good architecture is not about making decisions; it's about deferring decisions until you have enough information."
    },
    readerQuestion: {
      question: "My team keeps arguing about whether to use Page Object Model or some other pattern. We've rewritten our test framework three times in two years. How do we stop this cycle?",
      signature: "Frustrated Framework Hopper"
    },
    marilynResponse: [
      "The problem isn't which pattern you choose—it's that you're choosing patterns before understanding principles. Patterns are solutions to specific problems. If you don't understand the problem, you'll misapply the solution.",
      "Action-Based Testing isn't a pattern; it's a philosophy. It says: separate what you're testing from how you're testing it. Once you internalize this principle, the right patterns emerge naturally.",
      "Stop debating frameworks. Start understanding the problem you're solving."
    ],
    coreConceptTitle: "The Three Separations",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">ABT enforces three critical separations:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Test Logic</strong> from <strong>Test Data</strong> — What you're testing vs. what values you're using</li>
          <li><strong>Business Actions</strong> from <strong>Technical Implementation</strong> — What the user does vs. how it's done</li>
          <li><strong>Test Definition</strong> from <strong>Test Execution</strong> — What should happen vs. when/where it runs</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "Which separation is NOT part of the ABT philosophy?",
      options: [
        "a) Test logic from test data",
        "b) Business actions from technical implementation",
        "c) Test code from production code",
        "d) Test definition from test execution"
      ],
      answer: "c",
      explanation: "While keeping test code separate from production code is good practice, it's not one of ABT's three core separations."
    },
    prevModule: { path: "/grace-academy/module-1", label: "Introduction to ABT" },
    nextModule: { path: "/grace-academy/module-3", label: "Actions as First-Class Citizens" },
    estimatedMinutes: 15
  },
  3: {
    moduleNumber: 3,
    title: "Actions as First-Class Citizens",
    subtitle: "Building reusable, composable test components",
    track: "foundation",
    readerQuestion: {
      question: "I have 500 test cases and they all start with the same login steps. When login changes, I have to update all 500. There must be a better way.",
      signature: "Copy-Paste Casualty"
    },
    marilynResponse: [
      "You've discovered the most common anti-pattern in test automation: duplication. And like all duplication, it seems harmless at first—until it isn't.",
      "In ABT, 'Login' is not a sequence of steps you copy everywhere. It's an Action—a first-class citizen with its own definition, its own parameters, and its own implementation.",
      "When login changes, you update one Action. All 500 tests automatically use the new version."
    ],
    coreConceptTitle: "The Action Hierarchy",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Actions exist at multiple levels:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Atomic Actions</strong> — Single operations (click, type, verify)</li>
          <li><strong>Composite Actions</strong> — Combinations of atomic actions (Login, AddToCart)</li>
          <li><strong>Business Actions</strong> — Complete user journeys (CompleteCheckout, SubmitApplication)</li>
        </ul>
        <p className="text-muted-foreground">Each level builds on the one below, creating a pyramid of reusability.</p>
      </div>
    ),
    quizQuestion: {
      question: "What makes an Action a 'first-class citizen' in ABT?",
      options: [
        "a) It runs faster than regular code",
        "b) It has its own definition, parameters, and can be composed with other actions",
        "c) It requires special permissions to execute",
        "d) It can only be written by senior engineers"
      ],
      answer: "b",
      explanation: "First-class citizens can be defined, parameterized, passed around, and composed—just like functions in functional programming."
    },
    prevModule: { path: "/grace-academy/module-2", label: "The Philosophy of ABT" },
    nextModule: { path: "/grace-academy/module-4", label: "Composable Test Design" },
    estimatedMinutes: 15
  },
  4: {
    moduleNumber: 4,
    title: "Composable Test Design",
    subtitle: "Building complex tests from simple, reusable parts",
    track: "foundation",
    readerQuestion: {
      question: "Our test cases are getting longer and longer. Some are over 200 steps. They're impossible to debug when they fail. How do we manage this complexity?",
      signature: "Lost in the Steps"
    },
    marilynResponse: [
      "A 200-step test case is not a test case. It's a cry for help. No human can understand it, debug it, or maintain it.",
      "The solution is composition. Break your monolithic test into smaller, focused actions. Each action should do one thing well.",
      "A well-designed test reads like a story: 'Given a logged-in user, When they add items to cart and checkout, Then they receive a confirmation.'"
    ],
    coreConceptTitle: "The Composition Pattern",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Composable tests follow these principles:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Single Responsibility</strong> — Each action does one thing</li>
          <li><strong>Clear Interfaces</strong> — Actions have well-defined inputs and outputs</li>
          <li><strong>No Side Effects</strong> — Actions don't modify global state unexpectedly</li>
          <li><strong>Testable in Isolation</strong> — Each action can be verified independently</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What is the main benefit of composable test design?",
      options: [
        "a) Tests run in parallel automatically",
        "b) Complex tests become manageable through smaller, focused actions",
        "c) Tests require less test data",
        "d) Tests don't need assertions"
      ],
      answer: "b",
      explanation: "Composition breaks complexity into manageable pieces, making tests easier to understand, debug, and maintain."
    },
    prevModule: { path: "/grace-academy/module-3", label: "Actions as First-Class Citizens" },
    nextModule: { path: "/grace-academy/module-5", label: "State Management in ABT" },
    estimatedMinutes: 15
  },
  5: {
    moduleNumber: 5,
    title: "State Management in ABT",
    subtitle: "Handling application state across test actions",
    track: "foundation",
    readerQuestion: {
      question: "My tests pass when run individually but fail when run together. I think they're interfering with each other somehow. How do I fix this?",
      signature: "Randomly Failing"
    },
    marilynResponse: [
      "You've encountered the most insidious bug in test automation: shared state. When tests share state—whether in the application, the database, or the test framework—they become unpredictable.",
      "ABT addresses this through explicit state management. Every action declares what state it needs and what state it produces.",
      "Tests become deterministic because state is controlled, not accidental."
    ],
    coreConceptTitle: "State Contracts",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Every action has a state contract:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Preconditions</strong> — What state must exist before the action runs</li>
          <li><strong>Postconditions</strong> — What state the action guarantees after it completes</li>
          <li><strong>Invariants</strong> — What state must remain unchanged</li>
        </ul>
        <p className="text-muted-foreground">When contracts are explicit, test isolation becomes automatic.</p>
      </div>
    ),
    quizQuestion: {
      question: "Why do tests fail when run together but pass individually?",
      options: [
        "a) The tests are too slow",
        "b) Shared state between tests causes interference",
        "c) The test framework has bugs",
        "d) Tests should never be run together"
      ],
      answer: "b",
      explanation: "Shared state is the most common cause of flaky tests. Explicit state management prevents this."
    },
    prevModule: { path: "/grace-academy/module-4", label: "Composable Test Design" },
    nextModule: { path: "/grace-academy/module-6", label: "Error Handling Patterns" },
    estimatedMinutes: 15
  },
  6: {
    moduleNumber: 6,
    title: "Error Handling Patterns",
    subtitle: "Building resilient tests that fail gracefully",
    track: "foundation",
    readerQuestion: {
      question: "When my tests fail, the error messages are useless. 'Element not found' tells me nothing. How do I make failures more informative?",
      signature: "Debugging in the Dark"
    },
    marilynResponse: [
      "A test that fails silently is worse than no test at all. It gives you false confidence while hiding real problems.",
      "In ABT, error handling is not an afterthought—it's a core design principle. Every action should fail with context: what was attempted, what was expected, what actually happened.",
      "Good error messages are an investment in your future self's sanity."
    ],
    coreConceptTitle: "The Error Hierarchy",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">ABT distinguishes between error types:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Test Failures</strong> — The application didn't behave as expected (real bugs)</li>
          <li><strong>Test Errors</strong> — The test itself couldn't execute (infrastructure issues)</li>
          <li><strong>Test Warnings</strong> — Something unexpected but non-fatal occurred</li>
        </ul>
        <p className="text-muted-foreground">Each type requires different handling and different responses.</p>
      </div>
    ),
    quizQuestion: {
      question: "What's the difference between a test failure and a test error?",
      options: [
        "a) There is no difference",
        "b) Failures indicate application bugs; errors indicate test/infrastructure issues",
        "c) Failures are more severe than errors",
        "d) Errors only happen in production"
      ],
      answer: "b",
      explanation: "Distinguishing failures from errors helps teams prioritize: failures need developer attention, errors need test maintenance."
    },
    prevModule: { path: "/grace-academy/module-5", label: "State Management in ABT" },
    nextModule: { path: "/grace-academy/module-7", label: "Test Data Strategies" },
    estimatedMinutes: 15
  },
  7: {
    moduleNumber: 7,
    title: "Test Data Strategies",
    subtitle: "Managing the data that drives your tests",
    track: "foundation",
    readerQuestion: {
      question: "Our tests use hardcoded data that's always getting stale. We have users that don't exist anymore, products that were discontinued. How do we keep test data fresh?",
      signature: "Data Decay Victim"
    },
    marilynResponse: [
      "Hardcoded test data is a time bomb. It works today, fails tomorrow, and nobody knows why.",
      "ABT separates test logic from test data completely. Tests define what data they need; the framework provides it. This could be from files, databases, APIs, or generated on the fly.",
      "When data is external, tests become timeless."
    ],
    coreConceptTitle: "Data Strategies",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">ABT supports multiple data strategies:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Static Data</strong> — Fixed values for deterministic tests</li>
          <li><strong>Dynamic Data</strong> — Generated at runtime for variety</li>
          <li><strong>Seeded Data</strong> — Created before tests, cleaned after</li>
          <li><strong>Production Snapshots</strong> — Real data, anonymized for testing</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "Why should test data be separated from test logic?",
      options: [
        "a) To make tests run faster",
        "b) To allow the same test to run with different data sets",
        "c) To reduce the size of test files",
        "d) To comply with regulations"
      ],
      answer: "b",
      explanation: "Separation allows data-driven testing: one test definition, many data variations."
    },
    prevModule: { path: "/grace-academy/module-6", label: "Error Handling Patterns" },
    nextModule: { path: "/grace-academy/module-8", label: "Parallel Execution Models" },
    estimatedMinutes: 15
  },
  8: {
    moduleNumber: 8,
    title: "Parallel Execution Models",
    subtitle: "Running tests concurrently without conflicts",
    track: "foundation",
    readerQuestion: {
      question: "Our test suite takes 4 hours to run. We tried running tests in parallel but they started failing randomly. How do we speed things up without breaking everything?",
      signature: "Waiting for CI"
    },
    marilynResponse: [
      "Four hours is not a test suite; it's a punishment. But parallelization isn't just about running things simultaneously—it's about designing for concurrency.",
      "Tests that share state can't run in parallel safely. Tests that are truly independent can run anywhere, anytime, in any order.",
      "ABT's state management makes parallelization natural, not forced."
    ],
    coreConceptTitle: "Parallelization Patterns",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">ABT enables safe parallelization through:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Test Isolation</strong> — Each test gets its own state context</li>
          <li><strong>Resource Pooling</strong> — Shared resources are managed centrally</li>
          <li><strong>Dependency Declaration</strong> — Tests declare what they need, scheduler provides it</li>
          <li><strong>Conflict Detection</strong> — Framework prevents incompatible tests from running together</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the prerequisite for safe parallel test execution?",
      options: [
        "a) Faster computers",
        "b) Test isolation and explicit state management",
        "c) Fewer tests",
        "d) Running tests at night"
      ],
      answer: "b",
      explanation: "Parallel execution requires tests that don't interfere with each other—which requires isolation and state management."
    },
    prevModule: { path: "/grace-academy/module-7", label: "Test Data Strategies" },
    nextModule: { path: "/grace-academy/module-9", label: "Reporting and Observability" },
    estimatedMinutes: 15
  },
  9: {
    moduleNumber: 9,
    title: "Reporting and Observability",
    subtitle: "Making test results actionable",
    track: "foundation",
    readerQuestion: {
      question: "We have thousands of test results but no one looks at them. When something fails, people just re-run until it passes. How do we make our test reports actually useful?",
      signature: "Report Ignored"
    },
    marilynResponse: [
      "A report no one reads is not a report—it's noise. The problem isn't the report; it's that the report doesn't answer the questions people actually have.",
      "Good reporting answers: What failed? Why? What should I do about it? How urgent is it?",
      "ABT builds observability into the framework, not as an afterthought."
    ],
    coreConceptTitle: "Actionable Reporting",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Effective test reports include:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Executive Summary</strong> — Pass/fail at a glance for managers</li>
          <li><strong>Failure Analysis</strong> — Root cause, not just symptoms, for developers</li>
          <li><strong>Trend Data</strong> — Is quality improving or degrading over time?</li>
          <li><strong>Action Items</strong> — What needs to be done, by whom, by when?</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What makes a test report 'actionable'?",
      options: [
        "a) It has lots of charts",
        "b) It tells you what to do about the results",
        "c) It's sent to many people",
        "d) It's generated automatically"
      ],
      answer: "b",
      explanation: "Actionable reports don't just present data—they guide decisions and next steps."
    },
    prevModule: { path: "/grace-academy/module-8", label: "Parallel Execution Models" },
    nextModule: { path: "/grace-academy/module-10", label: "Foundation Capstone" },
    estimatedMinutes: 15
  },
  10: {
    moduleNumber: 10,
    title: "Foundation Capstone",
    subtitle: "Putting it all together",
    track: "foundation",
    readerQuestion: {
      question: "I've learned all these concepts but I'm not sure how they fit together in a real project. Can you show me the big picture?",
      signature: "Ready to Build"
    },
    marilynResponse: [
      "Congratulations on reaching this milestone. You now understand the foundations of Action-Based Testing.",
      "But knowledge without application is merely trivia. In this capstone, you'll design a complete ABT framework for a realistic scenario.",
      "This is where theory becomes practice."
    ],
    coreConceptTitle: "The Complete Picture",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">A complete ABT implementation includes:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Action Library</strong> — Reusable, composable actions at multiple levels</li>
          <li><strong>State Management</strong> — Explicit contracts for test isolation</li>
          <li><strong>Data Layer</strong> — Flexible, external test data</li>
          <li><strong>Execution Engine</strong> — Parallel-capable, observable</li>
          <li><strong>Reporting System</strong> — Actionable insights for all stakeholders</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "You've completed the Foundation track! What's the most important principle you've learned?",
      options: [
        "a) Tests should be fast",
        "b) Separate what you're testing from how you're testing it",
        "c) Use the latest tools",
        "d) Write more tests"
      ],
      answer: "b",
      explanation: "The core ABT principle: intent over mechanics, separation of concerns, composable design."
    },
    prevModule: { path: "/grace-academy/module-9", label: "Reporting and Observability" },
    nextModule: { path: "/grace-academy/intermediate", label: "AI Agent Mastery Track" },
    estimatedMinutes: 15
  },
  // Intermediate Track (Modules 11-20)
  11: {
    moduleNumber: 11,
    title: "Introduction to AI Agents",
    subtitle: "Understanding intelligent test automation",
    track: "intermediate",
    guestLecturer: {
      name: "An AI Researcher",
      quote: "The best AI doesn't replace human intelligence—it amplifies it."
    },
    readerQuestion: {
      question: "Everyone's talking about AI in testing, but it seems like hype. What can AI actually do that traditional automation can't?",
      signature: "Skeptical of the Hype"
    },
    marilynResponse: [
      "Your skepticism is healthy. Most 'AI testing' products are indeed marketing fluff wrapped around simple pattern matching.",
      "But genuine AI agents can do something traditional automation cannot: they can reason about intent, adapt to change, and learn from experience.",
      "The key is understanding what AI is good at—and what it isn't."
    ],
    coreConceptTitle: "AI Agent Capabilities",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">AI agents excel at:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Pattern Recognition</strong> — Finding similar elements across different UIs</li>
          <li><strong>Natural Language</strong> — Understanding test intent from descriptions</li>
          <li><strong>Adaptation</strong> — Adjusting to UI changes without explicit updates</li>
          <li><strong>Generation</strong> — Creating test cases from requirements</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What distinguishes AI agents from traditional test automation?",
      options: [
        "a) They run faster",
        "b) They can reason about intent and adapt to change",
        "c) They don't need any human input",
        "d) They only work in the cloud"
      ],
      answer: "b",
      explanation: "AI agents understand what you're trying to test, not just how to click buttons."
    },
    prevModule: { path: "/grace-academy/module-10", label: "Foundation Capstone" },
    nextModule: { path: "/grace-academy/module-12", label: "The GRACE Architecture" },
    estimatedMinutes: 15
  },
  12: {
    moduleNumber: 12,
    title: "The GRACE Architecture",
    subtitle: "How intelligent testing systems are built",
    track: "intermediate",
    readerQuestion: {
      question: "I want to build an AI-powered testing system but don't know where to start. What are the core components I need?",
      signature: "Aspiring Architect"
    },
    marilynResponse: [
      "GRACE—Generative Requirement Aware Cognitive Engineering—is not a product. It's an architecture pattern.",
      "Like any good architecture, it separates concerns: understanding requirements, generating tests, executing them, and learning from results.",
      "Each component can be implemented with different technologies, but the structure remains constant."
    ],
    coreConceptTitle: "GRACE Components",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">The GRACE architecture includes:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Requirement Analyzer</strong> — Understands what needs to be tested</li>
          <li><strong>Test Generator</strong> — Creates test cases from requirements</li>
          <li><strong>Execution Engine</strong> — Runs tests with self-healing capabilities</li>
          <li><strong>Cognitive Core</strong> — Learns and improves over time</li>
          <li><strong>Feedback Loop</strong> — Connects results back to requirements</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What does GRACE stand for?",
      options: [
        "a) General Regression Automated Checking Engine",
        "b) Generative Requirement Aware Cognitive Engineering",
        "c) Guided Robotic Automation for Continuous Execution",
        "d) Generic Reusable Automated Component Environment"
      ],
      answer: "b",
      explanation: "GRACE emphasizes understanding requirements and cognitive capabilities."
    },
    prevModule: { path: "/grace-academy/module-11", label: "Introduction to AI Agents" },
    nextModule: { path: "/grace-academy/module-13", label: "Requirement Analysis Agents" },
    estimatedMinutes: 15
  },
  13: {
    moduleNumber: 13,
    title: "Requirement Analysis Agents",
    subtitle: "Teaching AI to understand what needs testing",
    track: "intermediate",
    readerQuestion: {
      question: "Our requirements are scattered across Jira, Confluence, emails, and people's heads. How can AI help make sense of this chaos?",
      signature: "Requirements Archaeologist"
    },
    marilynResponse: [
      "Requirements chaos is universal. Every organization suffers from it. The question is not how to eliminate chaos—it's how to extract signal from noise.",
      "Requirement Analysis Agents use NLP to parse documents, identify testable statements, and link related requirements across sources.",
      "They don't replace human judgment—they augment it with comprehensive coverage."
    ],
    coreConceptTitle: "Requirement Analysis Pipeline",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">The analysis pipeline includes:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Document Ingestion</strong> — Collecting requirements from all sources</li>
          <li><strong>Entity Extraction</strong> — Identifying actors, actions, and outcomes</li>
          <li><strong>Relationship Mapping</strong> — Connecting related requirements</li>
          <li><strong>Testability Scoring</strong> — Rating how testable each requirement is</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What is the primary output of a Requirement Analysis Agent?",
      options: [
        "a) Test code",
        "b) Structured, testable requirements with relationships mapped",
        "c) Bug reports",
        "d) Performance metrics"
      ],
      answer: "b",
      explanation: "Analysis agents structure chaos into testable, connected requirements."
    },
    prevModule: { path: "/grace-academy/module-12", label: "The GRACE Architecture" },
    nextModule: { path: "/grace-academy/module-14", label: "Test Generation Agents" },
    estimatedMinutes: 15
  },
  14: {
    moduleNumber: 14,
    title: "Test Generation Agents",
    subtitle: "Automatically creating tests from requirements",
    track: "intermediate",
    readerQuestion: {
      question: "Can AI really write good test cases? Every AI-generated code I've seen is mediocre at best.",
      signature: "Quality Skeptic"
    },
    marilynResponse: [
      "You're right to be skeptical. AI-generated code is often mediocre because it lacks context. It doesn't know your system, your users, your edge cases.",
      "Test Generation Agents are different because they're fed rich context: analyzed requirements, existing test patterns, historical defects.",
      "The output isn't perfect—but it's a starting point that humans refine."
    ],
    coreConceptTitle: "Generation Strategies",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Test generation approaches:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Template-Based</strong> — Fill in patterns with requirement-specific details</li>
          <li><strong>Example-Based</strong> — Learn from existing tests to create similar ones</li>
          <li><strong>Generative</strong> — Create novel tests from first principles</li>
          <li><strong>Hybrid</strong> — Combine approaches for best results</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "Why are Test Generation Agents more effective than generic code generators?",
      options: [
        "a) They use better AI models",
        "b) They have rich context from requirement analysis and existing patterns",
        "c) They run faster",
        "d) They don't need human review"
      ],
      answer: "b",
      explanation: "Context is everything. Rich input produces better output."
    },
    prevModule: { path: "/grace-academy/module-13", label: "Requirement Analysis Agents" },
    nextModule: { path: "/grace-academy/module-15", label: "Execution Orchestration" },
    estimatedMinutes: 15
  },
  15: {
    moduleNumber: 15,
    title: "Execution Orchestration",
    subtitle: "Coordinating intelligent test execution",
    track: "intermediate",
    readerQuestion: {
      question: "We have thousands of tests but limited resources. How do we decide what to run and when?",
      signature: "Resource Constrained"
    },
    marilynResponse: [
      "Running all tests all the time is wasteful. Running no tests is reckless. The art is in selection.",
      "Execution Orchestration uses AI to prioritize: which tests are most likely to find bugs? Which cover the most risk? Which are fastest to provide feedback?",
      "Smart orchestration maximizes value per compute cycle."
    ],
    coreConceptTitle: "Orchestration Strategies",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Intelligent orchestration considers:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Risk-Based Selection</strong> — Prioritize tests for changed code</li>
          <li><strong>Historical Analysis</strong> — Run tests that often find bugs</li>
          <li><strong>Resource Optimization</strong> — Balance coverage with execution time</li>
          <li><strong>Feedback Speed</strong> — Fast tests first for quick developer feedback</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the goal of intelligent test orchestration?",
      options: [
        "a) Run all tests as fast as possible",
        "b) Maximize bug-finding probability per compute cycle",
        "c) Minimize the number of tests",
        "d) Eliminate flaky tests"
      ],
      answer: "b",
      explanation: "Orchestration optimizes for value: finding bugs efficiently."
    },
    prevModule: { path: "/grace-academy/module-14", label: "Test Generation Agents" },
    nextModule: { path: "/grace-academy/module-16", label: "Self-Healing Mechanisms" },
    estimatedMinutes: 15
  },
  16: {
    moduleNumber: 16,
    title: "Self-Healing Mechanisms",
    subtitle: "Tests that fix themselves",
    track: "intermediate",
    readerQuestion: {
      question: "Every sprint, we spend days fixing broken tests that failed just because a button moved. Can AI fix these automatically?",
      signature: "Maintenance Exhausted"
    },
    marilynResponse: [
      "Self-healing is the holy grail of test automation—and it's finally achievable.",
      "When a locator fails, AI can analyze the page, find the element that matches the original intent, and update the test automatically.",
      "But self-healing has limits. It fixes cosmetic changes, not logic changes. Human judgment is still required."
    ],
    coreConceptTitle: "Self-Healing Levels",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Self-healing operates at multiple levels:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Locator Healing</strong> — Finding elements when IDs change</li>
          <li><strong>Flow Healing</strong> — Adapting to new steps in a workflow</li>
          <li><strong>Data Healing</strong> — Adjusting to changed data formats</li>
          <li><strong>Assertion Healing</strong> — Updating expected values (with caution)</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What should self-healing NOT do automatically?",
      options: [
        "a) Fix broken locators",
        "b) Update expected values without human review",
        "c) Find alternative element paths",
        "d) Log healing actions"
      ],
      answer: "b",
      explanation: "Changing expected values could hide real bugs. Human review is essential."
    },
    prevModule: { path: "/grace-academy/module-15", label: "Execution Orchestration" },
    nextModule: { path: "/grace-academy/module-17", label: "Cognitive Feedback Loops" },
    estimatedMinutes: 15
  },
  17: {
    moduleNumber: 17,
    title: "Cognitive Feedback Loops",
    subtitle: "Systems that learn from experience",
    track: "intermediate",
    readerQuestion: {
      question: "Our AI testing tool makes the same mistakes over and over. How do we make it actually learn?",
      signature: "Groundhog Day"
    },
    marilynResponse: [
      "Learning requires feedback. If your AI doesn't know when it's wrong, it can't improve.",
      "Cognitive feedback loops connect outcomes back to decisions. When a generated test finds a bug, the system learns what made it effective. When it produces a false positive, it learns what to avoid.",
      "Over time, the system gets smarter—but only if the loop is closed."
    ],
    coreConceptTitle: "The Learning Loop",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Effective feedback loops include:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Outcome Tracking</strong> — Recording what happened after each decision</li>
          <li><strong>Attribution</strong> — Connecting outcomes to specific choices</li>
          <li><strong>Model Updates</strong> — Adjusting behavior based on feedback</li>
          <li><strong>Validation</strong> — Ensuring changes actually improve performance</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's essential for AI systems to learn from experience?",
      options: [
        "a) More training data",
        "b) Closed feedback loops connecting outcomes to decisions",
        "c) Faster processors",
        "d) More complex models"
      ],
      answer: "b",
      explanation: "Without feedback, AI can't distinguish good decisions from bad ones."
    },
    prevModule: { path: "/grace-academy/module-16", label: "Self-Healing Mechanisms" },
    nextModule: { path: "/grace-academy/module-18", label: "Integration Patterns" },
    estimatedMinutes: 15
  },
  18: {
    moduleNumber: 18,
    title: "Integration Patterns",
    subtitle: "Connecting AI testing to your ecosystem",
    track: "intermediate",
    readerQuestion: {
      question: "We have CI/CD, Jira, Slack, and a dozen other tools. How does AI testing fit into this mess?",
      signature: "Integration Nightmare"
    },
    marilynResponse: [
      "AI testing doesn't replace your toolchain—it enhances it. The key is integration, not isolation.",
      "GRACE systems connect to your existing tools: pulling requirements from Jira, triggering from CI/CD, reporting to Slack, updating dashboards.",
      "Good integration is invisible. It just works."
    ],
    coreConceptTitle: "Integration Points",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Common integration patterns:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Source Integration</strong> — Requirements from Jira, Confluence, etc.</li>
          <li><strong>Trigger Integration</strong> — CI/CD pipelines, webhooks, schedules</li>
          <li><strong>Output Integration</strong> — Reports to dashboards, alerts to Slack</li>
          <li><strong>Feedback Integration</strong> — Bug tracking, developer notifications</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the goal of AI testing integration?",
      options: [
        "a) Replace existing tools",
        "b) Enhance existing workflows without disruption",
        "c) Centralize all testing in one tool",
        "d) Eliminate manual processes"
      ],
      answer: "b",
      explanation: "Good integration enhances, not replaces, existing investments."
    },
    prevModule: { path: "/grace-academy/module-17", label: "Cognitive Feedback Loops" },
    nextModule: { path: "/grace-academy/module-19", label: "Performance Optimization" },
    estimatedMinutes: 15
  },
  19: {
    moduleNumber: 19,
    title: "Performance Optimization",
    subtitle: "Making AI testing fast and efficient",
    track: "intermediate",
    readerQuestion: {
      question: "Our AI testing is powerful but slow. It takes hours to analyze requirements and generate tests. How do we speed it up?",
      signature: "Patience Exhausted"
    },
    marilynResponse: [
      "AI is computationally expensive. But expense doesn't mean slow—it means you need to be smart about when and how you use it.",
      "Optimization strategies include caching, incremental processing, and tiered analysis. Not everything needs the full AI treatment.",
      "Fast enough is the goal, not fastest possible."
    ],
    coreConceptTitle: "Optimization Strategies",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Performance optimization approaches:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Caching</strong> — Reuse previous analysis for unchanged content</li>
          <li><strong>Incremental Processing</strong> — Only analyze what's changed</li>
          <li><strong>Tiered Analysis</strong> — Quick checks first, deep analysis when needed</li>
          <li><strong>Parallel Processing</strong> — Distribute work across resources</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the most effective way to speed up AI testing?",
      options: [
        "a) Use faster hardware",
        "b) Avoid redundant processing through caching and incremental analysis",
        "c) Simplify the AI models",
        "d) Run fewer tests"
      ],
      answer: "b",
      explanation: "Don't redo work. Cache results and only process changes."
    },
    prevModule: { path: "/grace-academy/module-18", label: "Integration Patterns" },
    nextModule: { path: "/grace-academy/module-20", label: "Intermediate Capstone" },
    estimatedMinutes: 15
  },
  20: {
    moduleNumber: 20,
    title: "Intermediate Capstone",
    subtitle: "Building your first AI testing system",
    track: "intermediate",
    readerQuestion: {
      question: "I understand the concepts. Now how do I actually build an AI testing system?",
      signature: "Ready to Implement"
    },
    marilynResponse: [
      "You've completed the Intermediate track. You understand AI agents, the GRACE architecture, and how the pieces fit together.",
      "In this capstone, you'll design a complete AI testing system for a realistic scenario, choosing components, defining integrations, and planning the implementation.",
      "This is where architecture becomes reality."
    ],
    coreConceptTitle: "System Design Checklist",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Your AI testing system needs:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Requirement Sources</strong> — Where does input come from?</li>
          <li><strong>Analysis Pipeline</strong> — How are requirements processed?</li>
          <li><strong>Generation Strategy</strong> — How are tests created?</li>
          <li><strong>Execution Engine</strong> — How are tests run?</li>
          <li><strong>Feedback Loop</strong> — How does the system learn?</li>
          <li><strong>Integration Points</strong> — How does it connect to your ecosystem?</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "You've completed the Intermediate track! What's the most important capability of AI testing systems?",
      options: [
        "a) Speed",
        "b) The ability to understand intent and adapt to change",
        "c) Cost reduction",
        "d) Eliminating human testers"
      ],
      answer: "b",
      explanation: "AI testing's value is in understanding and adaptation, not just automation."
    },
    prevModule: { path: "/grace-academy/module-19", label: "Performance Optimization" },
    nextModule: { path: "/grace-academy/advanced", label: "Enterprise Leadership Track" },
    estimatedMinutes: 15
  },
  // Advanced Track (Modules 21-30)
  21: {
    moduleNumber: 21,
    title: "Advanced AI Orchestration",
    subtitle: "Coordinating multiple AI agents",
    track: "advanced",
    guestLecturer: {
      name: "A Systems Architect",
      quote: "The whole is greater than the sum of its parts—but only if the parts work together."
    },
    readerQuestion: {
      question: "We have multiple AI tools that don't talk to each other. How do we make them work as a unified system?",
      signature: "Siloed and Struggling"
    },
    marilynResponse: [
      "Multiple AI agents without coordination is chaos. Each optimizes locally while the system suffers globally.",
      "Advanced orchestration treats agents as a team, not individuals. A central coordinator assigns tasks, manages dependencies, and resolves conflicts.",
      "The result is emergent intelligence: the system is smarter than any single agent."
    ],
    coreConceptTitle: "Multi-Agent Coordination",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Orchestration patterns:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Central Coordinator</strong> — One agent manages all others</li>
          <li><strong>Peer-to-Peer</strong> — Agents negotiate directly</li>
          <li><strong>Hierarchical</strong> — Agents organized in layers</li>
          <li><strong>Market-Based</strong> — Agents bid for tasks</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the main challenge in multi-agent AI systems?",
      options: [
        "a) Processing power",
        "b) Coordination and conflict resolution between agents",
        "c) Training data",
        "d) User interfaces"
      ],
      answer: "b",
      explanation: "Agents must work together, not against each other."
    },
    prevModule: { path: "/grace-academy/module-20", label: "Intermediate Capstone" },
    nextModule: { path: "/grace-academy/module-22", label: "Multi-Agent Collaboration" },
    estimatedMinutes: 15
  },
  22: {
    moduleNumber: 22,
    title: "Multi-Agent Collaboration",
    subtitle: "When AI agents work together",
    track: "advanced",
    readerQuestion: {
      question: "Can AI agents actually collaborate, or do they just run in sequence?",
      signature: "Collaboration Curious"
    },
    marilynResponse: [
      "True collaboration is more than sequential execution. It's agents sharing information, building on each other's work, and collectively solving problems.",
      "In GRACE, the Requirement Analyzer shares insights with the Test Generator. The Execution Engine feeds back to both. The Cognitive Core learns from all.",
      "This is collaborative intelligence."
    ],
    coreConceptTitle: "Collaboration Patterns",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Agents collaborate through:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Shared Memory</strong> — Common knowledge base all agents access</li>
          <li><strong>Message Passing</strong> — Agents communicate findings</li>
          <li><strong>Blackboard Systems</strong> — Agents post and read from shared space</li>
          <li><strong>Ensemble Methods</strong> — Multiple agents vote on decisions</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What distinguishes collaboration from sequential execution?",
      options: [
        "a) Speed",
        "b) Agents share information and build on each other's work",
        "c) More agents are involved",
        "d) Less human oversight"
      ],
      answer: "b",
      explanation: "Collaboration means agents enhance each other, not just follow each other."
    },
    prevModule: { path: "/grace-academy/module-21", label: "Advanced AI Orchestration" },
    nextModule: { path: "/grace-academy/module-23", label: "Autonomous Decision Making" },
    estimatedMinutes: 15
  },
  23: {
    moduleNumber: 23,
    title: "Autonomous Decision Making",
    subtitle: "When AI acts without human approval",
    track: "advanced",
    readerQuestion: {
      question: "How much autonomy should we give AI testing systems? I'm nervous about letting machines make decisions.",
      signature: "Control Conscious"
    },
    marilynResponse: [
      "Your nervousness is appropriate. Autonomy without accountability is dangerous.",
      "The key is graduated autonomy: AI makes low-risk decisions automatically, escalates high-risk ones to humans. Over time, as trust builds, the autonomy boundary can expand.",
      "Full autonomy is a destination, not a starting point."
    ],
    coreConceptTitle: "Autonomy Levels",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Graduated autonomy framework:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Level 0</strong> — AI suggests, human decides everything</li>
          <li><strong>Level 1</strong> — AI decides routine matters, human approves exceptions</li>
          <li><strong>Level 2</strong> — AI acts autonomously within defined boundaries</li>
          <li><strong>Level 3</strong> — AI expands its own boundaries based on performance</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the safest approach to AI autonomy?",
      options: [
        "a) Full autonomy from the start",
        "b) No autonomy ever",
        "c) Graduated autonomy based on risk and trust",
        "d) Random autonomy levels"
      ],
      answer: "c",
      explanation: "Start small, build trust, expand gradually."
    },
    prevModule: { path: "/grace-academy/module-22", label: "Multi-Agent Collaboration" },
    nextModule: { path: "/grace-academy/module-24", label: "Ethical AI in Testing" },
    estimatedMinutes: 15
  },
  24: {
    moduleNumber: 24,
    title: "Ethical AI in Testing",
    subtitle: "Responsible use of AI in quality engineering",
    track: "advanced",
    readerQuestion: {
      question: "Are there ethical concerns with AI testing that I should be aware of?",
      signature: "Ethics Minded"
    },
    marilynResponse: [
      "Every powerful technology raises ethical questions. AI testing is no exception.",
      "Concerns include bias in test generation, privacy in requirement analysis, accountability when AI makes mistakes, and the impact on testing jobs.",
      "Ethical AI isn't a constraint—it's a competitive advantage. Users trust systems that treat them fairly."
    ],
    coreConceptTitle: "Ethical Considerations",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Key ethical areas:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Bias</strong> — Does AI testing favor certain user groups?</li>
          <li><strong>Privacy</strong> — How is sensitive data in requirements handled?</li>
          <li><strong>Accountability</strong> — Who's responsible when AI makes mistakes?</li>
          <li><strong>Transparency</strong> — Can stakeholders understand AI decisions?</li>
          <li><strong>Employment</strong> — How does AI testing affect QE careers?</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "Why is ethical AI a competitive advantage?",
      options: [
        "a) It's required by law",
        "b) Users trust systems that treat them fairly",
        "c) It's cheaper",
        "d) It's faster"
      ],
      answer: "b",
      explanation: "Trust is valuable. Ethical AI builds trust."
    },
    prevModule: { path: "/grace-academy/module-23", label: "Autonomous Decision Making" },
    nextModule: { path: "/grace-academy/module-25", label: "Enterprise Scale Patterns" },
    estimatedMinutes: 15
  },
  25: {
    moduleNumber: 25,
    title: "Enterprise Scale Patterns",
    subtitle: "AI testing for large organizations",
    track: "advanced",
    readerQuestion: {
      question: "Our company has hundreds of applications and thousands of testers. How do we scale AI testing across the enterprise?",
      signature: "Enterprise Architect"
    },
    marilynResponse: [
      "Enterprise scale is a different beast. What works for one team doesn't necessarily work for a hundred teams.",
      "The key is standardization without strangulation. Provide common platforms and patterns, but allow teams to adapt to their specific needs.",
      "Think of it as a franchise model: consistent brand, local execution."
    ],
    coreConceptTitle: "Enterprise Patterns",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Scaling strategies:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Platform Approach</strong> — Central AI services, team-specific configurations</li>
          <li><strong>Federated Learning</strong> — Local models contribute to global intelligence</li>
          <li><strong>Center of Excellence</strong> — Expert team supports all others</li>
          <li><strong>Maturity Model</strong> — Teams progress through adoption stages</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the key to enterprise AI testing adoption?",
      options: [
        "a) Force all teams to use the same approach",
        "b) Let every team do whatever they want",
        "c) Standardization with flexibility for local adaptation",
        "d) Only deploy to the most advanced teams"
      ],
      answer: "c",
      explanation: "Balance consistency with team autonomy."
    },
    prevModule: { path: "/grace-academy/module-24", label: "Ethical AI in Testing" },
    nextModule: { path: "/grace-academy/module-26", label: "Security and Compliance" },
    estimatedMinutes: 15
  },
  26: {
    moduleNumber: 26,
    title: "Security and Compliance",
    subtitle: "Protecting AI testing systems",
    track: "advanced",
    readerQuestion: {
      question: "Our security team is concerned about AI testing. They worry about data leakage and compliance violations. How do we address this?",
      signature: "Security Conscious"
    },
    marilynResponse: [
      "Security concerns are legitimate. AI systems process sensitive data—requirements, test data, application behavior. This data must be protected.",
      "Compliance adds another layer: GDPR, HIPAA, SOC2 all have implications for AI testing. You need to know where data goes and how it's used.",
      "Security isn't a feature—it's a foundation."
    ],
    coreConceptTitle: "Security Framework",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Security considerations:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Data Classification</strong> — What data is sensitive?</li>
          <li><strong>Access Control</strong> — Who can see what?</li>
          <li><strong>Audit Logging</strong> — What happened and when?</li>
          <li><strong>Data Residency</strong> — Where is data stored and processed?</li>
          <li><strong>Model Security</strong> — Protecting AI models from attacks</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the first step in securing AI testing systems?",
      options: [
        "a) Buy security software",
        "b) Classify data by sensitivity",
        "c) Hire security experts",
        "d) Disable AI features"
      ],
      answer: "b",
      explanation: "You can't protect data if you don't know what's sensitive."
    },
    prevModule: { path: "/grace-academy/module-25", label: "Enterprise Scale Patterns" },
    nextModule: { path: "/grace-academy/module-27", label: "Future of Quality Engineering" },
    estimatedMinutes: 15
  },
  27: {
    moduleNumber: 27,
    title: "Future of Quality Engineering",
    subtitle: "Where AI testing is heading",
    track: "advanced",
    readerQuestion: {
      question: "What does the future hold for quality engineering? Will AI replace testers entirely?",
      signature: "Future Focused"
    },
    marilynResponse: [
      "AI will not replace testers. It will transform what testers do.",
      "The future QE professional is less a manual executor and more a strategic thinker: defining quality goals, designing AI systems, interpreting results, and making judgment calls AI cannot.",
      "The question isn't whether you'll work with AI—it's how well you'll work with it."
    ],
    coreConceptTitle: "Future Trends",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Emerging directions:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Continuous Testing</strong> — Testing embedded in every stage</li>
          <li><strong>Predictive Quality</strong> — Preventing defects before they occur</li>
          <li><strong>Autonomous Testing</strong> — AI systems that test themselves</li>
          <li><strong>Quality Intelligence</strong> — Data-driven quality decisions</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "How will AI change the QE profession?",
      options: [
        "a) Eliminate it entirely",
        "b) Transform it from execution to strategy",
        "c) Make it easier with no new skills needed",
        "d) Have no impact"
      ],
      answer: "b",
      explanation: "QE professionals will focus on strategy, design, and judgment—not manual execution."
    },
    prevModule: { path: "/grace-academy/module-26", label: "Security and Compliance" },
    nextModule: { path: "/grace-academy/module-28", label: "Leadership in AI-Driven QE" },
    estimatedMinutes: 15
  },
  28: {
    moduleNumber: 28,
    title: "Leadership in AI-Driven QE",
    subtitle: "Leading quality teams in the AI era",
    track: "advanced",
    readerQuestion: {
      question: "I'm a QE manager. How do I lead my team through this AI transformation?",
      signature: "Leader in Transition"
    },
    marilynResponse: [
      "Leadership in transformation is about people, not technology. Your team is scared, excited, confused—probably all three.",
      "Your job is to provide vision, remove obstacles, and build capabilities. Show them the destination, clear the path, and give them the skills to walk it.",
      "Technology changes. Leadership principles don't."
    ],
    coreConceptTitle: "Leadership Framework",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Leading AI transformation:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Vision</strong> — Where are we going and why?</li>
          <li><strong>Communication</strong> — Keeping everyone informed and aligned</li>
          <li><strong>Capability Building</strong> — Training and upskilling the team</li>
          <li><strong>Change Management</strong> — Helping people adapt</li>
          <li><strong>Measurement</strong> — Tracking progress and demonstrating value</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the most important leadership skill during AI transformation?",
      options: [
        "a) Technical expertise",
        "b) Communication and change management",
        "c) Budget management",
        "d) Vendor negotiation"
      ],
      answer: "b",
      explanation: "Transformation is about people. Communication and change management are essential."
    },
    prevModule: { path: "/grace-academy/module-27", label: "Future of Quality Engineering" },
    nextModule: { path: "/grace-academy/module-29", label: "Building QE Centers of Excellence" },
    estimatedMinutes: 15
  },
  29: {
    moduleNumber: 29,
    title: "Building QE Centers of Excellence",
    subtitle: "Creating organizational capability",
    track: "advanced",
    readerQuestion: {
      question: "How do we institutionalize AI testing knowledge so it doesn't depend on a few experts?",
      signature: "Institution Builder"
    },
    marilynResponse: [
      "Knowledge in heads is fragile. Knowledge in systems is durable.",
      "A Center of Excellence captures expertise in processes, tools, and training. It serves as a hub that supports all teams while continuously improving practices.",
      "The goal is to make excellence the default, not the exception."
    ],
    coreConceptTitle: "CoE Components",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">Building a QE Center of Excellence:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Knowledge Base</strong> — Documented practices and patterns</li>
          <li><strong>Training Program</strong> — Structured learning paths</li>
          <li><strong>Tool Platform</strong> — Shared infrastructure and services</li>
          <li><strong>Community</strong> — Forums for sharing and learning</li>
          <li><strong>Governance</strong> — Standards and quality gates</li>
        </ul>
      </div>
    ),
    quizQuestion: {
      question: "What's the primary purpose of a QE Center of Excellence?",
      options: [
        "a) Centralize all testing",
        "b) Institutionalize expertise so it's not dependent on individuals",
        "c) Reduce headcount",
        "d) Enforce compliance"
      ],
      answer: "b",
      explanation: "CoEs make expertise organizational, not personal."
    },
    prevModule: { path: "/grace-academy/module-28", label: "Leadership in AI-Driven QE" },
    nextModule: { path: "/grace-academy/module-30", label: "GRACE Mastery Capstone" },
    estimatedMinutes: 15
  },
  30: {
    moduleNumber: 30,
    title: "GRACE Mastery Capstone",
    subtitle: "Your journey to mastery is complete",
    track: "advanced",
    guestLecturer: {
      name: "Admiral Grace Hopper (in spirit)",
      quote: "The most dangerous phrase in the language is 'We've always done it this way.'"
    },
    readerQuestion: {
      question: "I've completed all 30 modules. What now?",
      signature: "GRACE Graduate"
    },
    marilynResponse: [
      "Congratulations. You have completed the GRACE Academy curriculum.",
      "But completion is not mastery. Mastery comes from application. Take what you've learned and build something. Fail. Learn. Iterate.",
      "The certificate you'll receive is not proof of knowledge—it's a commitment to continuous improvement. Honor that commitment."
    ],
    coreConceptTitle: "Your GRACE Journey",
    coreConceptContent: (
      <div className="space-y-4">
        <p className="text-muted-foreground">You've learned:</p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Foundation</strong> — Action-Based Testing principles</li>
          <li><strong>Intermediate</strong> — AI agents and the GRACE architecture</li>
          <li><strong>Advanced</strong> — Enterprise patterns and leadership</li>
        </ul>
        <p className="text-muted-foreground mt-4">Now go build the future of quality engineering.</p>
      </div>
    ),
    quizQuestion: {
      question: "What's the most important thing you've learned?",
      options: [
        "a) Specific tools and technologies",
        "b) The principles behind effective AI-powered testing",
        "c) How to pass certification exams",
        "d) How to avoid testing altogether"
      ],
      answer: "b",
      explanation: "Tools change. Principles endure. You've learned principles."
    },
    prevModule: { path: "/grace-academy/module-29", label: "Building QE Centers of Excellence" },
    nextModule: { path: "/grace-academy", label: "Return to GRACE Academy" },
    estimatedMinutes: 15
  }
};

interface GraceModulePageProps {
  moduleNumber: number;
}

export default function GraceModulePage({ moduleNumber }: GraceModulePageProps) {
  const content = graceModules[moduleNumber];
  const moduleImgs = getModuleImages(moduleNumber);
  
  if (!content) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Module Not Found</h1>
          <p className="text-muted-foreground mt-2">Module {moduleNumber} content is coming soon.</p>
        </div>
      </Layout>
    );
  }

  const trackLabel = content.track === "foundation" ? "ABT Foundations" : 
                     content.track === "intermediate" ? "AI Agent Mastery" : "Enterprise Leadership";

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">
              {trackLabel} • Module {content.moduleNumber}
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">
              {content.title}
            </h1>
            <p className="text-muted-foreground mt-1">{content.subtitle}</p>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={content.moduleNumber} 
              totalModules={TOTAL_GRACE_MODULES} 
              estimatedMinutes={content.estimatedMinutes || 15} 
            />
          </div>
        </div>

        {/* Primary Editorial Illustration */}
        {moduleImgs && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border bg-muted">
            <img 
              src={moduleImgs.primary} 
              alt={`Module ${moduleNumber} illustration`} 
              className="object-cover w-full h-full"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.img-fallback') as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="img-fallback absolute inset-0 items-center justify-center bg-muted text-muted-foreground" style={{ display: 'none' }}>
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Module {moduleNumber} — {content.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Guest Lecturer */}
        {content.guestLecturer && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-primary">Guest Lecturer: {content.guestLecturer.name}</p>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    "{content.guestLecturer.quote}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reader Question */}
        <div className="bg-muted/50 p-6 rounded-xl border-l-4 border-primary">
          <p className="font-serif italic text-lg">"Dear Marilyn,</p>
          <p className="font-serif italic text-lg mt-2">{content.readerQuestion.question}</p>
          <p className="font-serif italic text-lg mt-2">— {content.readerQuestion.signature}"</p>
        </div>

        {/* Marilyn's Response */}
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-2xl font-bold text-primary">Marilyn Responds:</h2>
          {content.marilynResponse.map((paragraph, index) => (
            <p key={index} className="font-sans leading-relaxed">
              {index === 0 && <span className="drop-cap">{paragraph.charAt(0)}</span>}
              {index === 0 ? paragraph.slice(1) : paragraph}
            </p>
          ))}
        </div>

        {/* Core Concept */}
        <div className="bg-secondary/30 p-8 rounded-xl border border-border space-y-6">
          <h2 className="text-2xl font-serif font-bold text-primary flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            {content.coreConceptTitle}
          </h2>
          {content.coreConceptContent}
        </div>

        {/* Challenge */}
        {content.challenge && (
          <div className="bg-amber-500/10 p-6 rounded-xl border border-amber-500/30">
            <h3 className="font-serif font-bold text-lg mb-3 text-amber-600">The Challenge:</h3>
            <p className="text-muted-foreground">{content.challenge}</p>
          </div>
        )}

        {/* Quiz */}
        {content.quizQuestion && (
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <h3 className="font-serif font-bold text-lg mb-4">Quick Check: Module {content.moduleNumber}</h3>
              <p className="text-muted-foreground mb-4">
                <strong>Question:</strong> {content.quizQuestion.question}
              </p>
              <div className="space-y-2 text-sm">
                {content.quizQuestion.options.map((option, index) => (
                  <p key={index}>{option}</p>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                (Answer: {content.quizQuestion.answer} — {content.quizQuestion.explanation})
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-border">
          <Link href={content.prevModule.path}>
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> {content.prevModule.label}
            </Button>
          </Link>
          <Link href={content.nextModule.path}>
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: {content.nextModule.label} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
