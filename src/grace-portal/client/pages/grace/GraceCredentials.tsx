/**
 * GRACE Credential Registry — CSC-GRACE-AI v1.3
 *
 * Test account management. Passwords are NEVER stored — only Azure Key Vault secret names.
 *
 * New in v1.3:
 *   - Reveal Password  — fetches the live password from Azure Key Vault (shown for 30s then hidden)
 *   - Reset Password   — generates a new password and updates Azure Key Vault
 *   - Vault status badge — shows whether the KV secret exists and is not locked
 */

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, ShieldCheck, KeyRound, UserCheck, Trash2, Eye, EyeOff, RefreshCw, Loader2, Copy } from "lucide-react";

type Environment = "DEV" | "IST" | "UAT" | "STAGE" | "PROD";

const ENV_COLORS: Record<Environment, string> = {
  DEV: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IST: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  UAT: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  STAGE: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  PROD: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

/** Revealed password state per credential ID */
interface RevealState {
  password: string;
  expiresAt: number; // unix ms
}

export default function GraceCredentials() {
  const [showRegister, setShowRegister] = useState(false);
  const [envFilter, setEnvFilter] = useState<Environment | "ALL">("ALL");
  const [form, setForm] = useState({
    applicationName: "", environment: "IST" as Environment,
    organisation: "", userRole: "", username: "", vaultSecretName: "", description: "",
  });

  // Per-credential reveal state (password shown for 30s)
  const [revealed, setRevealed] = useState<Record<number, RevealState>>({});
  // Track which credential IDs are currently loading (reveal or reset)
  const [loadingReveal, setLoadingReveal] = useState<Set<number>>(new Set());
  const [loadingReset, setLoadingReset] = useState<Set<number>>(new Set());
  // Countdown timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const utils = trpc.useUtils();
  const { data: credentials, isLoading } = trpc.graceCredentials.list.useQuery({
    environment: envFilter === "ALL" ? undefined : envFilter,
  });

  const registerMutation = trpc.graceCredentials.register.useMutation({
    onSuccess: () => {
      toast.success("Credential registered. Vault secret name stored — no password persisted.");
      utils.graceCredentials.list.invalidate();
      setShowRegister(false);
      setForm({ applicationName: "", environment: "IST", organisation: "", userRole: "", username: "", vaultSecretName: "", description: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  const deactivateMutation = trpc.graceCredentials.deactivate.useMutation({
    onSuccess: () => { toast.success("Credential deactivated."); utils.graceCredentials.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const fetchFromVaultMutation = trpc.graceCredentials.fetchFromVault.useMutation();
  const resetPasswordMutation = trpc.graceCredentials.resetPassword.useMutation();

  // Auto-expire revealed passwords after 30s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setRevealed(prev => {
        const next = { ...prev };
        let changed = false;
        for (const id in next) {
          if (next[id].expiresAt <= now) {
            delete next[id];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleReveal = async (credId: number, vaultSecretName: string) => {
    // Toggle off if already revealed
    if (revealed[credId]) {
      setRevealed(prev => { const n = { ...prev }; delete n[credId]; return n; });
      return;
    }
    setLoadingReveal(prev => new Set(prev).add(credId));
    try {
      const result = await fetchFromVaultMutation.mutateAsync({ vaultSecretName });
      setRevealed(prev => ({
        ...prev,
        [credId]: { password: result.password, expiresAt: Date.now() + 30_000 },
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to retrieve from Key Vault");
    } finally {
      setLoadingReveal(prev => { const n = new Set(prev); n.delete(credId); return n; });
    }
  };

  const handleReset = async (credId: number, vaultSecretName: string) => {
    if (!confirm(`Reset password for ${vaultSecretName}?\n\nA new password will be generated and stored in Azure Key Vault.`)) return;
    setLoadingReset(prev => new Set(prev).add(credId));
    // Hide any currently revealed password for this cred
    setRevealed(prev => { const n = { ...prev }; delete n[credId]; return n; });
    try {
      const result = await resetPasswordMutation.mutateAsync({ credentialId: credId, vaultSecretName });
      toast.success(`Password reset successfully for ${vaultSecretName}`);
      // Show the new password for 30s
      setRevealed(prev => ({
        ...prev,
        [credId]: { password: result.newPassword, expiresAt: Date.now() + 30_000 },
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoadingReset(prev => { const n = new Set(prev); n.delete(credId); return n; });
    }
  };

  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password).then(() => toast.success("Password copied to clipboard"));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.applicationName || !form.userRole || !form.username || !form.vaultSecretName) {
      toast.error("Application, Role, Username, and Vault Secret Name are required.");
      return;
    }
    registerMutation.mutate(form);
  }

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <GraceWorkflowBanner currentStep="execute" outcomeKey="credentials" compact />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-green-500" aria-hidden="true" />
            Credential Registry
          </h1>
          <p className="text-sm text-muted-foreground">
            Test account registry — passwords stored in Azure Key Vault only. No secrets persisted here.
          </p>
        </div>
        <Button onClick={() => setShowRegister(true)} aria-label="Register new credential">
          <Plus className="h-4 w-4 mr-2" /> Register Account
        </Button>
      </div>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="py-3 flex items-center gap-3">
          <KeyRound className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" aria-hidden="true" />
          <p className="text-sm text-green-700 dark:text-green-400">
            <strong>Security:</strong> Only Azure Key Vault secret names are stored. Passwords are retrieved at runtime via the Key Vault API and never persisted in this database.
            Revealed passwords auto-hide after <strong>30 seconds</strong>.
          </p>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="env-filter" className="text-sm">Filter by environment:</Label>
        <Select value={envFilter} onValueChange={(v) => setEnvFilter(v as Environment | "ALL")}>
          <SelectTrigger id="env-filter" className="w-32" aria-label="Filter by environment">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="DEV">DEV</SelectItem>
            <SelectItem value="IST">IST</SelectItem>
            <SelectItem value="UAT">UAT</SelectItem>
            <SelectItem value="STAGE">STAGE</SelectItem>
            <SelectItem value="PROD">PROD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <div className="text-center py-12 text-muted-foreground">Loading…</div>}

      {!isLoading && (!credentials || credentials.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <UserCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
            <p className="text-muted-foreground">No credentials registered yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2" role="list" aria-label="Registered credentials">
        {credentials?.map((cred) => {
          const revealState = revealed[cred.id];
          const isRevealLoading = loadingReveal.has(cred.id);
          const isResetLoading = loadingReset.has(cred.id);
          const secondsLeft = revealState
            ? Math.max(0, Math.ceil((revealState.expiresAt - Date.now()) / 1000))
            : 0;

          return (
            <Card key={cred.id} className={!cred.isActive ? "opacity-60" : ""} role="listitem">
              <CardContent className="py-3 space-y-2">
                {/* Top row: identity + actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${ENV_COLORS[cred.environment as Environment] ?? ""}`}>
                          {cred.environment}
                        </span>
                        <span className="text-sm font-medium">{cred.applicationName}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{cred.userRole}</span>
                        {!cred.isActive && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>User: <strong className="text-foreground">{cred.username}</strong></span>
                        <span>Vault: <code className="bg-muted px-1 rounded">{cred.vaultSecretName}</code></span>
                        {cred.organisation && <span>Org: {cred.organisation}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {cred.isActive && (
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reveal / Hide password */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => handleReveal(cred.id, cred.vaultSecretName)}
                        disabled={isRevealLoading || isResetLoading}
                        aria-label={revealState ? `Hide password for ${cred.username}` : `Reveal password for ${cred.username}`}
                        title={revealState ? `Hide (${secondsLeft}s)` : "Reveal password from Key Vault"}
                      >
                        {isRevealLoading
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : revealState
                            ? <><EyeOff className="h-3 w-3" /><span className="hidden sm:inline">Hide ({secondsLeft}s)</span></>
                            : <><Eye className="h-3 w-3" /><span className="hidden sm:inline">Reveal</span></>
                        }
                      </Button>

                      {/* Reset password */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => handleReset(cred.id, cred.vaultSecretName)}
                        disabled={isRevealLoading || isResetLoading}
                        aria-label={`Reset password for ${cred.username}`}
                        title="Generate new password and update Key Vault"
                      >
                        {isResetLoading
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <><RefreshCw className="h-3 w-3" /><span className="hidden sm:inline">Reset</span></>
                        }
                      </Button>

                      {/* Deactivate */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => deactivateMutation.mutate({ id: cred.id })}
                        disabled={deactivateMutation.isPending}
                        aria-label={`Deactivate credential for ${cred.username}`}
                        title="Deactivate this credential"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Revealed password row */}
                {revealState && (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
                    <KeyRound className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
                    <code className="text-sm font-mono flex-1 text-amber-900 dark:text-amber-200 select-all">
                      {revealState.password}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-amber-700 hover:text-amber-900"
                      onClick={() => handleCopy(revealState.password)}
                      aria-label="Copy password to clipboard"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-amber-600 dark:text-amber-400 shrink-0">
                      hides in {secondsLeft}s
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Register Dialog */}
      <Dialog open={showRegister} onOpenChange={setShowRegister}>
        <DialogContent className="max-w-lg" aria-describedby="credentials-dialog-desc" aria-labelledby="credentials-dialog-title">
          <DialogHeader>
            <DialogTitle>Register Test Account</DialogTitle>
            <DialogDescription>
              Enter the test account details. Only the Azure Key Vault secret name is stored — no passwords are persisted.
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="credentials-dialog-desc" className="sr-only">Manage stored credentials for test execution environments.</DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-3" aria-label="Register credential form">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="appName">Application <span aria-label="required">*</span></Label>
                <Input id="appName" value={form.applicationName} onChange={(e) => setForm({ ...form, applicationName: e.target.value })} placeholder="e.g. PFAAM" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="env">Environment <span aria-label="required">*</span></Label>
                <Select value={form.environment} onValueChange={(v) => setForm({ ...form, environment: v as Environment })}>
                  <SelectTrigger id="env" aria-label="Select environment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["DEV", "IST", "UAT", "STAGE", "PROD"] as Environment[]).map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="role">User Role <span aria-label="required">*</span></Label>
                <Input id="role" value={form.userRole} onChange={(e) => setForm({ ...form, userRole: e.target.value })} placeholder="e.g. caseworker" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="org">Organisation</Label>
                <Input id="org" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} placeholder="e.g. CSCDDSB" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username <span aria-label="required">*</span></Label>
              <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. pfaam_caseworker@ontarioemail.ca" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="vault">Azure Key Vault Secret Name <span aria-label="required">*</span></Label>
              <Input id="vault" value={form.vaultSecretName} onChange={(e) => setForm({ ...form, vaultSecretName: e.target.value })} placeholder="e.g. pfaam---caseworker--ontarioemail-ca" required />
              <p className="text-xs text-muted-foreground">Format: replace @ with --, . with -, _ with ---</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowRegister(false)}>Cancel</Button>
              <Button type="submit" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? "Registering…" : "Register"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
