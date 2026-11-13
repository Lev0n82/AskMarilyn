import { validateQuestion } from "./core";
import type { Release } from "./service";
export function validateRelease(r: Release): Release {
  const checkPublic = (x: any): void => {
    if (Array.isArray(x)) {
      x.forEach(checkPublic);
    } else if (x && typeof x === "object") {
      if ("correct_option" in x || "rationale" in x)
        throw new Error("Private fields in public content");
      Object.values(x).forEach(checkPublic);
    }
  };
  checkPublic(r.courses);
  if (
    r.version !== "3.0" ||
    r.courses.length !== 14 ||
    new Set(r.courses.map(c => c.course_id)).size !== 14 ||
    r.matrices.length !== 18
  )
    throw new Error("Incomplete approved release");
  const ids = new Set<string>();
  let topicCount = 0;
  function assessment(key: string, count: number) {
    const qs = r.questions[key];
    if (!qs || qs.length !== count)
      throw new Error(`Missing or invalid assessment ${key}`);
    for (const q of qs) {
      validateQuestion(q);
      if (ids.has(q.id)) throw new Error("Duplicate question ID");
      ids.add(q.id);
    }
    return qs;
  }
  for (let i = 0; i < r.courses.length; i++) {
    const c = r.courses[i];
    if (
      c.course_id !== `C${String(i + 1).padStart(2, "0")}` ||
      !c.introduction.dilemma ||
      !c.introduction.reply
    )
      throw new Error("Invalid course identity or introduction");
    for (const t of c.topics) {
      topicCount++;
      if (
        !t.title ||
        !t.lecture_markdown ||
        !t.visual.text_equivalent ||
        t.games.length !== 2 ||
        t.games.some((g: any) => g.rounds.length !== 3)
      )
        throw new Error("Incomplete topic teaching content");
      const qs = assessment(`topic:${c.course_id}:${t.topic_id}`, 3);
      if (t.quiz.questions.some((q: any) => !qs.some(x => x.id === q.id)))
        throw new Error("Public/private question mismatch");
    }
    assessment(`checkpoint:${c.course_id}`, 3);
    assessment(`final:${c.course_id}`, 5);
  }
  assessment("program", 36);
  if (topicCount !== 43 || ids.size !== 277)
    throw new Error("Incomplete approved topic/question inventory");
  return r;
}
