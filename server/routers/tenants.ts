import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { tenants, users } from "../../drizzle/schema";

export const tenantRouter = router({
  // Get current user's tenant
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.tenantId) return null;
    const db = await getDb();
    if (!db) return null;
    const result = await db.select().from(tenants).where(eq(tenants.id, ctx.user.tenantId)).limit(1);
    return result[0] || null;
  }),

  // Create a new tenant (admin/reseller only)
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
      logoUrl: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      customDomain: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "reseller") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins and resellers can create tenants" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Check slug uniqueness
      const existing = await db.select().from(tenants).where(eq(tenants.slug, input.slug)).limit(1);
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
      }

      await db.insert(tenants).values({
        name: input.name,
        slug: input.slug,
        logoUrl: input.logoUrl || null,
        primaryColor: input.primaryColor || "#6366f1",
        secondaryColor: input.secondaryColor || "#8b5cf6",
        customDomain: input.customDomain || null,
        ownerId: ctx.user.id,
      });

      const result = await db.select().from(tenants).where(eq(tenants.slug, input.slug)).limit(1);
      const tenant = result[0];

      // Assign tenant to user
      await db.update(users).set({ tenantId: tenant.id }).where(eq(users.id, ctx.user.id));

      return tenant;
    }),

  // Update tenant branding
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      logoUrl: z.string().nullable().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      customDomain: z.string().nullable().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(tenants).where(eq(tenants.id, input.id)).limit(1);
      if (!existing[0] || existing[0].ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }

      const { id, ...updateData } = input;
      const cleanData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));

      if (Object.keys(cleanData).length > 0) {
        await db.update(tenants).set(cleanData).where(eq(tenants.id, id));
      }

      const result = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);
      return result[0];
    }),

  // List all tenants (admin only)
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(tenants);
  }),
});
