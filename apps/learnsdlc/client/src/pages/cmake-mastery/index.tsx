import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Terminal,
  Package,
  TestTube,
  BarChart3,
  GraduationCap,
  Zap,
  Settings,
  Code2,
  Layers,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const tracks = [
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "Modules 1–5",
    color: "bg-blue-500",
    icon: <BookOpen className="w-6 h-6" />,
    description: "Why CMake exists, how to install and run the tools, writing CMakeLists files, the cache system, and key concepts including policies, properties, and scope.",
    modules: 5,
    duration: "75 min",
    href: "/cmake-mastery/module/1",
  },
  {
    id: "build_system",
    title: "Build System",
    subtitle: "Modules 6–10",
    color: "bg-amber-500",
    icon: <Settings className="w-6 h-6" />,
    description: "Reusable modules, installing files with GNUInstallDirs, finding packages, custom commands for code generation, and converting existing projects to CMake.",
    modules: 5,
    duration: "90 min",
    href: "/cmake-mastery/module/6",
  },
  {
    id: "advanced",
    title: "Advanced",
    subtitle: "Modules 11–15",
    color: "bg-purple-500",
    icon: <Zap className="w-6 h-6" />,
    description: "Packaging with CPack, testing with CTest, the CDash dashboard, building a complete project from scratch, and making your build system user-friendly with presets.",
    modules: 5,
    duration: "90 min",
    href: "/cmake-mastery/module/11",
  },
  {
    id: "tools",
    title: "Tools & Ecosystem",
    subtitle: "Modules 16–20",
    color: "bg-green-500",
    icon: <Package className="w-6 h-6" />,
    description: "FetchContent for dependency management, exporting Config Packages, IDE integration, generator expressions, and the comprehensive final mastery exam.",
    modules: 5,
    duration: "90 min",
    href: "/cmake-mastery/module/16",
  },
];

const capabilities = [
  { icon: <Terminal className="w-10 h-10 text-blue-500" />, title: "Command-Line Mastery", desc: "cmake, ctest, cpack, ccmake — every tool in the family" },
  { icon: <Code2 className="w-10 h-10 text-amber-500" />, title: "Modern CMake Code", desc: "Target-based builds with proper visibility and transitive dependencies" },
  { icon: <TestTube className="w-10 h-10 text-green-500" />, title: "CTest Integration", desc: "Register, run, and analyze tests with GoogleTest auto-discovery" },
  { icon: <Package className="w-10 h-10 text-purple-500" />, title: "CPack Packaging", desc: "DEB, RPM, NSIS, DMG — one config, every platform" },
  { icon: <BarChart3 className="w-10 h-10 text-red-500" />, title: "CDash Dashboard", desc: "Continuous integration with team-visible test results" },
  { icon: <Layers className="w-10 h-10 text-cyan-500" />, title: "Cross-Compilation", desc: "Toolchain files for ARM, embedded, and cross-platform targets" },
  { icon: <GraduationCap className="w-10 h-10 text-pink-500" />, title: "Config Packages", desc: "Export your library so others can use find_package()" },
  { icon: <Settings className="w-10 h-10 text-orange-500" />, title: "IDE Integration", desc: "VS Code, CLion, Visual Studio, Xcode — all from one CMakeLists.txt" },
];

