// Course topic definitions for breaking down courses into separate navigable pages
// Each topic becomes a separate page with its own quiz

export interface CourseTopic {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  duration: string;
  type: "intro" | "topic" | "quiz" | "capstone";
}

export interface CourseTopicDefinition {
  courseId: string;
  courseName: string;
  topics: CourseTopic[];
}

// Coding Style Guide Topics
export const codingStyleTopics: CourseTopic[] = [
  {
    id: "coding-intro",
    title: "Introduction",
    subtitle: "Why coding style matters",
    path: "/coding-style-guide",
    duration: "~3 min",
    type: "intro",
  },
  {
    id: "file-organization",
    title: "File Organization",
    subtitle: "The sacred order of file contents",
    path: "/coding-style-guide/file-organization",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "indentation",
    title: "Indentation",
    subtitle: "Tabs vs spaces and consistency",
    path: "/coding-style-guide/indentation",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "naming-conventions",
    title: "Naming Conventions",
    subtitle: "The art of naming things",
    path: "/coding-style-guide/naming-conventions",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "statements",
    title: "Statements & Braces",
    subtitle: "Proper statement formatting",
    path: "/coding-style-guide/statements",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "white-space",
    title: "White Space",
    subtitle: "The invisible architecture",
    path: "/coding-style-guide/white-space",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "coding-quiz",
    title: "Style Assessment",
    subtitle: "Test your knowledge",
    path: "/coding-style-guide/quiz",
    duration: "~5 min",
    type: "quiz",
  },
];

// Art of Commenting Topics
export const commentingTopics: CourseTopic[] = [
  {
    id: "commenting-intro",
    title: "Introduction",
    subtitle: "The paradox of comments",
    path: "/commenting-guide",
    duration: "~3 min",
    type: "intro",
  },
  {
    id: "case-against",
    title: "The Case Against Comments",
    subtitle: "When comments are code smell",
    path: "/commenting-guide/case-against",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "comment-types",
    title: "Types of Comments",
    subtitle: "Understanding comment categories",
    path: "/commenting-guide/comment-types",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "style-guidelines",
    title: "Style Guidelines",
    subtitle: "How to write effective comments",
    path: "/commenting-guide/style-guidelines",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "xml-comments",
    title: "XML Documentation",
    subtitle: "Structured documentation comments",
    path: "/commenting-guide/xml-comments",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "commenting-quiz",
    title: "Commenting Assessment",
    subtitle: "Test your knowledge",
    path: "/commenting-guide/quiz",
    duration: "~5 min",
    type: "quiz",
  },
];

// Technical Writing Topics
export const technicalWritingTopics: CourseTopic[] = [
  {
    id: "writing-intro",
    title: "Introduction",
    subtitle: "The art of technical communication",
    path: "/technical-writing-guide",
    duration: "~3 min",
    type: "intro",
  },
  {
    id: "three-pillars",
    title: "The Three Pillars",
    subtitle: "Foundation of technical writing",
    path: "/technical-writing-guide/three-pillars",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "readability",
    title: "Readability",
    subtitle: "Making text easy to read",
    path: "/technical-writing-guide/readability",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "comprehensibility",
    title: "Comprehensibility",
    subtitle: "Making content understandable",
    path: "/technical-writing-guide/comprehensibility",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "style",
    title: "Writing Style",
    subtitle: "Professional tone and voice",
    path: "/technical-writing-guide/style",
    duration: "~8 min",
    type: "topic",
  },
  {
    id: "structure",
    title: "Document Structure",
    subtitle: "Organizing technical content",
    path: "/technical-writing-guide/structure",
    duration: "~5 min",
    type: "topic",
  },
  {
    id: "reading",
    title: "Recommended Reading",
    subtitle: "Further resources",
    path: "/technical-writing-guide/reading",
    duration: "~3 min",
    type: "topic",
  },
  {
    id: "writing-quiz",
    title: "Writing Assessment",
    subtitle: "Test your knowledge",
    path: "/technical-writing-guide/quiz",
    duration: "~5 min",
    type: "quiz",
  },
];

// Action Based Testing Topics (existing modules are already separate)
export const abtTopics: CourseTopic[] = [
  {
    id: "abt-intro",
    title: "Introduction",
    subtitle: "A logical approach to testing",
    path: "/",
    duration: "~5 min",
    type: "intro",
  },
  {
    id: "testing-paradox",
    title: "The Testing Paradox",
    subtitle: "Why more tests don't mean better quality",
    path: "/module-1",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "three-layers",
    title: "The Three Layers",
    subtitle: "Business, Technical, and Execution",
    path: "/module-2",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "anti-patterns",
    title: "Anti-Patterns",
    subtitle: "Common testing mistakes",
    path: "/module-3",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "architecture",
    title: "Architecture",
    subtitle: "Structuring your test framework",
    path: "/module-4",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "language-of-logic",
    title: "Language of Logic",
    subtitle: "The vocabulary of testing",
    path: "/module-5",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "test-lifecycle",
    title: "Test Life-Cycle",
    subtitle: "From creation to retirement",
    path: "/module-6",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "building-modules",
    title: "Building Test Modules",
    subtitle: "Hands-on construction",
    path: "/module-7",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "advanced-techniques",
    title: "Advanced Techniques",
    subtitle: "Variations, regex, and graphics",
    path: "/module-8",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "anti-pattern-gallery",
    title: "Anti-Pattern Gallery",
    subtitle: "The complete collection",
    path: "/module-9",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "test-design-template",
    title: "Test Design Template",
    subtitle: "The complete taxonomy",
    path: "/module-10",
    duration: "~10 min",
    type: "topic",
  },
  {
    id: "refactoring-game",
    title: "Refactoring Game",
    subtitle: "Practice your skills",
    path: "/refactoring-challenge",
    duration: "~10 min",
    type: "quiz",
  },
  {
    id: "boss-level",
    title: "The Architect's Challenge",
    subtitle: "Ultimate test design challenge",
    path: "/boss-level",
    duration: "~15 min",
    type: "quiz",
  },
  {
    id: "final-assessment",
    title: "Final Assessment",
    subtitle: "Comprehensive exam",
    path: "/quiz",
    duration: "~15 min",
    type: "quiz",
  },
  {
    id: "test-builder",
    title: "Test Builder",
    subtitle: "Interactive test creation",
    path: "/test-builder",
    duration: "~10 min",
    type: "quiz",
  },
];

// All course definitions
export const allCourseTopics: CourseTopicDefinition[] = [
  {
    courseId: "action-based-testing",
    courseName: "Action Based Testing",
    topics: abtTopics,
  },
  {
    courseId: "coding-style",
    courseName: "Coding Style Guide",
    topics: codingStyleTopics,
  },
  {
    courseId: "commenting",
    courseName: "Art of Commenting",
    topics: commentingTopics,
  },
  {
    courseId: "technical-writing",
    courseName: "Technical Writing",
    topics: technicalWritingTopics,
  },
];
