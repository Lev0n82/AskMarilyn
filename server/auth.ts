import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { users, passwordResetTokens } from "../drizzle/schema";
import { getDb } from "./db";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerUser(email: string, password: string, name: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if email already exists
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    throw new Error("Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const openId = `local_${nanoid(16)}`;

  await db.insert(users).values({
    openId,
    email,
    name,
    passwordHash,
    loginMethod: "email",
    role: "user",
    lastSignedIn: new Date(),
  });

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] ?? null;
}

export async function authenticateUser(email: string, password: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (result.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result[0];
  if (!user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  // Update last signed in
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));

  return user;
}

export async function createPasswordResetToken(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (result.length === 0) {
    // Don't reveal whether email exists
    return { token: null, success: true };
  }

  const user = result[0];
  const token = nanoid(48);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  return { token, userId: user.id, success: true };
}

export async function resetPassword(token: string, newPassword: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
  if (result.length === 0) {
    throw new Error("Invalid or expired reset token");
  }

  const resetToken = result[0];
  if (resetToken.usedAt) {
    throw new Error("Token already used");
  }
  if (new Date() > resetToken.expiresAt) {
    throw new Error("Token expired");
  }

  const passwordHash = await hashPassword(newPassword);

  await db.update(users).set({ passwordHash }).where(eq(users.id, resetToken.userId));
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, resetToken.id));

  return { success: true };
}
