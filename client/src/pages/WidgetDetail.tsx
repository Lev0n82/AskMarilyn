import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Upload,
  Trash2,
  FileText,
  Copy,
  Eye,
  Mic,
} from "lucide-react";

export default function WidgetDetail() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const widgetId = parseInt(params.id || "0");

  const widgetQuery = trpc.widget.getById.useQuery({ id: widgetId }, { enabled: widgetId > 0 });
  const updateWidget = trpc.widget.update.useMutation({
    onSuccess: () => {
      toast.success("Widget updated");
      widgetQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (!loading && !user) setLocation("/login");
  }, [user, loading, setLocation]);

  if (loading || widgetQuery.isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  const widget = widgetQuery.data;
  if (!widget) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Widget not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => setLocation("/dashboard")} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">{widget.name}</h1>
            <p className="text-sm text-slate-500">Widget Configuration</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Provider</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="voice">Voice Assistant</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="ai">
            <AIProviderTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="knowledge">
            <KnowledgeBaseTab widgetId={widget.id} />
          </TabsContent>
          <TabsContent value="channels">
            <ChannelsTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="voice">
            <VoiceAssistantTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="embed">
            <EmbedTab widgetId={widget.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ─── General Tab ─────────────────────────────────────────────────────────────
function GeneralTab({ widget, onUpdate }: { widget: any; onUpdate: (data: any) => void }) {
  const [name, setName] = useState(widget.name);
  const [theme, setTheme] = useState(widget.theme);
  const [greeting, setGreeting] = useState(widget.greeting || "");
  const [chips, setChips] = useState((widget.suggestionChips || []).join(", "));

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure your widget's appearance and behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Widget Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Liquid Glass">Liquid Glass</SelectItem>
              <SelectItem value="Warm Neutral">Warm Neutral</SelectItem>
              <SelectItem value="Aurora Soft">Aurora Soft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Greeting Message</Label>
          <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} placeholder="Hi there! How can I help?" />
        </div>
        <div className="space-y-2">
          <Label>Suggestion Chips (comma-separated)</Label>
          <Input value={chips} onChange={(e) => setChips(e.target.value)} placeholder="Pricing, Demo, Support" />
        </div>
        <Button
          onClick={() => onUpdate({
            name,
            theme,
            greeting,
            suggestionChips: chips.split(",").map((c: string) => c.trim()).filter(Boolean),
          })}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── AI Provider Tab ────────────────────────────────────────────────────────
function AIProviderTab({ widget, onUpdate }: { widget: any; onUpdate: (data: any) => void }) {
  const [provider, setProvider] = useState(widget.aiProvider || "manus");
  const [apiBaseUrl, setApiBaseUrl] = useState(widget.aiApiBaseUrl || "");
  const [apiKey, setApiKey] = useState(widget.aiApiKey || "");
  const [model, setModel] = useState(widget.aiModel || widget.ollamaModel || "");
  const [ollamaEndpoint, setOllamaEndpoint] = useState(widget.ollamaEndpoint || "http://localhost:11434");
  const [systemPrompt, setSystemPrompt] = useState(widget.systemPrompt || "");
  const [qualificationPrompt, setQualificationPrompt] = useState(widget.qualificationPrompt || "");

  const testOllama = trpc.ollama.testConnection.useMutation();
  const testOpenAI = trpc.ollama.testOpenAIConnection.useMutation();
  const ollamaModels = trpc.ollama.listModels.useQuery({ endpoint: ollamaEndpoint }, { enabled: false });
  const openaiModels = trpc.ollama.listOpenAIModels.useQuery(
    { baseUrl: apiBaseUrl, apiKey: apiKey || undefined },
    { enabled: false }
  );

  const handleTestConnection = () => {
    if (provider === "ollama") {
      testOllama.mutate({ endpoint: ollamaEndpoint }, {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(`Connected! ${data.modelCount} model(s) available.`);
            ollamaModels.refetch();
          } else {
            toast.error(`Connection failed: ${data.error}`);
          }
        },
      });
    } else if (provider === "vllm" || provider === "openai_compatible") {
      testOpenAI.mutate({ baseUrl: apiBaseUrl, apiKey: apiKey || undefined }, {
        onSuccess: (data) => {
          if (data.success) {
            toast.success(`Connected! ${data.modelCount} model(s) available.`);
            openaiModels.refetch();
          } else {
            toast.error(`Connection failed: ${data.error}`);
          }
        },
      });
    } else if (provider === "manus") {
      toast.success("Manus AI is always available — no configuration needed.");
    }
  };

  const handleSave = () => {
    onUpdate({
      aiProvider: provider,
      aiApiBaseUrl: apiBaseUrl || null,
      aiApiKey: apiKey || null,
      aiModel: model || null,
      ollamaEndpoint: provider === "ollama" ? ollamaEndpoint : widget.ollamaEndpoint,
      ollamaModel: provider === "ollama" ? model : widget.ollamaModel,
      systemPrompt,
      qualificationPrompt: qualificationPrompt || null,
    });
  };

  const availableModels = provider === "ollama"
    ? (ollamaModels.data || []).map((m: any) => m.name)
    : (openaiModels.data || []).map((m: any) => m.id || m.name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Provider</CardTitle>
          <CardDescription>
            Choose your AI backend. The demo uses Manus AI (always free). For on-premises, connect Ollama, vLLM, or any OpenAI-compatible API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="manus">Manus AI (Demo — Always Free)</SelectItem>
                <SelectItem value="ollama">Ollama (Local / Self-Hosted)</SelectItem>
                <SelectItem value="vllm">vLLM (OpenAI-Compatible)</SelectItem>
                <SelectItem value="openai_compatible">Custom OpenAI-Compatible API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {provider === "manus" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>Manus AI</strong> is pre-configured and always available at no cost for the demo.
                No API keys or endpoints needed. Responses are powered by high-quality language models.
              </p>
            </div>
          )}

          {provider === "ollama" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Ollama Endpoint</Label>
                <div className="flex gap-2">
                  <Input value={ollamaEndpoint} onChange={(e) => setOllamaEndpoint(e.target.value)} placeholder="http://localhost:11434" />
                  <Button variant="outline" onClick={handleTestConnection} disabled={testOllama.isPending}>
                    {testOllama.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
                  </Button>
                </div>
              </div>
              {testOllama.data && (
                <div className={`flex items-center gap-2 text-sm ${testOllama.data.success ? "text-green-600" : "text-red-600"}`}>
                  {testOllama.data.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testOllama.data.success ? `${testOllama.data.modelCount} models available` : testOllama.data.error}
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700">
                  Recommended models: <strong>llama3.2</strong>, <strong>granite3.1-dense</strong>, <strong>mistral</strong>, <strong>phi3</strong>.
                  All run locally on CPU — no GPU required.
                </p>
              </div>
            </div>
          )}

          {(provider === "vllm" || provider === "openai_compatible") && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>API Base URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={apiBaseUrl}
                    onChange={(e) => setApiBaseUrl(e.target.value)}
                    placeholder={provider === "vllm" ? "http://localhost:8000/v1" : "https://api.example.com/v1"}
                  />
                  <Button variant="outline" onClick={handleTestConnection} disabled={testOpenAI.isPending}>
                    {testOpenAI.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>API Key {provider === "vllm" && <span className="text-slate-400">(optional for local)</span>}</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              {testOpenAI.data && (
                <div className={`flex items-center gap-2 text-sm ${testOpenAI.data.success ? "text-green-600" : "text-red-600"}`}>
                  {testOpenAI.data.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {testOpenAI.data.success ? `${testOpenAI.data.modelCount} models available` : testOpenAI.data.error}
                </div>
              )}
              {provider === "vllm" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    vLLM serves models via an OpenAI-compatible API. Start with: <code>vllm serve meta-llama/Llama-3.2-3B-Instruct</code>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Model</Label>
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder={provider === "manus" ? "Auto-selected" : "Enter model name"} disabled={provider === "manus"} />
            {availableModels.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {availableModels.map((m: string) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`text-xs px-2 py-1 rounded border ${model === m ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Behavior</CardTitle>
          <CardDescription>Configure how the AI responds to visitors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant for..."
              rows={4}
            />
            <p className="text-xs text-slate-500">This sets the AI's personality and knowledge scope.</p>
          </div>
          <div className="space-y-2">
            <Label>Qualification Prompt</Label>
            <Textarea
              value={qualificationPrompt}
              onChange={(e) => setQualificationPrompt(e.target.value)}
              placeholder="When the user asks about pricing or wants to speak to a human, qualify them for human assistance."
              rows={3}
            />
            <p className="text-xs text-slate-500">This instructs the AI when to surface the human contact options (WhatsApp, Phone, Email).</p>
          </div>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save AI Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Voice Assistant Tab ────────────────────────────────────────────────────
function VoiceAssistantTab({ widget, onUpdate }: { widget: any; onUpdate: (data: any) => void }) {
  const [voiceEnabled, setVoiceEnabled] = useState(widget.voiceEnabled ?? false);
  const [activationMode, setActivationMode] = useState(widget.voiceActivationMode || "separate_toggle");
  const [idleOpacity, setIdleOpacity] = useState(widget.voiceIdleOpacity ?? 30);
  const [activeOpacity, setActiveOpacity] = useState(widget.voiceActiveOpacity ?? 90);
  const [scope, setScope] = useState(widget.voiceScope || "both");
  const [languageMode, setLanguageMode] = useState(widget.voiceLanguageMode || "auto_detect");
  const [languages, setLanguages] = useState((widget.voiceLanguages || ["en", "fr", "es"]).join(", "));
  const [position, setPosition] = useState(widget.voicePosition || "bottom_left");

  const handleSave = () => {
    onUpdate({
      voiceEnabled,
      voiceActivationMode: activationMode,
      voiceIdleOpacity: idleOpacity,
      voiceActiveOpacity: activeOpacity,
      voiceScope: scope,
      voiceLanguageMode: languageMode,
      voiceLanguages: languages.split(",").map((l: string) => l.trim()).filter(Boolean),
      voicePosition: position,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Voice Assistant (Eye Overlay)
          </CardTitle>
          <CardDescription>
            A semi-transparent eye overlay that listens and speaks in the user's language. Fully configurable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Voice Assistant</Label>
              <p className="text-xs text-slate-500 mt-1">Shows an ambient AI eye on the page that responds to voice</p>
            </div>
            <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
          </div>

          {voiceEnabled && (
            <>
              <div className="space-y-2">
                <Label>Activation Mode</Label>
                <Select value={activationMode} onValueChange={setActivationMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with_overlay">Appear with Accessibility Overlay</SelectItem>
                    <SelectItem value="separate_toggle">Separate Toggle Button</SelectItem>
                    <SelectItem value="always_visible">Always Visible</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">Controls when the eye appears on the page.</p>
              </div>

              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top_left">Top Left</SelectItem>
                    <SelectItem value="top_right">Top Right</SelectItem>
                    <SelectItem value="bottom_left">Bottom Left</SelectItem>
                    <SelectItem value="bottom_right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Idle Opacity: {idleOpacity}%</Label>
                <Slider
                  value={[idleOpacity]}
                  onValueChange={(v) => setIdleOpacity(v[0])}
                  min={5}
                  max={50}
                  step={5}
                />
                <p className="text-xs text-slate-500">How visible the eye is when not actively listening (5-50%).</p>
              </div>

              <div className="space-y-3">
                <Label>Active Opacity: {activeOpacity}%</Label>
                <Slider
                  value={[activeOpacity]}
                  onValueChange={(v) => setActiveOpacity(v[0])}
                  min={50}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-slate-500">How visible the eye becomes when actively listening/speaking (50-100%).</p>
              </div>

              <div className="space-y-2">
                <Label>Scope</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accessibility">Accessibility Commands Only</SelectItem>
                    <SelectItem value="chat">Full AI Chat Only</SelectItem>
                    <SelectItem value="both">Both (Accessibility + Chat)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  "Accessibility" handles commands like "make text bigger." "Chat" answers questions from your knowledge base.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Language Detection</Label>
                <Select value={languageMode} onValueChange={setLanguageMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto_detect">Auto-Detect Spoken Language</SelectItem>
                    <SelectItem value="pre_selected">Pre-Selected Languages</SelectItem>
                    <SelectItem value="user_chosen">User Chooses on Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(languageMode === "pre_selected" || languageMode === "user_chosen") && (
                <div className="space-y-2">
                  <Label>Supported Languages (comma-separated ISO codes)</Label>
                  <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="en, fr, es, de, ar" />
                  <p className="text-xs text-slate-500">ISO 639-1 codes: en=English, fr=French, es=Spanish, de=German, ar=Arabic, zh=Chinese, etc.</p>
                </div>
              )}

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-800">Preview</span>
                </div>
                <p className="text-xs text-indigo-700">
                  The eye overlay will appear at <strong>{position.replace("_", " ")}</strong> with{" "}
                  <strong>{idleOpacity}%</strong> opacity when idle, becoming <strong>{activeOpacity}%</strong> when
                  listening. It will handle <strong>{scope === "both" ? "accessibility commands and AI chat" : scope === "accessibility" ? "accessibility commands only" : "AI chat only"}</strong>.
                </p>
              </div>
            </>
          )}

          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save Voice Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Knowledge Base Tab ──────────────────────────────────────────────────────
function KnowledgeBaseTab({ widgetId }: { widgetId: number }) {
  const docsQuery = trpc.document.list.useQuery({ widgetId });
  const uploadDoc = trpc.document.upload.useMutation({
    onSuccess: () => {
      toast.success("Document uploaded and processed");
      docsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteDoc = trpc.document.delete.useMutation({
    onSuccess: () => {
      toast.success("Document deleted");
      docsQuery.refetch();
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["text/plain", "text/csv", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".txt") && !file.name.endsWith(".csv")) {
      toast.error("Unsupported file type. Please upload PDF, DOCX, TXT, or CSV.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadDoc.mutate({
        widgetId,
        filename: file.name,
        mimeType: file.type || "text/plain",
        content: base64,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const docs = docsQuery.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>Upload documents to power your AI with relevant context</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 mb-2">Drop files here or click to upload</p>
          <p className="text-xs text-slate-400 mb-4">Supported: PDF, DOCX, TXT, CSV</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadDoc.isPending}>
            {uploadDoc.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Choose File
          </Button>
        </div>

        {docs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Uploaded Documents ({docs.length})</h4>
            {docs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{doc.filename}</p>
                    <p className="text-xs text-slate-400">{doc.chunkCount} chunks &bull; {doc.status}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteDoc.mutate({ id: doc.id })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Channels Tab ────────────────────────────────────────────────────────────
function ChannelsTab({ widget, onUpdate }: { widget: any; onUpdate: (data: any) => void }) {
  const [whatsapp, setWhatsapp] = useState(widget.whatsappNumber || "");
  const [phone, setPhone] = useState(widget.phoneNumber || "");
  const [email, setEmail] = useState(widget.emailAddress || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Channels</CardTitle>
        <CardDescription>Configure contact options shown when a visitor is qualified for human help</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>WhatsApp Number</Label>
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+1234567890" />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" />
        </div>
        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@company.com" />
        </div>
        <p className="text-xs text-slate-500">These options appear only when the AI qualifies the user or the user explicitly requests human help.</p>
        <Button
          onClick={() => onUpdate({
            whatsappNumber: whatsapp || null,
            phoneNumber: phone || null,
            emailAddress: email || null,
          })}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Save Channels
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Embed Tab ───────────────────────────────────────────────────────────────
function EmbedTab({ widgetId }: { widgetId: number }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const snippet = `<script src="${baseUrl}/widget.js" data-widget-id="${widgetId}" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
    toast.success("Snippet copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embed Code</CardTitle>
        <CardDescription>Add this single line to your website to deploy the widget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{snippet}</code>
          </pre>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Paste this snippet before the closing <code>&lt;/body&gt;</code> tag on any page where you want the widget to appear.
            The script loads asynchronously and won't affect page performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
