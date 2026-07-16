import type { Express, Request, Response } from "express";

/**
 * OAuth routes are disabled in standalone mode.
 * Authentication is handled entirely via local JWT + bcrypt.
 * This file is kept as a no-op to avoid breaking the import in index.ts.
 */
export function registerOAuthRoutes(app: Express) {
  // No OAuth routes registered — auth is fully standalone.
  // The /api/oauth/callback endpoint is intentionally removed.
  // All authentication goes through tRPC auth.register / auth.login procedures.

  // Return a helpful message if someone hits the old OAuth endpoint
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.status(410).json({
      error: "OAuth is disabled. This platform uses standalone email/password authentication.",
      loginUrl: "/login",
      registerUrl: "/register",
    });
  });
}
