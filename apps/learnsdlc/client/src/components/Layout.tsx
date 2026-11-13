import evidenceNavigation from "../../../course-content/evidence-desk/navigation.json";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Menu, BookOpen, AlertTriangle, Layers, CheckCircle, Code, FileText, Trophy, Puzzle, MessageSquare, Clock, Wrench, Sparkles, XCircle, FileCode, PenTool, GraduationCap, ChevronRight, ChevronDown, Brain, Cpu, Gamepad2, HelpCircle, Award, PanelLeftClose, PanelLeft, Lock, Shield, Zap, Target, BarChart3, Users, Settings, Lightbulb, Building2, Scale, Rocket, Crown, GripVertical, List } from "lucide-react";
import { Search } from "@/components/Search";
import { useProgress } from "@/contexts/ProgressContext";
import { UserProfileMenu } from "@/components/UserProfileMenu";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useEffect, useRef, useCallback } from "react";
import { RodOfAsclepius } from "@/components/icons/RodOfAsclepius";

interface LayoutProps {
  children: React.ReactNode;
  wideContent?: boolean;
  singleMount?: boolean;
}

// Module types for categorization
type ModuleType = "lesson" | "game" | "quiz" | "exam" | "challenge" | "capstone";

interface CourseModule {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type: ModuleType;
  duration?: string;
}

interface Course {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  introPath: string;
  modules: CourseModule[];
  requiresProgression?: boolean; // If true, modules are locked until prerequisites completed
}

// Admin email with full access
const ADMIN_EMAIL = "levon999@gmail.com";

// Sidebar width constraints
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 320; // 20rem = 320px for better text visibility

