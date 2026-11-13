import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { RodOfAsclepius } from "@/components/icons/RodOfAsclepius";
import { 
  BookOpen, 
  Code, 
  MessageSquare, 
  FileText, 
  GraduationCap,
  Server,
  Database,
  Brain,
  ShieldAlert,
  Wrench,
  Clock,
  Users,
  LayoutGrid,
  List,
  Layers,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowUpDown,
  Tag,
  CheckCircle
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

// ─── Retro color card images (CDN) ───────────────────────────────────
const cardImages: Record<string, string> = {
  "evidence-desk": "/manus-storage/learning_sequence_0325d623.png",
  "abt": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/KsjWYukxcdLLbAyd.jpg",
  "grace-foundation": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/xggiRRUbEdUftaRh.jpg",
  "grace-intermediate": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/OEamHmvBgUqBtHWg.jpg",
  "grace-advanced": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/yHClRAzMBDulNKkv.jpg",
  "coding-style": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/fIoakiiOIbPeaLzf.jpg",
  "commenting": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/GnSmvsjAJolPPWMe.jpg",
  "technical-writing": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/IQHotheipNfgQMAC.jpg",
  "systems-architect": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/IkCLuDspBmuhWOrW.jpg",
  "dba": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/CmiQgbekrwBIlaVm.jpg",
  "data-scientist": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/iSmbXkiGzZOSBibY.jpg",
  "healthcare": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/fVjCaBGYchvMOpDX.jpg",
  "sql-injection": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031655536/awffNBupCwrMsJYH.jpg",
  "cmake-mastery": "https://d2xsxph8kpxj0f.cloudfront.net/310419663031655536/ntM3o3aiXPMQsUrapBxJXu/card-cmake-color-eCAcjhJFtUZV8gwgBQVZib.webp",
  "stf": "https://d2xsxph8kpxj0f.cloudfront.net/310419663031655536/ntM3o3aiXPMQsUrapBxJXu/card-stf-fundamentals-KmrHS8gQBiWsDGRRojni9t.webp"
};

// ─── Course description points for flipping carousel ─────────────────
const courseDescPoints: Record<string, string[]> = {
  "evidence-desk": ["Build 18 evidence matrices, query Azure DevOps and create honest QA/SDLC dashboards through 14 self-paced micro-courses."],
  "abt": [
    "Master the fundamentals of Action-Based Testing methodology with structured test automation.",
    "Learn the three layers of logic: Actions, Test Cases, and Modules for maintainable tests.",
    "Identify and avoid common anti-patterns that make test suites brittle and hard to maintain.",
    "Build scalable test architectures with interactive quizzes and real-world challenges."
  ],
  "grace-foundation": [
    "GRACE Academy Track 1: Deep dive into ABT core principles with AI-enhanced learning.",
    "Interactive hands-on challenges that reinforce testing fundamentals through practice.",
    "Structured progression from novice to competent with achievement-based unlocking.",
    "Foundation certification track — your first step toward GRACE Diploma."
  ],
  "grace-intermediate": [
    "GRACE Academy Track 2: Master AI agents for intelligent test automation.",
    "Learn GRACE architecture patterns for orchestrating complex test workflows.",
    "Build multi-agent systems that collaborate to achieve testing objectives.",
    "Intermediate certification — advance your GRACE Diploma journey."
  ],
  "grace-advanced": [
    "GRACE Academy Track 3: Enterprise-scale patterns for test automation leadership.",
    "Develop QE leadership skills for managing large-scale testing organizations.",
    "Master multi-agent collaboration and cross-team test strategy alignment.",
    "Advanced certification — complete your GRACE Diploma with distinction."
  ],
  "coding-style": [
    "Learn professional coding standards that make your code readable and maintainable.",
    "Master file organization, indentation rules, and consistent formatting practices.",
    "Adopt naming conventions that communicate intent and reduce cognitive load.",
    "Structure statements and expressions for maximum clarity and minimum bugs."
  ],
  "commenting": [
    "Master the art of writing meaningful comments that add value, not noise.",
    "Learn the three types of comments: clarification, intent, and warning.",
    "Build expertise in XML documentation for API-level code documentation.",
    "Develop a personal style guide for consistent, professional commenting."
  ],
  "technical-writing": [
    "Develop technical writing skills focused on readability and precision.",
    "Master comprehensibility techniques that make complex topics accessible.",
    "Learn document structure patterns for reports, specs, and guides.",
    "Build a professional style guide aligned with industry standards."
  ],
  "systems-architect": [
    "Master Agentic AI patterns for building autonomous, intelligent systems.",
    "Learn Platform Engineering principles for scalable infrastructure design.",
    "Explore Green Computing strategies for sustainable system architecture.",
    "Design systems that balance performance, cost, and environmental impact."
  ],
  "dba": [
    "Deep dive into ACID transactions — the bedrock of reliable data systems.",
    "Explore Vector Databases for AI-powered search and similarity matching.",
    "Design Security Fortresses with zero-trust access controls and encryption.",
    "Master modern database patterns for high-availability production systems."
  ],
  "data-scientist": [
    "Understand the LLM Revolution and how large language models reshape AI.",
    "Master RAG Architecture for grounding AI responses in real-world data.",
    "Build MLOps Pipelines for deploying and monitoring production AI systems.",
    "Architect intelligent systems that learn, adapt, and scale reliably."
  ],
  "healthcare": [
    "Trace the HL7 Evolution from v2 messaging to modern interoperability.",
    "Master FHIR Resources — the building blocks of healthcare data exchange.",
    "Implement SMART on FHIR for secure, standards-based clinical applications.",
    "Design healthcare systems that connect providers, patients, and data seamlessly."
  ],
  "sql-injection": [
    "Learn offensive SQL injection techniques to understand how attackers think.",
    "Master defense strategies including parameterized queries and input validation.",
    "Practice with an interactive SQL simulator in a safe, sandboxed environment.",
    "Study real-world attack patterns and the devastating breaches they caused."
  ],
  "cmake-mastery": [
    "Master CMake from zero to expert — the industry-standard C/C++ build system.",
    "Learn targets, properties, find_package(), FetchContent, and generator expressions.",
    "Build cross-compilation toolchains, CTest/CDash pipelines, and CPack packaging.",
    "20 comprehensive modules with quizzes, infographics, and hands-on challenges."
  ],
  "stf": [
    "Master ISTQB-aligned testing fundamentals: seven principles, test levels, and design techniques.",
    "Compare Waterfall, V-Model, and Agile SDLC approaches with real-world testing strategies.",
    "Learn DevOps CI/CD pipelines, TDD, BDD, and modern test automation practices.",
    "Build requirement-to-test-case traceability — the foundational skill of every QA professional."
  ]
};

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  modules: number;
  duration: string;
  level: string;
  color: string;
  subject: string;
  recommendedOrder: number;
}

