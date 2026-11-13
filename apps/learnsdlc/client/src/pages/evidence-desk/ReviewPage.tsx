import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Streamdown } from "streamdown";
export default function ReviewPage() {
  const { user } = useAuth();
  const queue = trpc.evidenceDesk.queue.useQuery(undefined, {
    enabled: !!user,
  });
  const [selected, setSelected] = useState("");
  const [learner, setLearner] = useState("");
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [levels, setLevels] = useState<number[]>([]);
  const [gates, setGates] = useState({
    truthful: false,
    authorized: false,
    reconciled: false,
    accessible: false,
    authentic: false,
  });
  const assign = trpc.evidenceDesk.assign.useMutation();
  const judge = trpc.evidenceDesk.judge.useMutation();
  const issue = trpc.evidenceDesk.issue.useMutation();
  const respond = trpc.evidenceDesk.respond.useMutation();
  const release = trpc.evidenceDesk.release.useMutation();
  const retake = trpc.evidenceDesk.allowRetake.useMutation();
  const attempts = trpc.evidenceDesk.instructorAttempts.useQuery(
    { learnerId: Number(learner) || 1 },
    { enabled: !!user && user.role === "admin" && Number(learner) > 0 }
  );
  const sub = queue.data?.submissions.find((s: any) => s.id === selected);
  const course = trpc.evidenceDesk.course.useQuery(
    { courseId: sub?.data.courseId ?? "C01" },
    { enabled: !!sub && sub.data.kind === "course" }
  );
  const labels =
    sub?.data.kind === "technical"
      ? [
          "Source/access and complete extraction",
          "Lineage, grain, history and relationships",
          "Denominator, selection and DAX correctness",
          "Matrix reconciliation and drillback",
          "Usable ethical handoff",
        ]
      : sub?.data.kind === "capstone"
        ? [
            "Decision/business relevance",
            "Audience fit",
            "Evidence/model accuracy",
            "QA management and improvement",
            "Narrative logic and challenge",
            "Visual access",
            "Ethical restraint",
          ]
        : sub?.data.kind === "course"
          ? ((course.data as any)?.practical_completion.reviewer_checks ?? [])
          : [
              sub?.data.kind === "peer"
                ? "Substantive source-linked complete peer review cycle"
                : "Individual changed-scope competence against all topic success checks",
            ];
  async function run(action: () => Promise<unknown>) {
    try {
      await action();
      setMessage(
        "Action recorded. Source evidence and accepted revisions remain auditable."
      );
      queue.refetch();
      attempts.refetch();
    } catch (e: any) {
      setMessage(e.message);
    }
  }
  if (!user) return <p>Sign in to access assigned reviews.</p>;
  return (
    <div className="space-y-7">
      <h1 className="font-serif text-3xl text-primary">Review desk</h1>
      <p>
        Only assigned peers can read and respond to their review cases. Only a
        server-authorized instructor can verify practical competence or issue
        completion. Your registered reviewer ID is <strong>{user.id}</strong>.
      </p>
      <p role="status">{message}</p>
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-primary">
          Your assigned peer reviews
        </h2>
        {queue.error && <p role="alert">{queue.error.message}</p>}
        {queue.data?.reviews.length ? (
          queue.data.reviews
            .filter((r: any) => r.data.type === "peer")
            .map((r: any) => {
              const evidence = queue.data?.submissions.find(
                (s: any) => s.id === r.data.submissionId
              );
              return (
                <Card key={r.id} className="p-5 space-y-3">
                  <p>Review {r.id}</p>
                  {evidence && (
                    <>
                      <a
                        href={evidence.data.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Open assigned permission-controlled evidence
                      </a>
                      <p>{evidence.data.notes}</p>
                    </>
                  )}
                  <PeerResponse
                    review={r}
                    onSave={text =>
                      run(() =>
                        respond.mutateAsync({ reviewId: r.id, response: text })
                      )
                    }
                  />
                </Card>
              );
            })
        ) : (
          <p>
            No reviews have been assigned. A real peer response cannot be
            invented or replaced with your own approval.
          </p>
        )}
      </section>
      {user.role === "admin" && (
        <>
          <section className="space-y-4 border-t pt-6">
            <h2 className="font-serif text-2xl text-primary">
              Instructor intake and evidence judgment
            </h2>
            <label className="block">
              Submitted revision
              <select
                className="ed-input"
                value={selected}
                onChange={e => {
                  setSelected(e.target.value);
                  setLevels([]);
                  setReason("");
                  setGates({
                    truthful: false,
                    authorized: false,
                    reconciled: false,
                    accessible: false,
                    authentic: false,
                  });
                }}
              >
                <option value="">Select a submission</option>
                {queue.data?.submissions.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    Learner {s.ownerId}: {s.data.kind} {s.data.courseId}{" "}
                    {s.data.topicId} — {s.id}
                  </option>
                ))}
              </select>
            </label>
            {sub && (
              <div className="rounded-xl border p-5 space-y-5">
                <p>
                  Mode: {sub.data.connectionMode} · submitted{" "}
                  {new Date(sub.data.createdAt).toLocaleString()}
                </p>
                <a
                  href={sub.data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  Inspect the authorized evidence reference
                </a>
                <p>{sub.data.notes}</p>
                <label className="block">
                  Registered peer reviewer ID
                  <input
                    className="ed-input"
                    type="number"
                    min="1"
                    value={reviewer}
                    onChange={e => setReviewer(e.target.value)}
                  />
                </label>
                <Button
                  variant="outline"
                  onClick={() =>
                    run(() =>
                      assign.mutateAsync({
                        submissionId: sub.id,
                        reviewerId: Number(reviewer),
                        type: "peer",
                      })
                    )
                  }
                  disabled={!Number(reviewer)}
                >
                  Assign actual peer review
                </Button>
                <p className="text-sm">
                  Score each required published criterion. 0 absent/false; 1
                  substantive repair; 2 competent; 3 strong. Every criterion
                  must reach 2. A URL or a passing quiz is not proof of
                  authentic competence.
                </p>
                {labels.map((l: string, i: number) => (
                  <label key={i} className="block space-y-2">
                    <span className="prose prose-sm">
                      <Streamdown>{l}</Streamdown>
                    </span>
                    <select
                      className="ed-input"
                      value={levels[i] ?? ""}
                      onChange={e => {
                        const v = levels.slice();
                        v[i] = Number(e.target.value);
                        setLevels(v);
                      }}
                    >
                      <option value="">Select observed level</option>
                      {[0, 1, 2, 3].map(n => (
                        <option key={n} value={n}>
                          {n} —{" "}
                          {
                            [
                              "Absent/materially false",
                              "Developing/repair",
                              "Competent",
                              "Strong",
                            ][n]
                          }
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
                <fieldset className="space-y-3">
                  <legend className="font-semibold mb-3">
                    Absolute source and accessibility gates
                  </legend>
                  {Object.keys(gates).map(key => (
                    <label key={key} className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={gates[key as keyof typeof gates]}
                        onChange={e =>
                          setGates(v => ({ ...v, [key]: e.target.checked }))
                        }
                      />
                      {key} — verified with actual evidence
                    </label>
                  ))}
                </fieldset>
                <label className="block">
                  Source-linked judgment and repair reason
                  <textarea
                    className="ed-input min-h-28"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                  />
                </label>
                <Button
                  onClick={() =>
                    run(() =>
                      judge.mutateAsync({
                        submissionId: sub.id,
                        levels,
                        gates,
                        reason,
                      })
                    )
                  }
                  disabled={
                    !reason ||
                    levels.filter(x => x !== undefined).length !==
                      labels.length ||
                    judge.isPending
                  }
                >
                  Record instructor judgment
                </Button>
              </div>
            )}
          </section>
          <section className="space-y-4 border-t pt-6">
            <h2 className="font-serif text-2xl text-primary">
              Protected final review and completion
            </h2>
            <label className="block">
              Registered learner ID
              <input
                className="ed-input"
                type="number"
                min="1"
                value={learner}
                onChange={e => setLearner(e.target.value)}
              />
            </label>
            <label className="block">
              Feedback release / remediation review reason
              <textarea
                className="ed-input min-h-24"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </label>
            {attempts.data
              ?.filter(
                (a: any) =>
                  ["final", "program"].includes(a.kind) &&
                  a.status === "submitted"
              )
              .map((a: any) => (
                <Card className="p-4 space-y-3" key={a.id}>
                  <p>
                    {a.key} · {a.score}/{a.total} ·{" "}
                    {a.passed ? "Passed" : "Repair required"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      disabled={!reason}
                      onClick={() =>
                        run(() =>
                          release.mutateAsync({ attemptId: a.id, reason })
                        )
                      }
                    >
                      Release reviewed feedback
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!reason}
                      onClick={() =>
                        run(() =>
                          retake.mutateAsync({ attemptId: a.id, reason })
                        )
                      }
                    >
                      Authorize low-stakes learning repeat
                    </Button>
                  </div>
                </Card>
              ))}
            <Button
              disabled={!Number(learner) || issue.isPending}
              onClick={() =>
                run(() => issue.mutateAsync({ learnerId: Number(learner) }))
              }
            >
              Verify all gates and issue completion certificate
            </Button>
            <p className="text-sm">
              The server rejects issuance until every course, exam,
              technical/capstone rubric, two actual review cycles and all
              absolute gates are satisfied. The result is a training completion
              certificate, not ISO certification.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
function PeerResponse({
  review,
  onSave,
}: {
  review: any;
  onSave: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  return review.data.state === "responded" ? (
    <p>{review.data.response}</p>
  ) : (
    <div className="space-y-3">
      <label className="block">
        Identify two source-linked challenges, their decision impact and a
        repair
        <textarea
          className="ed-input min-h-32"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <Button onClick={() => onSave(text)} disabled={!text.trim()}>
        Submit substantive peer feedback
      </Button>
    </div>
  );
}
