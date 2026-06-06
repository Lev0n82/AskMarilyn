import { useState, useRef, useCallback, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { toast } from "sonner";
import {
  Upload, Play, RefreshCw, Download, Send, CheckCircle2,
  XCircle, Clock, Loader2, FileSpreadsheet, AlertTriangle, Monitor, Server,
} from "lucide-react";

const BROWSERS = [
  { value: "chromium", label: "Chromium (default)" },
  { value: "chrome", label: "Google Chrome" },
  { value: "firefox", label: "Firefox" },
  { value: "edge", label: "Microsoft Edge" },
  { value: "webkit", label: "WebKit / Safari" },
];

const ENVIRONMENTS = [
  { value: "DEV", label: "DEV" },
  { value: "IST", label: "IST" },
  { value: "UAT", label: "UAT" },
  { value: "STAGE", label: "STAGE" },
  { value: "PROD", label: "PROD" },
];

type BrowserValue = "chromium" | "chrome" | "firefox" | "edge" | "webkit";
type EnvValue = "DEV" | "IST" | "UAT" | "STAGE" | "PROD";
type ExecutionTarget = "server" | "remote_pc";
type RunStatus = "idle" | "importing" | "queued" | "running" | "complete" | "failed";

interface ImportResult {
  runId: number;
  filename: string;
  totalCases: number;
  totalSteps: number;
  releaseLabel: string | null;
  scenarioSummary: string | null;
  s3Url: string;
}

// Matches the actual pollRun return shape from grace-xls-runner router
// run columns: id, fileName, status, totalTestCases, totalSteps, passedTestCases, failedTestCases, targetBrowser, targetEnvironment, targetUrl, adoTestRunUrl
interface PollRun {
  id: number;
  fileName: string;
  status: string;
  totalTestCases: number | null;
  totalSteps: number | null;
  passedTestCases: number | null;
  failedTestCases: number | null;
  targetBrowser: string | null;
  targetEnvironment: string | null;
  targetUrl: string | null;
  adoTestRunUrl: string | null;
  resultsS3Url: string | null;
}

interface PollTestCase {
  id: number;
  testCaseName: string;
  status: string;
  totalSteps: number | null;
}

interface PollStep {
  id: number;
  stepNum: number;
  actionOnObject: string;
  object: string | null;
  status: string;
  actualResult: string | null;
  errorMessage: string | null;
  durationMs: number | null;
  screenshotUrl: string | null;
}

interface PollResult {
  run: PollRun;
  testCases: PollTestCase[];
  recentSteps: PollStep[];
}

function getStatusBadge(status: string) {
  switch (status) {
    case "passed": case "complete": return <Badge className="bg-green-100 text-green-800 border-green-200">Passed</Badge>;
    case "failed": return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
    case "running": return <Badge className="bg-blue-100 text-blue-800 border-blue-200 animate-pulse">Running</Badge>;
    case "queued": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Queued</Badge>;
    case "skipped": return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Skipped</Badge>;
    case "blocked": return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Blocked</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}

function getStepIcon(status: string) {
  switch (status) {
    case "passed": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "failed": return <XCircle className="h-4 w-4 text-red-600" />;
    case "running": return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

export default function GraceXlsRunner() {
  const [file, setFile] = useState<File | null>(null);
  const [browser, setBrowser] = useState<BrowserValue>("chromium");
  const [environment, setEnvironment] = useState<EnvValue>("IST");
  const [targetUrl, setTargetUrl] = useState("");
  const [executionTarget, setExecutionTarget] = useState<ExecutionTarget>("server");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [pollResult, setPollResult] = useState<PollResult | null>(null);
  const [selectedStep, setSelectedStep] = useState<PollStep | null>(null);
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utils = trpc.useUtils();

  const adoConnections = trpc.graceSettings.listAdoConnections.useQuery();
  const agentList = trpc.graceDesktopAgent.list.useQuery();

  const importMutation = trpc.graceXlsRunner.importXls.useMutation({
    onSuccess: (data) => {
      setImportResult({
        runId: data.runId,
        filename: data.filename,
        totalCases: data.totalCases,
        totalSteps: data.totalSteps,
        releaseLabel: data.releaseLabel,
        scenarioSummary: data.scenarioSummary,
        s3Url: data.s3Url,
      });
      setRunStatus("queued");
      toast.success(`Imported ${data.totalCases} test cases, ${data.totalSteps} steps`);
    },
    onError: (err) => {
      setRunStatus("idle");
      toast.error(`Import failed: ${err.message}`);
    },
  });

  const startMutation = trpc.graceXlsRunner.startRun.useMutation({
    onSuccess: () => {
      setRunStatus("running");
      startPolling();
      toast.success("Execution queued — browser will launch shortly");
    },
    onError: (err) => toast.error(`Start failed: ${err.message}`),
  });

  const exportMutation = trpc.graceXlsRunner.exportResults.useMutation({
    onSuccess: (data) => {
      if (data.resultsS3Url) window.open(data.resultsS3Url, "_blank");
      toast.success("Results XLSX exported");
    },
    onError: (err) => toast.error(`Export failed: ${err.message}`),
  });

  const publishMutation = trpc.graceXlsRunner.publishToAdo.useMutation({
    onSuccess: (data) => {
      toast.success(`Published to ADO — Run ID: ${data.adoRunId}`);
      if (data.adoRunUrl) window.open(data.adoRunUrl, "_blank");
    },
    onError: (err) => toast.error(`ADO publish failed: ${err.message}`),
  });

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollIntervalRef.current = setInterval(async () => {
      if (!importResult) return;
      try {
        const result = await utils.graceXlsRunner.pollRun.fetch({ runId: importResult.runId });
        setPollResult(result as unknown as PollResult);
        const st = (result as unknown as PollResult).run.status;
        if (st === "complete" || st === "failed") {
          setRunStatus(st as RunStatus);
          stopPolling();
        }
      } catch {
        // ignore transient errors
      }
    }, 2500);
  }, [importResult, utils, stopPolling]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setRunStatus("importing");
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      importMutation.mutate({
        filename: file.name,
        fileBase64: base64,
        targetBrowser: browser,
        targetEnvironment: environment,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStart = () => {
    if (!importResult) return;
    if (executionTarget === "remote_pc" && !selectedAgentId) {
      toast.error("Select a Desktop Agent to dispatch to, or switch execution target to Server");
      return;
    }
    startMutation.mutate({
      runId: importResult.runId,
      targetBrowser: browser,
      targetEnvironment: environment,
      targetBaseUrl: targetUrl || undefined,
      executionTarget,
      desktopAgentId: executionTarget === "remote_pc" && selectedAgentId ? Number(selectedAgentId) : undefined,
    });
  };

  const progress = pollResult
    ? Math.round(
        ((pollResult.run.passedTestCases ?? 0) + (pollResult.run.failedTestCases ?? 0)) /
        Math.max(pollResult.run.totalTestCases ?? 1, 1) * 100
      )
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <GraceWorkflowBanner currentStep="execute" outcomeKey="xls" />
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-blue-600" />
            XLSX Test Runner
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload a DDD v5.1 regression XLSX, select browser and environment, and execute the full test suite.
          </p>
        </div>

        {/* Upload & Config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1 — Upload & Configure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Regression XLSX File</Label>
                <div className="flex gap-2">
                  <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="text-sm" />
                </div>
                {file && (
                  <p className="text-xs text-muted-foreground">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Target Base URL (optional override)</Label>
                <Input
                  placeholder="https://pfaam-ist.example.gov.on.ca"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="browser-select">Browser</Label>
                <Select value={browser} onValueChange={(v) => setBrowser(v as BrowserValue)}>
                  <SelectTrigger id="browser-select" aria-label="Select browser"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BROWSERS.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment-select">Environment</Label>
                <Select value={environment} onValueChange={(v) => setEnvironment(v as EnvValue)}>
                  <SelectTrigger id="environment-select" aria-label="Select environment"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ENVIRONMENTS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ado-connection-select">ADO Connection</Label>
                <Select>
                  <SelectTrigger id="ado-connection-select" aria-label="Select ADO connection">
                    <SelectValue placeholder={
                      adoConnections.data?.length
                        ? "Select connection"
                        : "No connections — configure in Settings"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {adoConnections.data?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.label} ({c.adoProject} — {c.environment})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Execution Target */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  Execution Target
                  <span className="text-xs text-muted-foreground font-normal">(where Playwright runs)</span>
                </Label>
                <Select value={executionTarget} onValueChange={(v) => {
                  setExecutionTarget(v as ExecutionTarget);
                  if (v === "server") setSelectedAgentId("");
                }}>
                  <SelectTrigger aria-label="Select execution target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="server">
                      <span className="flex items-center gap-2">
                        <Server className="h-3.5 w-3.5" />
                        Portal Server (headless, no UI)
                      </span>
                    </SelectItem>
                    <SelectItem value="remote_pc">
                      <span className="flex items-center gap-2">
                        <Monitor className="h-3.5 w-3.5" />
                        Remote PC (Desktop Agent)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {executionTarget === "remote_pc" && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    Desktop Agent
                    {agentList.data?.length === 0 && (
                      <span className="text-xs text-amber-600 font-normal">
                        — none registered. <a href="/grace/desktop-agent" className="underline">Register one</a>
                      </span>
                    )}
                  </Label>
                  <Select
                    value={selectedAgentId}
                    onValueChange={setSelectedAgentId}
                    disabled={!agentList.data?.length}
                  >
                    <SelectTrigger aria-label="Select desktop agent">
                      <SelectValue placeholder={
                        agentList.isLoading ? "Loading agents…" :
                        agentList.data?.length ? "Select agent" :
                        "No agents registered"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {agentList.data?.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          <span className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${
                              a.isActive ? "bg-green-500" : "bg-gray-400"
                            }`} />
                            {a.label}{a.hostname ? ` (${a.hostname})` : ""}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                disabled={!file || runStatus === "importing" || runStatus === "running"}
                className="gap-2"
              >
                {runStatus === "importing"
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing…</>
                  : <><Upload className="h-4 w-4" /> Import XLSX</>}
              </Button>
              {importResult && runStatus === "queued" && (
                <Button onClick={handleStart} disabled={startMutation.isPending} className="gap-2 bg-green-600 hover:bg-green-700">
                  {startMutation.isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Starting…</>
                    : <><Play className="h-4 w-4" /> Start Execution</>}
                </Button>
              )}
              {importResult && (runStatus === "running" || runStatus === "complete" || runStatus === "failed") && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => importResult && utils.graceXlsRunner.pollRun.fetch({ runId: importResult.runId }).then((r) => setPollResult(r as unknown as PollResult))}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Import Summary */}
        {importResult && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">File</span>
                  <p className="font-medium">{importResult.filename}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Release</span>
                  <p className="font-medium">{importResult.releaseLabel ?? "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Test Cases</span>
                  <p className="font-medium">{importResult.totalCases}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Steps</span>
                  <p className="font-medium">{importResult.totalSteps}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-0.5">{getStatusBadge(runStatus)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        {pollResult && (runStatus === "running" || runStatus === "complete" || runStatus === "failed") && (
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {runStatus === "running"
                    ? `Executing — ${pollResult.run.totalTestCases ?? 0} test cases`
                    : runStatus === "complete" ? "Execution complete"
                    : "Execution failed"}
                </span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex gap-6 text-sm">
                <span className="text-green-600 font-medium">✓ {pollResult.run.passedTestCases ?? 0} passed</span>
                <span className="text-red-600 font-medium">✗ {pollResult.run.failedTestCases ?? 0} failed</span>
                <span className="text-muted-foreground">
                  {(pollResult.run.totalTestCases ?? 0) - (pollResult.run.passedTestCases ?? 0) - (pollResult.run.failedTestCases ?? 0)} pending
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Cases Table */}
        {pollResult && pollResult.testCases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Table aria-label="Test run steps">
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Case</TableHead>
                    <TableHead className="w-20">Steps</TableHead>
                    <TableHead className="w-28">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pollResult.testCases.map((tc) => (
                    <TableRow key={tc.id}>
                      <TableCell className="text-sm font-medium">{tc.testCaseName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{tc.totalSteps ?? "—"}</TableCell>
                      <TableCell>{getStatusBadge(tc.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Steps */}
        {pollResult && pollResult.recentSteps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Steps (last 20)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table aria-label="Test run results">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Object</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="w-20">Duration</TableHead>
                    <TableHead className="w-16">Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pollResult.recentSteps.map((step) => (
                    <TableRow
                      key={step.id}
                      className={
                        step.status === "failed" ? "bg-red-50 dark:bg-red-950/20" :
                        step.status === "passed" ? "bg-green-50 dark:bg-green-950/20" : ""
                      }
                    >
                      <TableCell className="text-xs text-muted-foreground">{step.stepNum}</TableCell>
                      <TableCell>{getStepIcon(step.status)}</TableCell>
                      <TableCell className="text-xs font-mono">{step.actionOnObject}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{step.object ?? "—"}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">
                        {step.errorMessage
                          ? <span className="text-red-600">{step.errorMessage}</span>
                          : step.actualResult ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {step.durationMs != null ? `${step.durationMs}ms` : "—"}
                      </TableCell>
                      <TableCell>
                        {(step.screenshotUrl || step.errorMessage) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => { setSelectedStep(step); setStepDialogOpen(true); }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Export & Publish */}
        {importResult && (runStatus === "complete" || runStatus === "failed") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export & Publish Results</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => exportMutation.mutate({ runId: importResult.runId })}
                disabled={exportMutation.isPending}
              >
                {exportMutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting…</>
                  : <><Download className="h-4 w-4" /> Download Results XLSX</>}
              </Button>
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                const connId = adoConnections.data?.find((c) => c.isDefault)?.id ?? adoConnections.data?.[0]?.id;
                if (!connId) { toast.error("No ADO connection configured — add one in Settings"); return; }
                publishMutation.mutate({ runId: importResult.runId, adoConnectionId: connId });
              }}
                disabled={publishMutation.isPending}
              >
                {publishMutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Publishing…</>
                  : <><Send className="h-4 w-4" /> Publish to Azure DevOps</>}
              </Button>
              {pollResult?.run.adoTestRunUrl && (
                <Button variant="ghost" className="gap-2 text-blue-600" asChild>
                  <a href={pollResult.run.adoTestRunUrl ?? ""} target="_blank" rel="noopener noreferrer">
                    View ADO Test Run
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Simulation notice */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-600" />
          <span>
            <strong>Browser execution requires the GRACE MCP Agent</strong> running locally on the QA workstation.
            The agent connects to Playwright via CDP, dispatches each step, and streams results back to this portal.
            Without the local agent, runs will remain in <em>queued</em> status.
            See the GRACE Architecture document for setup instructions.
          </span>
        </div>
      </div>

      {/* Step Detail Dialog */}
      <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="runner-dialog-desc" aria-labelledby="runner-dialog-title">
          <DialogHeader>
            <DialogTitle>Step {selectedStep?.stepNum} — {selectedStep?.actionOnObject}</DialogTitle>
            <DialogDescription>
              Execution detail for this test step including result, error, and screenshot.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="runner-dialog-desc" className="sr-only">View the details and result of this test step.</DialogDescription>
          {selectedStep && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Object</span>
                  <p className="font-mono text-xs mt-1 break-all">{selectedStep.object ?? "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <div className="mt-1">{getStatusBadge(selectedStep.status)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="mt-1">{selectedStep.durationMs != null ? `${selectedStep.durationMs}ms` : "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual Result</span>
                  <p className="mt-1">{selectedStep.actualResult ?? "—"}</p>
                </div>
              </div>
              {selectedStep.errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/20 rounded p-3">
                  <span className="text-red-600 font-semibold text-xs">Error</span>
                  <p className="text-red-700 dark:text-red-400 text-xs mt-1 font-mono break-all">{selectedStep.errorMessage}</p>
                </div>
              )}
              {selectedStep.screenshotUrl && (
                <div>
                  <span className="text-muted-foreground text-xs">Screenshot</span>
                  <img
                    src={selectedStep.screenshotUrl}
                    alt="Step screenshot"
                    className="mt-2 rounded border border-border w-full object-contain max-h-80"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
