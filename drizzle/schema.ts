import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, json, boolean } from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "reseller"]).default("user").notNull(),
  tenantId: int("tenantId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Tenants (White-Label) ───────────────────────────────────────────────────
export const tenants = mysqlTable("tenants", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  logoUrl: text("logoUrl"),
  primaryColor: varchar("primaryColor", { length: 7 }).default("#6366f1"),
  secondaryColor: varchar("secondaryColor", { length: 7 }).default("#8b5cf6"),
  customDomain: varchar("customDomain", { length: 255 }),
  ownerId: int("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = typeof tenants.$inferInsert;

// ─── Widgets ─────────────────────────────────────────────────────────────────
export const widgets = mysqlTable("widgets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tenantId: int("tenantId"),
  name: varchar("name", { length: 255 }).notNull(),
  theme: mysqlEnum("theme", ["Liquid Glass", "Warm Neutral", "Aurora Soft"]).default("Warm Neutral").notNull(),
  greeting: text("greeting"),
  suggestionChips: json("suggestionChips").$type<string[]>(),
  // Ollama configuration
  ollamaEndpoint: varchar("ollamaEndpoint", { length: 512 }).default("http://localhost:11434"),
  ollamaModel: varchar("ollamaModel", { length: 128 }),
  systemPrompt: text("systemPrompt"),
  // Multi-channel communication
  whatsappNumber: varchar("whatsappNumber", { length: 32 }),
  phoneNumber: varchar("phoneNumber", { length: 32 }),
  emailAddress: varchar("emailAddress", { length: 320 }),
  // Qualification trigger phrase
  qualificationPrompt: text("qualificationPrompt"),
  // Accessibility overlay
  accessibilityEnabled: boolean("accessibilityEnabled").default(true),
  // Status
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Widget = typeof widgets.$inferSelect;
export type InsertWidget = typeof widgets.$inferInsert;

// ─── Documents (Knowledge Base) ──────────────────────────────────────────────
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  widgetId: int("widgetId").notNull(),
  filename: varchar("filename", { length: 512 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl"),
  sizeBytes: bigint("sizeBytes", { mode: "number" }),
  chunkCount: int("chunkCount").default(0),
  status: mysqlEnum("status", ["pending", "processing", "ready", "error"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// ─── Document Chunks (Vector Store) ─────────────────────────────────────────
export const documentChunks = mysqlTable("document_chunks", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  widgetId: int("widgetId").notNull(),
  content: text("content").notNull(),
  chunkIndex: int("chunkIndex").notNull(),
  // Store embedding as JSON array of floats
  embedding: json("embedding").$type<number[]>(),
  metadata: json("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocumentChunk = typeof documentChunks.$inferSelect;
export type InsertDocumentChunk = typeof documentChunks.$inferInsert;

// ─── Conversations ───────────────────────────────────────────────────────────
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  widgetId: int("widgetId").notNull(),
  visitorId: varchar("visitorId", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["active", "qualified", "closed"]).default("active").notNull(),
  metadata: json("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// ─── Messages ────────────────────────────────────────────────────────────────
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  ragContext: text("ragContext"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ─── Password Reset Tokens ───────────────────────────────────────────────────
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
