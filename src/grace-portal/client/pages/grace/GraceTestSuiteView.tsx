/**
 * GRACE Test Suite View — CSC-GRACE-AI v1.2
 * Two tabs:
 *   - Active Suites: view, approve, export DDD v5.1 test condition suites
 *   - Library: all approved/published suites with version history and re-run
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Download, ChevronDown, ChevronRight, CheckCircle2, XCircle, Clock, AlertTriangle,
  ThumbsDown, BookOpen, RefreshCw, GitBranch, ExternalLink, GitCommit, FlaskConical, GitPullRequest,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_ICON: Record<string, React.ReactNode> = {
  passed: <CheckCircle2 className="h-4 w-4 text-green-500" aria-label="Passed" />,
  failed: <XCircle className="h-4 w-4 text-red-500" aria-label="Failed" />,
  pending: <Clock className="h-4 w-4 text-gray-400" aria-label="Pending" />,
  blocked: <AlertTriangle className="h-4 w-4 text-amber-500" aria-label="Blocked" />,
  skipped: <Clock className="h-4 w-4 text-muted-foreground" aria-label="Skipped" />,
};

const TEST_TYPE_COLORS: Record<string, string> = {
  functional: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  negative: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  boundary: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  integration: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  performance: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  security: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  accessibility: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
};

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved" || status === "completed") return "default";
  if (status === "rejected") return "destructive";
  if (status === "pending_review" || status === "executing") return "secondary";
  return "outline";
}

// ── Active Suites Tab ─────────────────────────────────────────────────────────

function ActiveSuitesTab() {
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("suiteId");
    return id ? parseInt(id, 10) : null;
  });
  const [expandedConditions, setExpandedConditions] = useState<Set<number>>(new Set());
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [gitDialogOpen, setGitDialogOpen] = useState(false);
  const [gitStrategy, setGitStrategy] = useState<"main" | "branch">("main");
  const adoConnections = trpc.graceSettings.listAdoConnections.useQuery();
  const [selectedAdoConnId, setSelectedAdoConnId] = useState<string>("");

  // Sync URL param when selection changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedSuiteId) {
      url.searchParams.set("suiteId", String(selectedSuiteId));
    } else {
      url.searchParams.delete("suiteId");
    }
    window.history.replaceState(null, "", url.toString());
  }, [selectedSuiteId]);

  const utils = trpc.useUtils();
  const { data: suites, isLoading: suitesLoading } = trpc.graceTestSuite.list.useQuery({ workItemId: undefined });
  const { data: suite, isLoading: suiteLoading } = trpc.graceTestSuite.byId.useQuery(
    { id: selectedSuiteId! },
    { enabled: selectedSuiteId !== null }
  );
  const { data: schedule } = trpc.graceTestSuite.schedule.useQuery(
    { suiteId: selectedSuiteId! },
    { enabled: selectedSuiteId !== null }
  );

  const exportMutation = trpc.graceTestSuite.exportXls.useMutation({
    onSuccess: (result) => {
      toast.success("Export ready");
      window.open(result.url, "_blank");
    },
    onError: (e) => toast.error(e.message),
  });

  const approveMutation = trpc.graceTestSuite.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Suite approved.");
      utils.graceTestSuite.byId.invalidate();
      utils.graceTestSuite.list.invalidate();
      utils.graceTestSuite.listLibrary.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const publishToGitMutation = trpc.graceTestSuite.publishToGit.useMutation({
    onSuccess: (result) => {
      toast.success(
        result.prUrl
          ? `Branch created — PR ready: ${result.branch}`
          : `Committed to ${result.branch} (${result.commitSha?.slice(0, 7)})`
      );
      if (result.prUrl) window.open(result.prUrl, "_blank");
      setGitDialogOpen(false);
      utils.graceTestSuite.byId.invalidate();
      utils.graceTestSuite.listLibrary.invalidate();
    },
    onError: (e) => toast.error(`Git publish failed: ${e.message}`),
  });

  const rejectMutation = trpc.graceTestSuite.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Suite rejected.");
      setRejectDialogOpen(false);
      setRejectReason("");
      utils.graceTestSuite.byId.invalidate();
      utils.graceTestSuite.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  function toggleCondition(id: number) {
    setExpandedConditions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Suite Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedSuiteId?.toString() ?? ""}
          onValueChange={(v) => setSelectedSuiteId(v ? parseInt(v) : null)}
        >
          <SelectTrigger className="w-80" aria-label="Select test suite">
            <SelectValue placeholder={suitesLoading ? "Loading…" : "Select a test suite…"} />
          </SelectTrigger>
          <SelectContent>
            {suites?.map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name} [{s.status}]
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSuiteId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportMutation.mutate({ suiteId: selectedSuiteId })}
            disabled={exportMutation.isPending}
            aria-label="Export test suite to XLSX"
          >
            <Download className="h-3 w-3 mr-2" />
            {exportMutation.isPending ? "Exporting…" : "Export XLSX"}
          </Button>
        )}
        {suite && (suite.status === "draft" || suite.status === "pending_review") && (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => approveMutation.mutate({ id: suite.id, status: "approved" })}
              disabled={approveMutation.isPending}
              aria-label="Approve test suite"
            >
              <CheckCircle2 className="h-3 w-3 mr-2" /> Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setRejectDialogOpen(true)}
              aria-label="Reject test suite"
            >
              <ThumbsDown className="h-3 w-3 mr-2" /> Reject
            </Button>
          </>
        )}
        {suite && suite.status === "approved" && (
          <Button
            size="sm"
            variant="outline"
            className="border-violet-300 text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950"
            onClick={() => setGitDialogOpen(true)}
            aria-label="Publish suite XLSX to ADO Git"
          >
            <GitPullRequest className="h-3 w-3 mr-2" /> Publish to Git
          </Button>
        )}
      </div>

      {/* Suite Details */}
      {suiteLoading && <div className="text-center py-8 text-muted-foreground">Loading suite…</div>}

      {suite && (
        <div className="space-y-4">
          {/* Suite Header */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{suite.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{suite.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={statusBadgeVariant(suite.status)} className="capitalize">{suite.status}</Badge>
                  {suite.libraryStatus === "library" && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <BookOpen className="h-3 w-3" /> Library v{suite.libraryVersion ?? 1}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Application</dt>
                  <dd className="font-medium">{suite.applicationName ?? "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Environment</dt>
                  <dd className="font-medium">{suite.environment}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Browsers</dt>
                  <dd className="font-medium">{Array.isArray(suite.browserMatrix) ? (suite.browserMatrix as string[]).join(", ") : "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Conditions</dt>
                  <dd className="font-medium">{suite.conditions?.length ?? 0}</dd>
                </div>
              </dl>
              {/* ADO / Git badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {suite.adoTestPlanId && (
                  <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-300">
                    <FlaskConical className="h-3 w-3" /> ADO Plan #{suite.adoTestPlanId}
                  </Badge>
                )}
                {suite.adoTestSuiteId && (
                  <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-300">
                    <FlaskConical className="h-3 w-3" /> ADO Suite #{suite.adoTestSuiteId}
                  </Badge>
                )}
                {suite.gitCommitSha && (
                  <Badge variant="outline" className="text-xs gap-1 text-purple-600 border-purple-300">
                    <GitCommit className="h-3 w-3" /> {suite.gitCommitSha.slice(0, 8)}
                  </Badge>
                )}
                {suite.gitPrUrl && (
                  <a href={suite.gitPrUrl} target="_blank" rel="noopener noreferrer">
                    <Badge variant="outline" className="text-xs gap-1 text-purple-600 border-purple-300 cursor-pointer hover:bg-purple-50">
                      <GitBranch className="h-3 w-3" /> View PR <ExternalLink className="h-2.5 w-2.5" />
                    </Badge>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* DAG Schedule */}
          {schedule && schedule.groups.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Execution Schedule (DAG)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {schedule.groups.map((group, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="bg-muted rounded px-2 py-1 text-xs">
                        <span className="font-medium text-muted-foreground">Group {idx + 1}</span>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {group.map((id) => (
                            <span key={id} className="bg-background border rounded px-1 text-xs font-mono">TC-{id}</span>
                          ))}
                        </div>
                      </div>
                      {idx < schedule.groups.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditions List */}
          <div className="space-y-2" role="list" aria-label="Test conditions">
            {suite.conditions?.map((cond) => (
              <Collapsible
                key={cond.id}
                open={expandedConditions.has(cond.id)}
                onOpenChange={() => toggleCondition(cond.id)}
              >
                <Card role="listitem">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="pb-2 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg" aria-expanded={expandedConditions.has(cond.id)}>
                      <div className="flex items-center gap-3">
                        {expandedConditions.has(cond.id) ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                        <span className="text-xs font-mono text-muted-foreground shrink-0">TC-{cond.conditionNumber.toString().padStart(3, "0")}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${TEST_TYPE_COLORS[cond.testType] ?? ""}`}>
                          {cond.testType}
                        </span>
                        <span className="text-sm font-medium flex-1 truncate">{cond.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {cond.confidenceScore && (
                            <span className="text-xs text-muted-foreground">
                              {(parseFloat(cond.confidenceScore) * 100).toFixed(0)}%
                            </span>
                          )}
                          {STATUS_ICON[cond.status] ?? <Clock className="h-4 w-4 text-gray-400" />}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 text-sm space-y-3">
                      {cond.preconditions && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Preconditions</p>
                          <p className="text-foreground">{cond.preconditions}</p>
                        </div>
                      )}
                      {Array.isArray(cond.steps) && (cond.steps as Array<{ stepNumber: number; action: string; expectedResult: string }>).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Steps</p>
                          <ol className="space-y-1 list-none">
                            {(cond.steps as Array<{ stepNumber: number; action: string; expectedResult: string }>).map((step) => (
                              <li key={step.stepNumber} className="grid grid-cols-[auto_1fr] gap-2">
                                <span className="text-xs font-mono text-muted-foreground pt-0.5">{step.stepNumber}.</span>
                                <div>
                                  <p>{step.action}</p>
                                  <p className="text-xs text-green-600 dark:text-green-400">→ {step.expectedResult}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                      {cond.expectedResult && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Expected Result</p>
                          <p className="text-foreground">{cond.expectedResult}</p>
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Role: {cond.userRole ?? "N/A"}</span>
                        <span>Browser: {cond.browserTarget ?? "N/A"}</span>
                        {Array.isArray(cond.dependsOn) && (cond.dependsOn as number[]).length > 0 && (
                          <span>Depends on: TC-{(cond.dependsOn as number[]).join(", TC-")}</span>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      )}

      {/* Publish to Git dialog */}
      <Dialog open={gitDialogOpen} onOpenChange={setGitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-violet-600" />
              Publish XLSX to ADO Git
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Branch Strategy</Label>
              <Select value={gitStrategy} onValueChange={(v) => setGitStrategy(v as "main" | "branch")}>
                <SelectTrigger aria-label="Select branch strategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">
                    <span className="flex items-center gap-2">
                      <GitCommit className="h-3.5 w-3.5" />
                      Commit directly to main
                    </span>
                  </SelectItem>
                  <SelectItem value="branch">
                    <span className="flex items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5" />
                      Create branch + open Pull Request
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {gitStrategy === "main"
                  ? "The XLSX will be committed directly to the main branch under regression-tests/."
                  : "A branch named grace/regression/<suite-name> will be created and a PR opened for review."}
              </p>
            </div>
            <div className="space-y-2">
              <Label>ADO Connection <span className="text-muted-foreground font-normal text-xs">(optional — uses default if blank)</span></Label>
              <Select value={selectedAdoConnId} onValueChange={setSelectedAdoConnId}>
                <SelectTrigger aria-label="Select ADO connection">
                  <SelectValue placeholder={adoConnections.data?.length ? "Use default connection" : "No connections — configure in Settings"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Use default connection</SelectItem>
                  {adoConnections.data?.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.label} ({c.adoProject} — {c.environment})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGitDialogOpen(false)}>Cancel</Button>
            <Button
              disabled={publishToGitMutation.isPending}
              onClick={() => suite && publishToGitMutation.mutate({
                suiteId: suite.id,
                gitStrategy,
                adoConnectionId: selectedAdoConnId && selectedAdoConnId !== "default" ? Number(selectedAdoConnId) : undefined,
              })}
              className="gap-2"
            >
              {publishToGitMutation.isPending
                ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Publishing…</>
                : <><GitPullRequest className="h-3.5 w-3.5" /> {gitStrategy === "branch" ? "Create Branch + PR" : "Commit to Main"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Test Suite</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="reject-reason">Reason for rejection</Label>
            <Textarea
              id="reject-reason"
              placeholder="Describe what needs to be changed before this suite can be approved…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              onClick={() => suite && rejectMutation.mutate({ id: suite.id, status: "rejected", rejectionReason: rejectReason.trim() })}
            >
              {rejectMutation.isPending ? "Rejecting…" : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!selectedSuiteId && !suitesLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Select a test suite above to view its conditions and execution schedule.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Library Tab ───────────────────────────────────────────────────────────────

type LibrarySuite = {
  id: number;
  name: string;
  status: string;
  libraryStatus: string | null;
  libraryVersion: number | null;
  applicationName: string | null;
  environment: string;
  xlsFilePath: string | null;
  adoTestPlanId: number | null;
  adoTestSuiteId: number | null;
  adoPublishedAt: Date | null;
  gitCommitSha: string | null;
  gitBranch: string | null;
  gitPrUrl: string | null;
  gitCommittedAt: Date | null;
  updatedAt: Date;
  versions: Array<{
    id: number;
    libraryVersion: number | null;
    status: string;
    createdAt: Date;
    adoPublishedAt: Date | null;
    gitCommitSha: string | null;
    gitBranch: string | null;
    gitPrUrl: string | null;
  }>;
};

function LibraryTab() {
  const utils = trpc.useUtils();
  const { data: librarySuites, isLoading } = trpc.graceTestSuite.listLibrary.useQuery();
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());
  const [rerunDialogOpen, setRerunDialogOpen] = useState<number | null>(null);
  const [newVersionEnv, setNewVersionEnv] = useState<string>("");

  const rerunMutation = trpc.graceTestSuite.rerunFromLibrary.useMutation({
    onSuccess: (result) => {
      if (result.action === "rerun_original") {
        toast.success("Re-run XLSX generated — downloading…");
        if (result.xlsUrl) window.open(result.xlsUrl, "_blank");
      } else {
        toast.success(`New version v${result.version} created and queued for review.`);
        utils.graceTestSuite.listLibrary.invalidate();
        utils.graceTestSuite.list.invalidate();
      }
      setRerunDialogOpen(null);
      setNewVersionEnv("");
    },
    onError: (e) => toast.error(e.message),
  });

  function toggleVersions(id: number) {
    setExpandedVersions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedSuite = librarySuites?.find((s) => s.id === rerunDialogOpen) as LibrarySuite | undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Approved suites published to the ADO Test Plan and committed to Git. Re-run the original or create a new version with updated parameters.
        </p>
        <Button variant="ghost" size="sm" onClick={() => utils.graceTestSuite.listLibrary.invalidate()} aria-label="Refresh library">
          <RefreshCw className="h-3 w-3 mr-1" /> Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">Loading library…</div>
      )}

      {!isLoading && (!librarySuites || librarySuites.length === 0) && (
        <Card>
          <CardContent className="py-16 text-center space-y-2">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground font-medium">No library suites yet.</p>
            <p className="text-sm text-muted-foreground">
              Suites appear here after they are approved in the HITL queue — the post-approval pipeline publishes them to ADO and commits the XLSX to Git.
            </p>
          </CardContent>
        </Card>
      )}

      {librarySuites?.map((suite) => {
        const s = suite as LibrarySuite;
        const hasVersions = s.versions && s.versions.length > 0;
        return (
          <Card key={s.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base">{s.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs gap-1 shrink-0">
                      <BookOpen className="h-3 w-3" /> v{s.libraryVersion ?? 1}
                    </Badge>
                    <Badge variant={statusBadgeVariant(s.status)} className="text-xs capitalize shrink-0">{s.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {s.applicationName ?? "—"} · {s.environment} · Updated {new Date(s.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRerunDialogOpen(s.id)}
                    aria-label={`Re-run suite ${s.name}`}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" /> Re-run
                  </Button>
                  {s.xlsFilePath && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(s.xlsFilePath!, "_blank")}
                      aria-label="Download XLSX"
                    >
                      <Download className="h-3 w-3 mr-1" /> XLSX
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {/* ADO + Git status row */}
              <div className="flex flex-wrap gap-2">
                {s.adoTestPlanId ? (
                  <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-300">
                    <FlaskConical className="h-3 w-3" /> ADO Plan #{s.adoTestPlanId}
                    {s.adoPublishedAt && <span className="text-muted-foreground ml-1">· {new Date(s.adoPublishedAt).toLocaleDateString()}</span>}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">ADO: not published</Badge>
                )}
                {s.gitCommitSha ? (
                  <Badge variant="outline" className="text-xs gap-1 text-purple-600 border-purple-300">
                    <GitCommit className="h-3 w-3" /> {s.gitCommitSha.slice(0, 8)}
                    {s.gitBranch && <span className="text-muted-foreground ml-1">· {s.gitBranch}</span>}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">Git: not committed</Badge>
                )}
                {s.gitPrUrl && (
                  <a href={s.gitPrUrl} target="_blank" rel="noopener noreferrer">
                    <Badge variant="outline" className="text-xs gap-1 text-purple-600 border-purple-300 cursor-pointer hover:bg-purple-50">
                      <GitBranch className="h-3 w-3" /> View PR <ExternalLink className="h-2.5 w-2.5" />
                    </Badge>
                  </a>
                )}
              </div>

              {/* Version history */}
              {hasVersions && (
                <Collapsible open={expandedVersions.has(s.id)} onOpenChange={() => toggleVersions(s.id)}>
                  <CollapsibleTrigger asChild>
                    <button
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      aria-expanded={expandedVersions.has(s.id)}
                    >
                      {expandedVersions.has(s.id) ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      {s.versions.length} version{s.versions.length !== 1 ? "s" : ""} in history
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <table className="w-full text-xs" aria-label="Suite version history">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Version</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Status</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">ADO Published</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Git Commit</th>
                            <th className="text-left px-3 py-2 font-medium text-muted-foreground">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.versions.map((v) => (
                            <tr key={v.id} className="border-t hover:bg-muted/30">
                              <td className="px-3 py-2 font-mono">v{v.libraryVersion ?? "?"}</td>
                              <td className="px-3 py-2 capitalize">{v.status}</td>
                              <td className="px-3 py-2">
                                {v.adoPublishedAt ? new Date(v.adoPublishedAt).toLocaleDateString() : "—"}
                              </td>
                              <td className="px-3 py-2 font-mono">
                                {v.gitCommitSha ? (
                                  <span className="flex items-center gap-1">
                                    {v.gitCommitSha.slice(0, 8)}
                                    {v.gitPrUrl && (
                                      <a href={v.gitPrUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>
                                    )}
                                  </span>
                                ) : "—"}
                              </td>
                              <td className="px-3 py-2">{new Date(v.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Re-run dialog */}
      <Dialog open={rerunDialogOpen !== null} onOpenChange={(open) => { if (!open) { setRerunDialogOpen(null); setNewVersionEnv(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-run from Library</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              <strong>No changes?</strong> Re-export the original XLSX and download it immediately.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Changes needed?</strong> Select a new environment below to create a new version (v{(selectedSuite?.libraryVersion ?? 1) + 1}) that will go through the HITL review queue before publishing.
            </p>
            <div className="space-y-2">
              <Label htmlFor="new-version-env">New environment (leave blank to re-run original)</Label>
              <Select value={newVersionEnv} onValueChange={setNewVersionEnv}>
                <SelectTrigger id="new-version-env" aria-label="Select new environment">
                  <SelectValue placeholder="Same as original (re-run)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEV">DEV</SelectItem>
                  <SelectItem value="IST">IST</SelectItem>
                  <SelectItem value="UAT">UAT</SelectItem>
                  <SelectItem value="STAGE">STAGE</SelectItem>
                  <SelectItem value="PROD">PROD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRerunDialogOpen(null); setNewVersionEnv(""); }}>Cancel</Button>
            <Button
              disabled={rerunMutation.isPending}
              onClick={() => {
                if (rerunDialogOpen === null) return;
                rerunMutation.mutate({
                  suiteId: rerunDialogOpen,
                  newVersion: newVersionEnv
                    ? { environment: newVersionEnv as "DEV" | "IST" | "UAT" | "STAGE" | "PROD" }
                    : undefined,
                });
              }}
            >
              {rerunMutation.isPending
                ? "Processing…"
                : newVersionEnv
                  ? `Create v${(selectedSuite?.libraryVersion ?? 1) + 1}`
                  : "Re-run Original"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GraceTestSuiteView() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") ?? "active";
  });

  // Sync tab in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState(null, "", url.toString());
  }, [activeTab]);

  return (
    <div className="p-6 space-y-4 max-w-6xl mx-auto">
      <GraceWorkflowBanner currentStep="review" outcomeKey="suites" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Test Suites</h1>
          <p className="text-sm text-muted-foreground">DDD v5.1 test condition suites — review, approve, export, and manage the library</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList aria-label="Test suite views">
          <TabsTrigger value="active">Active Suites</TabsTrigger>
          <TabsTrigger value="library" className="gap-1">
            <BookOpen className="h-3.5 w-3.5" /> Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <ActiveSuitesTab />
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <LibraryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
