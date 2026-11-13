import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "evidence*.spec.ts",
  timeout: 180000,
  workers: 1,
  use: {
    baseURL: process.env.EVIDENCE_TEST_URL ?? "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 900 },
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/evidence-browser.json" }],
  ],
});
