/**
 * GraceDesktopAgent.tsx
 *
 * Management page for GRACE Desktop Agents.
 * Users can:
 *   - Register a new agent (generates a pairing token)
 *   - See all registered agents with their last-seen status
 *   - Download the desktop agent installer
 *   - Revoke agents
 *   - Rename agents
 *
 * The desktop agent is a small Node.js application that:
 *   1. Connects to GRACE via the pairing token
 *   2. Receives test execution commands via WebSocket
 *   3. Runs Playwright on the local Windows machine
 *   4. Streams stdout back to GRACE in real time
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Monitor,
  Plus,
  Copy,
  Trash2,
  Pencil,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Terminal,
  Info,
  ExternalLink,
  FileCode,
  BookOpen,
  Loader2,
} from "lucide-react";

function formatLastSeen(lastSeenAt: Date | null | string | undefined): { label: string; status: "online" | "recent" | "offline" | "never" } {
  if (!lastSeenAt) return { label: "Never connected", status: "never" };
  const d = new Date(lastSeenAt);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 2) return { label: "Online now", status: "online" };
  if (diffMin < 10) return { label: `${diffMin}m ago`, status: "recent" };
  if (diffMin < 60) return { label: `${diffMin}m ago`, status: "offline" };
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return { label: `${diffH}h ago`, status: "offline" };
  return { label: `${Math.floor(diffH / 24)}d ago`, status: "offline" };
}

export default function GraceDesktopAgent() {
  const utils = trpc.useUtils();

  const { data: agents = [], isLoading } = trpc.graceDesktopAgent.list.useQuery();
  const { data: downloadInfo, isLoading: downloadLoading } =
    trpc.graceDesktopAgent.getAgentDownloadInfo.useQuery();

  const registerMutation = trpc.graceDesktopAgent.register.useMutation({
    onSuccess: () => utils.graceDesktopAgent.list.invalidate(),
  });
  const revokeMutation = trpc.graceDesktopAgent.revoke.useMutation({
    onSuccess: () => utils.graceDesktopAgent.list.invalidate(),
  });
  const renameMutation = trpc.graceDesktopAgent.rename.useMutation({
    onSuccess: () => utils.graceDesktopAgent.list.invalidate(),
  });

  const [registerOpen, setRegisterOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("My PC");
  const [newToken, setNewToken] = useState<string | null>(null);

  const [revokeId, setRevokeId] = useState<number | null>(null);
  const [renameId, setRenameId] = useState<number | null>(null);
  const [renameLabel, setRenameLabel] = useState("");

  const handleRegister = async () => {
    const result = await registerMutation.mutateAsync({ label: newLabel });
    setNewToken(result.pairingToken);
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Pairing token copied to clipboard");
  };

  const handleRevoke = async () => {
    if (revokeId == null) return;
    await revokeMutation.mutateAsync({ id: revokeId });
    setRevokeId(null);
    toast.success("Agent revoked");
  };

  const handleRename = async () => {
    if (renameId == null) return;
    await renameMutation.mutateAsync({ id: renameId, label: renameLabel });
    setRenameId(null);
    toast.success("Agent label updated");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <GraceWorkflowBanner currentStep="execute" outcomeKey="agents" />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Monitor className="h-6 w-6 text-primary" />
            AUTONOMOUS.ML Desktop Agent
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Run Playwright tests directly on your Windows or Linux machine. Install the
            AUTONOMOUS.ML agent, pair it with a token, and choose{" "}
            <strong>"Remote PC"</strong> when executing test suites.
          </p>
        </div>
        <Button onClick={() => { setNewLabel("My PC"); setNewToken(null); setRegisterOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Register Agent
        </Button>
      </div>

      {/* How it works */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>1. Register an agent here to get a pairing token.</p>
          <p>2. Download and install the AUTONOMOUS.ML agent on your machine (see below).</p>
          <p>3. Run the agent with your pairing token — it connects back to GRACE automatically and announces itself via heartbeat.</p>
          <p>4. When running test suites, select <strong>"Remote PC"</strong> as the execution target.</p>
          <p>5. GRACE sends test commands to your machine; results stream back in real time. If all locators fail on a step, the agent calls the LLM failure-analysis pipeline and routes the step to the HITL queue automatically.</p>
        </CardContent>
      </Card>

      {/* Download */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download AUTONOMOUS.ML Agent
            {downloadInfo?.latestRelease && (
              <Badge variant="secondary" className="ml-1 text-xs font-mono">
                {downloadInfo.latestRelease.tag}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Install the agent on any Windows or Linux/macOS machine where you want to run
            Playwright tests. The agent requires Node.js 22+ and Playwright.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {downloadLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking for latest release…
            </div>
          ) : (
            <>
              {/* Windows */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Windows</p>
                <div className="flex flex-wrap gap-2">
                  {downloadInfo?.latestRelease?.windowsExeUrl ? (
                    <Button variant="default" size="sm" className="gap-2" asChild>
                      <a href={downloadInfo.latestRelease.windowsExeUrl} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Windows Installer (.exe){" "}
                        <Badge variant="secondary" className="ml-1 text-xs">{downloadInfo.latestRelease.tag}</Badge>
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={downloadInfo?.agentDeployWindowsUrl ?? "#"} target="_blank" rel="noreferrer">
                        <FileCode className="h-4 w-4" />
                        deploy-windows.ps1
                        <Badge variant="outline" className="ml-1 text-xs text-yellow-500 border-yellow-500/40">No release yet</Badge>
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.windowsInstallScriptUrl ?? "#"} target="_blank" rel="noreferrer">
                      <Terminal className="h-4 w-4" />
                      install.ps1 (PowerShell)
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1">
                  irm {downloadInfo?.windowsInstallScriptUrl ?? "…"} | iex
                </p>
              </div>
              <Separator />
              {/* Linux / macOS */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Linux / macOS</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.agentDeployUnixUrl ?? "#"} target="_blank" rel="noreferrer">
                      <Terminal className="h-4 w-4" />
                      deploy-unix.sh (systemd / launchd)
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.unixInstallScriptUrl ?? "#"} target="_blank" rel="noreferrer">
                      <FileCode className="h-4 w-4" />
                      install.sh (portal + agent)
                    </a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1">
                  curl -fsSL {downloadInfo?.unixInstallScriptUrl ?? "…"} | bash
                </p>
              </div>
              <Separator />
              {/* Config + Docs */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Configuration &amp; Documentation</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.agentAppsettingsUrl ?? "#"} target="_blank" rel="noreferrer">
                      <FileCode className="h-4 w-4" />
                      appsettings.json
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.docsUrl ?? "#"} target="_blank" rel="noreferrer">
                      <BookOpen className="h-4 w-4" />
                      Architecture Docs
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={downloadInfo?.repoUrl ?? "#"} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      GitHub Repository
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Registered agents */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Registered Agents ({agents.filter(a => a.isActive).length} active)
        </h2>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : agents.filter(a => a.isActive).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground text-sm">
              No agents registered yet. Click "Register Agent" to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {agents.filter(a => a.isActive).map(agent => {
              const { label: seenLabel, status: seenStatus } = formatLastSeen(agent.lastSeenAt);
              return (
                <Card key={agent.id}>
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="relative shrink-0">
                      <Monitor className="h-8 w-8 text-muted-foreground" />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                          seenStatus === "online"
                            ? "bg-green-500"
                            : seenStatus === "recent"
                            ? "bg-yellow-500"
                            : "bg-zinc-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{agent.label}</span>
                        {agent.platform && (
                          <Badge variant="outline" className="text-xs">
                            {agent.platform}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                        {agent.hostname && <span>{agent.hostname}</span>}
                        <span className="flex items-center gap-1">
                          {seenStatus === "online" ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : seenStatus === "recent" ? (
                            <Clock className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-3 w-3 text-zinc-400" />
                          )}
                          {seenLabel}
                        </span>
                        {agent.agentVersion && (
                          <span>v{agent.agentVersion}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Rename"
                        onClick={() => { setRenameId(agent.id); setRenameLabel(agent.label); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        title="Revoke"
                        onClick={() => setRevokeId(agent.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Register Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Register Desktop Agent</DialogTitle>
            <DialogDescription>
              {newToken
                ? "Copy the pairing token below and use it when starting the desktop agent."
                : "Give this agent a label (e.g. 'My Work PC') so you can identify it later."}
            </DialogDescription>
          </DialogHeader>

          {!newToken ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent Label</label>
                <Input
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  placeholder="My Work PC"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRegisterOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending || !newLabel.trim()}
                >
                  {registerMutation.isPending ? "Generating…" : "Generate Token"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-3 font-mono text-xs break-all">
                  {newToken}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleCopyToken(newToken)}
                >
                  <Copy className="h-4 w-4" />
                  Copy Token
                </Button>
                <p className="text-xs text-muted-foreground">
                  Keep this token safe — it will not be shown again. Start the desktop agent with:
                </p>
                <div className="rounded bg-zinc-900 text-zinc-200 p-2 font-mono text-xs">
                  node grace-agent.mjs --token {newToken.slice(0, 8)}…
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setRegisterOpen(false)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Rename Dialog ───────────────────────────────────────────────────── */}
      <Dialog open={renameId != null} onOpenChange={open => !open && setRenameId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Agent</DialogTitle>
          </DialogHeader>
          <Input
            value={renameLabel}
            onChange={e => setRenameLabel(e.target.value)}
            placeholder="Agent label"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>Cancel</Button>
            <Button onClick={handleRename} disabled={renameMutation.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Revoke Confirm ──────────────────────────────────────────────────── */}
      <AlertDialog open={revokeId != null} onOpenChange={open => !open && setRevokeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Agent?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently deactivate the agent. Any running tests on this agent will be
              interrupted. You can register a new agent at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRevoke}
            >
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
