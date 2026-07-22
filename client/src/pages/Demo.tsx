import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Phone,
  Mail,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type WidgetState = "pill" | "card" | "panel";
type ThemeName = "Liquid Glass" | "Warm Neutral" | "Aurora Soft";

const DEMO_CONFIG = {
  name: "Hansen AI",
  greeting: "Hi! I'm your AI assistant. How can I help you today?",
  chips: ["What can you do?", "Pricing info", "Talk to a human"],
};

export default function Demo() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("Liquid Glass");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-xl text-slate-800">Hansen</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm">
                Start Free — Forever
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Interactive Demo</h1>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Try the Hansen widget in all three theme styles. Each widget is fully functional
            and powered by AI. Click the chat pill to start a conversation.
          </p>
        </div>

        {/* Theme Selector */}
        <div className="flex justify-center gap-3 mb-10">
          {(["Liquid Glass", "Warm Neutral", "Aurora Soft"] as ThemeName[]).map((theme) => (
            <button
              key={theme}
              onClick={() => setActiveTheme(theme)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTheme === theme
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Mock Website */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500 bg-white px-3 py-0.5 rounded-md border">
                  yourwebsite.com
                </span>
              </div>
            </div>
            <div className={`relative min-h-[500px] p-6 ${
              activeTheme === "Aurora Soft" 
                ? "bg-slate-900" 
                : activeTheme === "Liquid Glass"
                  ? "bg-gradient-to-br from-indigo-50 via-purple-50/40 to-sky-50"
                  : "bg-amber-50/30"
            }`}>
              {/* Fake site content */}
              <div className={`space-y-4 ${activeTheme === "Aurora Soft" ? "text-slate-300" : "text-slate-600"}`}>
                <div className={`h-8 w-48 rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-700" 
                  : activeTheme === "Liquid Glass" ? "bg-white/60 backdrop-blur-sm border border-white/40" 
                  : "bg-stone-200"
                }`} />
                <div className={`h-4 w-full rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/40" 
                  : "bg-stone-100"
                }`} />
                <div className={`h-4 w-5/6 rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/40" 
                  : "bg-stone-100"
                }`} />
                <div className={`h-4 w-4/6 rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/40" 
                  : "bg-stone-100"
                }`} />
                <div className="h-8" />
                <div className={`h-32 w-full rounded-lg ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/50 backdrop-blur-sm border border-white/30" 
                  : "bg-stone-100 border border-stone-200"
                }`} />
                <div className={`h-4 w-full rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/40" 
                  : "bg-stone-100"
                }`} />
                <div className={`h-4 w-3/4 rounded ${
                  activeTheme === "Aurora Soft" ? "bg-slate-800" 
                  : activeTheme === "Liquid Glass" ? "bg-white/40" 
                  : "bg-stone-100"
                }`} />
              </div>

              {/* Widget Preview */}
              <DemoWidget theme={activeTheme} />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <ThemeInfoCard theme={activeTheme} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">How it works</h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Click the chat pill in the bottom-right corner of the mock website</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                  <span>The widget expands to a compact card with quick-action chips</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Click a chip or type a message to open the full chat panel</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Ask to "talk to a human" to see the multi-channel contact bar appear</span>
                </li>
              </ol>
            </div>
            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-6 text-center">
              <p className="text-sm text-indigo-700 mb-3">Ready to add this to your website?</p>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Start Free — Forever
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ThemeInfoCard({ theme }: { theme: ThemeName }) {
  const info = {
    "Liquid Glass": {
      description: "Inspired by the freedom of transformation and control granularity. Translucent frosted panels with layered depth, spectral gradients, and ethereal blur — giving users fine-grained control over how AI integrates with their brand.",
      best: "Corporate sites, SaaS products, premium brands",
      colors: ["bg-indigo-100/80", "bg-gradient-to-r from-indigo-500 to-purple-500", "bg-white/60"],
    },
    "Warm Neutral": {
      description: "Grounded in clarity and universal professionalism. Warm stone tones, amber accents, and generous whitespace — designed for environments where trust and readability are paramount.",
      best: "B2B, healthcare, finance, legal, government",
      colors: ["bg-stone-50", "bg-amber-600", "bg-amber-100"],
    },
    "Aurora Soft": {
      description: "Sophisticated dark mode with deep navy backgrounds and subtle purple-to-teal gradient accents. Modern and technical without being flashy.",
      best: "Developer tools, tech companies, gaming, creative agencies",
      colors: ["bg-slate-900", "bg-purple-600", "bg-slate-800"],
    },
  };

  const t = info[theme];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-2">{theme}</h3>
      <p className="text-sm text-slate-600 mb-3">{t.description}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-slate-500 font-medium">Best for:</span>
        <span className="text-xs text-slate-700">{t.best}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Palette:</span>
        <div className="flex gap-1">
          {t.colors.map((c, i) => (
            <div key={i} className={`w-5 h-5 rounded-full border border-slate-200 ${c}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoWidget({ theme }: { theme: ThemeName }) {
  const [state, setState] = useState<WidgetState>("pill");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeClasses = getThemeClasses(theme);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setLoading(true);

    try {
      const res = await fetch("/api/widget/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      if (data.showContactBar) setShowContactBar(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm here to help! This is a demo — sign up free to connect your own AI and knowledge base." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setState("panel");
    sendMessage(chip);
  };

  return (
    <div className="absolute bottom-4 right-4 z-50">
      {/* Pill */}
      {state === "pill" && (
        <button
          onClick={() => setState("card")}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 ${themeClasses.pill}`}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Need help?</span>
        </button>
      )}

      {/* Card */}
      {state === "card" && (
        <div className={`w-[280px] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${themeClasses.card}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.avatar}`}>
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold">{DEMO_CONFIG.name}</span>
              </div>
              <button onClick={() => setState("pill")} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-sm mb-3 ${theme === "Aurora Soft" ? "text-slate-300" : "text-slate-600"}`}>
              {DEMO_CONFIG.greeting}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {DEMO_CONFIG.chips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(chip)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${themeClasses.chip}`}
                >
                  {chip}
                </button>
              ))}
            </div>
            <button
              onClick={() => setState("panel")}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg border ${themeClasses.input}`}
            >
              Type your message...
            </button>
          </div>
        </div>
      )}

      {/* Panel */}
      {state === "panel" && (
        <div className={`w-[380px] h-[460px] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${themeClasses.panel}`}>
          {/* Header */}
          <div className={`px-4 py-3 flex items-center justify-between border-b ${themeClasses.header}`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.avatar}`}>
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{DEMO_CONFIG.name}</p>
                <p className="text-xs text-slate-500">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setState("card")} className="p-1 text-slate-400 hover:text-slate-600">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={() => setState("pill")} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className={`text-sm ${theme === "Aurora Soft" ? "text-slate-400" : "text-slate-500"}`}>
                  {DEMO_CONFIG.greeting}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {DEMO_CONFIG.chips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${themeClasses.chip}`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                  msg.role === "user" ? themeClasses.userBubble : themeClasses.assistantBubble
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-3 py-2 rounded-2xl text-sm ${themeClasses.assistantBubble}`}>
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Bar */}
          {showContactBar && (
            <div className="px-4 py-2 border-t bg-slate-50 flex items-center justify-center gap-3">
              <a href="#" className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full hover:bg-green-100">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                WhatsApp
              </a>
              <a href="#" className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100">
                <Phone className="w-3 h-3" /> Call
              </a>
              <a href="#" className="flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded-full hover:bg-purple-100">
                <Mail className="w-3 h-3" /> Email
              </a>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  theme === "Aurora Soft" ? "border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-800"
                }`}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-2 rounded-lg transition-colors ${themeClasses.sendBtn}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getThemeClasses(theme: string) {
  switch (theme) {
    case "Liquid Glass":
      return {
        pill: "bg-white/70 backdrop-blur-2xl border border-white/40 text-slate-700 shadow-[0_8px_32px_rgba(99,102,241,0.15),inset_0_1px_0_rgba(255,255,255,0.6)]",
        card: "bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_12px_40px_rgba(99,102,241,0.12)]",
        panel: "bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_16px_48px_rgba(99,102,241,0.1)]",
        header: "bg-white/50 backdrop-blur-md border-indigo-100/40",
        avatar: "bg-gradient-to-br from-indigo-200/80 to-purple-200/80 text-indigo-700",
        chip: "border-indigo-200/50 text-indigo-700 bg-indigo-50/40 backdrop-blur-sm hover:bg-indigo-100/50",
        input: "border-white/40 bg-white/30 backdrop-blur-sm text-slate-400",
        userBubble: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md",
        assistantBubble: "bg-white/60 backdrop-blur-sm text-slate-800 border border-white/40",
        sendBtn: "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 shadow-sm",
      };
    case "Aurora Soft":
      return {
        pill: "bg-slate-900 text-slate-100 border border-slate-700",
        card: "bg-slate-900 border border-slate-700 text-slate-100",
        panel: "bg-slate-900 border border-slate-700 text-slate-100",
        header: "bg-slate-800 border-slate-700",
        avatar: "bg-purple-900/50 text-purple-300",
        chip: "border-slate-600 text-slate-300 bg-slate-800 hover:bg-slate-700",
        input: "border-slate-600 bg-slate-800 text-slate-400",
        userBubble: "bg-purple-600 text-white",
        assistantBubble: "bg-slate-800 text-slate-200",
        sendBtn: "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50",
      };
    case "Warm Neutral":
    default:
      return {
        pill: "bg-stone-50 text-stone-700 border border-stone-300 shadow-sm",
        card: "bg-stone-50 border border-stone-200 shadow-md",
        panel: "bg-stone-50 border border-stone-200 shadow-md",
        header: "bg-stone-100 border-stone-200",
        avatar: "bg-amber-200 text-amber-800",
        chip: "border-amber-200 text-stone-700 bg-amber-50 hover:bg-amber-100",
        input: "border-stone-300 bg-white text-stone-400",
        userBubble: "bg-stone-800 text-white",
        assistantBubble: "bg-amber-50 text-stone-800 border border-amber-100",
        sendBtn: "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50",
      };
  }
}
