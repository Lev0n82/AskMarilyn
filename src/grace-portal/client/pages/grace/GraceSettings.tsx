/**
 * GraceSettings — CSC-GRACE-AI v1.1
 *
 * Admin-only settings page with three tabs:
 *   1. ADO Connections — add/edit/delete/test per-project ADO connections
 *   2. LLM Configuration — full multi-provider selector (Ollama local/cloud, OpenAI, Anthropic,
 *      Gemini, Azure OpenAI, Mistral, Cohere, custom OpenAI-compatible endpoint, Manus built-in)
 *   3. Quality Thresholds — testability, confidence, duplicate similarity thresholds
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { GraceWorkflowBanner } from "@/components/GraceWorkflowBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  TestTube2,
  ShieldCheck,
  ExternalLink,
  KeyRound,
  ToggleLeft,
  Lock,
  Unlock,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { GRACE_FEATURE_KEYS, type GraceFeatureKey } from "../../../../drizzle/schema";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AdoConnection {
  id: number;
  label: string;
  adoOrgUrl: string;
  adoProject: string;
  environment: string;
  isDefault: boolean;
  isActive: boolean;
  adoPatHint: string;
}

interface GlobalSettings {
  llmProvider: string;
  llmEndpoint: string;
  llmModel: string;
  llmTemperature: string;
  llmMaxTokens: number;
  llmSystemPrompt: string;
  llmApiKeyHint: string | null;
  testabilityThreshold: string;
  confidenceThreshold: string;
  duplicateSimilarityThreshold: string;
}

interface ProviderInfo {
  id: string;
  label: string;
  defaultEndpoint: string;
  requiresApiKey: boolean;
  requiresEndpoint: boolean;
  supportsModelList: boolean;
  defaultModels: string[];
  docsUrl: string;
  notes: string;
}

const ENVIRONMENTS = ["DEV", "IST", "UAT", "STAGE", "PROD"] as const;

const emptyConn = {
  label: "",
  adoOrgUrl: "",
  adoProject: "",
  environment: "IST" as typeof ENVIRONMENTS[number],
  adoPat: "",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function GraceSettings() {
  // ── ADO Connections ──────────────────────────────────────────────────────────
  const { data: connections, refetch: refetchConnections } =
    trpc.graceSettings.listAdoConnections.useQuery();
  const saveConnMutation = trpc.graceSettings.saveAdoConnection.useMutation();
  const deleteConn = trpc.graceSettings.deleteAdoConnection.useMutation();
  const setDefaultConn = trpc.graceSettings.setDefaultConnection.useMutation();
  const testConn = trpc.graceSettings.testAdoConnection.useMutation();

  const [connDialogOpen, setConnDialogOpen] = useState(false);
  const [editingConn, setEditingConn] = useState<AdoConnection | null>(null);
  const [connForm, setConnForm] = useState(emptyConn);
  const [testResults, setTestResults] = useState<Record<number, { success: boolean; message: string }>>({});

  const openAddDialog = () => {
    setEditingConn(null);
    setConnForm(emptyConn);
    setConnDialogOpen(true);
  };

  const openEditDialog = (conn: AdoConnection) => {
    setEditingConn(conn);
    setConnForm({
      label: conn.label,
      adoOrgUrl: conn.adoOrgUrl,
      adoProject: conn.adoProject,
      environment: conn.environment as typeof ENVIRONMENTS[number],
      adoPat: "",
    });
    setConnDialogOpen(true);
  };

  const handleSaveConn = async () => {
    if (!connForm.label.trim() || !connForm.adoOrgUrl.trim() || !connForm.adoProject.trim()) {
      toast.error("Label, Organisation URL, and Project are required");
      return;
    }
    try {
      if (editingConn) {
        await saveConnMutation.mutateAsync({ id: editingConn.id, ...connForm });
        toast.success("Connection updated");
      } else {
        await saveConnMutation.mutateAsync(connForm);
        toast.success("Connection added");
      }
      setConnDialogOpen(false);
      refetchConnections();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDeleteConn = async (id: number) => {
    if (!confirm("Delete this ADO connection? This cannot be undone.")) return;
    try {
      await deleteConn.mutateAsync({ id });
      toast.success("Connection deleted");
      refetchConnections();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultConn.mutateAsync({ id });
      toast.success("Default connection updated");
      refetchConnections();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set default");
    }
  };

  const handleTestConn = async (id: number) => {
    try {
      const result = await testConn.mutateAsync({ id });
      setTestResults(r => ({ ...r, [id]: result }));
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test failed");
    }
  };

  // ── LLM Settings ─────────────────────────────────────────────────────────────
  const { data: globalSettings, refetch: refetchSettings } =
    trpc.graceSettings.getGlobalSettings.useQuery();
  const { data: providerCatalogue } = trpc.graceSettings.getLlmProviders.useQuery();
  const saveLlm = trpc.graceSettings.saveLlm.useMutation();
  const testLlm = trpc.graceSettings.testLlmConnection.useMutation();
  const saveThresholds = trpc.graceSettings.saveThresholds.useMutation();

  const [llmTestResult, setLlmTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [llmForm, setLlmForm] = useState({
    llmProvider: "manus_builtin",
    llmEndpoint: "",
    llmModel: "manus-default",
    llmTemperature: "0.3",
    llmMaxTokens: 4096,
    llmSystemPrompt: "",
    llmApiKey: "",
  });

  const [thresholdForm, setThresholdForm] = useState({
    testabilityThreshold: "0.65",
    confidenceThreshold: "0.70",
    duplicateSimilarityThreshold: "0.85",
  });

  useEffect(() => {
    if (globalSettings) {
      const s = globalSettings as GlobalSettings;
      setLlmForm(f => ({
        ...f,
        llmProvider: s.llmProvider ?? f.llmProvider,
        llmEndpoint: s.llmEndpoint ?? f.llmEndpoint,
        llmModel: s.llmModel ?? f.llmModel,
        llmTemperature: s.llmTemperature ?? f.llmTemperature,
        llmMaxTokens: s.llmMaxTokens ?? f.llmMaxTokens,
        llmSystemPrompt: s.llmSystemPrompt ?? f.llmSystemPrompt,
      }));
      setThresholdForm({
        testabilityThreshold: s.testabilityThreshold ?? "0.65",
        confidenceThreshold: s.confidenceThreshold ?? "0.70",
        duplicateSimilarityThreshold: s.duplicateSimilarityThreshold ?? "0.85",
      });
    }
  }, [globalSettings]);

  const currentProvider: ProviderInfo | undefined = (providerCatalogue ?? []).find(
    (p: ProviderInfo) => p.id === llmForm.llmProvider
  );

  const handleSelectProvider = (p: ProviderInfo) => {
    setLlmForm(f => ({
      ...f,
      llmProvider: p.id,
      llmEndpoint: p.defaultEndpoint,
      llmModel: p.defaultModels[0] ?? "",
    }));
    setLlmTestResult(null);
  };

  const handleSaveLlm = async () => {
    try {
      await saveLlm.mutateAsync(llmForm);
      toast.success("LLM configuration saved");
      refetchSettings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleTestLlm = async () => {
    setLlmTestResult(null);
    try {
      const r = await testLlm.mutateAsync();
      setLlmTestResult(r);
    } catch (err) {
      setLlmTestResult({ success: false, message: err instanceof Error ? err.message : "Test failed" });
    }
  };

  // ── Azure Key Vault ──────────────────────────────────────────────────────────────
  const { data: kvSettings, refetch: refetchKv } = trpc.graceSettings.getKvSettings.useQuery();
  const saveKv = trpc.graceSettings.saveKvSettings.useMutation();
  const testKv = trpc.graceSettings.testKvConnection.useMutation();
  const [kvTestResult, setKvTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [kvForm, setKvForm] = useState({ kvVaultName: "", kvTenantId: "", kvClientId: "", kvClientSecret: "" });

  useEffect(() => {
    if (kvSettings) {
      setKvForm(f => ({ ...f,
        kvVaultName: kvSettings.kvVaultName ?? "",
        kvTenantId: kvSettings.kvTenantId ?? "",
        kvClientId: kvSettings.kvClientId ?? "",
      }));
    }
  }, [kvSettings]);

  const handleSaveKv = async () => {
    try {
      await saveKv.mutateAsync({
        kvVaultName: kvForm.kvVaultName.trim(),
        kvTenantId: kvForm.kvTenantId.trim(),
        kvClientId: kvForm.kvClientId.trim(),
        kvClientSecret: kvForm.kvClientSecret.trim() || undefined,
      });
      toast.success("Key Vault settings saved");
      setKvForm(f => ({ ...f, kvClientSecret: "" }));
      refetchKv();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleTestKv = async () => {
    setKvTestResult(null);
    try {
      const result = await testKv.mutateAsync();
      setKvTestResult(result);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test failed");
    }
  };

  const handleSaveThresholds = async () => {
    try {
      await saveThresholds.mutateAsync(thresholdForm);
      toast.success("Quality thresholds saved");
      refetchSettings();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <GraceWorkflowBanner currentStep="intake" outcomeKey="settings" compact />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">GRACE Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure ADO connections, LLM provider, and quality thresholds. Admin access only.
        </p>
      </div>

      <Tabs defaultValue="ado">
        <TabsList className="mb-4">
          <TabsTrigger value="ado">ADO Connections</TabsTrigger>
          <TabsTrigger value="llm">LLM Configuration</TabsTrigger>
          <TabsTrigger value="thresholds">Quality Thresholds</TabsTrigger>
          <TabsTrigger value="keyvault"><KeyRound className="w-3 h-3 mr-1" />Azure Key Vault</TabsTrigger>
          <TabsTrigger value="features"><ToggleLeft className="w-3 h-3 mr-1" />Features</TabsTrigger>
        </TabsList>

        {/* ── ADO Connections Tab ── */}
        <TabsContent value="ado" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Azure DevOps Connections</h2>
              <p className="text-sm text-muted-foreground">
                Each connection is a unique combination of Organisation URL, Project, and Environment.
                Run tests against multiple projects in parallel — each work item links to its own connection.
              </p>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-1" /> Add Connection
            </Button>
          </div>

          {connections && connections.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table aria-label="ADO connections">
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>Organisation URL</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>PAT</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connections.map((conn: AdoConnection) => (
                    <TableRow key={conn.id}>
                      <TableCell className="font-medium">
                        {conn.label}
                        {conn.isDefault && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            <Star className="w-3 h-3 mr-1" /> Default
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground max-w-[180px] truncate">
                        {conn.adoOrgUrl}
                      </TableCell>
                      <TableCell className="text-sm">{conn.adoProject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{conn.environment}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {conn.adoPatHint ? `••••${conn.adoPatHint}` : <span className="text-yellow-600">Not set</span>}
                      </TableCell>
                      <TableCell>
                        {testResults[conn.id] ? (
                          testResults[conn.id].success ? (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="w-3 h-3" /> Connected
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-red-600">
                              <XCircle className="w-3 h-3" /> Failed
                            </span>
                          )
                        ) : (
                          <Badge variant={conn.isActive ? "secondary" : "outline"} className="text-xs">
                            {conn.isActive ? "Active" : "Inactive"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            title="Test connection" onClick={() => handleTestConn(conn.id)}
                            disabled={testConn.isPending} aria-label={`Test ${conn.label}`}
                          >
                            {testConn.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <TestTube2 className="w-3 h-3" />}
                          </Button>
                          {!conn.isDefault && (
                            <Button
                              variant="ghost" size="icon" className="h-7 w-7"
                              title="Set as default" onClick={() => handleSetDefault(conn.id)}
                              aria-label={`Set ${conn.label} as default`}
                            >
                              <Star className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            title="Edit" onClick={() => openEditDialog(conn)}
                            aria-label={`Edit ${conn.label}`}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                            title="Delete" onClick={() => handleDeleteConn(conn.id)}
                            aria-label={`Delete ${conn.label}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-lg p-12 text-center text-muted-foreground space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto opacity-30" />
              <p className="font-medium">No ADO connections configured</p>
              <p className="text-sm">
                Add a connection to link GRACE work items to an Azure DevOps project.
                The PAT is encrypted at rest — only the last 4 characters are stored as a hint.
              </p>
              <Button size="sm" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-1" /> Add First Connection
              </Button>
            </div>
          )}

          {Object.entries(testResults).map(([id, result]) => (
            <div
              key={id}
              className={`text-xs px-3 py-2 rounded border ${result.success
                ? "border-green-300 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                : "border-red-300 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"}`}
            >
              <strong>Connection {id}:</strong> {result.message}
            </div>
          ))}
        </TabsContent>

        {/* ── LLM Configuration Tab ── */}
        <TabsContent value="llm" className="space-y-6">
          <div>
            <h2 className="font-semibold">LLM Configuration</h2>
            <p className="text-sm text-muted-foreground">
              GRACE can run on any LLM — local Ollama, cloud Ollama, OpenAI, Anthropic, Google Gemini,
              Azure OpenAI, Mistral, Cohere, or any custom OpenAI-compatible endpoint.
              Select a provider below to configure it.
            </p>
          </div>

          {/* Provider grid */}
          <div className="space-y-2">
            <Label>Provider</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {(providerCatalogue ?? []).map((p: ProviderInfo) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectProvider(p)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    llmForm.llmProvider === p.id
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div className="font-medium leading-tight">{p.label}</div>
                  {p.notes && (
                    <div className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">{p.notes}</div>
                  )}
                </button>
              ))}
            </div>
            {currentProvider?.docsUrl && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Documentation:{" "}
                <a href={currentProvider.docsUrl} target="_blank" rel="noreferrer" className="underline hover:text-foreground">
                  {currentProvider.docsUrl}
                </a>
              </p>
            )}
          </div>

          {/* Provider-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Endpoint — only when provider needs it */}
            {currentProvider?.requiresEndpoint && (
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="llm-endpoint">Endpoint URL</Label>
                <Input
                  id="llm-endpoint"
                  value={llmForm.llmEndpoint}
                  onChange={e => setLlmForm(f => ({ ...f, llmEndpoint: e.target.value }))}
                  placeholder={currentProvider.defaultEndpoint || "https://"}
                />
                <p className="text-xs text-muted-foreground">
                  {llmForm.llmProvider === "ollama_local"
                    ? "Local Ollama endpoint. Default: http://localhost:11434. Install Ollama from ollama.com."
                    : llmForm.llmProvider === "ollama_cloud"
                    ? "Your cloud Ollama instance URL (e.g. https://ollama.yourdomain.com)."
                    : "Custom OpenAI-compatible base URL (e.g. https://api.together.xyz/v1)."}
                </p>
              </div>
            )}

            {/* Model selector */}
            <div className="space-y-1.5">
              <Label htmlFor="llm-model">Model</Label>
              {currentProvider && currentProvider.defaultModels.length > 0 ? (
                <>
                  <Select
                    value={currentProvider.defaultModels.includes(llmForm.llmModel) ? llmForm.llmModel : "__custom__"}
                    onValueChange={v => {
                      if (v !== "__custom__") setLlmForm(f => ({ ...f, llmModel: v }));
                      else setLlmForm(f => ({ ...f, llmModel: "" }));
                    }}
                  >
                    <SelectTrigger id="llm-model"><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent>
                      {currentProvider.defaultModels.map((m: string) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                      <SelectItem value="__custom__">Custom (type below)…</SelectItem>
                    </SelectContent>
                  </Select>
                  {(!currentProvider.defaultModels.includes(llmForm.llmModel)) && (
                    <Input
                      value={llmForm.llmModel}
                      onChange={e => setLlmForm(f => ({ ...f, llmModel: e.target.value }))}
                      placeholder={llmForm.llmProvider === "ollama_local" ? "e.g. llama3.2:latest, mistral:latest" : "Model name"}
                    />
                  )}
                </>
              ) : (
                <Input
                  id="llm-model"
                  value={llmForm.llmModel}
                  onChange={e => setLlmForm(f => ({ ...f, llmModel: e.target.value }))}
                  placeholder="Model name"
                />
              )}
              {llmForm.llmProvider === "ollama_local" && (
                <p className="text-xs text-muted-foreground">
                  Run <code className="bg-muted px-1 rounded">ollama list</code> to see installed models.
                  Pull new models with <code className="bg-muted px-1 rounded">ollama pull &lt;model&gt;</code>.
                </p>
              )}
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <Label htmlFor="llm-temp">Temperature</Label>
              <Input
                id="llm-temp"
                value={llmForm.llmTemperature}
                onChange={e => setLlmForm(f => ({ ...f, llmTemperature: e.target.value }))}
                placeholder="0.3"
              />
              <p className="text-xs text-muted-foreground">
                0 = deterministic, 2 = highly creative. Recommended: 0.1–0.3 for test generation.
              </p>
            </div>

            {/* Max tokens */}
            <div className="space-y-1.5">
              <Label htmlFor="llm-tokens">Max Output Tokens</Label>
              <Input
                id="llm-tokens"
                type="number"
                min={256}
                max={32768}
                value={llmForm.llmMaxTokens}
                onChange={e => setLlmForm(f => ({ ...f, llmMaxTokens: parseInt(e.target.value) || 4096 }))}
              />
              <p className="text-xs text-muted-foreground">Recommended: 4096–8192 for ABT derivation.</p>
            </div>

            {/* API key — only when provider needs it */}
            {currentProvider?.requiresApiKey && (
              <div className="space-y-1.5">
                <Label htmlFor="llm-apikey">API Key</Label>
                <Input
                  id="llm-apikey"
                  type="password"
                  value={llmForm.llmApiKey}
                  onChange={e => setLlmForm(f => ({ ...f, llmApiKey: e.target.value }))}
                  placeholder="Paste your API key"
                  autoComplete="new-password"
                />
                {(globalSettings as GlobalSettings | undefined)?.llmApiKeyHint && (
                  <p className="text-xs text-muted-foreground">
                    Saved key hint:{" "}
                    <code className="bg-muted px-1 rounded">
                      ••••{(globalSettings as GlobalSettings).llmApiKeyHint}
                    </code>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* System prompt override */}
          <div className="space-y-1.5">
            <Label htmlFor="llm-prompt">System Prompt Override <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea
              id="llm-prompt"
              value={llmForm.llmSystemPrompt}
              onChange={e => setLlmForm(f => ({ ...f, llmSystemPrompt: e.target.value }))}
              placeholder="Leave blank to use the built-in DDD v5.1 ABT system prompt"
              className="min-h-[120px] font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              The built-in prompt follows DDD v5.1 Section 6.2. Override only if you need to customise
              derivation logic for a specific application domain.
            </p>
          </div>

          {/* Test result banner */}
          {llmTestResult && (
            <div className={`rounded-lg border px-4 py-3 text-sm flex items-start gap-2 ${
              llmTestResult.success
                ? "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300"
                : "border-red-400 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300"
            }`}>
              {llmTestResult.success
                ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{llmTestResult.message}</span>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleSaveLlm} disabled={saveLlm.isPending}>
              {saveLlm.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                : "Save LLM Configuration"}
            </Button>
            <Button variant="outline" onClick={handleTestLlm} disabled={testLlm.isPending}>
              {testLlm.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing…</>
                : <><TestTube2 className="w-4 h-4 mr-2" /> Test Connection</>}
            </Button>
          </div>
        </TabsContent>

        {/* ── Quality Thresholds Tab ── */}
        <TabsContent value="thresholds" className="space-y-6">
          <div>
            <h2 className="font-semibold">Quality Thresholds</h2>
            <p className="text-sm text-muted-foreground">
              These thresholds control when GRACE automatically routes work items to the HITL queue for human review.
              All values are between 0 and 1 (e.g. 0.65 = 65%).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="thresh-testability">Testability Threshold</Label>
              <Input
                id="thresh-testability"
                value={thresholdForm.testabilityThreshold}
                onChange={e => setThresholdForm(f => ({ ...f, testabilityThreshold: e.target.value }))}
                placeholder="0.65"
              />
              <p className="text-xs text-muted-foreground">
                Work items scoring below this are routed to HITL for clarification before ABT derivation proceeds.
                DDD v5.1 default: <strong>0.65</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thresh-confidence">Confidence Gate Threshold</Label>
              <Input
                id="thresh-confidence"
                value={thresholdForm.confidenceThreshold}
                onChange={e => setThresholdForm(f => ({ ...f, confidenceThreshold: e.target.value }))}
                placeholder="0.70"
              />
              <p className="text-xs text-muted-foreground">
                Derived test conditions with confidence below this are flagged for scope review before execution.
                DDD v5.1 default: <strong>0.70</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thresh-duplicate">Duplicate Similarity Threshold</Label>
              <Input
                id="thresh-duplicate"
                value={thresholdForm.duplicateSimilarityThreshold}
                onChange={e => setThresholdForm(f => ({ ...f, duplicateSimilarityThreshold: e.target.value }))}
                placeholder="0.85"
              />
              <p className="text-xs text-muted-foreground">
                Conditions with cosine similarity above this to an existing condition are flagged as potential duplicates.
                DDD v5.1 default: <strong>0.85</strong>
              </p>
            </div>
          </div>

          <Button onClick={handleSaveThresholds} disabled={saveThresholds.isPending}>
            {saveThresholds.isPending
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
              : "Save Thresholds"}
          </Button>
        </TabsContent>

        {/* ── Azure Key Vault Tab ── */}
        <TabsContent value="keyvault" className="space-y-6">
          <div>
            <h2 className="font-semibold flex items-center gap-2"><KeyRound className="w-4 h-4" /> Azure Key Vault</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Configure the service principal used by GRACE to retrieve test account passwords and reset credentials.
              The client secret is AES-256-GCM encrypted at rest — only a hint is shown after saving.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-lg">
            <div className="space-y-1">
              <Label>Vault Name</Label>
              <Input
                placeholder="e.g. qa-dev-app"
                value={kvForm.kvVaultName}
                onChange={e => setKvForm(f => ({ ...f, kvVaultName: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Short vault name only — GRACE calls <code className="bg-muted px-1 rounded">https://&lt;vault-name&gt;.vault.azure.net</code>.</p>
            </div>
            <div className="space-y-1">
              <Label>Tenant ID</Label>
              <Input
                placeholder="e.g. cddc1229-ac2a-4b97-b78a-0e5cacb5865c"
                value={kvForm.kvTenantId}
                onChange={e => setKvForm(f => ({ ...f, kvTenantId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Azure AD tenant ID for the service principal.</p>
            </div>
            <div className="space-y-1">
              <Label>Client ID (Application ID)</Label>
              <Input
                placeholder="e.g. 25bc4f7b-2c9e-4c13-9ffc-3ff55e140cfd"
                value={kvForm.kvClientId}
                onChange={e => setKvForm(f => ({ ...f, kvClientId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">The app registration client ID.</p>
            </div>
            <div className="space-y-1">
              <Label>Client Secret</Label>
              <Input
                type="password"
                placeholder={kvSettings?.kvClientSecretHint ? `Current: ••••${kvSettings.kvClientSecretHint} (leave blank to keep)` : "Enter client secret"}
                value={kvForm.kvClientSecret}
                onChange={e => setKvForm(f => ({ ...f, kvClientSecret: e.target.value }))}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">Leave blank to keep the existing secret. Stored AES-256-GCM encrypted.</p>
            </div>
          </div>

          {kvTestResult && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-md border ${
              kvTestResult.success
                ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300"
                : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300"
            }`}>
              {kvTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
              {kvTestResult.message}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSaveKv} disabled={saveKv.isPending}>
              {saveKv.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : "Save Key Vault Settings"}
            </Button>
            <Button variant="outline" onClick={handleTestKv} disabled={testKv.isPending || !kvSettings?.kvVaultName}>
              {testKv.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing…</> : <><TestTube2 className="w-4 h-4 mr-2" />Test Connection</>}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-1">Secret Name Encoding</h3>
            <p className="text-sm text-muted-foreground">GRACE encodes email addresses into Key Vault secret names using the AzureSecretManager convention:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-1 space-y-0.5">
              <li><code className="bg-muted px-1 rounded">_</code> → <code className="bg-muted px-1 rounded">---</code></li>
              <li><code className="bg-muted px-1 rounded">@</code> → <code className="bg-muted px-1 rounded">--</code></li>
              <li><code className="bg-muted px-1 rounded">.</code> → <code className="bg-muted px-1 rounded">-</code></li>
              <li>All characters lowercased</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Example: <code className="bg-muted px-1 rounded">aeac_bu@ontarioemail.ca</code> → <code className="bg-muted px-1 rounded">aeac---bu--ontarioemail-ca</code>
            </p>
          </div>
        </TabsContent>

        {/* ── Features Tab ── */}
        <FeatureFlagsTab />

      </Tabs>

      {/* ── Add / Edit Connection Dialog ── */}
      <Dialog open={connDialogOpen} onOpenChange={setConnDialogOpen}>
        <DialogContent className="max-w-lg" aria-describedby="settings-dialog-desc" aria-labelledby="settings-dialog-title">
          <DialogHeader>
            <DialogTitle>{editingConn ? "Edit ADO Connection" : "Add ADO Connection"}</DialogTitle>
            <DialogDescription>
              {editingConn
                ? "Update the connection details. Leave the PAT field blank to keep the existing token."
                : "Add a new Azure DevOps connection. The PAT is AES-256 encrypted at rest — only the last 4 characters are stored as a hint."}
            </DialogDescription>
          </DialogHeader>
          <DialogDescription id="settings-dialog-desc" className="sr-only">Configure the Azure DevOps connection details.</DialogDescription>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="conn-label">Label <span className="text-destructive">*</span></Label>
              <Input
                id="conn-label"
                value={connForm.label}
                onChange={e => setConnForm(f => ({ ...f, label: e.target.value }))}
                placeholder="e.g. EDCS IST, PFAAM UAT"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="conn-org">Organisation URL <span className="text-destructive">*</span></Label>
              <Input
                id="conn-org"
                value={connForm.adoOrgUrl}
                onChange={e => setConnForm(f => ({ ...f, adoOrgUrl: e.target.value }))}
                placeholder="https://dev.azure.com/your-org"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="conn-project">Project <span className="text-destructive">*</span></Label>
              <Input
                id="conn-project"
                value={connForm.adoProject}
                onChange={e => setConnForm(f => ({ ...f, adoProject: e.target.value }))}
                placeholder="e.g. EDCS, PFAAM, DataCollections"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="conn-env">Environment</Label>
              <Select
                value={connForm.environment}
                onValueChange={v => setConnForm(f => ({ ...f, environment: v as typeof ENVIRONMENTS[number] }))}
              >
                <SelectTrigger id="conn-env" aria-label="Environment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENVIRONMENTS.map(env => (
                    <SelectItem key={env} value={env}>{env}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="conn-pat">
                Personal Access Token (PAT)
                {editingConn && <span className="text-muted-foreground font-normal ml-1 text-xs">— leave blank to keep existing</span>}
                {!editingConn && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="conn-pat"
                type="password"
                value={connForm.adoPat}
                onChange={e => setConnForm(f => ({ ...f, adoPat: e.target.value }))}
                placeholder={editingConn ? "••••••••••••••••" : "Paste your ADO Personal Access Token"}
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Required scopes:{" "}
                <code className="bg-muted px-1 rounded">Work Items (Read &amp; Write)</code>,{" "}
                <code className="bg-muted px-1 rounded">Test Management (Read &amp; Write)</code>,{" "}
                <code className="bg-muted px-1 rounded">Build (Read)</code>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSaveConn}
                disabled={saveConnMutation.isPending}
                className="flex-1"
              >
                {saveConnMutation.isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                  : editingConn ? "Update Connection" : "Add Connection"}
              </Button>
              <Button variant="outline" onClick={() => setConnDialogOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Feature Flags Tab ──────────────────────────────────────────────────────────
function FeatureFlagsTab() {
  const { flags, isLoading, refetch } = useFeatureFlags();
  const { data: me } = trpc.auth.me.useQuery();
  const isAdmin = me?.role === "admin";

  const setAdminFlag = trpc.graceFeatureFlags.setAdminFlag.useMutation({
    onSuccess: () => { refetch(); toast.success("Global flag updated"); },
    onError: (e) => toast.error(e.message),
  });
  const setUserFlag = trpc.graceFeatureFlags.setUserFlag.useMutation({
    onSuccess: () => { refetch(); toast.success("Your preference saved"); },
    onError: (e) => toast.error(e.message),
  });

  const graceFlags = flags.filter(f => f.featureGroup === "grace");
  const lmsFlags = flags.filter(f => f.featureGroup === "lms");

  const renderFlagRow = (flag: typeof flags[0]) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{flag.label}</span>
          {flag.isAdminLocked && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" /> Admin locked
            </span>
          )}
          {!flag.isAdminLocked && flag.userOverride !== null && (
            <span className="flex items-center gap-1 text-xs text-amber-600">
              <Unlock className="w-3 h-3" /> Personalised
            </span>
          )}
        </div>
        {flag.description && (
          <p className="text-xs text-muted-foreground mt-0.5">{flag.description}</p>
        )}
      </div>
      <div className="flex items-center gap-4 shrink-0 ml-4">
        {/* User toggle — only shown if admin allows override */}
        {!flag.isAdminLocked && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">You</span>
            <Switch
              checked={flag.enabled}
              onCheckedChange={(v) => setUserFlag.mutate({ featureKey: flag.featureKey as GraceFeatureKey, enabled: v })}
              aria-label={`Toggle ${flag.label} for yourself`}
            />
          </div>
        )}
        {/* Admin global toggle — only shown to admins */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Global</span>
            <Switch
              checked={flag.adminDefault}
              onCheckedChange={(v) => setAdminFlag.mutate({
                featureKey: flag.featureKey as GraceFeatureKey,
                enabledByDefault: v,
                allowUserOverride: flag.allowUserOverride,
              })}
              aria-label={`Set global default for ${flag.label}`}
            />
          </div>
        )}
        {/* Admin lock toggle */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Lock</span>
            <Switch
              checked={!flag.allowUserOverride}
              onCheckedChange={(v) => setAdminFlag.mutate({
                featureKey: flag.featureKey as GraceFeatureKey,
                enabledByDefault: flag.adminDefault,
                allowUserOverride: !v,
              })}
              aria-label={`Lock ${flag.label} for all users`}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <TabsContent value="features" className="space-y-6">
      <div>
        <h2 className="font-semibold">Feature Flags</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control which screens and features are visible.
          {isAdmin
            ? " As an admin, you set the global default and can lock features so users cannot override them."
            : " You can personalise your experience unless a feature is locked by an admin."}
        </p>
        {isAdmin && (
          <div className="flex gap-6 text-xs text-muted-foreground mt-2 border rounded-lg p-3 bg-muted/30">
            <span><strong>You</strong> — your personal toggle (overrides global)</span>
            <span><strong>Global</strong> — default for all users</span>
            <span><strong>Lock</strong> — prevent users from changing this feature</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading feature flags…
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">GRACE Screens</h3>
            <div className="border rounded-lg px-4">
              {graceFlags.map((f) => <div key={f.featureKey}>{renderFlagRow(f)}</div>)}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Learning / LMS Screens</h3>
            <div className="border rounded-lg px-4">
              {lmsFlags.map((f) => <div key={f.featureKey}>{renderFlagRow(f)}</div>)}
            </div>
          </div>
        </>
      )}
    </TabsContent>
  );
}
