import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import {
  edAttempts,
  edLearning,
  edReleases,
  edSubmissions,
  edReviews,
  edCredentials,
} from "../../drizzle/evidence-schema";
import type { Store, Release, Row } from "./service";
import { users } from "../../drizzle/schema";
import { validateRelease } from "./import";
const tables: Record<string, typeof edAttempts> = {
  attempts: edAttempts,
  learning: edLearning,
  submissions: edSubmissions,
  reviews: edReviews,
  credentials: edCredentials,
};
let releasePromise: Promise<Release> | undefined;
function repository(db: any): Store {
  return {
    async release() {
      if (!releasePromise)
        releasePromise = (async () => {
          const rows = await db
            .select()
            .from(edReleases)
            .where(eq(edReleases.version, "3.0"))
            .limit(1);
          if (!rows.length)
            throw new Error(
              "Evidence Desk private release has not been installed"
            );
          return validateRelease(rows[0].data as Release);
        })();
      try {
        return await releasePromise;
      } catch (e) {
        releasePromise = undefined;
        throw e;
      }
    },
    async actorExists(id) {
      return (
        (
          await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.id, id))
            .limit(1)
        ).length === 1
      );
    },
    async get(name, id) {
      const t = tables[name];
      if (!t) throw new Error("Unknown Evidence Desk table");
      return (await db.select().from(t).where(eq(t.id, id)).limit(1))[0] as
        | Row
        | undefined;
    },
    async list(name, owner) {
      const t = tables[name];
      if (!t) throw new Error("Unknown Evidence Desk table");
      let q = db.select().from(t);
      if (owner !== undefined)
        q = q.where(and(eq(t.ownerId, owner), eq(t.version, "3.0")));
      return (await q) as Row[];
    },
    async put(name, row) {
      const t = tables[name];
      if (!t) throw new Error("Unknown Evidence Desk table");
      await db
        .insert(t)
        .values(row)
        .onDuplicateKeyUpdate({ set: { data: row.data } });
      return row;
    },
    async tx(owner, fn) {
      const id = `${owner}:3.0`;
      await db
        .insert(edLearning)
        .values({
          id,
          ownerId: owner,
          version: "3.0",
          data: { topics: {}, milestones: [], revision: 0 },
        })
        .onDuplicateKeyUpdate({ set: { id } });
      return db.transaction(async (tx: any) => {
        await tx
          .select()
          .from(edLearning)
          .where(eq(edLearning.id, id))
          .for("update");
        return fn(repository(tx));
      });
    },
  };
}
export const databaseStore: Store = {
  release: async () => repository(await requiredDb()).release(),
  actorExists: async id => repository(await requiredDb()).actorExists(id),
  get: async (t, id) => repository(await requiredDb()).get(t, id),
  list: async (t, o) => repository(await requiredDb()).list(t, o),
  put: async (t, r) => repository(await requiredDb()).put(t, r),
  tx: async (o, f) => repository(await requiredDb()).tx(o, f),
};
async function requiredDb() {
  const db = await getDb();
  if (!db) throw new Error("Academy database unavailable");
  return db;
}
