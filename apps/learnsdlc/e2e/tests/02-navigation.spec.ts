/**
 * Test Module 02: Course Navigation & Content Loading
 *
 * ABT Structure:
 *   - Tests all major route categories load without errors
 *   - Validates content rendering at multiple resolutions
 *   - Uses reusable navigation actions
 *   - Covers: All Courses, ABT, STF, CMake, GRACE, Professional courses
 */

import { test, expect } from "@playwright/test";
import { DEV_ACCOUNTS } from "../data/test-accounts";
import { loginAsTestUser } from "../actions/auth.actions";
import {
  navigateTo,
  verifyPageLoaded,
  verifyNoHorizontalOverflow,
} from "../actions/navigation.actions";

test.describe("Course Navigation & Content", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, DEV_ACCOUNTS.user1);
  });

  test.describe("Landing & Catalog Pages", () => {
    test("All Courses page loads", async ({ page }) => {
      await navigateTo(page, "/all-courses");
      await verifyPageLoaded(page);
      await verifyNoHorizontalOverflow(page);
    });

    test("Home/All Courses at root loads", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
    });

    test("ABT Intro page loads", async ({ page }) => {
      await navigateTo(page, "/abt-intro");
      await verifyPageLoaded(page);
    });
  });

  test.describe("ABT Course Modules (1-10)", () => {
    const modules = Array.from({ length: 10 }, (_, i) => i + 1);

    for (const num of modules) {
      test(`ABT Module ${num} loads`, async ({ page }) => {
        await navigateTo(page, `/module-${num}`);
        await verifyPageLoaded(page);
        await verifyNoHorizontalOverflow(page);
      });
    }
  });

  test.describe("STF Course", () => {
    test("STF index page loads", async ({ page }) => {
      await navigateTo(page, "/stf");
      await verifyPageLoaded(page);
    });

    test("STF dashboard loads", async ({ page }) => {
      await navigateTo(page, "/stf/dashboard");
      await verifyPageLoaded(page);
    });

    const stfModules = [1, 2, 3, 5, 8, 10, 12, 15];
    for (const num of stfModules) {
      test(`STF Module ${num} loads with content`, async ({ page }) => {
        await navigateTo(page, `/stf/module/${num}`);
        await verifyPageLoaded(page);
        await verifyNoHorizontalOverflow(page);

        // Verify module has content sections
        await page.waitForTimeout(1000);
        const body = await page.textContent("body");
        expect(body!.length).toBeGreaterThan(100);
      });
    }
  });

  test.describe("CMake Mastery Course", () => {
    test("CMake index page loads", async ({ page }) => {
      await navigateTo(page, "/cmake-mastery");
      await verifyPageLoaded(page);
    });

    test("CMake dashboard loads", async ({ page }) => {
      await navigateTo(page, "/cmake-mastery/dashboard");
      await verifyPageLoaded(page);
    });

    test("CMake Module 1 loads", async ({ page }) => {
      await navigateTo(page, "/cmake-mastery/module/1");
      await verifyPageLoaded(page);
    });
  });

  test.describe("GRACE Academy", () => {
    test("GRACE index page loads", async ({ page }) => {
      await navigateTo(page, "/grace-academy");
      await verifyPageLoaded(page);
    });

    test("GRACE Module 1 loads", async ({ page }) => {
      await navigateTo(page, "/grace-academy/module-1");
      await verifyPageLoaded(page);
    });

    test("GRACE Module 10 loads", async ({ page }) => {
      await navigateTo(page, "/grace-academy/module-10");
      await verifyPageLoaded(page);
    });

    test("GRACE Intermediate intro loads", async ({ page }) => {
      await navigateTo(page, "/grace-academy/intermediate");
      await verifyPageLoaded(page);
    });

    test("GRACE Advanced intro loads", async ({ page }) => {
      await navigateTo(page, "/grace-academy/advanced");
      await verifyPageLoaded(page);
    });
  });

  test.describe("Professional Courses", () => {
    test("Systems Architect loads", async ({ page }) => {
      await navigateTo(page, "/systems-architect");
      await verifyPageLoaded(page);
    });

    test("Database Administrator loads", async ({ page }) => {
      await navigateTo(page, "/database-administrator");
      await verifyPageLoaded(page);
    });

    test("Data Scientist loads", async ({ page }) => {
      await navigateTo(page, "/data-scientist");
      await verifyPageLoaded(page);
    });

    test("Healthcare Architect loads", async ({ page }) => {
      await navigateTo(page, "/healthcare-architect");
      await verifyPageLoaded(page);
    });
  });

  test.describe("Supplementary Pages", () => {
    test("Coding Style Guide loads", async ({ page }) => {
      await navigateTo(page, "/coding-style-guide");
      await verifyPageLoaded(page);
    });

    test("Commenting Guide loads", async ({ page }) => {
      await navigateTo(page, "/commenting-guide");
      await verifyPageLoaded(page);
    });

    test("Technical Writing Guide loads", async ({ page }) => {
      await navigateTo(page, "/technical-writing-guide");
      await verifyPageLoaded(page);
    });

    test("Learning Progress loads", async ({ page }) => {
      await navigateTo(page, "/learning-progress");
      await verifyPageLoaded(page);
    });

    test("Accessibility page loads", async ({ page }) => {
      await navigateTo(page, "/accessibility");
      await verifyPageLoaded(page);
    });
  });

  test.describe("Error Handling", () => {
    test("404 page renders for unknown route", async ({ page }) => {
      await page.goto("/this-route-does-not-exist");
      await page.waitForLoadState("domcontentloaded");
      const body = await page.textContent("body");
      expect(body).toContain("Not Found");
    });
  });
});
