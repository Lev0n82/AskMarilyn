import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Cpu,
  Code,
} from "lucide-react";

type Step = 1 | 2 | 3;

export default function Onboarding() {
  const [step, setStep] = useState<Step>(1);
  const [, navigate] = useLocation();

  // AI config state (Step 1)
  const [aiProvider, setAiProvider] = useState("manus");
  const [aiEndpoint, setAiEndpoint] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [widgetName, setWidgetName] = useState("");
  const [theme, setTheme] = useState("Warm Neutral");

  // Document state (Step 2)
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Created widget
  const [createdWidgetId, setCreatedWidgetId] = useState<number | null>(null);

  const createWidget = trpc.widget.create.useMutation();
  const uploadDoc = trpc.document.upload.useMutation();

  // Step 1 → Step 2: Create widget with AI provider config
  const handleStep1Complete = async () => {
    try {
      const result = await createWidget.mutateAsync({
        name: widgetName || "My First Widget",
        theme: theme as any,
        greeting: "Hi! How can I help you today?",
        suggestionChips: ["Pricing", "Features", "Contact Support"],
        aiProvider: aiProvider as any,
        aiApiBaseUrl: aiEndpoint || undefined,
        aiModel: aiModel || undefined,
      });
      setCreatedWidgetId(result.id);
      setStep(2);
    } catch (err) {
      console.error("Failed to create widget:", err);
    }
  };

  // Step 2 → Step 3: Upload documents then show snippet
  const handleStep2Complete = async () => {
    if (!createdWidgetId || documents.length === 0) {
      setStep(3);
      return;
    }
    setUploading(true);
    try {
      for (const file of documents) {
        const content = await readFileAsBase64(file);
        await uploadDoc.mutateAsync({
          widgetId: createdWidgetId,
          filename: file.name,
          mimeType: file.type || "text/plain",
          content,
        });
      }
      setUploadComplete(true);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      setStep(3);
    }
  };

  const baseUrl = window.location.origin;
  const embedCode = `<script src="${baseUrl}/api/widget/embed.js" data-widget-id="${createdWidgetId}"></script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress — 3 steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  s < step
                    ? "bg-green-500 text-white"
                    : s === step
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${s < step ? "bg-green-500" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div className="flex justify-between text-xs text-slate-500 mb-6 px-4">
          <span className={step === 1 ? "text-indigo-600 font-medium" : ""}>Connect AI</span>
          <span className={step === 2 ? "text-indigo-600 font-medium" : ""}>Upload Docs</span>
          <span className={step === 3 ? "text-indigo-600 font-medium" : ""}>Get Snippet</span>
        </div>

        {/* Step 1: Connect AI Provider */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Connect Your AI</h2>
              <p className="text-sm text-slate-500 mt-1">Choose how your widget will be powered and give it a name.</p>
            </div>

            <div className="space-y-4">
              {/* Widget name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Widget Name</label>
                <input
                  type="text"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder="e.g., Support Bot, Sales Helper"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Theme selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["Liquid Glass", "Warm Neutral", "Aurora Soft"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        theme === t ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-full h-6 rounded-lg mb-1.5 ${
                          t === "Liquid Glass"
                            ? "bg-gradient-to-r from-white/80 to-indigo-100/80 border border-white/50"
                            : t === "Aurora Soft"
                            ? "bg-gradient-to-r from-slate-900 to-purple-900"
                            : "bg-gradient-to-r from-slate-50 to-amber-50 border border-slate-200"
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-700">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Provider selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">AI Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "manus", label: "Hansen Cloud AI", desc: "Instant setup, no config needed" },
                    { id: "ollama", label: "Ollama", desc: "Self-hosted, local models" },
                    { id: "vllm", label: "vLLM", desc: "High-performance inference" },
                    { id: "openai_compatible", label: "OpenAI Compatible", desc: "Any compatible API" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setAiProvider(p.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        aiProvider === p.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800">{p.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {aiProvider !== "manus" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">API Endpoint URL</label>
                    <input
                      type="url"
                      value={aiEndpoint}
                      onChange={(e) => setAiEndpoint(e.target.value)}
                      placeholder={aiProvider === "ollama" ? "http://localhost:11434" : "http://your-server:8000"}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      placeholder={aiProvider === "ollama" ? "llama3.1:8b" : "model-name"}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
              )}

              {aiProvider === "manus" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium">No configuration needed!</p>
                  <p className="text-xs text-green-600 mt-1">
                    Hansen Cloud AI is ready to use immediately. You can switch to a self-hosted provider later.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleStep1Complete}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={createWidget.isPending}
              >
                {createWidget.isPending ? "Creating..." : "Next: Upload Documents"}{" "}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Upload Knowledge Base</h2>
              <p className="text-sm text-slate-500 mt-1">
                Add documents so your AI can answer questions about your business.
                <br />
                <span className="text-xs text-slate-400">(You can skip this and add documents later)</span>
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-400 mt-1">TXT, CSV supported (PDF, DOCX coming soon)</p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".txt,.csv,.pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setDocuments((prev) => [...prev, ...files]);
                  }}
                />
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <span className="text-sm text-slate-700 truncate">{doc.name}</span>
                      <button
                        onClick={() => setDocuments((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} disabled>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                onClick={handleStep2Complete}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : documents.length > 0
                  ? "Upload & Get Snippet"
                  : "Skip — Get Snippet"}{" "}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generate Embed Snippet */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Your Embed Snippet</h2>
              <p className="text-sm text-slate-500 mt-1">
                Copy this single line and paste it before the closing &lt;/body&gt; tag on your website.
              </p>
            </div>

            {uploadComplete && documents.length > 0 && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {documents.length} document{documents.length > 1 ? "s" : ""} uploaded to knowledge base
                </p>
              </div>
            )}

            <div className="bg-slate-900 rounded-xl p-4 relative">
              <code className="text-green-400 text-xs break-all font-mono">{embedCode}</code>
              <button
                onClick={() => navigator.clipboard.writeText(embedCode)}
                className="absolute top-2 right-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600"
              >
                Copy
              </button>
            </div>

            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <p className="text-sm text-indigo-800 font-medium">You're all set!</p>
              <p className="text-xs text-indigo-600 mt-1">
                Your AI-powered chat widget with accessibility overlay is ready to serve your visitors.
                You can configure more settings from your dashboard at any time.
              </p>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button
                onClick={() => navigate(`/widget/${createdWidgetId}`)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Configure Widget <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Hansen — Removing barriers. For everyone. Everywhere.
        </p>
      </div>
    </div>
  );
}

/** Read a File as base64 string */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:text/plain;base64,")
      const base64 = result.split(",")[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
