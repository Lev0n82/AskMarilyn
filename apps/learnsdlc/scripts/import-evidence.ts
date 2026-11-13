import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import courses from "../course-content/evidence-desk/courses.json";
import resources from "../course-content/evidence-desk/resources.json";
import { validateRelease } from "../server/evidence/import";
import { getDb } from "../server/db";
import { edReleases } from "../drizzle/evidence-schema";
import type { Release } from "../server/evidence/service";
const source = process.argv[2];
if (!source)
  throw new Error(
    "Usage: pnpm exec tsx scripts/import-evidence.ts /private/path/to/approved-v3-author-pack"
  );
const load = async (p: string) =>
  JSON.parse(await readFile(resolve(source, p), "utf8"));
const questions: Release["questions"] = {};
const feedback: any[] = [];
const clips: Record<string, string> = {};
for (let n = 1; n <= 14; n++) {
  const nn = String(n).padStart(2, "0");
  const bank = await load(`instructor/assessments/course_${nn}.json`);
  for (const t of bank.topics)
    questions[`topic:${bank.course_id}:${t.topic_id}`] = t.questions;
  questions[`checkpoint:${bank.course_id}`] = bank.checkpoint_questions;
  questions[`final:${bank.course_id}`] = bank.final_questions;
  feedback.push(
    ...(await load(`instructor/course_${nn}_feedback.json`)).feedback
  );
  for (const clip of (await load(`media_scripts/course_${nn}_clips.json`))
    .clips)
    clips[clip.clip_id] = clip.transcript;
}
questions.program = (
  await load("instructor/assessments/program_final.json")
).final_questions;
const data: Release = {
  version: "3.0",
  hash: "",
  courses,
  questions,
  feedback,
  clips,
  ...resources,
};
data.hash = createHash("sha256").update(JSON.stringify(data)).digest("hex");
validateRelease(data);
const db = await getDb();
if (!db) throw new Error("Academy database unavailable");
const prior = await db
  .select()
  .from(edReleases)
  .where(eq(edReleases.version, data.version));
if (prior.length) {
  if (prior[0].hash !== data.hash)
    throw new Error(
      "Immutable release already exists with a different content hash. Create a reviewed new version."
    );
  console.log("Approved release already installed with identical hash.");
} else {
  await db
    .insert(edReleases)
    .values({ version: data.version, hash: data.hash, data });
  console.log(
    "Installed approved private release: 14 courses, 43 topics, 277 questions; no learner or legacy rows changed."
  );
}
process.exit(0);