export default function CMakeMasteryIndex() {
  usePageMeta({
    title: "CMake Mastery Course",
    description: "Comprehensive educational course on CMake build system for professional software engineers. Part of GRACE Academy curriculum.",
    keywords: "CMake education, build system training, software engineering course, GRACE Academy"
  });

  const { user, isAuthenticated } = useAuth();
  const { data: dashboard } = trpc.cmakeMastery.progress.getDashboard.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const overallProgress = dashboard
    ? Math.round((dashboard.completedModules / dashboard.totalModules) * 100)
    : 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Terminal className="w-4 h-4" />
            CMake Mastery Course
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Master the CMake Ecosystem
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From your first <code className="bg-muted px-1 rounded text-sm">CMakeLists.txt</code> to
            distributable packages and team dashboards — the complete guide to professional C/C++ builds.
          </p>

          {/* Reader's Dilemma */}
          <div className="max-w-3xl mx-auto bg-muted/40 border border-border rounded-xl p-6 text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-muted-foreground mb-1">Dear Marilyn,</p>
                <p className="text-foreground italic">
                  "I have been a C++ developer for eight years. I can write complex software. But every time I
                  start a new project, I spend days fighting the build system. I have three different Makefiles,
                  a Visual Studio solution, and an Xcode project — all for the same code. They are always out of
                  sync. My colleagues on different platforms can never build my code. I feel like I am maintaining
                  four projects instead of one. There must be a better way."
                </p>
                <p className="text-sm text-muted-foreground mt-2">— Desperate in Denver</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <p className="font-semibold text-primary mb-2">Marilyn responds:</p>
              <p className="text-foreground">
                There is. It is called <strong>CMake</strong>, and it will change how you think about building software.
                CMake is not a build system — it is a <em>build system generator</em>. Write your build logic once,
                and CMake generates native build files for every platform: Makefiles on Linux, Visual Studio solutions
                on Windows, Xcode projects on macOS. One source of truth. Every platform. That is the promise of CMake,
                and this course will show you exactly how to claim it.
              </p>
            </div>
          </div>

          {/* Progress Bar (authenticated users) */}
          {isAuthenticated && dashboard && (
            <div className="max-w-xl mx-auto bg-card border border-border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Your Progress</span>
                <span className="text-sm text-muted-foreground">
                  {dashboard.completedModules}/{dashboard.totalModules} modules
                </span>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{overallProgress}% complete</span>
                <span>Avg score: {dashboard.averageScore}%</span>
              </div>
              {dashboard.certificates.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {dashboard.certificates.map((cert) => (
                    <Badge key={cert.id} variant="secondary" className="text-xs">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      {cert.certificateType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cmake-mastery/module/1">
              <Button size="lg" className="gap-2">
                Start Module 1 <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/cmake-mastery/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <BarChart3 className="w-5 h-5" /> My Dashboard
                </Button>
              </Link>
            )}
            {!isAuthenticated && (
              <a href={getLoginUrl()}>
                <Button size="lg" variant="outline" className="gap-2">
                  Sign In to Track Progress
                </Button>
              </a>
            )}
          </div>
        </section>

        {/* Learning Tracks */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">Learning Tracks</h2>
          <p className="text-muted-foreground mb-6">
            Four tracks, 20 modules, 100 quiz questions. Each module follows the proven
            Spark → Gauntlet → Crucible → Imprint methodology.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {tracks.map((track) => {
              const trackProgress = dashboard
                ? track.id === 'foundations' ? dashboard.foundationsProgress
                : track.id === 'advanced' ? dashboard.advancedProgress
                : 0
                : 0;

              return (
                <Card key={track.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className={`h-2 ${track.color}`} />
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 rounded-full ${track.color} text-white flex items-center justify-center`}>
                        {track.icon}
                      </div>
                      <div>
                        <CardTitle className="font-display">{track.title}</CardTitle>
                        <CardDescription>{track.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">{track.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {track.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {track.duration}
                      </span>
                    </div>
                    {isAuthenticated && dashboard && (
                      <Progress
                        value={Math.round((trackProgress / track.modules) * 100)}
                        className="h-2"
                      />
                    )}
                    <Link href={track.href}>
                      <Button className="w-full gap-2 group-hover:bg-primary/90">
                        Start Track <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* What You'll Master */}
        <section className="bg-muted/30 p-8 rounded-xl">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">What You Will Master</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">{cap.icon}</div>
                <h3 className="font-bold mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground">{cap.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Module List */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">All 20 Modules</h2>
          <div className="space-y-2">
            {[
              { n: 1, t: "Why CMake? The Build System Awakening", track: "Foundations" },
              { n: 2, t: "Getting Started: Install, Configure, and Run", track: "Foundations" },
              { n: 3, t: "Writing CMakeLists Files", track: "Foundations" },
              { n: 4, t: "The CMake Cache", track: "Foundations" },
              { n: 5, t: "Key Concepts: Policies, Properties, and Scope", track: "Foundations" },
              { n: 6, t: "Modules: Reusable Build Logic", track: "Build System" },
              { n: 7, t: "Installing Files", track: "Build System" },
              { n: 8, t: "System Inspection and Finding Packages", track: "Build System" },
              { n: 9, t: "Custom Commands and Code Generation", track: "Build System" },
              { n: 10, t: "Converting Existing Systems and Cross Compiling", track: "Build System" },
              { n: 11, t: "Packaging with CPack", track: "Advanced" },
              { n: 12, t: "Testing with CMake and CTest", track: "Advanced" },
              { n: 13, t: "CDash: The Testing Dashboard", track: "Advanced" },
              { n: 14, t: "The CMake Tutorial: A Complete Project", track: "Advanced" },
              { n: 15, t: "User Interaction Guide: Presets and Options", track: "Advanced" },
              { n: 16, t: "Using Dependencies: FetchContent and ExternalProject", track: "Tools" },
              { n: 17, t: "Importing and Exporting: Config Packages", track: "Tools" },
              { n: 18, t: "IDE Integration Guide", track: "Tools" },
              { n: 19, t: "Advanced Techniques: Generator Expressions", track: "Tools" },
              { n: 20, t: "CMake Mastery Final Exam", track: "Tools" },
            ].map((mod) => {
              const isCompleted = dashboard?.progress.some(
                (p) => p.moduleId === mod.n && p.moduleCompleted
              );
              return (
                <Link key={mod.n} href={`/cmake-mastery/module/${mod.n}`}>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{mod.t}</p>
                      <p className="text-xs text-muted-foreground">{mod.track}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Certifications */}
        <section className="text-center py-8 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl border border-border">
          <GraduationCap className="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 className="font-display text-2xl font-bold mb-4">Three Certifications Await</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl mb-2">🏅</div>
              <p className="font-bold text-sm">CMake Foundations</p>
              <p className="text-xs text-muted-foreground">Complete modules 1–10</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl mb-2">🥇</div>
              <p className="font-bold text-sm">CMake Advanced</p>
              <p className="text-xs text-muted-foreground">Complete modules 11–20</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="text-2xl mb-2">🎓</div>
              <p className="font-bold text-sm">CMake Mastery Diploma</p>
              <p className="text-xs text-muted-foreground">Complete all 20 modules</p>
            </div>
          </div>
          <Link href="/cmake-mastery/module/1">
            <Button size="lg" className="gap-2">
              Begin Your Journey <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
