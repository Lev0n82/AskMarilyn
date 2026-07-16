import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAuthenticatedContext(userId = 1, role = "user" as const): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: {
      id: userId,
      openId: `local_test_${userId}`,
      email: `user${userId}@example.com`,
      name: "Test User",
      loginMethod: "email",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      passwordHash: null,
      tenantId: null,
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

function createUnauthenticatedContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
  return { ctx };
}

describe("widget.create", () => {
  it("rejects unauthenticated widget creation", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.widget.create({
        name: "Test Widget",
        theme: "Warm Neutral",
      })
    ).rejects.toThrow();
  });

  it("validates theme names strictly", async () => {
    const { ctx } = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.widget.create({
        name: "Test Widget",
        theme: "Invalid Theme" as any,
      })
    ).rejects.toThrow();
  });

  it("accepts valid theme names: Liquid Glass, Warm Neutral, Aurora Soft", async () => {
    const { ctx } = createAuthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    // These should not throw validation errors (may throw DB errors in test env, but not zod errors)
    const themes = ["Liquid Glass", "Warm Neutral", "Aurora Soft"] as const;
    for (const theme of themes) {
      try {
        await caller.widget.create({ name: `Widget ${theme}`, theme });
      } catch (err: any) {
        // Acceptable: DB errors in test env, but NOT validation errors
        expect(err.code).not.toBe("BAD_REQUEST");
      }
    }
  });
});

describe("widget.list", () => {
  it("rejects unauthenticated listing", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.widget.list()).rejects.toThrow();
  });
});

describe("ollama.listModels", () => {
  it("rejects unauthenticated model listing", async () => {
    const { ctx } = createUnauthenticatedContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.ollama.listModels({ endpoint: "http://localhost:11434" })
    ).rejects.toThrow();
  });
});

describe("tenant.create", () => {
  it("rejects non-admin/reseller tenant creation", async () => {
    const { ctx } = createAuthenticatedContext(1, "user");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.tenant.create({
        name: "Test Tenant",
        slug: "test-tenant",
      })
    ).rejects.toThrow("Only admins and resellers can create tenants");
  });
});
