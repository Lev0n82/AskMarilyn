/**
 * grace-desktop-agent.ts — tRPC router for GRACE Desktop Agent management
 *
 * Procedures:
 *   list                  — list all registered agents for the current user
 *   register              — create a new agent pairing token
 *   revoke                — deactivate an agent
 *   rename                — rename an agent
 *   heartbeat             — called by the desktop agent to update lastSeenAt
 *   getByToken            — public procedure used by the desktop agent to authenticate
 *   getAgentDownloadInfo  — public: returns GitHub release URLs + install script URLs
 */

import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { graceDesktopAgents } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

function generatePairingToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const graceDesktopAgentRouter = router({
  // ── List agents for current user ────────────────────────────────────────────
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    const agents = await db!
      .select()
      .from(graceDesktopAgents)
      .where(eq(graceDesktopAgents.userId, ctx.user.id));
    return agents;
  }),

  // ── Register a new desktop agent ────────────────────────────────────────────
  register: protectedProcedure
    .input(z.object({ label: z.string().min(1).max(128).default("My PC") }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const pairingToken = generatePairingToken();
      const [result] = await db!.insert(graceDesktopAgents).values({
        userId: ctx.user.id,
        label: input.label,
        pairingToken,
        isActive: true,
      });
      const id = (result as { insertId: number }).insertId;
      return { id, pairingToken, label: input.label };
    }),

  // ── Revoke / deactivate an agent ────────────────────────────────────────────
  revoke: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!
        .update(graceDesktopAgents)
        .set({ isActive: false })
        .where(
          and(
            eq(graceDesktopAgents.id, input.id),
            eq(graceDesktopAgents.userId, ctx.user.id)
          )
        );
      return { ok: true };
    }),

  // ── Rename an agent ──────────────────────────────────────────────────────────
  rename: protectedProcedure
    .input(z.object({ id: z.number(), label: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      await db!
        .update(graceDesktopAgents)
        .set({ label: input.label })
        .where(
          and(
            eq(graceDesktopAgents.id, input.id),
            eq(graceDesktopAgents.userId, ctx.user.id)
          )
        );
      return { ok: true };
    }),

  // ── Heartbeat — called by the desktop agent process ─────────────────────────
  // Uses the pairing token as auth (not a session cookie)
  heartbeat: publicProcedure
    .input(
      z.object({
        pairingToken: z.string(),
        platform: z.string().optional(),
        hostname: z.string().optional(),
        agentVersion: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      const [agent] = await db!
        .select()
        .from(graceDesktopAgents)
        .where(
          and(
            eq(graceDesktopAgents.pairingToken, input.pairingToken),
            eq(graceDesktopAgents.isActive, true)
          )
        )
        .limit(1);

      if (!agent) {
        return { ok: false, error: "Unknown or revoked token" };
      }

      await db!
        .update(graceDesktopAgents)
        .set({
          lastSeenAt: new Date(),
          platform: input.platform ?? agent.platform,
          hostname: input.hostname ?? agent.hostname,
          agentVersion: input.agentVersion ?? agent.agentVersion,
        })
        .where(eq(graceDesktopAgents.id, agent.id));

      return { ok: true, agentId: agent.id, label: agent.label };
    }),

  // ── Agent download info — public, no auth required ─────────────────────────
  // Returns download URLs for the AUTONOMOUS.ML agent installers.
  // Checks the GitHub Releases API for the latest published release first;
  // always returns raw-file fallback URLs for the install scripts.
  getAgentDownloadInfo: publicProcedure.query(async () => {
    const REPO = "Lev0n82/AskMarilyn";
    const BRANCH = "feature/autonomous-agent";
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;

    let latestRelease: {
      tag: string;
      windowsExeUrl: string | null;
      windowsMsiUrl: string | null;
    } | null = null;

    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/releases/latest`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      if (res.ok) {
        const rel = (await res.json()) as {
          tag_name: string;
          assets: Array<{ name: string; browser_download_url: string }>;
        };
        const exeAsset = rel.assets.find((a) => a.name.endsWith(".exe"));
        const msiAsset = rel.assets.find((a) => a.name.endsWith(".msi"));
        latestRelease = {
          tag: rel.tag_name,
          windowsExeUrl: exeAsset?.browser_download_url ?? null,
          windowsMsiUrl: msiAsset?.browser_download_url ?? null,
        };
      }
    } catch {
      // GitHub API unavailable — fall through to script-only links
    }

    return {
      latestRelease,
      // Script installers always available from the repo
      windowsInstallScriptUrl: `${RAW_BASE}/scripts/install.ps1`,
      unixInstallScriptUrl: `${RAW_BASE}/scripts/install.sh`,
      agentDeployUnixUrl: `${RAW_BASE}/agent/deploy-unix.sh`,
      agentDeployWindowsUrl: `${RAW_BASE}/agent/deploy-windows.ps1`,
      agentAppsettingsUrl: `${RAW_BASE}/agent/appsettings.json`,
      repoUrl: `https://github.com/${REPO}/tree/${BRANCH}/agent`,
      docsUrl: `https://github.com/${REPO}/blob/${BRANCH}/docs/GRACE_Architecture.md`,
    };
  }),

  // ── Get agent by token — used by the desktop agent on startup ───────────────
  getByToken: publicProcedure
    .input(z.object({ pairingToken: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      const [agent] = await db!
        .select({
          id: graceDesktopAgents.id,
          label: graceDesktopAgents.label,
          isActive: graceDesktopAgents.isActive,
          platform: graceDesktopAgents.platform,
          hostname: graceDesktopAgents.hostname,
        })
        .from(graceDesktopAgents)
        .where(eq(graceDesktopAgents.pairingToken, input.pairingToken))
        .limit(1);

      if (!agent) return null;
      return agent;
    }),
});
