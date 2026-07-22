import { useState, useRef, useEffect } from "react";
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
  Minus,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type WidgetState = "pill" | "card" | "panel";
type ThemeName = "Liquid Glass" | "Warm Neutral" | "Aurora Soft";

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
            Experience the progressive disclosure widget in all three theme styles.
            Each widget is fully functional and powered by AI.
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
                  ? theme === "Aurora Soft"
                    ? "bg-slate-900 text-white shadow-md border border-purple-500/50"
                    : theme === "Warm Neutral"
                      ? "bg-stone-800 text-white shadow-md"
                      : "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>

        {/* Demo Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Mock Website with Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Browser chrome */}
            <div className="bg-slate-100 px-4 py-2 flex items-center gap-2 border-b">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500 bg-white px-3 py-0.5 rounded-md border">
                  {activeTheme === "Warm Neutral" ? "solveo.com" : activeTheme === "Aurora Soft" ? "aurora.dev" : "acme-inc.com"}
                </span>
              </div>
            </div>
            {/* Website content area */}
            <div className={`relative min-h-[540px] overflow-hidden ${getMockSiteBackground(activeTheme)}`}>
              <MockSiteContent theme={activeTheme} />
              <DemoWidget theme={activeTheme} />
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <ThemeInfoCard theme={activeTheme} />
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Progressive Disclosure</h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
                  <span><strong>The Pill</strong> — A minimal floating element (~140×48px) that signals availability without intruding</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
                  <span><strong>The Card</strong> — Expands to 280×200px with a greeting, suggestion chips, and input field</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">3</span>
                  <span><strong>The Panel</strong> — Full 380×520px chat with history, agent info, and multi-channel contact bar</span>
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