type SortOption = "recommended" | "alphabetical" | "subject";
type LayoutView = "carousel" | "grid" | "list";

const courses: Course[] = [
  { id: "evidence-desk", title: "Evidence Desk — Azure DevOps QA Measurement", description: "Fourteen self-paced micro-courses with matrices, source-based QA reporting and instructor-verified practical work.", icon: CheckCircle, href: "/evidence-desk/v3", modules: 14, duration: "Self-paced applied pathway", level: "Intermediate", color: "bg-blue-900", subject: "QA Measurement", recommendedOrder: 0 },
  { id: "abt", title: "Action Based Testing", description: "Master the fundamentals of Action-Based Testing methodology.", icon: BookOpen, href: "/abt-intro", modules: 10, duration: "2-3 hours", level: "Foundation", color: "bg-blue-500", subject: "Test Automation", recommendedOrder: 1 },
  { id: "grace-foundation", title: "ABT Foundations", description: "GRACE Academy Track 1: Deep dive into ABT core principles.", icon: GraduationCap, href: "/grace-academy", modules: 10, duration: "5 hours", level: "Foundation", color: "bg-emerald-500", subject: "Test Automation", recommendedOrder: 2 },
  { id: "grace-intermediate", title: "AI Agent Mastery", description: "GRACE Academy Track 2: Master AI agents and GRACE architecture.", icon: Brain, href: "/grace-academy/intermediate", modules: 10, duration: "5 hours", level: "Intermediate", color: "bg-purple-500", subject: "AI & Automation", recommendedOrder: 3 },
  { id: "grace-advanced", title: "Enterprise Leadership", description: "GRACE Academy Track 3: Enterprise patterns and QE leadership.", icon: Users, href: "/grace-academy/advanced", modules: 10, duration: "5 hours", level: "Advanced", color: "bg-amber-500", subject: "Leadership", recommendedOrder: 4 },
  { id: "coding-style", title: "Coding Style Guide", description: "Learn professional coding standards and best practices.", icon: Code, href: "/coding-style-guide", modules: 6, duration: "1 hour", level: "Foundation", color: "bg-cyan-500", subject: "Software Engineering", recommendedOrder: 5 },
  { id: "commenting", title: "Art of Commenting", description: "Master the art of writing meaningful code comments.", icon: MessageSquare, href: "/commenting-guide", modules: 5, duration: "45 mins", level: "Foundation", color: "bg-pink-500", subject: "Software Engineering", recommendedOrder: 6 },
  { id: "technical-writing", title: "Technical Writing", description: "Develop technical writing skills for professional documentation.", icon: FileText, href: "/technical-writing-guide", modules: 6, duration: "1 hour", level: "Foundation", color: "bg-indigo-500", subject: "Software Engineering", recommendedOrder: 7 },
  { id: "systems-architect", title: "Systems Architect", description: "Master Agentic AI & Platform Engineering.", icon: Server, href: "/systems-architect", modules: 4, duration: "2 hours", level: "Advanced", color: "bg-orange-500", subject: "Architecture", recommendedOrder: 8 },
  { id: "dba", title: "Database Administrator", description: "ACID, Vector DBs & Security Fortresses.", icon: Database, href: "/database-administrator", modules: 4, duration: "2 hours", level: "Intermediate", color: "bg-teal-500", subject: "Data & Infrastructure", recommendedOrder: 9 },
  { id: "data-scientist", title: "Data Scientist", description: "The Architect of Intelligence — LLM, RAG, MLOps.", icon: Brain, href: "/data-scientist", modules: 4, duration: "2 hours", level: "Advanced", color: "bg-violet-500", subject: "AI & Automation", recommendedOrder: 10 },
  { id: "healthcare", title: "Healthcare Architect", description: "The Digital Healer — HL7, FHIR, SMART on FHIR.", icon: RodOfAsclepius, href: "/healthcare-architect", modules: 3, duration: "1.5 hours", level: "Specialized", color: "bg-rose-500", subject: "Healthcare", recommendedOrder: 11 },
  { id: "sql-injection", title: "SQL Injection Masterclass", description: "Offensive Security & Defense with interactive simulator.", icon: ShieldAlert, href: "/sql-injection", modules: 4, duration: "1.5 hours", level: "Specialized", color: "bg-red-500", subject: "Security", recommendedOrder: 12 },
  { id: "cmake-mastery", title: "CMake Mastery", description: "Master the industry-standard C/C++ build system from zero to expert.", icon: Wrench, href: "/cmake-mastery", modules: 20, duration: "6+ hours", level: "Intermediate", color: "bg-lime-600", subject: "Software Engineering", recommendedOrder: 13 },
  { id: "stf", title: "Software Testing Fundamentals", description: "ISTQB-aligned course covering SDLC models, test design, traceability, and DevOps.", icon: CheckCircle, href: "/stf", modules: 15, duration: "7+ hours", level: "Foundation", color: "bg-sky-600", subject: "Test Automation", recommendedOrder: 1 }
];

