/**
 * GraceAbtWorkbench.tsx — CSC-GRACE-AI v1
 * Three-stage ABT pipeline UI:
 *   Stage 1 — Derive:   free-form requirement → LLM → DDD v5.1 conditions table
 *   Stage 2 — Export:   conditions → .xlsx download (DDD v5.1 9-column format)
 *   Stage 3 — Execute:  conditions → queue for local GRACE MCP agent → HITL updates
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Step {
  action_type: string;
  target: string;
  value?: string;
  expected?: string;
}

interface Condition {
  sequence: number;
  condition_type: string;
  title: string;
  steps_json: Step[];
  expected_result: string;
  depends_on: string;
  execution_group: string;
  role_required: string;
  browser_target: string;
  _validation_warning?: string;
}

interface DeriveResult {
  suiteName: string;
  appName: string;
  orgCode: string;
  targetUrl: string;
  conditions: Condition[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const CONDITION_TYPE_COLOURS: Record<string, string> = {
  functional: "bg-blue-100 text-blue-800",
  negative: "bg-red-100 text-red-800",
  security: "bg-orange-100 text-orange-800",
  accessibility: "bg-purple-100 text-purple-800",
  performance: "bg-yellow-100 text-yellow-800",
  integration: "bg-teal-100 text-teal-800",
  regression: "bg-gray-100 text-gray-800",
  boundary: "bg-pink-100 text-pink-800",
};

function ConditionTypeBadge({ type }: { type: string }) {
  const cls = CONDITION_TYPE_COLOURS[type] ?? "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GraceAbtWorkbench() {
  // Stage 1 — Derive
  const [requirement, setRequirement] = useState("");
  const [appName, setAppName] = useState("");
  const [orgCode, setOrgCode] = useState("CSCDDSB");
  const [targetUrl, setTargetUrl] = useState("");
  const [deriveResult, setDeriveResult] = useState<DeriveResult | null>(null);

  // Stage 2 — Export
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [savedSuiteId, setSavedSuiteId] = useState<number | null>(null);

  // Stage 3 — Execute
  const [executeResult, setExecuteResult] = useState<{
    conditionsQueued: number;
    note: string;
  } | null>(null);
  const [execBrowser, setExecBrowser] = useState<"chromium" | "edge" | "firefox">("chromium");

  // Condition detail dialog
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  // ── tRPC mutations ──────────────────────────────────────────────────────────
  const deriveMutation = trpc.graceAbt.derive.useMutation({
    onSuccess: (data) => {
      setDeriveResult(data as DeriveResult);
      setExportUrl(null);
      setSavedSuiteId(null);
      setExecuteResult(null);
      toast.success(`Derived ${(data as DeriveResult).conditions.length} conditions from requirement`);
    },
    onError: (err) => {
      toast.error(`Derive failed: ${err.message}`);
    },
  });

  const exportMutation = trpc.graceAbt.export.useMutation({
    onSuccess: (data) => {
      setExportUrl(data.url);
      toast.success(`XLSX exported — ${data.validCount} conditions. ${data.skippedCount > 0 ? `${data.skippedCount} skipped.` : ""}`);
    },
    onError: (err) => {
      toast.error(`Export failed: ${err.message}`);
    },
  });

  const saveToDbMutation = trpc.graceAbt.saveToDb.useMutation({
    onSuccess: (data) => {
      setSavedSuiteId(data.suiteId);
      toast.success(`Saved to database — Suite ID ${data.suiteId}, ${data.conditionsCreated} conditions`);
    },
    onError: (err) => {
      toast.error(`Save failed: ${err.message}`);
    },
  });

  const executeMutation = trpc.graceAbt.execute.useMutation({
    onSuccess: (data) => {
      setExecuteResult({ conditionsQueued: data.conditionsQueued, note: data.note });
      toast.success(`${data.conditionsQueued} condition(s) queued for GRACE MCP agent execution`);
    },
    onError: (err) => {
      toast.error(`Execute failed: ${err.message}`);
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleDerive() {
    if (!requirement.trim()) {
      toast.error("Please enter a requirement before deriving conditions");
      return;
    }
    deriveMutation.mutate({ requirement, appName, orgCode, targetUrl });
  }

  function handleExport() {
    if (!deriveResult) return;
    exportMutation.mutate({
      suiteName: deriveResult.suiteName,
      conditions: deriveResult.conditions,
    });
  }

  function handleSaveToDb() {
    if (!deriveResult) return;
    saveToDbMutation.mutate({
      suiteName: deriveResult.suiteName,
      appName: deriveResult.appName,
      targetUrl: deriveResult.targetUrl,
      conditions: deriveResult.conditions,
    });
  }

  function handleExecute() {
    if (!savedSuiteId) {
      toast.error("Save the suite to the database first before executing");
      return;
    }
    if (!targetUrl.trim()) {
      toast.error("Enter a target URL before executing");
      return;
    }
    executeMutation.mutate({
      suiteId: savedSuiteId,
      targetUrl,
      browserTarget: execBrowser,
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <GraceWorkflowBanner currentStep="derive" outcomeKey="abt" />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">ABT Workbench</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Action-Based Testing pipeline — DDD v5.1 compliant. Derive structured test conditions
          from plain-English requirements, export to .xlsx, and queue for browser execution.
        </p>
      </div>

      {/* ── Stage 1: Derive ─────────────────────────────────────────────────── */}
      <section aria-labelledby="stage1-heading" className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            1
          </span>
          <h2 id="stage1-heading" className="text-lg font-semibold">
            Derive Conditions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              placeholder="e.g. PFAAM"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="orgCode">Organisation Code</Label>
            <Input
              id="orgCode"
              placeholder="e.g. CSCDDSB"
              value={orgCode}
              onChange={(e) => setOrgCode(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              placeholder="https://pfaam.ontario.ca"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="requirement">Requirement / User Story</Label>
          <Textarea
            id="requirement"
            rows={6}
            placeholder={`Describe the requirement in plain English. Example:\n\nAs a PFAAM Applicant, I want to submit a college application so that my application is reviewed by the college administrator. The form has 10 tabs: Personal Info, Education History, Program Selection, References, Financial Aid, Supporting Documents, Declaration, Review, Submit, and Confirmation. All mandatory fields must be validated before allowing tab navigation.`}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <Button
          onClick={handleDerive}
          disabled={deriveMutation.isPending || !requirement.trim()}
          className="w-full md:w-auto"
        >
          {deriveMutation.isPending ? "Deriving conditions…" : "Derive ABT Conditions"}
        </Button>
      </section>

      {/* ── Derived Conditions Table ─────────────────────────────────────────── */}
      {deriveResult && (
        <section aria-labelledby="conditions-heading" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 id="conditions-heading" className="text-lg font-semibold">
                {deriveResult.suiteName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {deriveResult.conditions.length} condition(s) derived •{" "}
                {deriveResult.appName || "App not specified"} •{" "}
                {deriveResult.orgCode}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Condition type summary */}
              {Object.entries(
                deriveResult.conditions.reduce<Record<string, number>>((acc, c) => {
                  acc[c.condition_type] = (acc[c.condition_type] ?? 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table aria-label="Test conditions">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-24">Browser</TableHead>
                  <TableHead className="w-24">Depends On</TableHead>
                  <TableHead className="w-28">Group</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deriveResult.conditions.map((c) => (
                  <TableRow key={c.sequence}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {c.sequence}
                    </TableCell>
                    <TableCell>
                      <ConditionTypeBadge type={c.condition_type} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {c.title}
                      {c._validation_warning && (
                        <span className="ml-2 text-xs text-yellow-600">⚠ validation warning</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.browser_target || "chromium"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {c.depends_on || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.execution_group || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCondition(c)}
                        aria-label={`View details for condition ${c.sequence}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ── Stage 2: Export ──────────────────────────────────────────────── */}
          <section aria-labelledby="stage2-heading" className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </span>
              <h3 id="stage2-heading" className="text-base font-semibold">
                Export to DDD v5.1 XLSX
              </h3>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exportMutation.isPending}
              >
                {exportMutation.isPending ? "Generating XLS…" : "Export .xlsx (9-column)"}
              </Button>

              {exportUrl && (
                <a
                  href={exportUrl}
                  download
                  className="inline-flex items-center gap-1.5 rounded-md border border-green-600 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  ↓ Download XLS
                </a>
              )}

              <Button
                variant="outline"
                onClick={handleSaveToDb}
                disabled={saveToDbMutation.isPending}
              >
                {saveToDbMutation.isPending
                  ? "Saving…"
                  : savedSuiteId
                  ? `Saved — Suite #${savedSuiteId}`
                  : "Save to Database"}
              </Button>
            </div>

            {exportMutation.data?.warnings && exportMutation.data.warnings.length > 0 && (
              <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                <strong>XLS warnings:</strong>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  {exportMutation.data.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* ── Stage 3: Execute ─────────────────────────────────────────────── */}
          <section aria-labelledby="stage3-heading" className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </span>
              <h3 id="stage3-heading" className="text-base font-semibold">
                Execute via GRACE MCP Agent
              </h3>
            </div>

            <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-sm text-blue-800">
              <strong>How execution works:</strong> Conditions are queued in the HITL queue and
              picked up by the local GRACE MCP agent running on the QA workstation. The agent
              connects to the browser via Playwright CDP and executes each step, updating condition
              status in real time. Start the GRACE MCP server locally before clicking Execute.
            </div>

            <div className="flex items-end gap-3 flex-wrap">
              <div className="space-y-1">
                <Label htmlFor="execBrowser">Browser</Label>
                <Select
                  value={execBrowser}
                  onValueChange={(v) => setExecBrowser(v as "chromium" | "edge" | "firefox")}
                >
                  <SelectTrigger id="execBrowser" className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chromium">Chromium</SelectItem>
                    <SelectItem value="edge">Edge</SelectItem>
                    <SelectItem value="firefox">Firefox</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleExecute}
                disabled={executeMutation.isPending || !savedSuiteId}
                title={!savedSuiteId ? "Save to database first" : undefined}
              >
                {executeMutation.isPending ? "Queuing…" : "Queue for Execution"}
              </Button>
            </div>

            {executeResult && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800 space-y-1">
                <p>
                  <strong>{executeResult.conditionsQueued}</strong> condition(s) queued
                  successfully.
                </p>
                <p className="text-green-700">{executeResult.note}</p>
                <p>
                  Check the{" "}
                  <a href="/grace/hitl" className="underline font-medium">
                    HITL Queue
                  </a>{" "}
                  for live execution updates.
                </p>
              </div>
            )}
          </section>
        </section>
      )}

      {/* ── Condition Detail Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={!!selectedCondition}
        onOpenChange={(open) => { if (!open) setSelectedCondition(null); }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" aria-describedby="abt-dialog-desc" aria-labelledby="abt-dialog-title">
          <DialogHeader>
            <DialogTitle>
              Condition {selectedCondition?.sequence}: {selectedCondition?.title}
            </DialogTitle>
            <DialogDescription>
              DDD v5.1 test condition detail — steps, expected result, and execution metadata.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="abt-dialog-desc" className="sr-only">Review and edit the generated ABT conditions before saving.</DialogDescription>

          {selectedCondition && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <ConditionTypeBadge type={selectedCondition.condition_type} />
                </div>
                <div>
                  <span className="text-muted-foreground">Browser: </span>
                  <span className="font-mono">{selectedCondition.browser_target || "chromium"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Depends on: </span>
                  <span className="font-mono">{selectedCondition.depends_on || "none"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Group: </span>
                  <span className="font-mono">{selectedCondition.execution_group || "solo"}</span>
                </div>
                {selectedCondition.role_required && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Role: </span>
                    <span className="font-mono">{selectedCondition.role_required}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="font-medium mb-1">Expected Result</p>
                <p className="text-muted-foreground bg-muted rounded p-2">
                  {selectedCondition.expected_result}
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">Steps ({selectedCondition.steps_json.length})</p>
                <Accordion type="multiple" className="space-y-1">
                  {selectedCondition.steps_json.map((step, i) => (
                    <AccordionItem
                      key={i}
                      value={`step-${i}`}
                      className="border rounded-md px-3"
                    >
                      <AccordionTrigger className="text-sm py-2 hover:no-underline">
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {i + 1}.
                        </span>
                        <span className="font-medium text-left">{step.action_type}</span>
                        <span className="ml-2 text-muted-foreground truncate max-w-xs text-left">
                          {step.target}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2 space-y-1 text-xs">
                        <div>
                          <span className="text-muted-foreground">Target: </span>
                          <code className="bg-muted rounded px-1">{step.target}</code>
                        </div>
                        {step.value && (
                          <div>
                            <span className="text-muted-foreground">Value: </span>
                            <code className="bg-muted rounded px-1">{step.value}</code>
                          </div>
                        )}
                        {step.expected && (
                          <div>
                            <span className="text-muted-foreground">Expected: </span>
                            <span>{step.expected}</span>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
