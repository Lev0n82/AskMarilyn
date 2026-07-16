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
  Code,
  Copy,
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
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ai">AI Model</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="ai">
            <AIModelTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
          </TabsContent>
          <TabsContent value="knowledge">
            <KnowledgeBaseTab widgetId={widget.id} />
          </TabsContent>
          <TabsContent value="channels">
            <ChannelsTab widget={widget} onUpdate={(data) => updateWidget.mutate({ id: widget.id, ...data })} />
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

// ─── AI Model Tab ────────────────────────────────────────────────────────────
function AIModelTab({ widget, onUpdate }: { widget: any; onUpdate: (data: any) => void }) {
  const [endpoint, setEndpoint] = useState(widget.ollamaEndpoint || "http://localhost:11434");
  const [model, setModel] = useState(widget.ollamaModel || "");
  const [systemPrompt, setSystemPrompt] = useState(widget.systemPrompt || "");
  const [qualificationPrompt, setQualificationPrompt] = useState(widget.qualificationPrompt || "");

  const testConnection = trpc.ollama.testConnection.useMutation();
  const modelsQuery = trpc.ollama.listModels.useQuery({ endpoint }, { enabled: false });

  const handleTest = () => {
    testConnection.mutate({ endpoint }, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(`Connected! ${data.modelCount} model(s) available.`);
          modelsQuery.refetch();
        } else {
          toast.error(`Connection failed: ${data.error}`);
        }
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Configuration</CardTitle>
        <CardDescription>Connect to your Ollama instance and configure the AI behavior</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Ollama Endpoint</Label>
          <div className="flex gap-2">
            <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="http://localhost:11434" />
            <Button variant="outline" onClick={handleTest} disabled={testConnection.isPending}>
              {testConnection.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
            </Button>
          </div>
          {testConnection.data && (
            <div className={`flex items-center gap-2 text-sm ${testConnection.data.success ? "text-green-600" : "text-red-600"}`}>
              {testConnection.data.success ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {testConnection.data.success ? `${testConnection.data.modelCount} models available` : testConnection.data.error}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Model</Label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="llama3.2" />
          {modelsQuery.data && modelsQuery.data.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {modelsQuery.data.map((m: any) => (
                <button
                  key={m.name}
                  onClick={() => setModel(m.name)}
                  className={`text-xs px-2 py-1 rounded border ${model === m.name ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>System Prompt</Label>
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant for..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Qualification Prompt</Label>
          <Textarea
            value={qualificationPrompt}
            onChange={(e) => setQualificationPrompt(e.target.value)}
            placeholder="When the user asks about pricing or wants to speak to a human, qualify them for human assistance."
            rows={3}
          />
          <p className="text-xs text-slate-500">This instructs the AI when to surface the human contact options.</p>
        </div>
        <Button
          onClick={() => onUpdate({ ollamaEndpoint: endpoint, ollamaModel: model, systemPrompt, qualificationPrompt })}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Save AI Configuration
        </Button>
      </CardContent>
    </Card>
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
                    <p className="text-xs text-slate-400">{doc.chunkCount} chunks • {doc.status}</p>
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