// Course definitions with their modules and types
const courses: Course[] = [
  { id: "evidence-desk", name: "Evidence Desk — QA Measurement", icon: BarChart3, introPath: "/evidence-desk/v3", requiresProgression: false, modules: [{ path: "/evidence-desk/v3", label: "Program introduction", icon: BookOpen, type: "lesson" }, ...evidenceNavigation.map(c => ({ path: `/evidence-desk/v3/courses/${c.id}`, label: `${c.id} — ${c.title}`, icon: FileText, type: "lesson" as const })), { path: "/evidence-desk/v3/resources", label: "18 matrix templates", icon: BarChart3, type: "lesson" }, { path: "/evidence-desk/v3/progress", label: "My evidence progress", icon: CheckCircle, type: "lesson" }] },
  {
    id: "action-based-testing",
    name: "Action Based Testing",
    icon: BookOpen,
    introPath: "/abt-intro",
    requiresProgression: false,
    modules: [
      { path: "/abt-intro", label: "Introduction", icon: BookOpen, type: "lesson" },
      { path: "/module-1", label: "The Testing Paradox", icon: AlertTriangle, type: "lesson" },
      { path: "/module-2", label: "The Three Layers", icon: Layers, type: "lesson" },
      { path: "/module-3", label: "Anti-Patterns", icon: AlertTriangle, type: "lesson" },
      { path: "/module-4", label: "Architecture", icon: Layers, type: "lesson" },
      { path: "/module-5", label: "Language of Logic", icon: BookOpen, type: "lesson" },
      { path: "/module-6", label: "Test Life-Cycle", icon: Clock, type: "lesson" },
      { path: "/module-7", label: "Building Test Modules", icon: Wrench, type: "lesson" },
      { path: "/module-8", label: "Advanced Techniques", icon: Sparkles, type: "lesson" },
      { path: "/module-9", label: "Anti-Pattern Gallery", icon: XCircle, type: "lesson" },
      { path: "/module-10", label: "Test Design Template", icon: FileCode, type: "lesson" },
      { path: "/refactoring-challenge", label: "Refactoring Game", icon: Gamepad2, type: "game" },
      { path: "/boss-level", label: "The Architect's Challenge", icon: Trophy, type: "challenge" },
      { path: "/quiz", label: "Final Assessment", icon: HelpCircle, type: "quiz" },
      { path: "/test-builder", label: "Test Builder", icon: Puzzle, type: "game" },
    ],
  },
  {
    id: "grace-foundation",
    name: "ABT Foundations",
    icon: Brain,
    introPath: "/grace-academy",
    requiresProgression: true,
    modules: [
      { path: "/grace-academy", label: "Introduction", icon: Brain, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-1", label: "Introduction to ABT", icon: BookOpen, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-2", label: "The Philosophy of ABT", icon: Lightbulb, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-3", label: "Actions as First-Class Citizens", icon: Zap, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-4", label: "Composable Test Design", icon: Layers, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-5", label: "State Management in ABT", icon: Settings, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-6", label: "Error Handling Patterns", icon: AlertTriangle, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-7", label: "Test Data Strategies", icon: BarChart3, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-8", label: "Parallel Execution Models", icon: Cpu, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-9", label: "Reporting and Observability", icon: FileText, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-10", label: "Foundation Capstone", icon: Award, type: "capstone", duration: "~15 min" },
    ],
  },
  {
    id: "grace-intermediate",
    name: "AI Agent Mastery",
    icon: Layers,
    introPath: "/grace-academy/intermediate",
    requiresProgression: true,
    modules: [
      { path: "/grace-academy/intermediate", label: "Intermediate Overview", icon: Layers, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-11", label: "Introduction to AI Agents", icon: Cpu, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-12", label: "The GRACE Architecture", icon: Building2, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-13", label: "Requirement Analysis Agents", icon: Target, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-14", label: "Test Generation Agents", icon: Sparkles, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-15", label: "Execution Orchestration", icon: Settings, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-16", label: "Self-Healing Mechanisms", icon: Wrench, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-17", label: "Cognitive Feedback Loops", icon: Brain, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-18", label: "Integration Patterns", icon: Layers, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-19", label: "Performance Optimization", icon: Zap, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-20", label: "Intermediate Capstone", icon: Award, type: "capstone", duration: "~15 min" },
    ],
  },
  {
    id: "grace-advanced",
    name: "Enterprise Leadership",
    icon: Crown,
    introPath: "/grace-academy/advanced",
    requiresProgression: true,
    modules: [
      { path: "/grace-academy/advanced", label: "Advanced Overview", icon: Crown, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-21", label: "Advanced AI Orchestration", icon: Cpu, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-22", label: "Multi-Agent Collaboration", icon: Users, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-23", label: "Autonomous Decision Making", icon: Brain, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-24", label: "Ethical AI in Testing", icon: Scale, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-25", label: "Enterprise Scale Patterns", icon: Building2, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-26", label: "Security and Compliance", icon: Shield, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-27", label: "Future of Quality Engineering", icon: Rocket, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-28", label: "Leadership in AI-Driven QE", icon: Crown, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-29", label: "Building QE Centers of Excellence", icon: Building2, type: "lesson", duration: "~15 min" },
      { path: "/grace-academy/module-30", label: "GRACE Mastery Capstone", icon: Award, type: "capstone", duration: "~15 min" },
    ],
  },
  {
    id: "coding-style",
    name: "Coding Style Guide",
    icon: Code,
    introPath: "/coding-style-guide",
    requiresProgression: false,
    modules: [
      { path: "/coding-style-guide", label: "Introduction", icon: Code, type: "lesson", duration: "~3 min" },
      { path: "/coding-style-guide/file-organization", label: "File Organization", icon: FileCode, type: "lesson", duration: "~5 min" },
      { path: "/coding-style-guide/indentation", label: "Indentation", icon: Code, type: "lesson", duration: "~5 min" },
      { path: "/coding-style-guide/naming-conventions", label: "Naming Conventions", icon: Code, type: "lesson", duration: "~5 min" },
      { path: "/coding-style-guide/statements", label: "Statements & Braces", icon: Code, type: "lesson", duration: "~5 min" },
      { path: "/coding-style-guide/white-space", label: "White Space", icon: Code, type: "lesson", duration: "~5 min" },
      { path: "/coding-style-guide/quiz", label: "Style Assessment", icon: HelpCircle, type: "quiz", duration: "~10 min" },
    ],
  },
  {
    id: "commenting",
    name: "Art of Commenting",
    icon: MessageSquare,
    introPath: "/commenting-guide",
    requiresProgression: false,
    modules: [
      { path: "/commenting-guide", label: "Introduction", icon: MessageSquare, type: "lesson", duration: "~3 min" },
      { path: "/commenting-guide/case-against", label: "The Case Against NOT Commenting", icon: AlertTriangle, type: "lesson", duration: "~5 min" },
      { path: "/commenting-guide/comment-types", label: "Three Types of Comments", icon: FileText, type: "lesson", duration: "~5 min" },
      { path: "/commenting-guide/style-guidelines", label: "Style Guidelines", icon: BookOpen, type: "lesson", duration: "~5 min" },
      { path: "/commenting-guide/xml-comments", label: "XML Documentation", icon: Code, type: "lesson", duration: "~5 min" },
      { path: "/commenting-guide/quiz", label: "Commenting Assessment", icon: HelpCircle, type: "quiz", duration: "~10 min" },
    ],
  },
  {
    id: "technical-writing",
    name: "Technical Writing",
    icon: PenTool,
    introPath: "/technical-writing-guide",
    requiresProgression: false,
    modules: [
      { path: "/technical-writing-guide", label: "Introduction", icon: PenTool, type: "lesson", duration: "~3 min" },
      { path: "/technical-writing-guide/three-pillars", label: "The Three Pillars", icon: BookOpen, type: "lesson", duration: "~5 min" },
      { path: "/technical-writing-guide/readability", label: "Readability", icon: FileText, type: "lesson", duration: "~5 min" },
      { path: "/technical-writing-guide/comprehensibility", label: "Comprehensibility", icon: Brain, type: "lesson", duration: "~5 min" },
      { path: "/technical-writing-guide/style", label: "Matters of Style", icon: Sparkles, type: "lesson", duration: "~8 min" },
      { path: "/technical-writing-guide/structure", label: "Document Structure", icon: List, type: "lesson", duration: "~5 min" },
      { path: "/technical-writing-guide/quiz", label: "Writing Assessment", icon: HelpCircle, type: "quiz", duration: "~10 min" },
    ],
  },
  {
    id: "systems-architect",
    name: "Systems Architect",
    icon: Building2,
    introPath: "/systems-architect",
    requiresProgression: false,
    modules: [
      { path: "/systems-architect", label: "Introduction", icon: Building2, type: "lesson", duration: "~5 min" },
      { path: "/systems-architect/agentic-ai", label: "Agentic AI Patterns", icon: Cpu, type: "lesson", duration: "~15 min" },
      { path: "/systems-architect/platform-engineering", label: "Platform Engineering", icon: Layers, type: "lesson", duration: "~15 min" },
      { path: "/systems-architect/green-computing", label: "Green Computing", icon: Zap, type: "lesson", duration: "~15 min" },
    ],
  },
  {
    id: "database-administrator",
    name: "Database Administrator",
    icon: BarChart3,
    introPath: "/database-administrator",
    requiresProgression: false,
    modules: [
      { path: "/database-administrator", label: "Introduction", icon: BarChart3, type: "lesson", duration: "~5 min" },
      { path: "/database-administrator/acid-transactions", label: "ACID Transactions", icon: Shield, type: "lesson", duration: "~15 min" },
      { path: "/database-administrator/vector-databases", label: "Vector Databases", icon: Brain, type: "lesson", duration: "~15 min" },
      { path: "/database-administrator/security-fortress", label: "Security Fortress", icon: Lock, type: "lesson", duration: "~15 min" },
    ],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    icon: Brain,
    introPath: "/data-scientist",
    requiresProgression: false,
    modules: [
      { path: "/data-scientist", label: "Introduction", icon: Brain, type: "lesson", duration: "~5 min" },
      { path: "/data-scientist/llm-revolution", label: "LLM Revolution", icon: Sparkles, type: "lesson", duration: "~15 min" },
      { path: "/data-scientist/rag-architecture", label: "RAG Architecture", icon: Layers, type: "lesson", duration: "~15 min" },
      { path: "/data-scientist/mlops", label: "MLOps Pipeline", icon: Settings, type: "lesson", duration: "~15 min" },
    ],
  },
  {
    id: "healthcare-architect",
    name: "Healthcare Architect",
    icon: RodOfAsclepius,
    introPath: "/healthcare-architect",
    requiresProgression: false,
    modules: [
      { path: "/healthcare-architect", label: "Introduction", icon: RodOfAsclepius, type: "lesson", duration: "~5 min" },
      { path: "/healthcare-architect/hl7-evolution", label: "HL7 Evolution", icon: Clock, type: "lesson", duration: "~15 min" },
      { path: "/healthcare-architect/fhir-resources", label: "FHIR Resources", icon: FileText, type: "lesson", duration: "~15 min" },
      { path: "/healthcare-architect/smart-on-fhir", label: "SMART on FHIR", icon: Zap, type: "lesson", duration: "~15 min" },
    ],
  },
  {
    id: "sql-injection",
    name: "SQL Injection Masterclass",
    icon: AlertTriangle,
    introPath: "/sql-injection",
    requiresProgression: false,
    modules: [
      { path: "/sql-injection", label: "Introduction", icon: AlertTriangle, type: "lesson", duration: "~10 min" },
    ],
  },
  {
    id: "cmake-mastery",
    name: "CMake Mastery",
    icon: Wrench,
    introPath: "/cmake-mastery",
    requiresProgression: false,
    modules: [
      { path: "/cmake-mastery", label: "Course Overview", icon: BookOpen, type: "lesson", duration: "~5 min" },
      { path: "/cmake-mastery/dashboard", label: "Dashboard", icon: BarChart3, type: "lesson", duration: "~5 min" },
      { path: "/cmake-mastery/module/1", label: "Why CMake?", icon: Lightbulb, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/2", label: "Installation & First Build", icon: Wrench, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/3", label: "CMakeLists Anatomy", icon: FileCode, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/4", label: "Variables & Cache", icon: Settings, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/5", label: "Targets & Properties", icon: Target, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/6", label: "Libraries & Linking", icon: Layers, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/7", label: "find_package()", icon: Target, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/8", label: "FetchContent", icon: Code, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/9", label: "Generator Expressions", icon: Zap, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/10", label: "Custom Commands", icon: Puzzle, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/11", label: "Presets", icon: FileText, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/12", label: "CTest", icon: CheckCircle, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/13", label: "CDash", icon: BarChart3, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/14", label: "CPack", icon: GripVertical, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/15", label: "Cross-Compilation", icon: Cpu, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/16", label: "Toolchain Files", icon: Wrench, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/17", label: "Superbuild Pattern", icon: Building2, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/18", label: "IDE Integration", icon: Code, type: "lesson", duration: "~15 min" },
      { path: "/cmake-mastery/module/19", label: "CI/CD Pipelines", icon: Rocket, type: "lesson", duration: "~20 min" },
      { path: "/cmake-mastery/module/20", label: "Debugging CMake", icon: Brain, type: "lesson", duration: "~20 min" },
    ],
  },
  {
    id: "stf",
    name: "Software Testing Fundamentals",
    icon: Target,
    introPath: "/stf",
    modules: [
      { path: "/stf", label: "Course Overview", icon: BookOpen, type: "lesson", duration: "~5 min" },
      { path: "/stf/dashboard", label: "Dashboard", icon: BarChart3, type: "lesson", duration: "~5 min" },
      { path: "/stf/module/1", label: "Why We Test", icon: Lightbulb, type: "lesson", duration: "~20 min" },
      { path: "/stf/module/2", label: "Seven Principles of Testing", icon: Brain, type: "lesson", duration: "~20 min" },
      { path: "/stf/module/3", label: "The Waterfall Model", icon: Layers, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/4", label: "The V-Model", icon: Code, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/5", label: "Static Testing & Reviews", icon: FileText, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/6", label: "Agile Testing", icon: Zap, type: "lesson", duration: "~30 min" },
      { path: "/stf/module/7", label: "DevOps & CI/CD", icon: Rocket, type: "lesson", duration: "~30 min" },
      { path: "/stf/module/8", label: "Test Levels", icon: Layers, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/9", label: "Test Types", icon: Target, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/10", label: "Test Design Techniques", icon: Puzzle, type: "lesson", duration: "~30 min" },
      { path: "/stf/module/11", label: "Traceability", icon: CheckCircle, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/12", label: "Test Documentation", icon: FileText, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/13", label: "Defect Management", icon: Settings, type: "lesson", duration: "~25 min" },
      { path: "/stf/module/14", label: "Test Automation (TDD & BDD)", icon: Cpu, type: "lesson", duration: "~30 min" },
      { path: "/stf/module/15", label: "Capstone: The Complete Tester", icon: GraduationCap, type: "lesson", duration: "~30 min" },
    ],
  },
];

// Get badge color for module type
const getTypeBadgeColor = (type: ModuleType) => {
  switch (type) {
    case "lesson": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "game": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "quiz": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "exam": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "challenge": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "capstone": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default: return "bg-gray-100 text-gray-700";
  }
};

export function Layout({ children, wideContent, singleMount = false }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const { progress } = useProgress();
  const { user } = useAuth();
  
  // Check if current user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // Sidebar collapsed state - persisted in localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });

  // Sidebar width state - persisted in localStorage
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarWidth');
      if (saved) {
        const width = parseInt(saved, 10);
        if (width >= MIN_SIDEBAR_WIDTH && width <= MAX_SIDEBAR_WIDTH) {
          return width;
        }
      }
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });

  // Resizing state
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Persist sidebar width
  useEffect(() => {
    localStorage.setItem('sidebarWidth', String(sidebarWidth));
  }, [sidebarWidth]);

  // Handle mouse move during resize
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Add/remove event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Start resizing
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);
  
  // Determine which course the current page belongs to
  const getCurrentCourseId = (): string | null => {
    for (const course of courses) {
      if (course.modules.some(m => m.path === location)) {
        return course.id;
      }
    }
    return null;
  };

  // Track which course is expanded - only the current course should be expanded
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(getCurrentCourseId());

  // Update expanded course when location changes
  useEffect(() => {
    const currentCourse = getCurrentCourseId();
    if (currentCourse) {
      setExpandedCourseId(currentCourse);
    }
  }, [location]);

  const isModuleCompleted = (path: string) => {
    return progress.completedModules.includes(path) || 
      (path === "/quiz" && progress.quizScore !== null) ||
      (path === "/refactoring-challenge" && progress.refactoringScore !== null) ||
      (path === "/boss-level" && progress.bossScore !== null);
  };

  // Check if a module is unlocked based on progression
  const isModuleUnlocked = (course: Course, moduleIndex: number): boolean => {
    // Admin has full access
    if (isAdmin) return true;
    
    // If course doesn't require progression, all modules are unlocked
    if (!course.requiresProgression) return true;
    
    // First module (intro) is always unlocked
    if (moduleIndex === 0) return true;
    
    // Check if previous module is completed
    const previousModule = course.modules[moduleIndex - 1];
    return isModuleCompleted(previousModule.path);
  };

  const handleCourseClick = (course: Course, e: React.MouseEvent) => {
    // Navigate to the course intro page
    setLocation(course.introPath);
    // Expand this course (collapse others)
    setExpandedCourseId(course.id);
  };

  const handleExpandToggle = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Toggle: if already expanded, collapse; otherwise expand this one
    setExpandedCourseId(prev => prev === courseId ? null : courseId);
  };

  const handleLockedModuleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Could show a toast here explaining the module is locked
  };

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("py-6", isMobile && "h-full flex flex-col")}>
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <Link href="/">
            <h1 className="text-2xl font-serif font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer truncate">SDLC Academy</h1>
          </Link>
          <p className="text-sm text-muted-foreground mt-1 font-sans truncate">About Learning SDLC</p>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(true)}
            className="h-8 w-8 flex-shrink-0"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="px-6 mb-6">
        <Search />
      </div>
      
      <nav className="px-4" aria-label="Main navigation">
        {/* All Courses Header */}
        <Link href="/all-courses">
          <div className="flex items-center gap-3 px-2 py-3 mb-2 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors">
            <GraduationCap className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-semibold text-base truncate">All Courses</span>
          </div>
        </Link>

        {/* Course List */}
        <div className="space-y-1">
          {courses.map((course) => {
            const CourseIcon = course.icon;
            const isCurrentCourse = course.modules.some(m => m.path === location);
            const isExpanded = expandedCourseId === course.id;
            const completedCount = course.modules.filter(m => isModuleCompleted(m.path)).length;
            const totalCount = course.modules.length;
            
            return (
              <Collapsible
                key={course.id}
                open={isExpanded}
              >
                <div className="flex items-center">
                  {/* Clickable course name - navigates to intro and expands */}
                  <div
                    onClick={(e) => handleCourseClick(course, e)}
                    className={cn(
                      "flex-1 flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer transition-colors min-w-0",
                      "hover:bg-secondary/50",
                      isCurrentCourse && "bg-secondary/30 font-medium"
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCourseClick(course, e as unknown as React.MouseEvent);
                      }
                    }}
                  >
                    <CourseIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 text-left truncate" title={course.name}>{course.name}</span>
                    {completedCount > 0 && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {completedCount}/{totalCount}
                      </span>
                    )}
                  </div>
                  
                  {/* Expand/Collapse button */}
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-secondary/50 flex-shrink-0"
                      aria-label={isExpanded ? "Collapse course modules" : "Expand course modules"}
                      onClick={(e) => handleExpandToggle(course.id, e)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  {/* Course Modules */}
                  <div className="pl-6 mt-1 space-y-0.5 border-l-2 border-border ml-4">
                    {course.modules.map((module, moduleIndex) => {
                      const ModuleIcon = module.icon;
                      const isActive = location === module.path;
                      const isCompleted = isModuleCompleted(module.path);
                      const isUnlocked = isModuleUnlocked(course, moduleIndex);
                      
                      // Locked module
                      if (!isUnlocked) {
                        return (
                          <Button
                            key={module.path}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-2 text-sm font-normal h-auto py-2 px-2",
                              "opacity-50 cursor-not-allowed"
                            )}
                            onClick={handleLockedModuleClick}
                            disabled
                          >
                            <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="flex-1 text-left truncate text-muted-foreground" title={module.label}>
                              {module.label}
                            </span>
                            {module.duration && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">{module.duration}</span>
                            )}
                          </Button>
                        );
                      }
                      
                      return (
                        <Link key={module.path} href={module.path}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-2 text-sm font-normal h-auto py-2 px-2",
                              isActive && "bg-primary/10 text-primary font-medium",
                              isCompleted && !isActive && "text-muted-foreground"
                            )}
                          >
                            <ModuleIcon className={cn(
                              "h-3.5 w-3.5 flex-shrink-0",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="flex-1 text-left truncate" title={module.label}>{module.label}</span>
                            {module.duration && (
                              <span className="text-xs text-muted-foreground flex-shrink-0">{module.duration}</span>
                            )}
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded flex-shrink-0",
                              getTypeBadgeColor(module.type)
                            )}>
                              {module.type}
                            </span>
                            {isCompleted && (
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" aria-label="Completed" />
                            )}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Discussion Forums */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link href="/forum">
            <div className={cn(
              "flex items-center gap-3 px-2 py-3 rounded-md cursor-pointer transition-colors hover:bg-secondary/50",
              location === "/forum" && "bg-secondary"
            )}>
              <MessageSquare className="h-5 w-5 text-primary flex-shrink-0" />
              <span className={cn(
                "font-semibold text-base truncate flex-1",
                location === "/forum" && "text-primary"
              )}>Discussion Forums</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </div>
          </Link>
        </div>
      </nav>

      <div className="px-6 pt-6 mt-6 border-t border-border space-y-4">
        <a 
          href="/abt_cheat_sheet.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full p-2 text-sm font-sans font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
        >
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Download Cheat Sheet</span>
        </a>
        <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
          <p className="text-xs text-muted-foreground font-serif italic">
            "Logic is the beginning of wisdom, not the end."
          </p>
        </div>
        
        {/* Accessibility Link */}
        <Link href="/accessibility">
          <div className="flex items-center justify-center gap-2 w-full p-2 text-xs font-sans text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors">
            <span className="sr-only">View </span>Accessibility Statement
          </div>
        </Link>
      </div>
    </div>
  );

  // Collapsed sidebar view
  const CollapsedNav = () => (
    <div className="py-6 flex flex-col items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(false)}
        className="h-10 w-10 mb-4"
        aria-label="Expand sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      
      <div className="space-y-2">
        {courses.map((course) => {
          const CourseIcon = course.icon;
          const isCurrentCourse = course.modules.some(m => m.path === location);
          
          return (
            <Link key={course.id} href={course.introPath}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-10 w-10",
                  isCurrentCourse && "bg-secondary"
                )}
                title={course.name}
              >
                <CourseIcon className="h-5 w-5" />
              </Button>
            </Link>
          );
        })}
        
        <div className="border-t border-border pt-2 mt-2">
          <Link href="/forum">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10",
                location === "/forum" && "bg-secondary"
              )}
              title="Discussion Forums"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header with User Profile */}
      <header 
        className="hidden lg:flex fixed top-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 items-center justify-end px-6"
        style={{ left: sidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
      >
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
            <span className="ml-4 font-serif font-bold text-lg cursor-pointer hover:text-primary/80 transition-colors">SDLC Academy</span>
          </Link>
        </div>
        <UserProfileMenu />
      </div>

      {singleMount ? <div className="flex pt-16">
        <aside 
          ref={sidebarRef}
          className={cn(
            "hidden lg:block border-r border-border bg-sidebar flex-shrink-0 transition-all relative",
            sidebarCollapsed ? "w-16" : "",
            isResizing && "transition-none"
          )}
          style={{ width: sidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
        >
          {sidebarCollapsed ? <CollapsedNav /> : <NavContent />}
          
          {/* Resize Handle */}
          {!sidebarCollapsed && (
            <div
              className={cn(
                "absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-primary/20 transition-colors",
                isResizing && "bg-primary/30"
              )}
              onMouseDown={startResizing}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  setSidebarWidth(prev => Math.max(MIN_SIDEBAR_WIDTH, prev - 10));
                } else if (e.key === 'ArrowRight') {
                  setSidebarWidth(prev => Math.min(MAX_SIDEBAR_WIDTH, prev + 10));
                }
              }}
            >
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 right-0 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                isResizing && "opacity-100"
              )}>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </aside>
        <main id="main-content" className="flex-1 min-w-0 min-h-screen" aria-label="Main content"><div className={`py-8 lg:py-12 ${wideContent ? 'px-4 sm:px-6 lg:px-8 max-w-full' : 'container max-w-4xl'}`}>{children}</div></main>
      </div> : <>
      {/* Desktop Layout - Sidebar scrolls with page */}
      <div className="hidden lg:flex pt-16">
        {/* Sidebar - Collapsible and Resizable */}
        <aside 
          ref={sidebarRef}
          className={cn(
            "border-r border-border bg-sidebar flex-shrink-0 transition-all relative",
            sidebarCollapsed ? "w-16" : "",
            isResizing && "transition-none"
          )}
          style={{ width: sidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
        >
          {sidebarCollapsed ? <CollapsedNav /> : <NavContent />}
          
          {/* Resize Handle */}
          {!sidebarCollapsed && (
            <div
              className={cn(
                "absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-primary/20 transition-colors",
                isResizing && "bg-primary/30"
              )}
              onMouseDown={startResizing}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize sidebar"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  setSidebarWidth(prev => Math.max(MIN_SIDEBAR_WIDTH, prev - 10));
                } else if (e.key === 'ArrowRight') {
                  setSidebarWidth(prev => Math.min(MAX_SIDEBAR_WIDTH, prev + 10));
                }
              }}
            >
              <div className={cn(
                "absolute top-1/2 -translate-y-1/2 right-0 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                isResizing && "opacity-100"
              )}>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 min-w-0" role="main" aria-label="Main content">
          <div className={`py-8 lg:py-12 animate-in fade-in duration-500 ${wideContent ? 'px-4 sm:px-6 lg:px-8 max-w-full' : 'container max-w-4xl'}`}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Content */}
      <main id="main-content-mobile" className="lg:hidden pt-16 min-h-screen" role="main" aria-label="Main content">
          <div className={`py-8 animate-in fade-in duration-500 ${wideContent ? 'px-4 sm:px-6 max-w-full' : 'container max-w-4xl'}`}>
          {children}
        </div>
      </main>
      </>}
    </div>
  );
}
