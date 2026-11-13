export type Option = { id: string; text: string; rationale: string };
export type Question = {
  id: string;
  prompt: string;
  options: Option[];
  correct_option: string;
  explanation: string;
};
export type Gates = {
  truthful: boolean;
  authorized: boolean;
  reconciled: boolean;
  accessible: boolean;
  authentic: boolean;
};
export function validateQuestion(q: Question) {
  if (
    !q?.id ||
    !q.prompt ||
    !q.explanation ||
    q.options?.length !== 4 ||
    new Set(q.options.map(o => o.id)).size !== 4 ||
    q.options.some(
      o => !["A", "B", "C", "D"].includes(o.id) || !o.text || !o.rationale
    ) ||
    !q.options.some(o => o.id === q.correct_option)
  )
    throw new Error("Invalid question contract");
  return q;
}
export function publicQuestion(q: Question) {
  return {
    id: q.id,
    prompt: q.prompt,
    options: q.options.map(o => ({ id: o.id, text: o.text })),
  };
}
export function grade(qs: Question[], responses: Record<string, string>) {
  if (
    !qs.length ||
    Object.keys(responses).length !== qs.length ||
    Object.keys(responses).some(id => !qs.some(q => q.id === id))
  )
    throw new Error("Answer every presented question");
  qs.forEach(q => {
    validateQuestion(q);
    if (!q.options.some(o => o.id === responses[q.id]))
      throw new Error("Invalid option");
  });
  const score = qs.filter(q => responses[q.id] === q.correct_option).length;
  return {
    score,
    total: qs.length,
    passed: score >= Math.ceil(qs.length * 0.8),
  };
}
export function rubric(levels: number[], weights?: number[]) {
  if (
    !levels.length ||
    levels.some(l => !Number.isInteger(l) || l < 0 || l > 3) ||
    (weights && (weights.length !== levels.length || weights.some(w => w <= 0)))
  )
    throw new Error("Invalid rubric levels");
  const ws = weights ?? levels.map(() => 1);
  const score =
    levels.reduce((s, l, i) => s + [0, 50, 80, 100][l] * ws[i], 0) /
    ws.reduce((s, w) => s + w, 0);
  return { score, competent: levels.every(l => l >= 2) && score >= 80 };
}
export function gatesPass(g: Gates) {
  return [
    "truthful",
    "authorized",
    "reconciled",
    "accessible",
    "authentic",
  ].every(k => g?.[k as keyof Gates] === true);
}
export function halfway(total: number, verified: number) {
  return total > 0 && verified >= Math.ceil(total / 2);
}
export function evidenceUrl(value: string) {
  const u = new URL(value);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    Array.from(u.searchParams.keys()).some(k =>
      /token|secret|password|signature|sig$|credential|api.?key|sas/i.test(k)
    )
  )
    throw new Error(
      "Use a permission-controlled HTTPS reference without credentials or signed-access parameters"
    );
  return u.toString();
}
export function questionFeedback(q: Question, selected: string) {
  const choice = q.options.find(o => o.id === selected)!;
  return {
    id: q.id,
    correct: selected === q.correct_option,
    correctAnswer: q.options.find(o => o.id === q.correct_option)!.text,
    selectedAnswer: choice.text,
    rationale: choice.rationale,
    explanation: q.explanation,
  };
}
