import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, BookOpen, AlertTriangle, Layers, CheckCircle, Code, FileText, Trophy, Puzzle, Medal, MessageSquare, Clock, Wrench, Sparkles, XCircle, FileCode, PenTool, GraduationCap } from "lucide-react";
import { Search } from "@/components/Search";
import { useProgress } from "@/contexts/ProgressContext";
import { UserProfileMenu } from "@/components/UserProfileMenu";

interface LayoutProps {
  children: React.ReactNode;
}

// Main navigation items (course content and community features)
const menuItems = [
  { path: "/courses", label: "All Courses", icon: GraduationCap },
  { path: "/", label: "Introduction", icon: BookOpen },
  { path: "/module-1", label: "The Testing Paradox", icon: AlertTriangle },
  { path: "/module-2", label: "The Three Layers", icon: Layers },
  { path: "/module-3", label: "Anti-Patterns", icon: AlertTriangle },
  { path: "/module-4", label: "Architecture", icon: Layers },
  { path: "/module-5", label: "Language of Logic", icon: BookOpen },
  { path: "/module-6", label: "Test Life-Cycle", icon: Clock },
  { path: "/module-7", label: "Building Test Modules", icon: Wrench },
  { path: "/module-8", label: "Advanced Techniques", icon: Sparkles },
  { path: "/module-9", label: "Anti-Pattern Gallery", icon: XCircle },
  { path: "/module-10", label: "Test Design Template", icon: FileCode },
  { path: "/refactoring-challenge", label: "Refactoring Game", icon: Code },
  { path: "/boss-level", label: "The Architect's Challenge", icon: Trophy },
  { path: "/quiz", label: "Final Assessment", icon: CheckCircle },
  { path: "/test-builder", label: "Test Builder", icon: Puzzle },
  { path: "/leaderboard", label: "Leaderboard", icon: Medal },
  { path: "/forum", label: "Discussion Forum", icon: MessageSquare },
  // Bonus Courses
  { path: "/coding-style-guide", label: "Coding Style Guide", icon: FileCode },
  { path: "/commenting-guide", label: "Art of Commenting", icon: MessageSquare },
  { path: "/technical-writing-guide", label: "Technical Writing", icon: PenTool },
];

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { progress } = useProgress();

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("py-6", isMobile && "h-full flex flex-col")}>
      <div className="px-6 mb-6">
        <Link href="/">
          <h1 className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">Ask Marilyn</h1>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 font-sans">About Software Testing</p>
      </div>
      <div className="px-6 mb-6">
        <Search />
      </div>
      <nav className="px-4 space-y-2" aria-label="Main navigation">
        {menuItems.map((item) => {
          const isActive = location === item.path;
          const isCompleted = progress.completedModules.includes(item.path) || 
            (item.path === "/quiz" && progress.quizScore !== null) ||
            (item.path === "/refactoring-challenge" && progress.refactoringScore !== null) ||
            (item.path === "/boss-level" && progress.bossScore !== null);

          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start font-sans text-base relative",
                  isActive && "bg-secondary text-primary font-semibold"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {isCompleted && (
                  <CheckCircle className="h-3 w-3 text-green-500 ml-2" aria-label="Completed" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 pt-6 mt-6 border-t border-border space-y-4">
        <a 
          href="/abt_cheat_sheet.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full p-2 text-sm font-sans font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
        >
          <FileText className="h-4 w-4" />
          Download Cheat Sheet
        </a>
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
          <p className="text-xs text-muted-foreground font-serif italic">
            "Logic is the beginning of wisdom, not the end."
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header with User Profile */}
      <header className="hidden lg:flex fixed top-0 left-72 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 items-center justify-end px-6">
        <UserProfileMenu />
      </header>

      {/* Mobile Header - Fixed for mobile only */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation for the ABT Course</SheetDescription>
              <NavContent isMobile={true} />
            </SheetContent>
          </Sheet>
          <Link href="/">
            <span className="ml-4 font-serif font-bold text-lg cursor-pointer hover:text-primary/80 transition-colors">Ask Marilyn</span>
          </Link>
        </div>
        <UserProfileMenu />
      </div>

      {/* Desktop Layout - Sidebar scrolls with page */}
      <div className="hidden lg:flex pt-16">
        {/* Sidebar - Not fixed, scrolls with page */}
        <aside className="w-72 border-r border-border bg-sidebar flex-shrink-0">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container max-w-4xl py-8 lg:py-12 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Content */}
      <main className="lg:hidden pt-16 min-h-screen">
        <div className="container max-w-4xl py-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
