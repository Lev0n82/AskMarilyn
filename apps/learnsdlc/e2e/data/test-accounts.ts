/**
 * Test Account Data — ABT Test Data Module
 *
 * Following ABT principles: test data is separated from test logic,
 * centralized, and reusable across all test modules.
 *
 * DEV environment: Uses @levon.ca domain with auth bypass
 * PROD environment: Uses ProdTestUser@levon.ca with manually activated accounts
 */

export interface TestAccount {
  email: string;
  name: string;
  role: "user" | "admin";
}

// ─── Development Test Accounts (auto-bypass via /api/test-auth/login) ───
export const DEV_ACCOUNTS = {
  user1: {
    email: "LearnsdlcTestUser1@levon.ca",
    name: "Test User 1",
    role: "user" as const,
  },
  user2: {
    email: "LearnsdlcTestUser2@levon.ca",
    name: "Test User 2",
    role: "user" as const,
  },
  user3: {
    email: "LearnsdlcTestUser3@levon.ca",
    name: "Test User 3",
    role: "user" as const,
  },
  admin1: {
    email: "LearnsdlcTestAdmin1@levon.ca",
    name: "Test Admin 1",
    role: "admin" as const,
  },
};

// ─── Production Test Accounts (require manual activation) ───
export const PROD_ACCOUNTS = {
  user1: {
    email: "ProdTestUser1@levon.ca",
    name: "Prod Test User 1",
    role: "user" as const,
  },
  admin1: {
    email: "ProdTestAdmin1@levon.ca",
    name: "Prod Test Admin 1",
    role: "admin" as const,
  },
};

// ─── Resolution Definitions ───
export const PC_RESOLUTIONS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1536x864", width: 1536, height: 864 },
  { name: "1280x720", width: 1280, height: 720 },
] as const;

export const MOBILE_RESOLUTIONS = [
  { name: "iPhone 14", width: 390, height: 844 },
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "Pixel 7", width: 412, height: 915 },
  { name: "Galaxy S23", width: 360, height: 780 },
] as const;

// ─── Route Inventory ───
export const ROUTES = {
  home: "/",
  allCourses: "/all-courses",
  abtIntro: "/abt-intro",
  abtModules: Array.from({ length: 10 }, (_, i) => `/module-${i + 1}`),
  quiz: "/quiz",
  leaderboard: "/leaderboard",
  testBuilder: "/test-builder",
  certificate: "/certificate",
  badges: "/badges",
  forum: "/forum",
  profile: "/profile",
  codingStyleGuide: "/coding-style-guide",
  commentingGuide: "/commenting-guide",
  technicalWritingGuide: "/technical-writing-guide",
  learningProgress: "/learning-progress",
  courseCertificate: "/course-certificate",
  graceAcademy: "/grace-academy",
  graceModules: Array.from({ length: 30 }, (_, i) => `/grace-academy/module-${i + 1}`),
  cmakeMastery: "/cmake-mastery",
  stf: "/stf",
  stfModules: Array.from({ length: 15 }, (_, i) => `/stf/module/${i + 1}`),
  accessibility: "/accessibility",
  systemsArchitect: "/systems-architect",
  dba: "/database-administrator",
  dataScientist: "/data-scientist",
  healthcareArchitect: "/healthcare-architect",
} as const;
