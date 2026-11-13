/**
 * Test Module 01: Authentication & Registration Flow
 *
 * ABT Structure:
 *   - Uses reusable auth actions (login, logout, verify)
 *   - Test data from centralized test-accounts module
 *   - Validates security constraints (domain restriction)
 *   - Tests both positive and negative paths
 *
 * Note: Cookie verification uses Set-Cookie response headers
 * because SameSite=None cookies require Secure flag which
 * isn't available on localhost HTTP.
 */

import { test, expect } from "@playwright/test";
import { DEV_ACCOUNTS } from "../data/test-accounts";
import {
  loginAsTestUser,
  logoutTestUser,
  verifyTestAuthEnabled,
  verifyNonLevonRejected,
} from "../actions/auth.actions";

test.describe("Authentication System", () => {
  test.describe("Test Auth Bypass (Dev Environment)", () => {
    test("test auth endpoint is enabled in dev", async ({ request }) => {
      await verifyTestAuthEnabled(request);
    });

    test("login with LearnsdlcTestUser1@levon.ca succeeds", async ({ page }) => {
      const response = await page.request.post("/api/test-auth/login", {
        data: {
          email: DEV_ACCOUNTS.user1.email,
          name: DEV_ACCOUNTS.user1.name,
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.user.email).toBe(DEV_ACCOUNTS.user1.email);
      expect(body.user.loginMethod).toBe("test-bypass");

      // Verify Set-Cookie header was returned
      const setCookie = response.headers()["set-cookie"];
      expect(setCookie).toBeTruthy();
      expect(setCookie).toContain("app_session_id");
    });

    test("login with LearnsdlcTestUser2@levon.ca succeeds", async ({ page }) => {
      const response = await page.request.post("/api/test-auth/login", {
        data: {
          email: DEV_ACCOUNTS.user2.email,
          name: DEV_ACCOUNTS.user2.name,
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.user.email).toBe(DEV_ACCOUNTS.user2.email);

      const setCookie = response.headers()["set-cookie"];
      expect(setCookie).toContain("app_session_id");
    });

    test("login with LearnsdlcTestUser3@levon.ca succeeds", async ({ page }) => {
      const response = await page.request.post("/api/test-auth/login", {
        data: {
          email: DEV_ACCOUNTS.user3.email,
          name: DEV_ACCOUNTS.user3.name,
        },
      });

      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.user.email).toBe(DEV_ACCOUNTS.user3.email);

      const setCookie = response.headers()["set-cookie"];
      expect(setCookie).toContain("app_session_id");
    });

    test("authenticated user session is valid", async ({ page }) => {
      await loginAsTestUser(page, DEV_ACCOUNTS.user1);

      // Navigate and verify the page loads (not redirected to login)
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      expect(page.url()).not.toContain("app-auth");
    });

    test("logout returns success", async ({ page }) => {
      await loginAsTestUser(page, DEV_ACCOUNTS.user1);
      const response = await page.request.post("/api/test-auth/logout");
      expect(response.ok()).toBeTruthy();
      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  test.describe("Security Constraints", () => {
    test("rejects non-levon.ca email (gmail.com)", async ({ request }) => {
      await verifyNonLevonRejected(request, "hacker@gmail.com");
    });

    test("rejects non-levon.ca email (evil.com)", async ({ request }) => {
      await verifyNonLevonRejected(request, "attacker@evil.com");
    });

    test("rejects empty email", async ({ request }) => {
      const response = await request.post("/api/test-auth/login", {
        data: { name: "No Email" },
      });
      expect(response.status()).toBe(400);
    });

    test("rejects similar but wrong domain (@levon.ca.evil.com)", async ({
      request,
    }) => {
      await verifyNonLevonRejected(request, "user@levon.ca.evil.com");
    });
  });

  test.describe("Multiple User Sessions", () => {
    test("different test users get different openIds", async ({ page }) => {
      const resp1 = await page.request.post("/api/test-auth/login", {
        data: { email: DEV_ACCOUNTS.user1.email, name: DEV_ACCOUNTS.user1.name },
      });
      const body1 = await resp1.json();

      const resp2 = await page.request.post("/api/test-auth/login", {
        data: { email: DEV_ACCOUNTS.user2.email, name: DEV_ACCOUNTS.user2.name },
      });
      const body2 = await resp2.json();

      expect(body1.user.openId).not.toBe(body2.user.openId);
    });

    test("same email always gets same openId (deterministic)", async ({ page }) => {
      const resp1 = await page.request.post("/api/test-auth/login", {
        data: { email: DEV_ACCOUNTS.user1.email, name: DEV_ACCOUNTS.user1.name },
      });
      const body1 = await resp1.json();

      const resp2 = await page.request.post("/api/test-auth/login", {
        data: { email: DEV_ACCOUNTS.user1.email, name: DEV_ACCOUNTS.user1.name },
      });
      const body2 = await resp2.json();

      expect(body1.user.openId).toBe(body2.user.openId);
    });
  });
});
