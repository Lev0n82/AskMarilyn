import { mysqlTable, varchar, int, json, index } from "drizzle-orm/mysql-core";
export const edReleases = mysqlTable("ed_releases", {
  version: varchar("version", { length: 64 }).primaryKey(),
  hash: varchar("hash", { length: 64 }).notNull(),
  data: json("data").notNull(),
});
const record = (name: string) =>
  mysqlTable(
    name,
    {
      id: varchar("id", { length: 128 }).primaryKey(),
      ownerId: int("ownerId").notNull(),
      version: varchar("version", { length: 64 }).notNull(),
      data: json("data").notNull(),
    },
    t => [index(`${name}_owner`).on(t.ownerId, t.version)]
  );
export const edAttempts = record("ed_attempts");
export const edLearning = record("ed_learning");
export const edSubmissions = record("ed_submissions");
export const edReviews = record("ed_reviews");
export const edCredentials = record("ed_credentials");