/* ─── Mock Site Content ─── */
function MockSiteContent({ theme }: { theme: ThemeName }) {
  if (theme === "Liquid Glass") {
    return (
      <div className="p-6 pt-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="font-medium">Product ▾</span>
            <span>Resources ▾</span>
            <span>Pricing</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Log in</span>
            <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md">Get started</span>
          </div>
        </div>
        {/* Hero */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 leading-tight">
              The all-in-one<br />platform for<br />
              <span className="text-indigo-500">modern teams</span>
            </h2>
            <p className="text-xs text-slate-500 mt-3 max-w-[200px]">
              Plan, collaborate, and ship faster with everything you need in one beautiful workspace.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md">Get started</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">▶ Watch demo</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-6">Trusted by 10,000+ teams</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-slate-400">Linear</span>
              <span className="text-[10px] text-slate-400">Notion</span>
              <span className="text-[10px] text-slate-400">Vercel</span>
              <span className="text-[10px] text-slate-400">Discord</span>
            </div>
          </div>
          {/* Dashboard mockup */}
          <div className="w-[160px] bg-white/60 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-2 text-[8px] text-slate-600">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <span className="font-medium">Acme Inc.</span>
              <span className="ml-auto text-[7px]">Dashboard</span>
            </div>
            <div className="space-y-1 text-[7px] text-slate-400 pl-1">
              <div>Overview</div>
              <div>Home</div>
              <div>Tasks</div>
              <div>Calendar</div>
              <div>Analytics</div>
              <div>Settings</div>
            </div>
            <div className="mt-2 bg-indigo-50/50 rounded p-1">
              <span className="text-[7px] text-indigo-600 font-medium">+12.5%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (theme === "Warm Neutral") {
    return (
      <div className="p-6 pt-4">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-stone-800">✦ Solveo</span>
            <div className="flex items-center gap-4 ml-6 text-xs text-stone-500">
              <span>Product ▾</span>
              <span>Solutions ▾</span>
              <span>Resources ▾</span>
              <span>Pricing</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500">Log in</span>
            <span className="text-xs bg-stone-800 text-white px-3 py-1 rounded-md">Get started</span>
          </div>
        </div>
        {/* Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">NEW</span>
          <span className="text-[10px] text-stone-500">AI insights now in beta →</span>
        </div>
        {/* Hero */}
        <h2 className="text-2xl font-bold text-stone-900 text-center leading-tight">
          The all-in-one platform<br />to grow your business
        </h2>
        <p className="text-xs text-stone-500 text-center mt-2">
          Solveo helps teams streamline operations, automate workflows, and make data-driven decisions.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-xs bg-stone-800 text-white px-4 py-1.5 rounded-md">Get started free</span>
          <span className="text-xs text-stone-600 border border-stone-300 px-3 py-1.5 rounded-md">Book a demo</span>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[9px] text-stone-400">
          <span>✓ No credit card</span>
          <span>✓ Set up in minutes</span>
          <span>✓ Cancel anytime</span>
        </div>
        {/* Dashboard preview */}
        <div className="mt-4 bg-white rounded-lg border border-stone-200 p-3 shadow-sm">
          <div className="flex gap-3">
            <div className="w-20 space-y-1">
              <div className="text-[8px] bg-stone-800 text-white px-2 py-0.5 rounded">Overview</div>
              <div className="text-[8px] text-stone-400 px-2">Analytics</div>
              <div className="text-[8px] text-stone-400 px-2">Workflows</div>
              <div className="text-[8px] text-stone-400 px-2">Customers</div>
              <div className="text-[8px] text-stone-400 px-2">Integrations</div>
              <div className="text-[8px] text-stone-400 px-2">Settings</div>
            </div>
            <div className="flex-1">
              <div className="text-[9px] font-medium text-stone-700 mb-1">Overview</div>
              <div className="grid grid-cols-3 gap-2 text-[8px]">
                <div>
                  <div className="text-stone-400">Revenue</div>
                  <div className="font-bold text-stone-800">$128,540</div>
                  <div className="text-green-600">↑ 12.5%</div>
                </div>
                <div>
                  <div className="text-stone-400">New customers</div>
                  <div className="font-bold text-stone-800">842</div>
                  <div className="text-green-600">↑ 8.1%</div>
                </div>
                <div>
                  <div className="text-stone-400">Active users</div>
                  <div className="font-bold text-stone-800">2,521</div>
                  <div className="text-green-600">↑ 15.3%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-[9px] text-stone-400 text-center mt-4">Trusted by fast-growing teams</p>
        <div className="flex items-center justify-center gap-4 mt-1 text-[9px] text-stone-400">
          <span>▲ Acme</span>
          <span>◆ Luminous</span>
          <span>● Cloudix</span>
          <span>✦ Pivotal</span>
          <span>✧ Spherule</span>
        </div>
      </div>
    );
  }

  // Aurora Soft
  return (
    <div className="p-6 pt-4">
      {/* Nav */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-white">▲ Aurora</span>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Product ▾</span>
            <span>Solutions ▾</span>
            <span>Resources ▾</span>
            <span>Pricing</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Sign in</span>
          <span className="text-xs bg-white/10 text-white px-3 py-1 rounded-md border border-white/10">Get started</span>
        </div>
      </div>
      {/* Badge */}
      <div className="mb-4">
        <span className="text-[9px] text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">AI-POWERED PLATFORM</span>
      </div>
      {/* Hero */}
      <h2 className="text-3xl font-bold text-white leading-tight">
        Build smarter.<br />Ship faster.
      </h2>
      <p className="text-xs text-slate-400 mt-3 max-w-[280px]">
        Aurora helps teams collaborate, automate workflows, and deliver exceptional products with confidence.
      </p>
      <div className="flex items-center gap-3 mt-5">
        <span className="text-xs bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-1">Get started for free →</span>
        <span className="text-xs text-slate-400">Talk to sales</span>
      </div>
      <p className="text-[9px] text-slate-500 mt-2">✓ No credit card required</p>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mt-6 border-t border-slate-800 pt-4">
        <div>
          <div className="text-lg font-bold text-white">10k+</div>
          <div className="text-[8px] text-slate-500">Active teams</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">98.5%</div>
          <div className="text-[8px] text-slate-500">Uptime</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">2.5M+</div>
          <div className="text-[8px] text-slate-500">Tasks automated</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">40+</div>
          <div className="text-[8px] text-slate-500">Integrations</div>
        </div>
      </div>
      <p className="text-[8px] text-slate-600 uppercase tracking-wider mt-4">Trusted by innovative teams</p>
      <div className="flex items-center gap-4 mt-1 text-[9px] text-slate-500">
        <span>▲ Linear</span>
        <span>▲ Vercel</span>
        <span>◼ Notion</span>
        <span>✦ Slack</span>
        <span>◆ GitHub</span>
      </div>
    </div>
  );
}

function getMockSiteBackground(theme: ThemeName) {
  switch (theme) {
    case "Liquid Glass":
      return "bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20";
    case "Warm Neutral":
      return "bg-[#FAFAF8]";
    case "Aurora Soft":
      return "bg-[#0D1117]";
  }
}

/* ─── Theme Info Card ─── */
function ThemeInfoCard({ theme }: { theme: ThemeName }) {
  const info = {
    "Liquid Glass": {
      description: "Inspired by Apple's design language (iOS 26, macOS Tahoe). Translucent frosted glass panels with real-time refraction, backdrop blur, and multi-layered depth. Hierarchy through material rather than borders.",
      best: "Corporate sites, SaaS products, premium brands, luxury services",
      spec: "backdrop-filter: blur(40px) saturate(180%); 24px corners; 1px white inner border",
    },
    "Warm Neutral": {
      description: "Embraces the 'Calm Design' philosophy — technology should require the smallest possible amount of attention. Warm tones, generous whitespace, and crisp typography for trustworthy, efficient interfaces.",
      best: "B2B, healthcare, finance, legal, traditional corporate",
      spec: "Base: #FAFAF8; Accent: muted slate blue #4A5D7E; Borders: 1px solid #E5E4E0",
    },
    "Aurora Soft": {
      description: "Sophisticated dark mode with deep navy backgrounds and subtle glowing gradient meshes (auroras). Modern, technical, and polished — avoiding flat lifeless grays in favor of depth and visual interest.",
      best: "Developer tools, tech companies, gaming, creative agencies",
      spec: "Base: #0D1117; Surface: #161B22; Accent gradients at 15% opacity; Glow effects",
    },
  };

  const t = info[theme];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-2">{theme}</h3>
      <p className="text-sm text-slate-600 mb-3">{t.description}</p>
      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Best for:</span>
          <span className="text-xs text-slate-700">{t.best}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-slate-500 font-medium shrink-0">Spec:</span>
          <code className="text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">{t.spec}</code>
        </div>
      </div>
    </div>
  );
}

/* ─── Demo Widget ─── */
function DemoWidget({ theme }: { theme: ThemeName }) {
  const [state, setState] = useState<WidgetState>("pill");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; time?: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContactBar, setShowContactBar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Reset state when theme changes
  useEffect(() => {
    setState("pill");
    setMessages([]);
    setInput("");
    setShowContactBar(false);
  }, [theme]);

  const getTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content, time: getTime() }]);
    setLoading(true);

    try {
      const res = await fetch("/api/widget/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response, time: getTime() }]);
      if (data.showContactBar) setShowContactBar(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm here to help! Sign up free to connect your own AI and knowledge base.", time: getTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setState("panel");
    sendMessage(chip);
  };

  // ─── LIQUID GLASS ───
  if (theme === "Liquid Glass") {
    const chips = ["Product tour", "Pricing & plans", "Integrations"];
    return (
      <div className="absolute bottom-4 right-4 z-50">
        {state === "pill" && (
          <button
            onClick={() => setState("card")}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] text-slate-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium">Ask us anything</span>
          </button>
        )}

        {state === "card" && (
          <div className="w-[280px] rounded-[24px] bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_12px_40px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <button onClick={() => setState("pill")} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">How can we help?</h3>
              <div className="space-y-2 mb-4">
                {chips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(chip)}
                    className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-xl bg-indigo-50/50 backdrop-blur-sm border border-indigo-100/50 text-indigo-700 hover:bg-indigo-100/60 transition-colors"
                  >
                    <span className="text-indigo-400">✦</span>
                    {chip}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setState("panel")}
                className="w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/50 text-slate-400"
              >
                <span>Ask a question...</span>
                <Send className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {state === "panel" && (
          <div className="w-[380px] h-[480px] rounded-[24px] bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_16px_48px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100/50 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center overflow-hidden">
                  <span className="text-lg">👩</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Ava</p>
                  <p className="text-[11px] text-slate-500">Support Agent</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setState("card")} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button onClick={() => setState("pill")} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 mb-1">Today</p>
                  <div className="flex justify-start mt-3">
                    <div className="max-w-[80%] px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-sm text-sm text-slate-800 border border-white/50">
                      Hi there! 👋 I'd be happy to help you. What can I assist you with today?
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                    {chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleChipClick(chip)}
                        className="text-xs px-3 py-1.5 rounded-full bg-indigo-50/50 border border-indigo-100/50 text-indigo-700 hover:bg-indigo-100/60 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
                    <div className={`px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "bg-white/70 backdrop-blur-sm text-slate-800 border border-white/50"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.time && <p className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</p>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-white/70 backdrop-blur-sm text-sm text-slate-800 border border-white/50">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Contact Bar */}
            {showContactBar && (
              <div className="px-4 py-2 border-t border-slate-100/50 flex items-center justify-center gap-3">
                <a href="#" className="flex items-center gap-1 text-xs text-green-700 hover:underline">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
                <a href="#" className="flex items-center gap-1 text-xs text-slate-600 hover:underline">
                  <Phone className="w-3.5 h-3.5" /> Call us
                </a>
                <a href="#" className="flex items-center gap-1 text-xs text-slate-600 hover:underline">
                  <Mail className="w-3.5 h-3.5" /> Email us
                </a>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-100/50">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300/50"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">We typically reply in under 2 minutes</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── WARM NEUTRAL ───
  if (theme === "Warm Neutral") {
    const chips = ["Pricing", "Demo", "Support"];
    return (
      <div className="absolute bottom-4 right-4 z-50">
        {state === "pill" && (
          <button
            onClick={() => setState("card")}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-[#E5E4E0] shadow-[0_4px_12px_rgba(45,45,42,0.08)] text-stone-700 transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
              <span className="text-sm">👩</span>
            </div>
            <span className="text-sm font-medium text-stone-600">Hi, need help?</span>
          </button>
        )}

        {state === "card" && (
          <div className="w-[280px] rounded-[12px] bg-white border border-[#E5E4E0] shadow-[0_12px_40px_rgba(45,45,42,0.06)] overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                    <span className="text-lg">👩</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-stone-800">Hello! 👋</span>
                    <p className="text-xs text-stone-500">How can I help you today?</p>
                  </div>
                </div>
                <button onClick={() => setState("pill")} className="text-stone-400 hover:text-stone-600 transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {chips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(chip)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-[#E5E4E0] text-stone-600 bg-white hover:bg-stone-50 transition-colors"
                  >
                    {chip === "Pricing" && <span>◇</span>}
                    {chip === "Demo" && <span>▢</span>}
                    {chip === "Support" && <span>⊕</span>}
                    {chip}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setState("panel")}
                  className="flex-1 text-left text-sm px-3 py-2 rounded-lg border border-[#E5E4E0] text-stone-400 bg-white"
                >
                  Type your message...
                </button>
                <button className="p-2 rounded-lg bg-amber-500 text-white">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {state === "panel" && (
          <div className="w-[380px] h-[480px] rounded-[12px] bg-white border border-[#E5E4E0] shadow-[0_12px_40px_rgba(45,45,42,0.08)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#E5E4E0]">
              <div className="flex items-center gap-3">
                <button className="text-stone-400 hover:text-stone-600">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-stone-400">✦ Solveo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden">
                  <span className="text-lg">👩</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-800">Ava</p>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] text-stone-500">AI Support Agent</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-green-600">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setState("card")} className="p-1.5 text-stone-400 hover:text-stone-600">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                      <span className="text-sm">👩</span>
                    </div>
                    <div>
                      <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-white border border-[#E5E4E0] text-sm text-stone-700">
                        Hello! 👋 How can I help you today?
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5 px-1">10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-9">
                    {chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleChipClick(chip)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[#E5E4E0] text-stone-600 hover:bg-stone-50 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                      <span className="text-sm">👩</span>
                    </div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-amber-50 border border-amber-200 text-stone-800"
                        : "rounded-tl-sm bg-white border border-[#E5E4E0] text-stone-700"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.time && <p className={`text-[10px] text-stone-400 mt-0.5 ${msg.role === "user" ? "text-right" : ""} px-1`}>{msg.time}</p>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                    <span className="text-sm">👩</span>
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-white border border-[#E5E4E0] text-sm text-stone-700">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Contact Bar */}
            {showContactBar && (
              <div className="px-4 py-2 border-t border-[#E5E4E0] flex items-center justify-center gap-4">
                <a href="#" className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-800">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
                <a href="#" className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-800">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href="#" className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-800">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#E5E4E0]">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg border border-[#E5E4E0] bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
                  disabled={loading}
                />
                <button className="p-1.5 text-stone-400 hover:text-stone-600">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-stone-400 text-center mt-1.5">Powered by Solveo</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── AURORA SOFT ───
  const auroraChips = ["How does Aurora work?", "Pricing and plans", "Request a demo"];
  return (
    <div className="absolute bottom-4 right-4 z-50">
      {state === "pill" && (
        <button
          onClick={() => setState("card")}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-600 shadow-[0_4px_20px_rgba(168,85,247,0.4)] flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_28px_rgba(168,85,247,0.5)] active:scale-95"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {state === "card" && (
        <div className="w-[280px] rounded-[16px] bg-[#161B22] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-slate-400" />
              </div>
              <button onClick={() => setState("pill")} className="text-slate-500 hover:text-slate-300 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">How can we help?</h3>
            <p className="text-xs text-slate-400 mb-4">Our AI assistant is here to help you 24/7.</p>
            <div className="space-y-2 mb-4">
              {auroraChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChipClick(chip)}
                  className="flex items-center gap-2 w-full text-left text-xs px-3 py-2 rounded-lg bg-slate-800/50 border border-white/5 text-slate-300 hover:bg-slate-700/50 hover:border-white/10 transition-colors"
                >
                  <span className="text-purple-400">{i === 0 ? "✦" : i === 1 ? "▢" : "◎"}</span>
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/30 px-3 py-2">
              <button
                onClick={() => setState("panel")}
                className="flex-1 text-left text-xs text-slate-500"
              >
                Type your message...
              </button>
              <button className="p-1 rounded bg-emerald-500 text-white">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {state === "panel" && (
        <div className="w-[380px] h-[480px] rounded-[16px] bg-[#0D1117] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10 bg-[#161B22]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <span className="text-white font-bold text-xs">▲</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Aurora Support</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <p className="text-[11px] text-slate-400">AI Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setState("card")} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setState("pill")} className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 text-center">Today</p>
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                    <span className="text-white font-bold text-[9px]">▲</span>
                  </div>
                  <div>
                    <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[#161B22] border border-white/5 text-sm text-slate-200">
                      Hi! 👋 I'm your Aurora AI assistant. How can I help you today?
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5 px-1">10:30 AM</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {auroraChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleChipClick(chip)}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-slate-400 hover:bg-slate-700/50 hover:border-white/10 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "items-start gap-2"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                    <span className="text-white font-bold text-[9px]">▲</span>
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "rounded-tr-sm bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white border border-emerald-500/30"
                      : "rounded-tl-sm bg-[#161B22] border border-white/5 text-slate-200"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.time && (
                    <p className={`text-[10px] text-slate-600 mt-0.5 ${msg.role === "user" ? "text-right" : ""} px-1`}>
                      {msg.time} {msg.role === "user" && "✓✓"}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                  <span className="text-white font-bold text-[9px]">▲</span>
                </div>
                <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-[#161B22] border border-white/5 text-sm text-slate-200">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Bar */}
          {showContactBar && (
            <div className="px-4 py-2 border-t border-white/5">
              <p className="text-[10px] text-slate-500 text-center mb-2">Other ways to connect</p>
              <div className="flex items-center justify-center gap-2">
                <a href="#" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
                <a href="#" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 transition-colors">
                  <Phone className="w-3.5 h-3.5" /> Call us
                </a>
                <a href="#" className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Email us
                </a>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/5">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-[#161B22] border border-white/10 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Always show floating button when panel is open */}
      {state === "panel" && (
        <div className="absolute -bottom-0 -right-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-fuchsia-600 shadow-[0_4px_20px_rgba(168,85,247,0.4)] flex items-center justify-center opacity-60">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}
