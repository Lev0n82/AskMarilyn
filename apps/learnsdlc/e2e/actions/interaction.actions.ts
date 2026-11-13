/**
 * Interaction Actions — ABT Reusable Test Module
 *
 * Encapsulates user interactions with quizzes, games,
 * accessibility panel, and feedback form.
 */

import { type Page, expect } from "@playwright/test";

/**
 * Action: Open the floating accessibility panel
 */
export async function openAccessibilityPanel(page: Page): Promise<void> {
  // The accessibility button has an accessibility icon
  const accessibilityBtn = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /^$/ });
  // Try to find the button by its position (bottom-right, left of feedback)
  const buttons = page.locator('button[class*="fixed"], button[class*="bottom"]');
  
  // More reliable: look for the specific accessibility button
  const accBtn = page.locator('[aria-label*="ccessib"], [aria-label*="settings"]').first();
  if (await accBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await accBtn.click();
    return;
  }
  
  // Fallback: find fixed-position buttons at bottom of page
  const fixedButtons = page.locator('button').all();
  for (const btn of await fixedButtons) {
    const box = await btn.boundingBox();
    if (box && box.y > 500 && box.x > 800) {
      await btn.click();
      break;
    }
  }
}

/**
 * Action: Open the floating feedback dialog
 */
export async function openFeedbackDialog(page: Page): Promise<void> {
  const feedbackBtn = page.locator('[aria-label*="eedback"], [aria-label*="ontact"]').first();
  if (await feedbackBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await feedbackBtn.click();
    return;
  }
}

/**
 * Action: Adjust accessibility font size
 */
export async function adjustFontSize(page: Page, value: number): Promise<void> {
  await openAccessibilityPanel(page);
  await page.waitForTimeout(500);
  
  // Look for font size slider or input
  const slider = page.locator('input[type="range"]').first();
  if (await slider.isVisible({ timeout: 2000 }).catch(() => false)) {
    await slider.fill(String(value));
  }
}

/**
 * Action: Toggle an accessibility setting
 */
export async function toggleAccessibilitySetting(
  page: Page,
  settingLabel: string
): Promise<void> {
  // Find the toggle switch near the label text
  const section = page.locator(`text=${settingLabel}`).locator("..").locator("..");
  const toggle = section.locator('button[role="switch"], input[type="checkbox"]').first();
  if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    await toggle.click();
  }
}

/**
 * Action: Submit feedback via the floating form
 */
export async function submitFeedback(
  page: Page,
  category: string,
  message: string
): Promise<void> {
  await openFeedbackDialog(page);
  await page.waitForTimeout(500);

  // Fill in the feedback form
  const textarea = page.locator("textarea").first();
  if (await textarea.isVisible({ timeout: 3000 }).catch(() => false)) {
    await textarea.fill(message);
  }

  // Submit
  const submitBtn = page.locator('button:has-text("Submit"), button:has-text("Send")').first();
  if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await submitBtn.click();
  }
}

/**
 * Action: Click a tab in a tabbed interface
 */
export async function clickTab(page: Page, tabName: string): Promise<void> {
  const tab = page.locator(`[role="tab"]:has-text("${tabName}"), button:has-text("${tabName}")`).first();
  await expect(tab).toBeVisible({ timeout: 5000 });
  await tab.click();
  await page.waitForTimeout(500);
}

/**
 * Action: Verify a section heading exists on page
 */
export async function verifySectionExists(
  page: Page,
  headingText: string
): Promise<void> {
  const heading = page.locator(`h1:has-text("${headingText}"), h2:has-text("${headingText}"), h3:has-text("${headingText}")`).first();
  await expect(heading).toBeVisible({ timeout: 5000 });
}
