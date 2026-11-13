import { useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { Streamdown } from "streamdown";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  RotateCcw,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import Celebration from "./Celebration";
import ReviewPage from "./ReviewPage";
import "./evidence.css";
const BASE = "/evidence-desk/v3";
const coursePath = (id: string) => `${BASE}/courses/${id}`;
function Title({ children }: { children: string }) {
  useEffect(() => {
    document.title = `${children} | SDLC Academy`;
  }, [children]);
  return (
    <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
      {children}
    </h1>
  );
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
      {children}
    </div>
  );
}
function Waiting({ error }: { error?: any }) {
  return (
    <p role={error ? "alert" : "status"} className="py-8">
      {error
        ? `Unable to load: ${error.message}`
        : "Loading your learning desk…"}
    </p>
  );
}
function SignIn() {
  return (
    <Note>
      Sign in to save work, take protected checks and submit evidence. Reading
      remains available.{" "}
      <Button
        className="mt-3 block"
        onClick={() => window.location.assign(getLoginUrl())}
      >
        Sign in to continue
      </Button>
    </Note>
  );
}
function Prose({ text }: { text: any }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert leading-relaxed">
      <Streamdown>{String(text ?? "")}</Streamdown>
    </div>
  );
}
function Items({ items }: { items: any }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {(Array.isArray(items) ? items : [items])
        .filter(Boolean)
        .map((s: any, i: number) => (
          <li key={i}>
            <Prose text={typeof s === "string" ? s : JSON.stringify(s)} />
          </li>
        ))}
    </ul>
  );
}
function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-4 border-t border-border pt-7">
      <h2 className="font-serif text-2xl text-primary">{title}</h2>
      {children}
    </section>
  );
}
function Overview() {
  const q = trpc.evidenceDesk.catalog.useQuery();
  if (!q.data) return <Waiting error={q.error} />;
  return (
    <div className="space-y-8">
      <p className="uppercase tracking-[.2em] text-xs font-bold text-muted-foreground">
        An original evidence-led learning desk
      </p>
      <Title>Evidence Desk — Azure DevOps QA Measurement</Title>
      <p className="text-lg max-w-3xl leading-relaxed">
        Turn a green dashboard into a defensible decision. Learn QA management,
        build the evidence matrices, query Azure DevOps, and explain what your
        SDLC measures can—and cannot—tell you.
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          ["14", "self-paced micro-courses"],
          ["43", "resumable topic lessons"],
          ["18", "hands-on evidence matrices"],
        ].map(([n, s]) => (
          <Card key={n} className="p-5">
            <strong className="font-serif text-3xl text-primary">{n}</strong>
            <p className="text-sm mt-1">{s}</p>
          </Card>
        ))}
      </div>
      <Note>
        Bring permissioned Azure DevOps data or approved authentic exports.
        Missing evidence stays “Not Measured.” The lessons and templates are
        ready; they are not a live tenant connection, an already-built Power BI
        dashboard, or ISO certification.
      </Note>
      <div className="grid md:grid-cols-2 gap-4">
        {q.data.courses.map((c: any, i: number) => (
          <Card key={c.id} className="p-6 space-y-3">
            <p className="text-xs tracking-widest uppercase text-muted-foreground">
              {c.id} · {c.topics.length} topics
            </p>
            <h2 className="font-serif text-xl text-primary">
              <Link href={coursePath(c.id)}>{c.title}</Link>
            </h2>
            <p className="text-sm leading-relaxed">
              {c.outcomes?.[0] ?? c.introduction.dilemma}
            </p>
            <Link
              href={coursePath(c.id)}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm"
            >
              Open micro-course <ArrowRight size={16} />
            </Link>
          </Card>
        ))}
      </div>
      <Section title="Build four audience-specific dashboards">
        <Items
          items={[
            "Quality decision overview",
            "QA/test operations",
            "SDLC/engineering flow",
            "Quality evidence/compliance-readiness",
          ]}
        />
        <p>
          Each uses your source-based model, reconciled measures, accessible
          text and permitted drillback. The course progress screen is not an
          organizational QA dashboard.
        </p>
      </Section>
      <Section title="How self-paced learning works">
        <p>
          Predict, inspect a diagram, follow a guided build, try a changed
          scope, request a real asynchronous challenge, then recall and repair.
          Short segments are resumable; larger Azure and Power BI labs take
          sustained practice. Knowledge checks are automated. Authentic
          practical competence is instructor-verified.
        </p>
        <p>
          Keep the approved 80% overall threshold and all practical gates. The
          final credential is a training completion certificate, not ISO
          conformity assurance.
        </p>
      </Section>
    </div>
  );
}
function CourseIntro({ id }: { id: string }) {
  const q = trpc.evidenceDesk.course.useQuery({ courseId: id });
  if (!q.data) return <Waiting error={q.error} />;
  const c: any = q.data;
  return (
    <div className="space-y-8">
      <p className="text-xs uppercase tracking-widest">
        {c.course_id} · Self-paced micro-course
      </p>
      <Title>{c.title}</Title>
      <Section title="Reader’s dilemma">
        <blockquote className="border-l-4 border-primary pl-5 font-serif text-xl leading-relaxed">
          {c.introduction.dilemma}
        </blockquote>
      </Section>
      <Section title="The reply">
        <Prose text={c.introduction.reply} />
      </Section>
      <Section title="Course outline">
        <ol className="space-y-3">
          {c.topics.map((t: any, i: number) => (
            <li key={t.topic_id} className="flex gap-4 items-start">
              <span className="font-serif text-xl text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link
                className="text-primary underline underline-offset-4"
                href={`${coursePath(id)}/topics/${t.topic_id}`}
              >
                {t.title}
              </Link>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href={`${coursePath(id)}/checkpoint`}>
            Three-question checkpoint
          </Link>
          <Link href={`${coursePath(id)}/final`}>Separate course final</Link>
          <Link href={`${coursePath(id)}/lab`}>Practical evidence handoff</Link>
        </div>
        <Link
          className="inline-flex items-center gap-3 rounded-md bg-primary text-primary-foreground px-5 py-3 font-semibold"
          href={`${coursePath(id)}/topics/${c.introduction.start_topic_id}`}
        >
          Start this micro-course <ArrowRight size={18} />
        </Link>
      </Section>
    </div>
  );
}
function Practice({
  courseId,
  topicId,
  prompt,
  feedbackId,
  title,
  returnDay,
}: {
  courseId: string;
  topicId: string;
  prompt: string;
  feedbackId: string;
  title: string;
  returnDay?: 1 | 7 | 21;
}) {
  const { user } = useAuth();
  const [response, setResponse] = useState("");
  const [result, setResult] = useState<any>();
  const [error, setError] = useState("");
  const practice = trpc.evidenceDesk.practice.useMutation();
  const learning = trpc.evidenceDesk.learning.useMutation();
  async function check() {
    setError("");
    try {
      const r = await practice.mutateAsync({
        courseId,
        topicId,
        feedbackId,
        response,
      });
      await learning.mutateAsync({ courseId, topicId, response, returnDay });
      setResult(r);
    } catch (e: any) {
      setError(e.message);
    }
  }
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h3 className="font-semibold">{title}</h3>
      <Prose text={prompt} />
      <label className="block text-sm font-semibold" htmlFor={feedbackId}>
        Commit your answer before viewing feedback
      </label>
      <textarea
        id={feedbackId}
        className="ed-input min-h-24"
        value={response}
        onChange={e => setResponse(e.target.value)}
        disabled={!user}
      />
      <Button
        onClick={check}
        disabled={!user || !response.trim() || practice.isPending}
      >
        Save response and compare
      </Button>
      {!user && <p className="text-sm">Sign in to use saved practice.</p>}
      {error && <p role="alert">{error}</p>}
      {result && (
        <div role="status" className="space-y-2 border-l-4 border-primary pl-4">
          <strong>Evidence Desk comparison</strong>
          <Prose text={result.expected} />
          <Prose text={result.correction} />
          <p className="text-xs">{result.evaluation}</p>
        </div>
      )}
    </div>
  );
}
function TopicPage({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) {
  const q = trpc.evidenceDesk.topic.useQuery({ courseId, topicId });
  const c = trpc.evidenceDesk.course.useQuery({ courseId });
  const { user } = useAuth();
  const p = trpc.evidenceDesk.progress.useQuery(undefined, { enabled: !!user });
  const resume = trpc.evidenceDesk.resume.useMutation();
  const [saved, setSaved] = useState("");
  const [location] = useLocation();
  if (!q.data || !c.data) return <Waiting error={q.error ?? c.error} />;
  const t: any = q.data;
  const course: any = c.data;
  const at = course.topics.findIndex((x: any) => x.topic_id === topicId);
  const next = course.topics[at + 1];
  async function save() {
    try {
      const latest = await p.refetch();
      await resume.mutateAsync({
        route: location,
        section: "guided-build",
        scrollY: window.scrollY,
        revision: latest.data?.revision ?? 0,
      });
      setSaved("Exact location saved. Use My progress to resume.");
    } catch (e: any) {
      setSaved(e.message);
    }
  }
  return (
    <div className="space-y-8">
      <p className="text-xs uppercase tracking-widest">
        {courseId} · Topic {at + 1} of {course.topics.length}
      </p>
      <Title>{t.title}</Title>
      <nav
        aria-label="Topic navigation"
        className="flex flex-wrap gap-4 text-sm"
      >
        <Link href={coursePath(courseId)}>Course introduction</Link>
        <a href="#guided-build">Guided build</a>
        <a href="#topic-quiz">Knowledge check</a>
        {at > 0 && (
          <Link
            href={`${coursePath(courseId)}/topics/${course.topics[at - 1].topic_id}`}
          >
            Previous topic
          </Link>
        )}
      </nav>
      <Practice
        key={`${topicId}-predict`}
        courseId={courseId}
        topicId={topicId}
        title="Before you read: make a prediction"
        prompt={t.prediction.prompt}
        feedbackId={t.prediction.feedback_ref}
      />
      <Section title="The Evidence Desk lecture">
        <Prose text={t.lecture_markdown} />
      </Section>
      <Section title="Trace the visual">
        <figure className="space-y-4">
          <img
            src={t.visual.src}
            alt={t.visual.alt}
            className="w-full rounded-lg border bg-white"
          />
          <figcaption>
            <Prose text={t.visual.trace_prompt} />
          </figcaption>
        </figure>
        <details className="ed-details">
          <summary>Full text equivalent of the diagram</summary>
          <Prose text={t.visual.text_equivalent} />
        </details>
      </Section>
      <Section title="Guided tool build" id="guided-build">
        <Items items={t.walkthrough.preconditions} />
        <ol className="space-y-5">
          {t.walkthrough.steps.map((s: any, i: number) => (
            <li key={i} className="rounded-lg border p-5 space-y-3">
              <h3 className="font-semibold">
                Step {i + 1}: {s.title}
              </h3>
              <Prose text={s.instructions} />
              <Note>
                <strong>Save this output:</strong>{" "}
                <Prose text={s.checkpoint_output} />
              </Note>
            </li>
          ))}
        </ol>
        <h3 className="font-semibold">Build completion checks</h3>
        <Items items={t.walkthrough.completion_checks} />
        <Button onClick={save} disabled={!user}>
          Save my exact reading position
        </Button>
        <p role="status" className="text-sm">
          {saved}
        </p>
      </Section>
      <Section title="Your turn">
        <Prose text={t.your_turn.task} />
        <Note>
          <strong>Change the condition:</strong>
          <Prose text={t.your_turn.changed_condition} />
        </Note>
        <h3 className="font-semibold">Submit your own work</h3>
        <Items items={t.your_turn.submission} />
        <Items items={t.your_turn.success_checks} />
        <Link
          className="text-primary underline"
          href={`${BASE}/portfolio?course=${courseId}&topic=${topicId}`}
        >
          Submit private evidence for this topic
        </Link>
        <p className="text-sm">
          Matrix IDs: {t.matrix_ids.join(", ")}.{" "}
          <Link href={`${BASE}/resources`} className="underline">
            Download the exact-schema kits
          </Link>
          .
        </p>
      </Section>
      <Section title="Asynchronous challenge">
        <Items items={t.asynchronous_review.self_review_steps} />
        <Prose text={t.asynchronous_review.request_prompt} />
        <Prose text={t.asynchronous_review.reviewer_prompt} />
        <Items items={t.asynchronous_review.required_real_evidence} />
        <Note>
          <Prose text={t.asynchronous_review.pending_message} />
        </Note>
        <p>
          Use Portfolio to submit a permission-controlled reference. An
          instructor assigns an actual reviewer. Self-review and generated
          replies do not count as real peer participation.
        </p>
      </Section>
      <Practice
        key={`${topicId}-recall`}
        courseId={courseId}
        topicId={topicId}
        title="Recall before looking back"
        prompt={t.recall.prompt}
        feedbackId={t.recall.feedback_ref}
      />
      <Section title="Topic knowledge check" id="topic-quiz">
        <p>
          Three questions; all three must pass. This records knowledge—not
          verified practical evidence.
        </p>
        <Assessment
          key={topicId}
          kind="topic"
          courseId={courseId}
          topicId={topicId}
        />
      </Section>
      <Section title="Practice games — untimed and ungraded">
        {t.games.map((g: any) => (
          <div
            key={g.id}
            data-practice-game
            className="space-y-4 rounded-xl border p-5"
          >
            <h3 className="font-serif text-xl text-primary">{g.title}</h3>
            <Prose text={g.objective} />
            <Prose text={g.rules} />
            {g.rounds.map((r: any, i: number) => (
              <Practice
                key={r.feedback_ref}
                courseId={courseId}
                topicId={topicId}
                title={`Round ${i + 1}`}
                prompt={r.prompt}
                feedbackId={r.feedback_ref}
              />
            ))}
            <Prose text={g.scoring} />
            <details className="ed-details">
              <summary>Accessible alternative</summary>
              <Prose text={g.accessible_alternative} />
            </details>
          </div>
        ))}
      </Section>
      <Section title="Return, recall, repair">
        <p>
          Flexible practice at about one, seven and twenty-one days. No
          deadline, score penalty or external reminder has been installed.
        </p>
        {t.returns.map((r: any) => (
          <Practice
            key={r.feedback_ref}
            courseId={courseId}
            topicId={topicId}
            title={`Return at approximately +${r.offset_days} days`}
            prompt={r.prompt}
            feedbackId={r.feedback_ref}
            returnDay={r.offset_days}
          />
        ))}
        <Prose text={t.remediation.task} />
        <Prose text={t.remediation.recheck} />
        <Prose text={t.stretch} />
      </Section>
      <details className="ed-details">
        <summary>Accessibility and truthful evidence notes</summary>
        <Items items={t.accessibility} />
      </details>
      <div className="flex flex-wrap gap-4">
        <Link
          href={
            next
              ? `${coursePath(courseId)}/topics/${next.topic_id}`
              : `${coursePath(courseId)}/checkpoint`
          }
          className="text-primary font-semibold underline"
        >
          {next ? `Next: ${next.title}` : "Continue to course checkpoint"}
        </Link>
        <Link href={`${coursePath(courseId)}/lab`} className="underline">
          Course practical handoff
        </Link>
      </div>
    </div>
  );
}
function Assessment({
  kind,
  courseId,
  topicId,
}: {
  kind: "topic" | "checkpoint" | "final" | "program";
  courseId?: string;
  topicId?: string;
}) {
  const { user } = useAuth();
  const [a, setA] = useState<any>();
  const [responses, setResponses] = useState<
    Record<string, "A" | "B" | "C" | "D">
  >({});
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const start = trpc.evidenceDesk.start.useMutation();
  const save = trpc.evidenceDesk.save.useMutation();
  const submit = trpc.evidenceDesk.submit.useMutation();
  const utils = trpc.useUtils();
  async function begin() {
    setError("");
    try {
      const r = await start.mutateAsync({ kind, courseId, topicId });
      setA(r);
      setResponses(r.responses);
      setConfirm(false);
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function persist() {
    const r = await save.mutateAsync({
      attemptId: a.id,
      revision: a.revision,
      responses,
    });
    setA(r);
    return r;
  }
  async function saveDraft() {
    setError("");
    try {
      await persist();
      setError(
        "Draft saved. Start/resume reopens this exact form and answers."
      );
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function finish() {
    setError("");
    try {
      const s = await persist();
      const result = await submit.mutateAsync({
        attemptId: a.id,
        revision: s.revision,
      });
      setA(result);
      setConfirm(false);
      utils.evidenceDesk.progress.invalidate();
    } catch (e: any) {
      setError(e.message);
    }
  }
  if (!user) return <SignIn />;
  return (
    <div className="space-y-5">
      {!a && (
        <Button onClick={begin} disabled={start.isPending}>
          Start or resume{" "}
          {kind === "topic"
            ? "topic quiz"
            : kind === "program"
              ? "program final"
              : kind}
        </Button>
      )}
      {error && (
        <p role="alert" className="text-sm">
          {error}
        </p>
      )}
      {a && (
        <>
          <p className="text-sm">
            Content {a.version} · {a.total} questions ·{" "}
            {a.status === "draft"
              ? "Untimed saved attempt"
              : "Submitted attempt"}
          </p>
          {a.retakeMode && (
            <Note>
              This is a learning repeat of a disclosed identical form, not a
              secure alternate exam.
            </Note>
          )}
          {a.questions.map((q: any, i: number) => (
            <fieldset
              key={q.id}
              className="rounded-xl border p-5 space-y-3"
              disabled={a.status === "submitted"}
            >
              <legend className="font-semibold px-2">Question {i + 1}</legend>
              <Prose text={q.prompt} />
              {q.options.map((o: any) => (
                <label
                  key={o.id}
                  className="flex gap-3 rounded-md border p-3 cursor-pointer min-h-11"
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={responses[q.id] === o.id}
                    onChange={() => {
                      setResponses(v => ({ ...v, [q.id]: o.id }));
                      setConfirm(false);
                    }}
                    className="mt-1"
                  />
                  <span>
                    {o.id}. {o.text}
                  </span>
                </label>
              ))}
            </fieldset>
          ))}
          {a.status === "draft" ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={saveDraft}
                disabled={save.isPending}
              >
                Save draft
              </Button>
              <p>
                {Object.keys(responses).length} of {a.total} questions answered.
              </p>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={confirm}
                  onChange={e => setConfirm(e.target.checked)}
                />
                I have reviewed my answers and want to submit this attempt.
              </label>
              <Button
                onClick={finish}
                disabled={
                  !confirm ||
                  Object.keys(responses).length !== a.total ||
                  save.isPending ||
                  submit.isPending
                }
              >
                Submit final answers
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                role="status"
                className={`rounded-xl border-2 p-5 ${a.passed ? "border-emerald-700" : "border-red-700"}`}
              >
                <p className="font-serif text-xl flex items-center gap-2">
                  {a.passed ? (
                    <CheckCircle2 aria-hidden />
                  ) : (
                    <RotateCcw aria-hidden />
                  )}
                  {a.passed
                    ? "Approved — knowledge check passed"
                    : "Retry — review the premise and repair"}
                </p>
                <p>
                  {a.score} / {a.total}. Practical acceptance remains separate.
                </p>
              </div>
              {a.feedback ? (
                a.feedback.map((f: any) => (
                  <div key={f.id} className="rounded-lg border p-4 space-y-2">
                    <strong>
                      {f.correct ? "Approved" : "Repair this premise"}
                    </strong>
                    <p>
                      <strong>Correct answer:</strong> {f.correctAnswer}
                    </p>
                    <p>
                      <strong>You chose:</strong> {f.selectedAnswer}
                    </p>
                    <Prose text={f.rationale} />
                    <Prose text={f.explanation} />
                  </div>
                ))
              ) : (
                <Note>
                  Protected final explanations are held for instructor review.
                  Your score is saved; keys are not released by a browser
                  setting.
                </Note>
              )}
              {a.memoryText && (
                <details className="ed-details">
                  <summary>Memory explanation — text equivalent</summary>
                  <Prose text={a.memoryText} />
                  <p className="text-xs">
                    Script-based equivalent; no recorded video is claimed.
                  </p>
                </details>
              )}
              <Button variant="outline" onClick={begin}>
                Request another attempt
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
function AssessmentPage({
  courseId,
  kind,
}: {
  courseId?: string;
  kind: "checkpoint" | "final" | "program";
}) {
  return (
    <div className="space-y-7">
      <Title>
        {kind === "program"
          ? "Program scenario final"
          : `${courseId} — ${kind === "checkpoint" ? "Course checkpoint" : "Separate course final"}`}
      </Title>
      <Note>
        {kind === "checkpoint"
          ? "Checkpoint: three different questions, requiring 3/3."
          : "Final explanations remain protected until instructor-authorized release. Course final requires 4/5; program final requires 29/36. Retakes need reviewed remediation."}{" "}
        Tests are untimed. A quiz does not certify an authentic build.
      </Note>
      <Assessment key={`${courseId}-${kind}`} kind={kind} courseId={courseId} />
    </div>
  );
}
function Resources() {
  const q = trpc.evidenceDesk.resources.useQuery();
  if (!q.data) return <Waiting error={q.error} />;
  return (
    <div className="space-y-7">
      <Title>Matrix kits and evidence resources</Title>
      <Note>
        These are blank/scaffolded templates and local measure definitions, not
        already-measured organizational results. Preserve exact columns, grains
        and formulas. Build with authorized Azure source evidence in Excel,
        Power Query and Power BI.
      </Note>
      <div className="grid sm:grid-cols-2 gap-4">
        {q.data.assets
          .filter((a: any) => a.kind === "template")
          .map((a: any) => (
            <Card key={a.name} className="p-5">
              <FileSpreadsheet className="text-primary mb-3" />
              <a
                className="text-primary underline font-semibold"
                href={a.url}
                download
              >
                {a.name}
              </a>
            </Card>
          ))}
      </div>
      <Section title="The eighteen matrix builds">
        {q.data.matrices.map((m: any) => (
          <details key={m.id} className="ed-details">
            <summary>
              {m.id} — {m.name}
            </summary>
            <div className="mt-3 space-y-3">
              <p>
                <strong>Grain:</strong> {m.grain}
              </p>
              <p>
                <strong>Workbook/sheet:</strong> {m.workbook} / {m.sheet}
              </p>
              <p>
                <strong>Exact columns:</strong> {m.columns.join(", ")}
              </p>
              <Prose text={m.note} />
            </div>
          </details>
        ))}
      </Section>
    </div>
  );
}
function Lab({ id }: { id: string }) {
  const q = trpc.evidenceDesk.course.useQuery({ courseId: id });
  if (!q.data) return <Waiting error={q.error} />;
  const c: any = q.data;
  return (
    <div className="space-y-7">
      <Title>{`${id} — Practical evidence handoff`}</Title>
      <Section title="What to submit">
        <Items items={c.practical_completion.submission} />
      </Section>
      <Section title="Instructor acceptance criteria">
        <Items items={c.practical_completion.reviewer_checks} />
      </Section>
      <Note>
        No authentic core data means assessment pending, not a successful
        zero-data build. Passing the course final cannot override source,
        privacy, reproducibility or accessibility gates.
      </Note>
      <Link
        className="text-primary underline"
        href={`${BASE}/portfolio?course=${id}`}
      >
        Open private portfolio submission
      </Link>
    </div>
  );
}
function Progress() {
  const { user } = useAuth();
  const q = trpc.evidenceDesk.progress.useQuery(undefined, { enabled: !!user });
  if (!user) return <SignIn />;
  if (!q.data) return <Waiting error={q.error} />;
  const p = q.data;
  return (
    <div className="space-y-7">
      <Title>My evidence learning progress</Title>
      <Note>
        {p.complete} of {p.total} micro-courses verified complete. Overall
        assessment: {p.overall.toFixed(1)}%. Missing practical judgments remain
        pending; this is not a team productivity ranking.
      </Note>
      {p.resume && (
        <Link
          className="text-primary underline font-semibold"
          href={p.resume.route}
          onClick={() =>
            setTimeout(() => window.scrollTo(0, p.resume.scrollY), 300)
          }
        >
          Resume my saved topic position
        </Link>
      )}
      <div className="space-y-3">
        {p.courses.map((c: any) => (
          <Card className="p-5 space-y-2" key={c.id}>
            <Link
              className="font-serif text-xl text-primary"
              href={coursePath(c.id)}
            >
              {c.id} — {c.title}
            </Link>
            <p className="text-sm">
              Knowledge: {c.knowledgePassed}/{c.total} · Individually verified:{" "}
              {c.verified}/{c.total} · Checkpoint:{" "}
              {c.checkpointPassed ? "passed" : "pending"} · Final:{" "}
              {c.finalPassed ? "passed" : "pending"} · Practical:{" "}
              {c.performanceAccepted ? "accepted" : "pending"}
            </p>
            <details className="ed-details">
              <summary>Topic evidence states</summary>
              {c.topics.map((t: any) => (
                <p key={t.id} className="py-2">
                  <Link
                    href={`${coursePath(c.id)}/topics/${t.id}`}
                    className="underline"
                  >
                    {t.title}
                  </Link>{" "}
                  —{" "}
                  {t.verified
                    ? "Verified complete"
                    : t.submitted
                      ? "Evidence submitted / awaiting review"
                      : t.knowledge
                        ? "Knowledge passed"
                        : "Not yet knowledge-passed"}
                </p>
              ))}
            </details>
          </Card>
        ))}
      </div>
      <Section title="Flexible retrieval returns">
        <p>
          Open a started topic and recall at approximately +1, +7 and +21 days.
          Returns are formative, never expiry conditions.
        </p>
        {Object.entries(p.learning).map(([id, t]: [string, any]) => (
          <p key={id}>
            Topic {id}: started {new Date(t.startedAt).toLocaleDateString()} ·
            return records{" "}
            {Object.keys(t.returns ?? {}).join(", ") || "not yet recorded"}
          </p>
        ))}
      </Section>
      <Section title="Saved milestones">
        {p.milestones.length ? (
          p.milestones.map((m: any) => (
            <Celebration key={m.id} milestone={m.text} />
          ))
        ) : (
          <p>
            Milestones appear after verified topic/course requirements, not
            visits, game points or video timers.
          </p>
        )}
      </Section>
      {p.credential && (
        <Card className="p-6 space-y-3">
          <h2 className="font-serif text-2xl">{p.credential.title}</h2>
          <p>
            Certificate {p.credential.certificateId} · issued{" "}
            {new Date(p.credential.issuedAt).toLocaleDateString()}
          </p>
          <p>{p.credential.disclaimer}</p>
          <Button onClick={() => window.print()}>
            Print completion record
          </Button>
        </Card>
      )}
    </div>
  );
}
function Portfolio() {
  const { user } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const [kind, setKind] = useState<
    "topic" | "course" | "technical" | "capstone" | "peer"
  >(
    params.has("topic")
      ? "topic"
      : params.has("course")
        ? "course"
        : "technical"
  );
  const [courseId, setCourse] = useState(params.get("course") ?? "C01");
  const [topicId, setTopic] = useState(params.get("topic") ?? "1.1");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [parentId, setParent] = useState("");
  const [cycleReviewId, setCycle] = useState("");
  const [mode, setMode] = useState<
    "authentic_export" | "live_authorized" | "pending_source"
  >("pending_source");
  const [message, setMessage] = useState("");
  const q = trpc.evidenceDesk.submissions.useQuery(undefined, {
    enabled: !!user,
  });
  const cat = trpc.evidenceDesk.catalog.useQuery();
  const mutation = trpc.evidenceDesk.evidence.useMutation();
  const author = trpc.evidenceDesk.authorResponse.useMutation();
  async function submit() {
    try {
      await mutation.mutateAsync({
        kind,
        courseId: ["topic", "course"].includes(kind) ? courseId : undefined,
        topicId: kind === "topic" ? topicId : undefined,
        url,
        notes,
        connectionMode: mode,
        parentId: parentId || undefined,
        cycleReviewId: kind === "peer" ? cycleReviewId : undefined,
      });
      setMessage(
        "Evidence reference submitted. It is awaiting an actual review, not automatically verified."
      );
      q.refetch();
    } catch (e: any) {
      setMessage(e.message);
    }
  }
  if (!user) return <SignIn />;
  const topics =
    cat.data?.courses.find((c: any) => c.id === courseId)?.topics ?? [];
  return (
    <div className="space-y-7">
      <Title>Private portfolio and review trail</Title>
      <Note>
        Use recipient-controlled HTTPS evidence references only. Do not paste
        Azure credentials, SAS/token links, confidential raw rows or
        public-gallery links. The portal does not fetch your URL. Confirm that
        assigned reviewers have authorized access. An instructor must verify the
        source and every gate.
      </Note>
      <div className="space-y-4 rounded-xl border p-5">
        <label className="block">
          Submission kind
          <select
            className="ed-input"
            value={kind}
            onChange={e => setKind(e.target.value as any)}
          >
            {["topic", "course", "technical", "capstone", "peer"].map(k => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        {["topic", "course"].includes(kind) && (
          <label className="block">
            Micro-course
            <select
              className="ed-input"
              value={courseId}
              onChange={e => {
                setCourse(e.target.value);
                setTopic(
                  cat.data?.courses.find((c: any) => c.id === e.target.value)
                    ?.topics[0].id ?? ""
                );
              }}
            >
              {cat.data?.courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title}
                </option>
              ))}
            </select>
          </label>
        )}
        {kind === "topic" && (
          <label className="block">
            Topic
            <select
              className="ed-input"
              value={topicId}
              onChange={e => setTopic(e.target.value)}
            >
              {topics.map((t: any) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="block">
          Truthful connection mode
          <select
            className="ed-input"
            value={mode}
            onChange={e => setMode(e.target.value as any)}
          >
            <option value="pending_source">
              Pending authentic source — cannot be accepted as completed
              evidence
            </option>
            <option value="authentic_export">
              Approved authentic-export build
            </option>
            <option value="live_authorized">
              Authorized live-source build
            </option>
          </select>
        </label>
        <label className="block">
          Permission-controlled evidence reference
          <input
            className="ed-input"
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </label>
        <label className="block">
          Evidence index, source boundary and reviewer-access notes
          <textarea
            className="ed-input min-h-32"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </label>
        <label className="block">
          Previous submission ID, only for a corrected revision
          <input
            className="ed-input"
            value={parentId}
            onChange={e => setParent(e.target.value)}
          />
        </label>
        {kind === "peer" && (
          <label className="block">
            Completed assigned review ID for this cycle
            <input
              className="ed-input"
              value={cycleReviewId}
              onChange={e => setCycle(e.target.value)}
            />
          </label>
        )}
        <Button
          onClick={submit}
          disabled={!url || !notes || mutation.isPending}
        >
          Submit evidence reference
        </Button>
        <p role="status">{message}</p>
      </div>
      <Section title="Your submissions and feedback">
        {q.data?.map((s: any) => (
          <Card key={s.id} className="p-5 space-y-3">
            <strong>
              {s.data.kind} · {s.data.courseId} {s.data.topicId}
            </strong>
            <p className="text-xs break-all">Submission ID: {s.id}</p>
            <a
              href={s.data.url}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Open your permission-controlled evidence
            </a>
            <p>{s.data.notes}</p>
            <details className="ed-details">
              <summary>Published acceptance checks</summary>
              <Items items={s.labels} />
            </details>
            {s.reviews.length ? (
              s.reviews.map((r: any) => (
                <div
                  key={r.id}
                  className="border-l-4 border-primary pl-4 space-y-2"
                >
                  <p>
                    {r.data.type === "instructor"
                      ? r.data.accepted
                        ? "Instructor accepted this revision"
                        : "Instructor requested repair"
                      : r.data.state === "responded"
                        ? "Peer feedback received"
                        : "Awaiting assigned peer feedback"}
                  </p>
                  <p>{r.data.reason ?? r.data.response}</p>
                  <p className="text-xs">Review ID: {r.id}</p>
                  {r.data.type === "peer" && r.data.state === "responded" && (
                    <AuthorReply
                      review={r}
                      onSave={async text => {
                        try {
                          await author.mutateAsync({
                            reviewId: r.id,
                            response: text,
                          });
                          q.refetch();
                        } catch (e: any) {
                          setMessage(e.message);
                        }
                      }}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm">
                Awaiting instructor intake or an assigned reviewer.
              </p>
            )}
          </Card>
        ))}
      </Section>
    </div>
  );
}
function AuthorReply({
  review,
  onSave,
}: {
  review: any;
  onSave: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(review.data.authorResponse ?? "");
  return (
    <div className="space-y-2">
      <label className="block">
        Your source-linked response and revision account
        <textarea
          className="ed-input min-h-24"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <Button
        variant="outline"
        onClick={() => onSave(text)}
        disabled={!text.trim()}
      >
        Save author response
      </Button>
    </div>
  );
}
export default function EvidenceDesk() {
  const [location] = useLocation();
  return (
    <Layout singleMount>
      <div className="space-y-8 max-w-5xl mx-auto ed-root">
        <nav
          aria-label="Evidence Desk program navigation"
          className="flex flex-wrap gap-x-5 gap-y-3 text-sm border-b pb-5"
        >
          <Link
            href={BASE}
            aria-current={location === BASE ? "page" : undefined}
          >
            Program
          </Link>
          <Link href={`${BASE}/resources`}>Matrix kits</Link>
          <Link href={`${BASE}/progress`}>My progress</Link>
          <Link href={`${BASE}/portfolio`}>Portfolio</Link>
          <Link href={`${BASE}/reviews`}>Review desk</Link>
          <Link href={`${BASE}/exam`}>Program final</Link>
        </nav>
        <Switch>
          <Route path={`${BASE}/courses/:courseId/topics/:topicId`}>
            {p => (
              <TopicPage
                key={`${p.courseId}-${p.topicId}`}
                courseId={p.courseId}
                topicId={p.topicId}
              />
            )}
          </Route>
          <Route path={`${BASE}/courses/:courseId/checkpoint`}>
            {p => <AssessmentPage courseId={p.courseId} kind="checkpoint" />}
          </Route>
          <Route path={`${BASE}/courses/:courseId/final`}>
            {p => <AssessmentPage courseId={p.courseId} kind="final" />}
          </Route>
          <Route path={`${BASE}/courses/:courseId/lab`}>
            {p => <Lab id={p.courseId} />}
          </Route>
          <Route path={`${BASE}/courses/:courseId`}>
            {p => <CourseIntro id={p.courseId} />}
          </Route>
          <Route path={`${BASE}/resources`} component={Resources} />
          <Route path={`${BASE}/progress`} component={Progress} />
          <Route path={`${BASE}/portfolio`} component={Portfolio} />
          <Route path={`${BASE}/reviews`} component={ReviewPage} />
          <Route path={`${BASE}/exam`}>
            {() => <AssessmentPage kind="program" />}
          </Route>
          <Route path={BASE} component={Overview} />
          <Route>
            <div>
              <Title>Learning page not found</Title>
              <Link href={BASE}>Return to the program</Link>
            </div>
          </Route>
        </Switch>
        <footer className="border-t pt-6 text-xs leading-relaxed text-muted-foreground">
          Original Evidence Desk teaching. Source-based measures inform
          improvement; they do not establish ISO conformity.{" "}
          <details className="mt-3">
            <summary>EvidenceAppeal.example — fictional learning help</summary>
            <p className="mt-2">
              This internal learning-help label is fictional, not a website or
              legal appeal service. Revisit the source boundary, repair the
              relevant matrix or request instructor clarification in your review
              record.
            </p>
          </details>
        </footer>
      </div>
    </Layout>
  );
}
