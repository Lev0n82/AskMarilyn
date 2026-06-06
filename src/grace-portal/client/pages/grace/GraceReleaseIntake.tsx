/**
 * GraceReleaseIntake — CSC-GRACE-AI v1.1
 *
 * Two-step release intake flow:
 *   Step 1: Paste raw release dashboard text → click Parse
 *   Step 2: Review/edit the parsed table → select ADO connection → click Confirm & Intake
 *
 * On confirmation, a grace_releases row is created and a grace_work_items row is
 * created for each selected item with status "pending", ready for ABT derivation.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ClipboardPaste, CheckCircle2, AlertTriangle, Loader2, ArrowRight, RotateCcw } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ParsedWorkItem {
  adoId: string;
  title: string;
  projectGroup: string;
  subGroup: string;
  rawLine: string;
}

interface ParseResult {
  platform: string;
  releaseName: string;
  releaseDate: string;
  category: string;
  label: string;
  codeFreeze: string;
  workItems: ParsedWorkItem[];
  parseWarnings: string[];
}

interface WorkItemRow extends ParsedWorkItem {
  include: boolean;
  adoConnectionId?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GraceReleaseIntake() {
  const [step, setStep] = useState<"paste" | "review" | "done">("paste");
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [editedHeader, setEditedHeader] = useState<Partial<ParseResult>>({});
  const [workItemRows, setWorkItemRows] = useState<WorkItemRow[]>([]);
  const [defaultConnectionId, setDefaultConnectionId] = useState<number | undefined>();
  const [confirmResult, setConfirmResult] = useState<{ releaseId: number; releaseName: string; workItemsCreated: number } | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // tRPC
  const parseMutation = trpc.graceRelease.parseRelease.useMutation();
  const confirmMutation = trpc.graceRelease.confirmIntake.useMutation();
  const { data: connections } = trpc.graceSettings.listAdoConnections.useQuery();
  const { data: releases, refetch: refetchReleases } = trpc.graceRelease.listReleases.useQuery();

  // ── Step 1: Parse ────────────────────────────────────────────────────────────
  const handleParse = async () => {
    if (!rawText.trim()) {
      toast.error("Please paste the release dashboard text first");
      return;
    }
    try {
      const result = await parseMutation.mutateAsync({ rawText });
      setParsed(result);
      setEditedHeader({
        platform: result.platform,
        releaseName: result.releaseName,
        releaseDate: result.releaseDate,
        category: result.category,
        label: result.label,
        codeFreeze: result.codeFreeze,
      });
      setWorkItemRows(result.workItems.map(wi => ({ ...wi, include: true })));
      if (result.parseWarnings.length > 0) {
        result.parseWarnings.forEach(w => toast.warning(w));
      }
      setStep("review");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Parse failed");
    }
  };

  // ── Step 2: Confirm ──────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!parsed) return;
    const included = workItemRows.filter(r => r.include);
    if (included.length === 0) {
      toast.error("Select at least one work item to intake");
      return;
    }
    try {
      const result = await confirmMutation.mutateAsync({
        platform: editedHeader.platform ?? parsed.platform,
        releaseName: editedHeader.releaseName ?? parsed.releaseName,
        releaseDate: editedHeader.releaseDate ?? parsed.releaseDate,
        category: editedHeader.category ?? parsed.category,
        label: editedHeader.label ?? parsed.label,
        codeFreeze: editedHeader.codeFreeze ?? parsed.codeFreeze,
        rawText,
        adoConnectionId: defaultConnectionId,
        workItems: included.map(r => ({
          adoId: r.adoId,
          title: r.title,
          projectGroup: r.projectGroup,
          subGroup: r.subGroup,
          rawLine: r.rawLine,
          include: true,
          adoConnectionId: r.adoConnectionId ?? defaultConnectionId,
        })),
      });
      setConfirmResult(result);
      setStep("done");
      refetchReleases();
      toast.success(`${result.workItemsCreated} work item(s) queued for ABT derivation`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Intake failed");
    }
  };

  const handleReset = () => {
    setStep("paste");
    setRawText("");
    setParsed(null);
    setEditedHeader({});
    setWorkItemRows([]);
    setConfirmResult(null);
  };

  const toggleAll = (checked: boolean) => {
    setWorkItemRows(rows => rows.map(r => ({ ...r, include: checked })));
  };

  const toggleRow = (adoId: string, checked: boolean) => {
    setWorkItemRows(rows => rows.map(r => r.adoId === adoId ? { ...r, include: checked } : r));
  };

  const selectedCount = workItemRows.filter(r => r.include).length;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <GraceWorkflowBanner currentStep="intake" outcomeKey="intake" />
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Release Intake</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Paste a release dashboard entry to parse work items and queue them for ABT test derivation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setShowHistoryDialog(true); refetchReleases(); }}>
            Release History
          </Button>
          {step !== "paste" && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" /> New Intake
            </Button>
          )}
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        <span className={step === "paste" ? "font-semibold text-primary" : "text-muted-foreground"}>1. Paste</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className={step === "review" ? "font-semibold text-primary" : "text-muted-foreground"}>2. Review</span>
        <ArrowRight className="w-3 h-3 text-muted-foreground" />
        <span className={step === "done" ? "font-semibold text-green-600" : "text-muted-foreground"}>3. Confirmed</span>
      </div>

      {/* ── Step 1: Paste ── */}
      {step === "paste" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="release-paste">
              Release Dashboard Text
              <span className="text-muted-foreground font-normal ml-2 text-xs">
                Copy from the release dashboard and paste below (tab-separated or colon-separated header format)
              </span>
            </Label>
            <Textarea
              id="release-paste"
              placeholder={`Platform/Application\tEDCS\nRelease Name\tEDCS 26.6\nRelease Date\t2026-06-11\nCategory\tRelease - Minor\nLabel\t26.6\nCode Freeze\t2026-05-22\nMCU Projects\nCGRT Enhancements:\n129389 - Automate Snapshot Date to Provide Access to Latest Data Period in CGRT EDCS\nCSER :\n129297 - Update CSER Labeling from "Collaborative Nursing" to "Nursing" Across UI and Reports\nEDU Projects\nDual Credits CRs/FRs:\n130866 - As a EDCS user, I want the following listed text changes to be made`}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              className="min-h-[280px] font-mono text-xs"
              aria-describedby="release-paste-hint"
            />
            <p id="release-paste-hint" className="text-xs text-muted-foreground">
              Supported formats: tab-separated (Excel copy-paste) or colon-separated. Work items must follow the pattern: <code className="bg-muted px-1 rounded">123456 - Title text</code>
            </p>
          </div>
          <Button
            onClick={handleParse}
            disabled={parseMutation.isPending || !rawText.trim()}
            className="w-full sm:w-auto"
          >
            {parseMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Parsing…</>
            ) : (
              <><ClipboardPaste className="w-4 h-4 mr-2" /> Parse Release Dashboard</>
            )}
          </Button>
        </div>
      )}

      {/* ── Step 2: Review ── */}
      {step === "review" && parsed && (
        <div className="space-y-6">
          {/* Editable header fields */}
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Release Header</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(
                [
                  { key: "platform", label: "Platform / Application" },
                  { key: "releaseName", label: "Release Name" },
                  { key: "releaseDate", label: "Release Date" },
                  { key: "category", label: "Category" },
                  { key: "label", label: "Label" },
                  { key: "codeFreeze", label: "Code Freeze" },
                ] as { key: keyof ParseResult; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`header-${key}`} className="text-xs">{label}</Label>
                  <Input
                    id={`header-${key}`}
                    value={(editedHeader[key] as string) ?? ""}
                    onChange={e => setEditedHeader(h => ({ ...h, [key]: e.target.value }))}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ADO Connection selector */}
          {connections && connections.length > 0 && (
            <div className="border rounded-lg p-4 space-y-2">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Default ADO Connection</h2>
              <p className="text-xs text-muted-foreground">
                Work items will be linked to this connection unless overridden per row.
              </p>
              <Select
                value={defaultConnectionId?.toString() ?? "none"}
                onValueChange={v => setDefaultConnectionId(v === "none" ? undefined : parseInt(v))}
              >
                <SelectTrigger className="w-72" aria-label="Default ADO connection">
                  <SelectValue placeholder="Select a connection…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No connection (manual later)</SelectItem>
                  {connections.filter(c => c.isActive).map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.label} — {c.adoProject} ({c.environment})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Work items table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
              <h2 className="font-semibold text-sm">
                Work Items
                <Badge variant="secondary" className="ml-2">{parsed.workItems.length} detected</Badge>
                <Badge variant="outline" className="ml-1">{selectedCount} selected</Badge>
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  id="select-all"
                  checked={selectedCount === workItemRows.length}
                  onCheckedChange={(checked) => toggleAll(!!checked)}
                  aria-label="Select all work items"
                />
                <label htmlFor="select-all" className="cursor-pointer">Select all</label>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="Work items">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" aria-label="Include"></TableHead>
                    <TableHead className="w-24">ADO ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-36">Project Group</TableHead>
                    <TableHead className="w-40">Sub-Group</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItemRows.map(row => (
                    <TableRow key={row.adoId} className={!row.include ? "opacity-50" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={row.include}
                          onCheckedChange={(checked) => toggleRow(row.adoId, !!checked)}
                          aria-label={`Include work item ${row.adoId}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-primary">
                        {row.adoId}
                      </TableCell>
                      <TableCell className="text-sm">{row.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{row.projectGroup}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.subGroup || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {workItemRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No work items were detected. Check the format of the pasted text.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Parse warnings */}
          {parsed.parseWarnings.length > 0 && (
            <div className="border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4" /> Parse Warnings
              </div>
              {parsed.parseWarnings.map((w, i) => (
                <p key={i} className="text-xs text-yellow-700 dark:text-yellow-400 ml-6">{w}</p>
              ))}
            </div>
          )}

          {/* Confirm button */}
          <div className="flex gap-3">
            <Button
              onClick={handleConfirm}
              disabled={confirmMutation.isPending || selectedCount === 0}
            >
              {confirmMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating work items…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm & Intake {selectedCount} Item{selectedCount !== 1 ? "s" : ""}</>
              )}
            </Button>
            <Button variant="outline" onClick={handleReset}>Cancel</Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Done ── */}
      {step === "done" && confirmResult && (
        <div className="border border-green-300 bg-green-50 dark:bg-green-950/20 rounded-xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
          <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
            Release Intake Complete
          </h2>
          <p className="text-green-700 dark:text-green-400">
            <strong>{confirmResult.releaseName}</strong> — {confirmResult.workItemsCreated} work item{confirmResult.workItemsCreated !== 1 ? "s" : ""} created and queued for ABT derivation.
          </p>
          <p className="text-sm text-muted-foreground">
            Go to <strong>Work Items</strong> to review, or <strong>ABT Workbench</strong> to derive test conditions for each item.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Button onClick={handleReset}>
              <ClipboardPaste className="w-4 h-4 mr-2" /> Intake Another Release
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/grace/workitems"}>
              View Work Items
            </Button>
          </div>
        </div>
      )}

      {/* ── Release History Dialog ── */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" aria-describedby="release-dialog-desc" aria-labelledby="release-dialog-title">
          <DialogHeader>
            <DialogTitle>Release History</DialogTitle>
            <DialogDescription>
              All releases that have been processed through the GRACE intake pipeline.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="release-dialog-desc" className="sr-only">Confirm the parsed release details and work items before intake.</DialogDescription>
          {releases && releases.length > 0 ? (
            <Table aria-label="Suites in release">
              <TableHeader>
                <TableRow>
                  <TableHead>Release</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Intaked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {releases.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.releaseName}</TableCell>
                    <TableCell>{r.platform}</TableCell>
                    <TableCell className="text-xs">{r.releaseDate ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "complete" ? "default" : "secondary"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No releases intaked yet.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
