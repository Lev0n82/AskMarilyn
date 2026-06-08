import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  LogOut,
  PanelLeft,
  AlertTriangle,
  FileText,
  Bot,
  FlaskConical,
  FileSpreadsheet,
  ShieldCheck,
  PackageOpen,
  Activity,
  Info,
  Settings2,
  Monitor,
  HelpCircle,
  ClipboardList,
  BookOpen,
  Inbox,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import type { GraceFeatureKey } from "@/contexts/FeatureFlagsContext";

// ─── Navigation structure ────────────────────────────────────────────────────
// Groups are rendered top-to-bottom in workflow order.
// Items with featureKey are hidden when the feature flag is disabled.

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  featureKey?: GraceFeatureKey;
};

type NavGroup = {
  /** Section heading shown in expanded sidebar. Empty string = no heading (top-level). */
  heading: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  // ── Top-level ──────────────────────────────────────────────
  {
    heading: "",
    items: [
      { icon: LayoutDashboard, label: "Home", path: "/" },
      { icon: LayoutDashboard, label: "GRACE Dashboard", path: "/grace/dashboard" },
    ],
  },

  // ── 1. Intake ─────────────────────────────────────────────
  // Capture requirements, derive tests, review & approve
  {
    heading: "Intake",
    items: [
      { icon: PackageOpen,    label: "Release Intake",    path: "/grace/release",      featureKey: "grace_release_intake" },
      { icon: BookOpen,       label: "Work Items",        path: "/grace/workitems",    featureKey: "grace_workitems" },
      { icon: FlaskConical,   label: "ABT Workbench",     path: "/grace/abt",          featureKey: "grace_abt_workbench" },
      { icon: Bot,            label: "KISS Agent",        path: "/grace/kiss",         featureKey: "grace_kiss_agent" },
    ],
  },

  // ── 2. Review & Approval ──────────────────────────────────
  {
    heading: "Review & Approval",
    items: [
      { icon: FileText,       label: "Test Suites",       path: "/grace/suites",       featureKey: "grace_test_suites" },
      { icon: AlertTriangle,  label: "HITL Queue",        path: "/grace/hitl",         featureKey: "grace_hitl" },
    ],
  },

  // ── 3. Execution ──────────────────────────────────────────
  {
    heading: "Execution",
    items: [
      { icon: FileSpreadsheet, label: "XLSX Runner",      path: "/grace/xls",          featureKey: "grace_xls_runner" },
      { icon: Monitor,         label: "Desktop Agent",    path: "/grace/desktop-agent", featureKey: "grace_desktop_agent" },
    ],
  },

  // ── 4. Configuration ──────────────────────────────────────
  {
    heading: "Configuration",
    items: [
      { icon: ShieldCheck,    label: "Credentials",       path: "/grace/credentials",  featureKey: "grace_credentials" },
      { icon: Settings2,      label: "Settings",          path: "/grace/settings" },
    ],
  },

  // ── 5. Observability ──────────────────────────────────────
  {
    heading: "Observability",
    items: [
      { icon: Activity,       label: "Audit Log",         path: "/grace/audit",        featureKey: "grace_audit_log" },
      { icon: Info,           label: "Accessibility",     path: "/grace/accessibility", featureKey: "grace_accessibility" },
    ],
  },

  // ── 6. Support ────────────────────────────────────────────
  {
    heading: "Support",
    items: [
      { icon: HelpCircle,     label: "Help Centre",       path: "/grace/help" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isEnabled } = useFeatureFlags();
  const isMobile = useIsMobile();

  // Build flat list of visible items for mobile header label
  const allVisibleItems = NAV_GROUPS.flatMap(g =>
    g.items.filter(item => !item.featureKey || isEnabled(item.featureKey))
  );
  const activeMenuItem = allVisibleItems.find(item => item.path === location);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold tracking-tight truncate">
                    Navigation
                  </span>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 overflow-y-auto">
            <nav aria-label="Main navigation">
              {NAV_GROUPS.map((group, groupIdx) => {
                const visibleItems = group.items.filter(
                  item => !item.featureKey || isEnabled(item.featureKey)
                );
                if (visibleItems.length === 0) return null;

                return (
                  <div key={groupIdx} className="mb-1">
                    {/* Section heading — only shown when sidebar is expanded */}
                    {group.heading && !isCollapsed && (
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 select-none">
                        {group.heading}
                      </p>
                    )}
                    {/* Divider between groups when collapsed */}
                    {group.heading && isCollapsed && groupIdx > 0 && (
                      <div className="mx-3 my-1 border-t border-border/40" />
                    )}
                    <SidebarMenu className="px-2 py-0.5">
                      {visibleItems.map(item => {
                        const isActive = location === item.path;
                        return (
                          <SidebarMenuItem key={item.path}>
                            <SidebarMenuButton
                              isActive={isActive}
                              onClick={() => setLocation(item.path)}
                              tooltip={item.label}
                              className="h-9 transition-all font-normal"
                            >
                              <item.icon
                                className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                              />
                              <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </div>
                );
              })}
            </nav>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Resize handle */}
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main id="main-content" className="flex-1 p-4" tabIndex={-1}>
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
