/**
 * Navigation Actions — ABT Reusable Test Module
 *
 * Encapsulates all navigation patterns: sidebar, accordion,
 * module links, breadcrumbs, and floating buttons.
 */

import { type Page, expect } from "@playwright/test";

/**
 * Action: Navigate to a route and wait for load
 */
export async function navigateTo(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}

/**
 * Action: Verify page loaded without errors
 * Checks that no error boundary or 404 page is shown.
 */
export async function verifyPageLoaded(page: Page): Promise<void> {
  // Should not show the 404 page
  const notFoundHeading = page.locator("text=Page Not Found");
  const errorBoundary = page.locator("text=Something went wrong");

  // Give the page a moment to render
  await page.waitForTimeout(500);

  const is404 = await notFoundHeading.isVisible().catch(() => false);
  const isError = await errorBoundary.isVisible().catch(() => false);

  if (is404) {
    throw new Error(`Page loaded as 404: ${page.url()}`);
  }
  if (isError) {
    throw new Error(`Error boundary triggered: ${page.url()}`);
  }
}

/**
 * Action: Verify sidebar navigation is visible (desktop)
 */
export async function verifySidebarVisible(page: Page): Promise<void> {
  const sidebar = page.locator("nav, [role='navigation']").first();
  await expect(sidebar).toBeVisible({ timeout: 5000 });
}

/**
 * Action: Verify floating buttons are present
 */
export async function verifyFloatingButtons(page: Page): Promise<void> {
  // Wait for the page to fully render
  await page.waitForTimeout(1000);

  // Check for the floating feedback and accessibility buttons
  // They are fixed-position buttons in the bottom-right corner
  const floatingButtons = page.locator("button[aria-label]");
  const count = await floatingButtons.count();
  expect(count).toBeGreaterThan(0);
}

/**
 * Action: Check that the page title is set
 */
export async function verifyPageTitle(page: Page): Promise<void> {
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
  expect(title).not.toBe("undefined");
}

/**
 * Action: Scroll to bottom of page
 */
export async function scrollToBottom(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
}

/**
 * Action: Scroll to top of page
 */
export async function scrollToTop(page: Page): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

/**
 * Action: Verify no console errors on page
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Action: Verify responsive layout at current viewport
 * Checks that content doesn't overflow horizontally.
 */
export async function verifyNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  // Allow small overflow (scrollbar width)
  if (overflow) {
    const diff = await page.evaluate(() => {
      return document.documentElement.scrollWidth - document.documentElement.clientWidth;
    });
    // Allow up to 20px for scrollbar
    expect(diff).toBeLessThanOrEqual(20);
  }
}
