/**
 * Authentication Actions — ABT Reusable Test Module
 *
 * These actions encapsulate the authentication flow so test cases
 * never duplicate login/logout logic. Following ABT principle:
 * "A test action is a reusable building block."
 */

import { type Page, type APIRequestContext, expect } from "@playwright/test";
import type { TestAccount } from "../data/test-accounts";

/**
 * Action: Login via test bypass (dev environment only)
 *
 * Uses the /api/test-auth/login endpoint to authenticate
 * without going through the full OAuth flow.
 */
export async function loginAsTestUser(
  page: Page,
  account: TestAccount
): Promise<void> {
  // Call the test auth endpoint via the page's request context
  // so the cookie is set on the page's browser context
  const response = await page.request.post("/api/test-auth/login", {
    data: {
      email: account.email,
      name: account.name,
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.user.email).toBe(account.email);
}

/**
 * Action: Logout via test bypass
 */
export async function logoutTestUser(page: Page): Promise<void> {
  const response = await page.request.post("/api/test-auth/logout");
  expect(response.ok()).toBeTruthy();
}

/**
 * Action: Verify test auth is enabled (sanity check)
 */
export async function verifyTestAuthEnabled(
  request: APIRequestContext
): Promise<void> {
  const response = await request.get("/api/test-auth/status");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.enabled).toBe(true);
  expect(body.allowedDomain).toBe("@levon.ca");
}

/**
 * Action: Verify user is authenticated by checking tRPC auth.me
 */
export async function verifyAuthenticated(page: Page): Promise<void> {
  // Navigate to home to trigger auth check
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // The page should not redirect to login
  expect(page.url()).not.toContain("app-auth");
}

/**
 * Action: Verify non-levon.ca email is rejected
 */
export async function verifyNonLevonRejected(
  request: APIRequestContext,
  email: string
): Promise<void> {
  const response = await request.post("/api/test-auth/login", {
    data: { email, name: "Hacker" },
  });
  expect(response.status()).toBe(403);
  const body = await response.json();
  expect(body.error).toContain("@levon.ca");
}
