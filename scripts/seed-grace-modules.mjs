import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const MODULES = [
  // Foundation Track (1-10)
  { moduleNumber: 1, track: 'foundation', title: 'The Ghost in the Machine', subtitle: 'Understanding Autonomous Testing Philosophy' },
  { moduleNumber: 2, track: 'foundation', title: 'A Compiler for Quality', subtitle: 'The Five-Layer Architecture' },
  { moduleNumber: 3, track: 'foundation', title: 'The Rosetta Stone', subtitle: 'Natural Language Processing for Test Generation' },
  { moduleNumber: 4, track: 'foundation', title: 'The Cartographer', subtitle: 'Application Discovery and Mapping' },
  { moduleNumber: 5, track: 'foundation', title: 'The Playwright', subtitle: 'Test Script Generation and Orchestration' },
  { moduleNumber: 6, track: 'foundation', title: 'The Oracle Problem', subtitle: 'Automated Verification and Assertion' },
  { moduleNumber: 7, track: 'foundation', title: 'The Time Machine', subtitle: 'Regression Testing and Historical Analysis' },
  { moduleNumber: 8, track: 'foundation', title: 'The Feedback Loop', subtitle: 'Continuous Learning and Adaptation' },
  { moduleNumber: 9, track: 'foundation', title: 'The Dashboard', subtitle: 'Metrics, Reporting, and Visualization' },
  { moduleNumber: 10, track: 'foundation', title: 'The Foundation Exam', subtitle: 'Comprehensive Assessment' },
  
  // Intermediate Track (11-20)
  { moduleNumber: 11, track: 'intermediate', title: 'The Hive Mind', subtitle: 'Distributed Test Execution' },
  { moduleNumber: 12, track: 'intermediate', title: 'The Arena', subtitle: 'AI Model Competition and Selection' },
  { moduleNumber: 13, track: 'intermediate', title: 'The Chaos Monkey', subtitle: 'Chaos Engineering and Resilience Testing' },
  { moduleNumber: 14, track: 'intermediate', title: 'The Sentinel', subtitle: 'Security Testing and Vulnerability Detection' },
  { moduleNumber: 15, track: 'intermediate', title: 'The Speedometer', subtitle: 'Performance Testing and Optimization' },
  { moduleNumber: 16, track: 'intermediate', title: 'The Polyglot', subtitle: 'Cross-Platform and Multi-Language Testing' },
  { moduleNumber: 17, track: 'intermediate', title: 'The Diplomat', subtitle: 'API Testing and Integration' },
  { moduleNumber: 18, track: 'intermediate', title: 'The Archaeologist', subtitle: 'Legacy System Testing' },
  { moduleNumber: 19, track: 'intermediate', title: 'The Simulator', subtitle: 'Mock Services and Test Doubles' },
  { moduleNumber: 20, track: 'intermediate', title: 'The Intermediate Exam', subtitle: 'Comprehensive Assessment' },
  
  // Advanced Track (21-30)
  { moduleNumber: 21, track: 'advanced', title: 'The Semantic Kernel', subtitle: 'Deep Learning for Test Intelligence' },
  { moduleNumber: 22, track: 'advanced', title: 'The Prompt Engineer', subtitle: 'Advanced LLM Integration' },
  { moduleNumber: 23, track: 'advanced', title: 'The Ethicist', subtitle: 'AI Ethics and Responsible Testing' },
  { moduleNumber: 24, track: 'advanced', title: 'The Compliance Officer', subtitle: 'Regulatory and Standards Testing' },
  { moduleNumber: 25, track: 'advanced', title: 'The Architect', subtitle: 'Designing Scalable Test Frameworks' },
  { moduleNumber: 26, track: 'advanced', title: 'The DevOps Engineer', subtitle: 'CI/CD Integration and Automation' },
  { moduleNumber: 27, track: 'advanced', title: 'The Data Scientist', subtitle: 'Test Analytics and Predictive Modeling' },
  { moduleNumber: 28, track: 'advanced', title: 'The Futurist', subtitle: 'Emerging Technologies and Trends' },
  { moduleNumber: 29, track: 'advanced', title: 'The Mentor', subtitle: 'Teaching and Knowledge Transfer' },
  { moduleNumber: 30, track: 'advanced', title: 'The GRACE Diploma', subtitle: 'Final Comprehensive Assessment' },
];