const levelColors: Record<string, string> = {
  "Foundation": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Intermediate": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Advanced": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "Specialized": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
};

// ─── Flipping Description Carousel ───────────────────────────────────
function FlipDesc({ courseId, lineClamp = 2 }: { courseId: string; lineClamp?: number }) {
  const points = courseDescPoints[courseId] || [];
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (points.length <= 1) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % points.length);
        setFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [points.length]);

  if (!points.length) return null;

  return (
    <div className="relative min-h-[2.5rem]">
      <p
        className={`text-sm text-muted-foreground leading-relaxed transition-opacity duration-400 ${
          fading ? 'opacity-0' : 'opacity-100'
        } ${lineClamp === 3 ? 'line-clamp-3' : 'line-clamp-2'}`}
      >
        {points[idx]}
      </p>
      {/* Dot indicators */}
      <div className="flex gap-1 mt-2">
        {points.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
            className={`rounded-full transition-all duration-300 ${
              i === idx ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-muted-foreground/30'
            }`}
            aria-label={`Description point ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Grid Card: Title → Image → Flipping Description ─────────────────
function GridCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const image = cardImages[course.id];

  return (
    <Link href={course.href}>
      <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-0 bg-card">
        {/* Title Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-start gap-2 mb-1">
            <div className={`p-1.5 rounded-md ${course.color} text-white flex-shrink-0`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base leading-tight flex-1">{course.title}</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge className={`${levelColors[course.level]} text-[0.55rem] px-1.5 py-0`}>{course.level}</Badge>
            <span className="text-[0.6rem] text-muted-foreground">{course.modules} modules · {course.duration}</span>
          </div>
        </div>

        {/* Retro Image */}
        {image && (
          <div className="px-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border/50">
              <img
                src={image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Flipping Description */}
        <div className="px-4 pt-2 pb-3">
          <FlipDesc courseId={course.id} lineClamp={2} />
        </div>
      </Card>
    </Link>
  );
}

// ─── List Card: Wide, narrow — Title + Image + Flipping Desc ─────────
function ListCard({ course }: { course: Course }) {
  const Icon = course.icon;
  const image = cardImages[course.id];

  return (
    <Link href={course.href}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-0 bg-card">
        <div className="flex items-stretch gap-0">
          {/* Image thumbnail */}
          {image && (
            <div className="w-24 sm:w-32 md:w-40 flex-shrink-0 relative overflow-hidden">
              <img
                src={image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          {/* Content */}
          <div className="flex-1 min-w-0 px-3 sm:px-4 py-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <div className={`p-1 rounded-md ${course.color} text-white flex-shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base lg:text-lg leading-tight">{course.title}</h3>
              <Badge className={`${levelColors[course.level]} text-[0.55rem] px-1.5 py-0`}>{course.level}</Badge>
              <Badge variant="outline" className="text-[0.55rem] text-muted-foreground hidden sm:inline-flex">{course.subject}</Badge>
            </div>
            <FlipDesc courseId={course.id} lineClamp={3} />
          </div>
          {/* Stats — hidden on small screens */}
          <div className="hidden md:flex items-center gap-4 px-4 text-xs text-muted-foreground flex-shrink-0 border-l border-border/50">
            <div className="flex flex-col items-center gap-0.5">
              <BookOpen className="w-4 h-4" />
              <span>{course.modules}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Clock className="w-4 h-4" />
              <span className="whitespace-nowrap">{course.duration}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Card>
    </Link>
  );
}

// ─── Sorting helpers ──────────────────────────────────────────────────
function sortCourses(list: Course[], sortBy: SortOption): Course[] {
  const sorted = [...list];
  switch (sortBy) {
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'subject':
      return sorted.sort((a, b) => {
        const cmp = a.subject.localeCompare(b.subject);
        return cmp !== 0 ? cmp : a.recommendedOrder - b.recommendedOrder;
      });
    case 'recommended':
    default:
      return sorted.sort((a, b) => a.recommendedOrder - b.recommendedOrder);
  }
}

// ─── Main Component ────────────────────────────────────────────────────
export default function AllCourses() {
  usePageMeta({
    title: "Course Catalog",
    description: "Browse all GRACE Academy educational courses including Action-Based Testing, secure coding practices, software architecture, and professional development.",
    keywords: "education courses, software testing training, SDLC curriculum, professional development, GRACE Academy courses"
  });

  const [layoutView, setLayoutView] = useState<LayoutView>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('courseLayoutView') as LayoutView) || 'grid';
    }
    return 'grid';
  });

  const [sortOption, setSortOption] = useState<SortOption>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('courseSortOption') as SortOption) || 'recommended';
    }
    return 'recommended';
  });

  const sortedCourses = useMemo(() => sortCourses(courses, sortOption), [sortOption]);
  
  // Carousel state — 4 cards on desktop, responsive on smaller screens
  const [carouselPage, setCarouselPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const totalPages = Math.ceil(sortedCourses.length / cardsPerPage);

  // Responsive cards per page
  useEffect(() => {
    const updateCardsPerPage = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerPage(1);
      else if (w < 1024) setCardsPerPage(2);
      else if (w < 1536) setCardsPerPage(3);
      else setCardsPerPage(4);
    };
    updateCardsPerPage();
    window.addEventListener('resize', updateCardsPerPage);
    return () => window.removeEventListener('resize', updateCardsPerPage);
  }, []);

  // Persist preferences
  useEffect(() => { localStorage.setItem('courseLayoutView', layoutView); }, [layoutView]);
  useEffect(() => { localStorage.setItem('courseSortOption', sortOption); }, [sortOption]);
  useEffect(() => { setCarouselPage(0); }, [sortOption, cardsPerPage]);

  // Auto-advance carousel every 20 seconds
  useEffect(() => {
    if (layoutView !== 'carousel' || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setSlideDirection('left');
      setCarouselPage(prev => (prev + 1) % totalPages);
    }, 20000);
    return () => clearInterval(interval);
  }, [layoutView, isAutoPlaying, totalPages]);

  const goToPrevPage = useCallback(() => {
    setSlideDirection('right');
    setCarouselPage(prev => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    setSlideDirection('left');
    setCarouselPage(prev => (prev + 1) % totalPages);
  }, [totalPages]);

  const currentPageCourses = sortedCourses.slice(
    carouselPage * cardsPerPage,
    (carouselPage + 1) * cardsPerPage
  );

  // Subject grouping helper
  const groupBySubject = (list: Course[]) => {
    const groups: { subject: string; items: Course[] }[] = [];
    list.forEach(c => {
      const last = groups[groups.length - 1];
      if (last && last.subject === c.subject) last.items.push(c);
      else groups.push({ subject: c.subject, items: [c] });
    });
    return groups;
  };

  return (
    <Layout wideContent>
      <div className="space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative w-full aspect-[21/9] sm:aspect-[21/9] overflow-hidden rounded-xl border border-border shadow-lg">
            <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/RxwaLFayIQR6GE8u9S69uF/sandbox/CtCydrNZvLIhgfrf5eL4zA-img-1_1770157609000_na1fn_bWFyaWx5bi10ZWFjaGluZy1oZXJv.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvUnh3YUxGYXlJUVI2R0U4dTlTNjl1Ri9zYW5kYm94L0N0Q3lkck5adkxJaGdmcmY1ZUw0ekEtaW1nLTFfMTc3MDE1NzYwOTAwMF9uYTFmbl9iV0Z5YVd4NWJpMTBaV0ZqYUdsdVp5MW9aWEp2LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=UcR0a1m6lz3OG2NrPk1dNdDXoSRRe69L56KQEHrAAWy1RwWUnEZSmQJ2rnctrXi6~MynyjrodI1Kj1~Q8T6ixVCUsP1-USE2k49GfN5ha63gyMtX-bsDwYgGZCLaf9KUXXw1yaNJsyhT7h2I~Ae20nb3GNtkiDMhnlwqsagxJi2QOc8NcFg3pOs2qAO1t9H7FApTSNb1QBo3~p-XF~z1Sn3jP06rGzXdHf7ufGTPbF~3uzPIdaTCsFS-VUaIedfB3gNFYpWTBpsU6smkl4JUNIXP8dS5bsZ3iqkVqA4lFkmbXBusbudpB65w1znpQ0omPNu1QlTz9nGWAnqgUC2JFQ__"
              alt="Marilyn teaching and enlightening pupils"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold drop-shadow-lg">
                SDLC Learning Portal
              </h1>
              <p className="text-sm sm:text-lg md:text-xl mt-1 sm:mt-2 font-serif italic opacity-90 max-w-3xl line-clamp-2 sm:line-clamp-none">
                "The difference between a successful person and others is not a lack of strength, 
                not a lack of knowledge, but rather a lack of will."
              </p>
              <p className="text-xs sm:text-sm mt-1 opacity-75">— Marilyn</p>
            </div>
          </div>
        </section>

        {/* Partnership Statement */}
        <section className="text-center py-3 sm:py-4 border-y border-border bg-muted/30">
          <p className="text-sm sm:text-lg font-serif text-foreground px-4">
            <span className="font-semibold">SDLC learning</span> portal is presented by{" "}
            <span className="font-bold text-primary">SDLC Academy</span> in partnership with{" "}
            <span className="font-bold text-primary">GRACE</span>
          </p>
        </section>

        {/* Stats Bar */}
        <section className="flex flex-wrap justify-center gap-3 sm:gap-6 py-2 px-2">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>{courses.length} Courses</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>20+ Hours</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>GRACE Certification</span>
          </div>
        </section>

        {/* Controls Bar: Sort + Layout Toggle */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-2">
          {/* Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Sort:</span>
            <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
              {(["recommended", "alphabetical", "subject"] as SortOption[]).map(opt => (
                <Button
                  key={opt}
                  variant={sortOption === opt ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortOption(opt)}
                  className="text-[0.65rem] sm:text-xs h-6 sm:h-7 px-2 sm:px-3"
                >
                  {opt === 'recommended' ? 'Recommended' : opt === 'alphabetical' ? 'A–Z' : (
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" />Subject</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Layout Toggle */}
          <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
            {([
              { key: 'grid' as LayoutView, icon: LayoutGrid, label: 'Grid' },
              { key: 'carousel' as LayoutView, icon: Layers, label: 'Carousel' },
              { key: 'list' as LayoutView, icon: List, label: 'List' },
            ]).map(({ key, icon: LIcon, label }) => (
              <Button
                key={key}
                variant={layoutView === key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayoutView(key)}
                className="gap-1 text-[0.65rem] sm:text-xs h-6 sm:h-7 px-2 sm:px-3"
              >
                <LIcon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{label}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* ─── Grid View: responsive 1/2/3/4/5 cards per row ──── */}
        {layoutView === 'grid' && (
          <section>
            {sortOption === 'subject' ? (
              <div className="space-y-8">
                {groupBySubject(sortedCourses).map(g => (
                  <div key={g.subject}>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />{g.subject}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                      {g.items.map(c => <GridCard key={c.id} course={c} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
                {sortedCourses.map(c => <GridCard key={c.id} course={c} />)}
              </div>
            )}
          </section>
        )}

        {/* ─── Carousel View: smooth sliding, overlay arrows ──── */}
        {layoutView === 'carousel' && (
          <section className="relative" ref={containerRef}>
            {/* Cards container */}
            <div className="overflow-hidden rounded-lg px-2 sm:px-4">
              <div
                key={`${carouselPage}-${cardsPerPage}`}
                className="grid gap-4 sm:gap-5"
                style={{
                  gridTemplateColumns: `repeat(${cardsPerPage}, 1fr)`,
                  animation: `slideIn${slideDirection === 'left' ? 'Left' : 'Right'} 0.5s ease-out`,
                }}
              >
                {currentPageCourses.map(c => <GridCard key={c.id} course={c} />)}
              </div>
            </div>

            {/* Semi-transparent overlay arrows */}
            <button
              onClick={goToPrevPage}
              aria-label="Previous page"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-r-xl p-2 sm:p-3 transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNextPage}
              aria-label="Next page"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-l-xl p-2 sm:p-3 transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Page indicators + auto-play */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSlideDirection(idx > carouselPage ? 'left' : 'right');
                      setCarouselPage(idx);
                    }}
                    className={`rounded-full transition-all duration-300 ${
                      idx === carouselPage ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Page ${idx + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="gap-1 h-6 text-xs"
              >
                {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isAutoPlaying ? 'Pause' : 'Play'}
              </Button>
            </div>
            <p className="text-center text-[0.65rem] text-muted-foreground mt-1">
              Page {carouselPage + 1} of {totalPages} · {isAutoPlaying ? 'Auto-rotating every 20s' : 'Paused'}
            </p>
          </section>
        )}

        {/* ─── List View: wide, narrow cards ────────────────── */}
        {layoutView === 'list' && (
          <section>
            {sortOption === 'subject' ? (
              <div className="space-y-6">
                {groupBySubject(sortedCourses).map(g => (
                  <div key={g.subject}>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />{g.subject}
                    </h3>
                    <div className="space-y-2">
                      {g.items.map(c => <ListCard key={c.id} course={c} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {sortedCourses.map(c => <ListCard key={c.id} course={c} />)}
              </div>
            )}
          </section>
        )}

        {/* GRACE Academy Highlight */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 sm:p-8 text-center space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold">GRACE QA Certification</h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Complete all three GRACE tracks (ABT Foundations, AI Agent Mastery, and Enterprise Leadership) 
            to earn your GRACE Diploma — the gold standard in test automation excellence.
          </p>
          <Link href="/grace-academy">
            <button className="mt-3 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base">
              Start learning GRACE today→
            </button>
          </Link>
        </section>

        {/* Footer */}
        <section className="text-center py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground border-t border-border">
          <p>
            © {new Date().getFullYear()} Learn SDLC Portal, presented by <strong>SDLC Academy</strong>, in partnership with GRACE.
          </p>
        </section>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </Layout>
  );
}
