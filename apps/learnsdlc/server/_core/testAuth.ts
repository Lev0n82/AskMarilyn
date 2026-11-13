/**
 * Test Authentication Bypass — DEV ENVIRONMENT ONLY
 *
 * Provides a `/api/test-auth/login` endpoint that allows Playwright tests
 * to authenticate without going through the full Manus OAuth flow.
 *
 * Security constraints:
 *   1. ONLY registered when NODE_ENV !== "production"
 *   2. ONLY accepts emails ending in @levon.ca
 *   3. Creates a real session cookie identical to the OAuth flow
 *   4. The route is never registered in production builds
 *
 * Usage from Playwright:
 *   await page.request.post('/api/test-auth/login', {
 *     data: { email: 'LearnsdlcTestUser1@levon.ca', name: 'Test User 1' }
 *   });
 *
 * For production testing, use ProdTestUser1@levon.ca with manually
 * activated accounts through the real OAuth flow.
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";
import crypto from "crypto";

const TEST_DOMAIN = "@levon.ca";

function isTestEmail(email: string): boolean {
  return email.toLowerCase().endsWith(TEST_DOMAIN);
}

function generateTestOpenId(email: string): string {
  // Deterministic openId from email so the same test email always maps
  // to the same user record across test runs.
  return "test_" + crypto.createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 32);
}

export function registerTestAuthRoutes(app: Express) {
  // ─── CRITICAL GUARD: Never register in production ───
  if (ENV.isProduction) {
    console.log("[TestAuth] Production environment detected — test auth routes DISABLED");
    return;
  }

  console.log("[TestAuth] Development environment — test auth routes ENABLED (⚠️ dev only)");

  /**
   * POST /api/test-auth/login
   * Body: { email: string, name?: string }
   *
   * Creates or updates a test user and sets a session cookie.
   */
  app.post("/api/test-auth/login", async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body as { email?: string; name?: string };

      if (!email || typeof email !== "string") {
        res.status(400).json({ error: "email is required" });
        return;
      }

      if (!isTestEmail(email)) {
        res.status(403).json({
          error: `Only ${TEST_DOMAIN} emails are allowed for test authentication`,
        });
        return;
      }

      const openId = generateTestOpenId(email);
      const displayName = name || email.split("@")[0];

      // Upsert the test user into the database
      await db.upsertUser({
        openId,
        name: displayName,
        email,
        loginMethod: "test-bypass",
        lastSignedIn: new Date(),
      });

      // Create a session token (same mechanism as real OAuth)
      const sessionToken = await sdk.createSessionToken(openId, {
        name: displayName,
        expiresInMs: ONE_YEAR_MS,
      });

      // Set the session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({
        success: true,
        user: {
          openId,
          email,
          name: displayName,
          loginMethod: "test-bypass",
        },
      });
    } catch (error) {
      console.error("[TestAuth] Login failed:", error);
      res.status(500).json({ error: "Test auth login failed" });
    }
  });

  /**
   * POST /api/test-auth/logout
   * Clears the session cookie for test cleanup.
   */
  app.post("/api/test-auth/logout", (_req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.json({ success: true });
  });

  /**
   * GET /api/test-auth/status
   * Returns whether test auth is enabled (for Playwright to verify).
   */
  app.get("/api/test-auth/status", (_req: Request, res: Response) => {
    res.json({
      enabled: true,
      environment: process.env.NODE_ENV || "development",
      allowedDomain: TEST_DOMAIN,
    });
  });
}