// Sample quiz questions for Module 1
const MODULE_1_QUESTIONS = [
  {
    moduleId: 1,
    questionNumber: 1,
    question: 'What is the primary difference between traditional test automation and the GRACE approach?',
    options: JSON.stringify([
      'GRACE uses a different programming language',
      'GRACE automates the intent of a test, not just the mechanics',
      'GRACE eliminates the need for any human involvement',
      'GRACE only works for web applications'
    ]),
    correctAnswer: 1,
    explanation: 'The core philosophy of GRACE is to express what to test, and let the AI determine how.'
  },
  {
    moduleId: 1,
    questionNumber: 2,
    question: 'What does GRACE stand for?',
    options: JSON.stringify([
      'General Rapid Automated Code Execution',
      'Generative Requirement Aware Cognitive Engineering',
      'Guided Response Automated Compliance Engine',
      'Generic Regression And Continuous Evaluation'
    ]),
    correctAnswer: 1,
    explanation: 'GRACE stands for Generative Requirement Aware Cognitive Engineering.'
  },
  {
    moduleId: 1,
    questionNumber: 3,
    question: 'Why do traditional automated tests break frequently?',
    options: JSON.stringify([
      'Because testers write poor code',
      'Because they automate mechanics (element IDs, clicks) that change with every sprint',
      'Because the testing framework is outdated',
      'Because the application has too many features'
    ]),
    correctAnswer: 1,
    explanation: 'Traditional tests are brittle because they depend on implementation details that change frequently.'
  },
  {
    moduleId: 1,
    questionNumber: 4,
    question: 'Who was GRACE named after?',
    options: JSON.stringify([
      'Grace Kelly, the actress',
      'Grace Hopper, the computer science pioneer',
      'Grace Murray, a fictional character',
      'The concept of graceful degradation'
    ]),
    correctAnswer: 1,
    explanation: 'GRACE is named after Admiral Grace Hopper, who gave machines the gift of understanding human language.'
  },
  {
    moduleId: 1,
    questionNumber: 5,
    question: 'What is the central tension explored in the GRACE methodology?',
    options: JSON.stringify([
      'Speed vs. accuracy in test execution',
      'How to trust an AI to test software while ensuring transparency and auditability',
      'Manual testing vs. automated testing',
      'Open source vs. proprietary tools'
    ]),
    correctAnswer: 1,
    explanation: 'The challenge is building AI systems that are transparent, auditable, and self-correcting.'
  }
];

// Sample Crucible challenge for Module 1
const MODULE_1_CRUCIBLE = {
  moduleId: 1,
  challengePrompt: `**The Crucible Challenge: Intent vs. Mechanics**

You are a QA lead at a company that has been using traditional Selenium-based test automation. Your test suite has 500 tests, and after every sprint, approximately 30% of them break due to UI changes.

Your task: Write a brief proposal (150-300 words) explaining to your CTO how adopting an intent-based testing approach could solve this problem. Include:

1. A specific example of a brittle test and how it would be rewritten as an intent-based test
2. The expected reduction in maintenance effort
3. One potential risk or challenge of the new approach

Remember: The goal is not to eliminate all testing effort, but to shift it from maintenance to meaningful quality assurance.`,
  evaluationCriteria: 'Clear understanding of intent vs. mechanics distinction, practical example, realistic assessment of benefits and risks.',
  sampleResponse: 'A strong response would include a concrete before/after example, quantify expected improvements, and acknowledge that AI-based testing requires initial investment in training and prompt engineering.'
};

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding GRACE Academy modules...');
  
  // Insert modules
  for (const module of MODULES) {
    try {
      await connection.execute(
        `INSERT INTO grace_modules (moduleNumber, track, title, subtitle, estimatedMinutes) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle)`,
        [module.moduleNumber, module.track, module.title, module.subtitle, 15]
      );
      console.log(`  ✓ Module ${module.moduleNumber}: ${module.title}`);
    } catch (error) {
      console.error(`  ✗ Module ${module.moduleNumber}: ${error.message}`);
    }
  }
  
  console.log('\\nSeeding Module 1 quiz questions...');
  
  // Insert quiz questions for Module 1
  for (const q of MODULE_1_QUESTIONS) {
    try {
      await connection.execute(
        `INSERT INTO grace_quiz_questions (moduleId, questionNumber, question, options, correctAnswer, explanation)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE question = VALUES(question), options = VALUES(options)`,
        [q.moduleId, q.questionNumber, q.question, q.options, q.correctAnswer, q.explanation]
      );
      console.log(`  ✓ Question ${q.questionNumber}`);
    } catch (error) {
      console.error(`  ✗ Question ${q.questionNumber}: ${error.message}`);
    }
  }
  
  console.log('\\nSeeding Module 1 Crucible challenge...');
  
  // Insert Crucible challenge for Module 1
  try {
    await connection.execute(
      `INSERT INTO grace_crucible_challenges (moduleId, challengePrompt, evaluationCriteria, sampleResponse)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE challengePrompt = VALUES(challengePrompt)`,
      [MODULE_1_CRUCIBLE.moduleId, MODULE_1_CRUCIBLE.challengePrompt, MODULE_1_CRUCIBLE.evaluationCriteria, MODULE_1_CRUCIBLE.sampleResponse]
    );
    console.log('  ✓ Crucible challenge added');
  } catch (error) {
    console.error(`  ✗ Crucible challenge: ${error.message}`);
  }
  
  await connection.end();
  console.log('\\n✅ Seeding complete!');
}

seed().catch(console.error);
