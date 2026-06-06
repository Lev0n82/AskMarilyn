/**
 * GRACE Work Items — CSC-GRACE-AI v1
 * Ingest ADO work items, view testability scoring results,
 * and trigger ABT generation directly from the work items list.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Plus, RefreshCw, AlertTriangle, CheckCircle2, Zap, Play,
  FileText, Loader2, ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";
import { HelpTooltip, HelpBanner } from "@/components/HelpTooltip";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";

const STATUS_COLORS: Record<string, string> = {
  pending: "secondary",
  ready: "default",
  clarification_needed: "destructive",
  processing: "outline",
  done: "default",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  ready: "Ready",
  clarification_needed: "Needs Clarification",
  processing: "Generating\u2026",
  done: "Done",
};

export default function GraceWorkItems() {
  const [, navigate] = useLocation();
  const [showIngest, setShowIngest] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    adoId: "", adoProject: "", title: "", description: "", acceptanceCriteria: "", originator: "",
  });

  const utils = trpc.useUtils();

  const { data: items, isLoading } = trpc.graceWorkItems.listWithSuites.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data;
      if (Array.isArray(data) && data.some((w: { status: string }) => w.status === "processing")) return 3000;
      return false;
    },
  });

  const ingestMutation = trpc.graceWorkItems.ingest.useMutation({
    onSuccess: (result) => {
      toast.success(`Work item ingested. Testability: ${(result.testabilityScore * 100).toFixed(0)}%`);
      utils.graceWorkItems.listWithSuites.invalidate();
      utils.graceAudit.dashboardMetrics.invalidate();
      setShowIngest(false);
      setForm({ adoId: "", adoProject: "", title: "", description: "", acceptanceCriteria: "", originator: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  const generateNowMutation = trpc.graceWorkItems.generateNow.useMutation({
    onMutate: ({ id }) => { setGeneratingId(id); },
    onSuccess: (result) => {
      const adoId = items?.find((w) => w.id === result.workItemId)?.adoId ?? result.workItemId;
      toast.success(`Generated ${result.conditionsCreated} conditions for ADO-${adoId}`);
      setGeneratingId(null);
      utils.graceWorkItems.listWithSuites.invalidate();
      utils.graceAudit.dashboardMetrics.invalidate();
    },
    onError: (e) => {
      toast.error(`Generation failed: ${e.message}`);
      setGeneratingId(null);
      utils.graceWorkItems.listWithSuites.invalidate();
    },
  });

  const processQueueMutation = trpc.graceWorkItems.processPendingQueue.useMutation({
    onSuccess: (result) => {
      if (result.processed === 0) {
        toast.info("No pending items to process. All work items are already done.");
      } else {
        toast.success(`Queue processed: ${result.succeeded}/${result.processed} items succeeded.`);
      }
      utils.graceWorkItems.listWithSuites.invalidate();
      utils.graceAudit.dashboardMetrics.invalidate();
    },
    onError: (e) => toast.error(`Queue processing failed: ${e.message}`),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.adoId || !form.adoProject || !form.title) {
      toast.error("ADO ID, Project, and Title are required.");
      return;
    }
    ingestMutation.mutate(form);
  }

  const pendingCount = items?.filter((w) => w.status === "pending" || w.status === "ready").length ?? 0;
  const processingCount = items?.filter((w) => w.status === "processing").length ?? 0;

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <GraceWorkflowBanner currentStep="intake" outcomeKey="workitems" />
      <HelpBanner workflowId="work-item-intake" />
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">Work Items <HelpTooltip text="Work items are ADO user stories or tasks ingested into GRACE. Each item is scored for testability, then ABT conditions are generated and placed in a test suite for review." /></h1>
          <p className="text-sm text-muted-foreground">
            ADO work items ingested into the GRACE pipeline
            {pendingCount > 0 && (
              <span className="ml-2 text-amber-600 dark:text-amber-400 font-medium">
                &middot; {pendingCount} awaiting generation
              </span>
            )}
            {processingCount > 0 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                &middot; {processingCount} generating&hellip;
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {pendingCount > 0 && (
            <Button
              variant="default"
              onClick={() => processQueueMutation.mutate({ limit: 10 })}
              disabled={processQueueMutation.isPending}
              aria-label={`Process all ${pendingCount} pending work items`}
            >
              {processQueueMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />Processing&hellip;</>
              ) : (
                <><Play className="h-4 w-4 mr-2" aria-hidden="true" />Process All ({pendingCount})</>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => utils.graceWorkItems.listWithSuites.invalidate()}
            aria-label="Refresh work items list"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />Refresh
          </Button>
          <Button onClick={() => setShowIngest(true)} aria-label="Ingest new work item" title="Ingest a new ADO work item into the GRACE pipeline">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />Ingest Work Item
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground" role="status" aria-live="polite">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" aria-hidden="true" />
          Loading work items&hellip;
        </div>
      )}

      {!isLoading && (!items || items.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" aria-hidden="true" />
            <p className="font-medium">No work items yet</p>
            <p className="text-sm mt-1">Click &ldquo;Ingest Work Item&rdquo; to add your first ADO work item.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3" role="list" aria-label="Work items">
        {items?.map((wi) => {
          const isGenerating = generatingId === wi.id || wi.status === "processing";
          const canGenerate = wi.status === "pending" || wi.status === "ready";
          return (
            <Card
              key={wi.id}
              className={`transition-opacity ${isGenerating ? "opacity-75" : ""}`}
              role="listitem"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs shrink-0">ADO-{wi.adoId}</Badge>
                      <Badge variant="outline" className="text-xs shrink-0">{wi.adoProject}</Badge>
                      <Badge
                        variant={STATUS_COLORS[wi.status] as "default" | "secondary" | "destructive" | "outline"}
                        className={[
                          "text-xs shrink-0",
                          wi.status === "done" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "",
                          wi.status === "processing" ? "animate-pulse" : "",
                        ].join(" ")}
                        aria-label={`Status: ${STATUS_LABELS[wi.status] ?? wi.status}`}
                      >
                        {wi.status === "processing" && <Loader2 className="h-3 w-3 mr-1 animate-spin" aria-hidden="true" />}
                        {STATUS_LABELS[wi.status] ?? wi.status}
                      </Badge>
                      {wi.workItemType && (
                        <Badge variant="outline" className="text-xs shrink-0">{wi.workItemType}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-base mt-1">{wi.title}</CardTitle>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {wi.status === "done" && wi.suiteCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 px-2"
                        aria-label={`View ${wi.suiteCount} test suite(s)`}
                        onClick={() => navigate(`/grace/suite/${wi.latestSuiteId}`)}
                      >
                        <FileText className="h-3 w-3 mr-1" aria-hidden="true" />
                        {wi.suiteCount} suite{wi.suiteCount !== 1 ? "s" : ""}
                        <ChevronRight className="h-3 w-3 ml-1" aria-hidden="true" />
                      </Button>
                    )}
                    {canGenerate && (
                      <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs"
                        onClick={() => generateNowMutation.mutate({ id: wi.id })}
                        disabled={isGenerating || generateNowMutation.isPending}
                        aria-label={`Generate test conditions for ADO-${wi.adoId}`}
                      >
                        {isGenerating ? (
                          <><Loader2 className="h-3 w-3 mr-1 animate-spin" aria-hidden="true" />Generating&hellip;</>
                        ) : (
                          <><Zap className="h-3 w-3 mr-1" aria-hidden="true" />Generate Now</>
                        )}
                      </Button>
                    )}
                    {wi.testabilityScore && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">
                          {(parseFloat(wi.testabilityScore) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">testability</div>
                        <Progress
                          value={parseFloat(wi.testabilityScore) * 100}
                          className="h-1.5 w-16 mt-1"
                          aria-label={`Testability: ${(parseFloat(wi.testabilityScore) * 100).toFixed(0)}%`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {Array.isArray(wi.testabilityGaps) && (wi.testabilityGaps as string[]).length > 0 && (
                  <div className="flex items-start gap-2 mt-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Gaps: {(wi.testabilityGaps as string[]).join("; ")}
                    </p>
                  </div>
                )}
                {wi.status === "ready" && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" aria-hidden="true" />
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Ready for generation &mdash; click &ldquo;Generate Now&rdquo; to proceed
                    </p>
                  </div>
                )}
                {wi.status === "pending" && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" aria-hidden="true" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Awaiting generation &mdash; click &ldquo;Generate Now&rdquo; or &ldquo;Process All&rdquo;
                    </p>
                  </div>
                )}
                {wi.status === "done" && wi.suiteCount > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" aria-hidden="true" />
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {wi.suiteCount} test suite{wi.suiteCount !== 1 ? "s" : ""} generated
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Ingested {new Date(wi.createdAt).toLocaleString()}
                  {wi.originator && ` \u00b7 by ${wi.originator}`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Ingest Dialog */}
      <Dialog open={showIngest} onOpenChange={setShowIngest}>
        <DialogContent className="max-w-lg" aria-describedby="workitem-dialog-desc" aria-labelledby="workitem-dialog-title">
          <DialogHeader>
            <DialogTitle>Ingest Work Item</DialogTitle>
            <DialogDescription>
              Paste an ADO work item ID and details. GRACE will score testability, decompose acceptance criteria,
              and check for duplicates before creating the test suite.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="workitem-dialog-desc" className="sr-only">Add or edit a work item to queue it for ABT generation.</DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4" aria-label="Ingest work item form">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="adoId">ADO Work Item ID <span aria-label="required">*</span></Label>
                <Input
                  id="adoId"
                  value={form.adoId}
                  onChange={(e) => setForm({ ...form, adoId: e.target.value })}
                  placeholder="e.g. 129389"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="adoProject">ADO Project <span aria-label="required">*</span></Label>
                <Input
                  id="adoProject"
                  value={form.adoProject}
                  onChange={(e) => setForm({ ...form, adoProject: e.target.value })}
                  placeholder="e.g. EDCS"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="title">Title <span aria-label="required">*</span></Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Work item title"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Work item description&hellip;"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ac">Acceptance Criteria</Label>
              <Textarea
                id="ac"
                value={form.acceptanceCriteria}
                onChange={(e) => setForm({ ...form, acceptanceCriteria: e.target.value })}
                rows={4}
                placeholder="Given&hellip; When&hellip; Then&hellip;"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="originator">Originator (email)</Label>
              <Input
                id="originator"
                type="email"
                value={form.originator}
                onChange={(e) => setForm({ ...form, originator: e.target.value })}
                placeholder="analyst@example.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowIngest(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={ingestMutation.isPending}>
                {ingestMutation.isPending ? (
                  <><RefreshCw className="h-3 w-3 mr-2 animate-spin" aria-hidden="true" />Scoring&hellip;</>
                ) : (
                  "Ingest & Score"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
