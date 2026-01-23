import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, BookOpen, AlertTriangle, Layers, CheckCircle, Code, FileText, Trophy, Puzzle, Medal, MessageSquare, Clock, Wrench, Sparkles, XCircle, FileCode, PenTool, GraduationCap, ChevronDown, ChevronRight, Activity, Download, ShieldAlert } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Search } from "@/components/Search";
import { useProgress } from "@/contexts/ProgressContext";
import { UserProfileMenu } from "@/components/UserProfileMenu";

interface LayoutProps {
  children: React.ReactNode;
}

// L3 Content for ABT Course
const abtModules = [
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
];

// L2 Courses List
const courses = [
  { 
    id: "abt",
    label: "Software Quality ABT", 
    icon: BookOpen,
    children: abtModules 
  },
  { path: "/technical-writing-guide", label: "Technical Writing", icon: PenTool },
  { path: "/commenting-guide", label: "Art of Commenting", icon: MessageSquare },
  { path: "/coding-style-guide", label: "Coding Style Guide", icon: FileCode },
  { path: "/systems-architect", label: "Systems Architect", icon: Layers },
  { path: "/dba", label: "Database Administrator", icon: Wrench },
  { path: "/data-scientist", label: "Data Scientist", icon: Sparkles },
  { path: "/healthcare-architect", label: "Healthcare Architect", icon: Activity },
  { path: "/sql-injection", label: "SQL Injection Masterclass", icon: ShieldAlert },
];

const communityItems = [
  { path: "/leaderboard", label: "Leaderboard", icon: Medal },
  { path: "/forum", label: "Discussion Forum", icon: MessageSquare },
  { path: "/quiz", label: "Final Assessment", icon: CheckCircle },
  { path: "/boss-level", label: "The Architect's Challenge", icon: Trophy },
];

const downloadItems = [
  { href: "/abt_cheat_sheet.pdf", label: "ABT Cheat Sheet" },
  { href: "#", label: "SysArch Blueprint (Coming Soon)" },
  { href: "#", label: "DBA Security Checklist (Coming Soon)" },
];

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { progress } = useProgress();

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [isAllCoursesOpen, setIsAllCoursesOpen] = useState(true);
    const [openCourses, setOpenCourses] = useState<Record<string, boolean>>({ abt: false });

    const toggleCourse = (id: string) => {
      setOpenCourses(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
      <div className={cn("py-6", isMobile && "h-full flex flex-col")}>
        <div className="px-6 mb-6">
          <Link href="/">
            <h1 className="text-xl font-serif font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer leading-tight">
              Ask Marilyn Academy of Arts, and Neural Science
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-2 font-sans">About Software Testing</p>
        </div>
        <div className="px-6 mb-6">
          <Search />
        </div>
        
        <nav className="px-4 space-y-6" aria-label="Main navigation">
          
          {/* L1: All Courses */}
          <Collapsible open={isAllCoursesOpen} onOpenChange={setIsAllCoursesOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between font-sans text-base font-bold hover:bg-secondary/50">
                <div className="flex items-center">
                  <GraduationCap className="mr-3 h-5 w-5" />
                  All Courses
                </div>
                {isAllCoursesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 pl-2">
              {courses.map((course, index) => {
                // L2: Individual Courses
                if (course.children) {
                  const isOpen = openCourses[course.id!];
                  return (
                    <Collapsible key={course.id} open={isOpen} onOpenChange={() => toggleCourse(course.id!)} className="space-y-1">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between font-sans text-sm font-semibold pl-4 hover:bg-secondary/30">
                          <div className="flex items-center">
                            <course.icon className="mr-3 h-4 w-4" />
                            {course.label}
                          </div>
                          {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-4 border-l border-border ml-6">
                        {/* L3: Content Links */}
                        {course.children.map((child) => {
                          const isActive = location === child.path;
                          const isCompleted = progress.completedModules.includes(child.path);
                          return (
                            <Link key={child.path} href={child.path}>
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full justify-start font-sans text-xs h-8",
                                  isActive && "bg-secondary text-primary font-medium"
                                )}
                              >
                                <child.icon className="mr-3 h-3 w-3" />
                                <span className="truncate">{child.label}</span>
                                {isCompleted && <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />}
                              </Button>
                            </Link>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                } else {
                  // Single Page Course (L2)
                  const isActive = location === course.path;
                  return (
                    <Link key={course.path} href={course.path!}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start font-sans text-sm font-semibold pl-4 h-9",
                          isActive && "bg-secondary text-primary"
                        )}
                      >
                        <course.icon className="mr-3 h-4 w-4" />
                        {course.label}
                      </Button>
                    </Link>
                  );
                }
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Community Section */}
          <div className="space-y-2">
            <h3 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Community</h3>
            {communityItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start font-sans text-sm pl-4",
                      isActive && "bg-secondary text-primary font-medium"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Downloads Section */}
          <div className="space-y-2">
            <h3 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Downloads</h3>
            {downloadItems.map((item, idx) => (
              <a 
                key={idx}
                href={item.href}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center w-full px-4 py-2 text-sm font-sans text-muted-foreground hover:text-primary hover:bg-secondary/30 rounded-md transition-colors"
              >
                <Download className="mr-3 h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </div>

        </nav>
        
        <div className="px-6 pt-6 mt-auto border-t border-border">
          <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
            <p className="text-xs text-muted-foreground font-serif italic">
              "Logic is the beginning of wisdom, not the end."
            </p>
          </div>
        </div>
      </div>
    );
  };

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
        <aside className="w-72 border-r border-border bg-sidebar flex-shrink-0 fixed top-16 bottom-0 overflow-y-auto">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 ml-72">
          <div className="container max-w-5xl py-8 lg:py-12 animate-in fade-in duration-500">
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
