import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { registerUser, authenticateUser, createPasswordResetToken, resetPassword } from "./auth";
import { widgetRouter } from "./routers/widgets";
import { documentRouter } from "./routers/documents";
import { conversationRouter } from "./routers/conversations";
import { ollamaRouter } from "./routers/ollama";
import { tenantRouter } from "./routers/tenants";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await registerUser(input.email, input.password, input.name);
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Registration failed" });

        const token = await sdk.createSessionToken(user.openId, { name: user.name || "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }),

    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const user = await authenticateUser(input.email, input.password);
          const token = await sdk.createSessionToken(user.openId, { name: user.name || "" });
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

          return { id: user.id, email: user.email, name: user.name, role: user.role };
        } catch {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
        }
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await createPasswordResetToken(input.email);
        // Always return success to not reveal if email exists
        return { success: true, message: "If an account exists with that email, a reset link has been sent." };
      }),

    resetPassword: publicProcedure
      .input(z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        try {
          await resetPassword(input.token, input.newPassword);
          return { success: true };
        } catch (e: any) {
          throw new TRPCError({ code: "BAD_REQUEST", message: e.message || "Reset failed" });
        }
      }),
  }),

  widget: widgetRouter,
  document: documentRouter,
  conversation: conversationRouter,
  ollama: ollamaRouter,
  tenant: tenantRouter,
});

export type AppRouter = typeof appRouter;
