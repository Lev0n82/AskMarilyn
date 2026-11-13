import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright Configuration — ABT-Structured E2E Testing
 *
 * Following Action-Based Testing principles:
 *   - Reusable test actions (login, navigate) in e2e/actions/
 *   - Test modules organized by feature area in e2e/tests/
 *   - Multi-resolution coverage: 4 PC + 4 mobile viewports
 *   - Test data uses @levon.ca domain with dev-only auth bypass
 *
 * Resolution coverage:
 *   PC:     1920x1080, 1366x768, 1536x864, 1280x720
 *   Mobile: iPhone 14 (390x844), iPhone SE (375x667), Pixel 7 (412x915), Galaxy S23 (360x780)
 *
 * All projects use Chromium engine for consistency in CI environments.
 */
export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "e2e/reports" }],
    ["list"],
  ],
  outputDir: "e2e/results",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    // ─── PC Resolutions (4 most common) ───
    {
      name: "pc-1920x1080",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "pc-1366x768",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "pc-1536x864",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1536, height: 864 },
      },
    },
    {
      name: "pc-1280x720",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },

    // ─── Mobile Resolutions (Chromium with mobile emulation) ───
    {
      name: "mobile-iphone14",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
      },
    },
    {
      name: "mobile-iphoneSE",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
      },
    },
    {
      name: "mobile-pixel7",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 412, height: 915 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      },
    },
    {
      name: "mobile-galaxyS23",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 780 },
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; SM-S911B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      },
    },
  ],
});
