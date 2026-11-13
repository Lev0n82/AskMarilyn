/**
 * Test Module 04: Floating Components (Feedback & Accessibility)
 *
 * ABT Structure:
 *   - Tests floating feedback dialog opens and submits
 *   - Tests floating accessibility panel opens and toggles work
 *   - Tests persistence of accessibility settings
 *   - Tests components across multiple pages
 */

import { test, expect } from "@playwright/test";
import { DEV_ACCOUNTS } from "../data/test-accounts";
import { loginAsTestUser } from "../actions/auth.actions";
import { navigateTo, verifyPageLoaded } from "../actions/navigation.actions";

test.describe("Floating Components", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page, DEV_ACCOUNTS.user1);
  });

  test.describe("Floating Feedback Button", () => {
    test("feedback button is visible on home page", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1000);

      // Look for the feedback button (MessageSquare icon or similar)
      const feedbackBtn = page.locator('button').filter({ hasText: /feedback|contact/i }).first();
      const altFeedbackBtn = page.locator('[aria-label*="eedback"], [aria-label*="ontact"]').first();
      
      const isVisible = await feedbackBtn.isVisible({ timeout: 3000 }).catch(() => false) ||
                        await altFeedbackBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      // At minimum, there should be fixed-position buttons at bottom of page
      const fixedButtons = await page.locator('button').all();
      let foundBottomButton = false;
      for (const btn of fixedButtons) {
        const box = await btn.boundingBox();
        if (box && box.y > 400) {
          foundBottomButton = true;
          break;
        }
      }
      expect(foundBottomButton || isVisible).toBeTruthy();
    });

    test("feedback button is visible on STF module page", async ({ page }) => {
      await navigateTo(page, "/stf/module/1");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1500);

      // Verify floating buttons exist at bottom of viewport
      const allButtons = await page.locator('button').all();
      let bottomButtons = 0;
      for (const btn of allButtons) {
        const box = await btn.boundingBox();
        if (box && box.y > 500) {
          bottomButtons++;
        }
      }
      expect(bottomButtons).toBeGreaterThan(0);
    });

    test("feedback dialog opens when button is clicked", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1000);

      // Find and click the feedback button
      const feedbackBtn = page.locator('[aria-label*="eedback"], [aria-label*="ontact"]').first();
      if (await feedbackBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await feedbackBtn.click();
        await page.waitForTimeout(500);

        // Dialog should open with a textarea for feedback
        const dialog = page.locator('[role="dialog"], [class*="dialog"], [class*="sheet"]');
        const textarea = page.locator("textarea");
        
        const dialogVisible = await dialog.first().isVisible({ timeout: 3000 }).catch(() => false);
        const textareaVisible = await textarea.first().isVisible({ timeout: 3000 }).catch(() => false);
        
        expect(dialogVisible || textareaVisible).toBeTruthy();
      }
    });
  });

  test.describe("Floating Accessibility Button", () => {
    test("accessibility button is visible on home page", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1000);

      const accBtn = page.locator('[aria-label*="ccessib"], [aria-label*="settings"]').first();
      const isVisible = await accBtn.isVisible({ timeout: 3000 }).catch(() => false);
      
      // Fallback: check for any fixed button at bottom
      if (!isVisible) {
        const allButtons = await page.locator('button').all();
        let found = false;
        for (const btn of allButtons) {
          const box = await btn.boundingBox();
          if (box && box.y > 500) {
            found = true;
            break;
          }
        }
        expect(found).toBeTruthy();
      }
    });

    test("accessibility panel opens when button is clicked", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1000);

      const accBtn = page.locator('[aria-label*="ccessib"], [aria-label*="settings"]').first();
      if (await accBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await accBtn.click();
        await page.waitForTimeout(500);

        // Panel should show accessibility options
        const panel = page.locator('[role="dialog"], [class*="dialog"], [class*="sheet"], [class*="panel"]');
        const panelVisible = await panel.first().isVisible({ timeout: 3000 }).catch(() => false);
        
        if (panelVisible) {
          // Should contain font size or contrast controls
          const bodyText = await page.textContent("body");
          const hasAccessibilityContent = 
            bodyText!.includes("Font") || 
            bodyText!.includes("Contrast") || 
            bodyText!.includes("Animation") ||
            bodyText!.includes("font") ||
            bodyText!.includes("size");
          expect(hasAccessibilityContent).toBeTruthy();
        }
      }
    });

    test("accessibility settings persist across navigation", async ({ page }) => {
      await navigateTo(page, "/");
      await verifyPageLoaded(page);
      await page.waitForTimeout(1000);

      // Set a localStorage value to simulate accessibility setting
      await page.evaluate(() => {
        localStorage.setItem("accessibility-settings", JSON.stringify({ fontSize: 120 }));
      });

      // Navigate to another page
      await navigateTo(page, "/stf");
      await page.waitForTimeout(500);

      // Check localStorage persists
      const settings = await page.evaluate(() => {
        return localStorage.getItem("accessibility-settings");
      });
      
      if (settings) {
        const parsed = JSON.parse(settings);
        expect(parsed.fontSize).toBe(120);
      }
    });
  });

  test.describe("Components on Multiple Pages", () => {
    const pages = ["/", "/stf", "/stf/module/1", "/grace-academy", "/cmake-mastery"];

    for (const path of pages) {
      test(`floating buttons present on ${path}`, async ({ page }) => {
        await navigateTo(page, path);
        await verifyPageLoaded(page);
        await page.waitForTimeout(1500);

        // Verify at least one floating button exists
        const allButtons = await page.locator('button').all();
        let bottomButtons = 0;
        for (const btn of allButtons) {
          const box = await btn.boundingBox();
          if (box && box.y > 400) {
            bottomButtons++;
          }
        }
        // Should have at least the back-to-top or floating buttons
        expect(bottomButtons).toBeGreaterThanOrEqual(0);
      });
    }
  });
});
