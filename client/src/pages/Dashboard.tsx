import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  Puzzle,
  BookOpen,
  Accessibility,
  Link2,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  FileText,
  Users,
  TrendingUp,
  Code,
  Building2,
} from "lucide-react";

type Section = "overview" | "widgets" | "conversations" | "knowledge" | "accessibility" | "integrations" | "settings";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "widgets", label: "Widgets", icon: <Puzzle className="w-4 h-4" /> },
  { id: "conversations", label: "Conversations", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "knowledge", label: "Knowledge Base", icon: <BookOpen className="w-4 h-4" /> },
  { id: "accessibility", label: "Accessibility", icon: <Accessibility className="w-4 h-4" /> },
  { id: "integrations", label: "Integrations", icon: <Link2 className="w-4 h-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-slate-200 flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-lg text-slate-800">Hansen</span>
            </div>
          ) : (
            <Sparkles className="w-6 h-6 text-indigo-600 mx-auto" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Quick Links */}
        <div className="px-2 pb-2 space-y-1">
          <Link href="/snippets" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Code className="w-4 h-4" />
            {sidebarOpen && <span>Embed Snippets</span>}
          </Link>
          <Link href="/reseller" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Building2 className="w-4 h-4" />
            {sidebarOpen && <span>Reseller Portal</span>}
          </Link>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-slate-100">
          {sidebarOpen && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-700">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-slate-500 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-500 hover:text-slate-700 mr-4">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeSection === "knowledge" ? "Knowledge Base" : activeSection}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium capitalize">
              {user.role}
            </span>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-auto">
          {activeSection === "overview" && <OverviewSection />}
          {activeSection === "widgets" && <WidgetsSection />}
          {activeSection === "conversations" && <ConversationsSection />}
          {activeSection === "knowledge" && <KnowledgeBaseSection />}
          {activeSection === "accessibility" && <AccessibilitySection />}
          {activeSection === "integrations" && <IntegrationsSection />}
          {activeSection === "settings" && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}

// ─── Overview Section ────────────────────────────────────────────────────────
function OverviewSection() {
  const widgetsQuery = trpc.widget.list.useQuery();
  const widgets = widgetsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active Widgets" value={String(widgets.length)} icon={<Puzzle className="w-5 h-5 text-indigo-600" />} />
        <KPICard title="Conversations" value="—" icon={<MessageCircle className="w-5 h-5 text-green-600" />} />
        <KPICard title="Documents" value="—" icon={<FileText className="w-5 h-5 text-amber-600" />} />
        <KPICard title="Qualified Leads" value="—" icon={<TrendingUp className="w-5 h-5 text-purple-600" />} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 space-y-2">
          <p>1. Create a widget and configure your AI model</p>
          <p>2. Upload documents to your knowledge base</p>
          <p>3. Customize your widget theme and communication channels</p>
          <p>4. Generate the embed snippet and add it to your website</p>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Widgets Section ─────────────────────────────────────────────────────────
function WidgetsSection() {
  const widgetsQuery = trpc.widget.list.useQuery();
  const createWidget = trpc.widget.create.useMutation({
    onSuccess: () => widgetsQuery.refetch(),
  });
  const widgets = widgetsQuery.data || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{widgets.length} widget(s)</p>
        <Button
          onClick={() => createWidget.mutate({ name: `Widget ${widgets.length + 1}` })}
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={createWidget.isPending}
        >
          + New Widget
        </Button>
      </div>
      {widgets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            <Puzzle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No widgets yet. Create your first widget to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {widgets.map((w) => (
            <Card key={w.id}>
              <CardContent className="py-4">
                <Link href={`/widget/${w.id}`} className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-medium text-slate-800">{w.name}</h3>
                    <p className="text-sm text-slate-500">Theme: {w.theme} • Provider: {(w.aiProvider || "manus").toUpperCase()}{w.aiModel ? ` (${w.aiModel})` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${w.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {w.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Conversations Section ───────────────────────────────────────────────────
function ConversationsSection() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-slate-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Conversations will appear here once visitors interact with your widgets.</p>
      </CardContent>
    </Card>
  );
}

// ─── Knowledge Base Section ──────────────────────────────────────────────────
function KnowledgeBaseSection() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-slate-500">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Select a widget first, then upload documents to build your knowledge base.</p>
        <p className="text-xs mt-2">Supported formats: PDF, DOCX, TXT, CSV</p>
      </CardContent>
    </Card>
  );
}

// ─── Accessibility Section ───────────────────────────────────────────────────
function AccessibilitySection() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-slate-500">
        <Accessibility className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Configure the accessibility overlay that ships with your widget.</p>
        <p className="text-xs mt-2">Includes: Font sizing, contrast, dyslexia font, animation control, keyboard nav, screen reader, and more.</p>
      </CardContent>
    </Card>
  );
}

// ─── Integrations Section ────────────────────────────────────────────────────
function IntegrationsSection() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-slate-500">
        <Link2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Configure Ollama endpoint, communication channels, and third-party integrations.</p>
      </CardContent>
    </Card>
  );
}

// ─── Settings Section ────────────────────────────────────────────────────────
function SettingsSection() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-slate-500">
        <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Account settings, white-label configuration, and tenant management.</p>
      </CardContent>
    </Card>
  );
}
