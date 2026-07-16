import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
import { Copy, Check, Code, ArrowLeft } from "lucide-react";

export default function SnippetGenerator() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: widgets = [] } = trpc.widget.list.useQuery(undefined, {
    enabled: !!user,
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) { setLocation("/login"); return null; }

  const getSnippetCode = (widgetId: number) => {
    const baseUrl = window.location.origin;
    return `<script src="${baseUrl}/widget.js" data-widget-id="${widgetId}" async></script>`;
  };

  const copyToClipboard = (widgetId: number) => {
    navigator.clipboard.writeText(getSnippetCode(widgetId));
    setCopiedId(widgetId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Code className="w-6 h-6" />
            Snippet Generator
          </h1>
          <p className="text-slate-500 mt-1">Copy the embed code and paste it into your website's HTML to activate the widget.</p>
        </div>

        {widgets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No widgets created yet. Create a widget first from the dashboard.</p>
              <Button onClick={() => setLocation("/dashboard")} className="mt-4">Go to Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {widgets.map((w: any) => (
              <Card key={w.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{w.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${w.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {w.isActive ? "Active" : "Inactive"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500 mb-2">Theme: {w.theme} | Model: {w.ollamaModel || "Not set"}</p>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 relative">
                    <code className="break-all">{getSnippetCode(w.id)}</code>
                    <button
                      onClick={() => copyToClipboard(w.id)}
                      className="absolute top-2 right-2 p-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                      aria-label="Copy snippet"
                    >
                      {copiedId === w.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Paste this single line into your website's HTML, just before the closing &lt;/body&gt; tag.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-2">
            <p>1. Copy the snippet code for your widget above.</p>
            <p>2. Paste it into your website's HTML, ideally before the closing <code className="bg-slate-100 px-1 rounded">&lt;/body&gt;</code> tag.</p>
            <p>3. The widget will automatically load and display on your site with the configured theme and settings.</p>
            <p>4. The accessibility overlay will also be injected if enabled in your widget settings.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
