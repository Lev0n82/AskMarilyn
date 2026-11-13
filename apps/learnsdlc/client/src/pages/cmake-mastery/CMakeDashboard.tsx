import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  ArrowRight,
  GraduationCap,
  Trophy,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Terminal,
  Package,
  Zap,
  BookOpen,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const MODULE_TITLES: Record<number, string> = {
  1: "Why CMake?",
  2: "Getting Started",
  3: "Writing CMakeLists Files",
  4: "The CMake Cache",
  5: "Key Concepts",
  6: "Modules",
  7: "Installing Files",
  8: "System Inspection & Finding Packages",
  9: "Custom Commands",
  10: "Converting & Cross Compiling",
  11: "Packaging with CPack",
  12: "Testing with CTest",
  13: "CDash Dashboard",
  14: "The CMake Tutorial",
  15: "User Interaction Guide",
  16: "Using Dependencies",
  17: "Importing and Exporting",
  18: "IDE Integration",
  19: "Advanced Techniques",
  20: "Final Exam",
};

const TRACK_MODULES: Record<string, number[]> = {
  foundations: [1, 2, 3, 4, 5],
  build_system: [6, 7, 8, 9, 10],
  advanced: [11, 12, 13, 14, 15],
  tools: [16, 17, 18, 19, 20],
};

const TRACK_INFO: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  foundations: { label: "Foundations", icon: <BookOpen className="w-5 h-5" />, color: "text-blue-500" },
  build_system: { label: "Build System", icon: <Terminal className="w-5 h-5" />, color: "text-amber-500" },
  advanced: { label: "Advanced", icon: <Zap className="w-5 h-5" />, color: "text-purple-500" },
  tools: { label: "Tools & Ecosystem", icon: <Package className="w-5 h-5" />, color: "text-green-500" },
};

export default function CMakeDashboard() {
  usePageMeta({
    title: "CMake Mastery - Dashboard",
    description: "CMake Mastery course dashboard showing learning progress and module overview. Part of GRACE Academy curriculum.",
    keywords: "CMake course progress, build system education, software engineering training, GRACE Academy"
  });

  const { user, isAuthenticated } = useAuth();
  const { data: dashboard, isLoading } = trpc.cmakeMastery.progress.getDashboard.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
          <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="font-display text-3xl font-bold">Your CMake Mastery Dashboard</h1>
          <p className="text-muted-foreground">Sign in to track your progress, view quiz scores, and earn certificates.</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Sign In to View Dashboard</Button>
          </a>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const completedModules = dashboard?.completedModules || 0;
  const totalModules = dashboard?.totalModules || 20;
  const overallProgress = Math.round((completedModules / totalModules) * 100);
  const averageScore = dashboard?.averageScore || 0;

  const progressMap: Record<number, any> = {};
  (dashboard?.progress || []).forEach((p: any) => {
    progressMap[p.moduleId] = p;
  });

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">CMake Mastery Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.name || 'Student'}!</p>
          </div>
          <Link href="/cmake-mastery">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" /> Course Overview
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-black text-primary">{completedModules}/{totalModules}</div>
              <p className="text-sm text-muted-foreground mt-1">Modules Complete</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-black text-green-500">{overallProgress}%</div>
              <p className="text-sm text-muted-foreground mt-1">Overall Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-black text-amber-500">{averageScore}%</div>
              <p className="text-sm text-muted-foreground mt-1">Avg Quiz Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <div className="text-3xl font-black text-purple-500">{dashboard?.certificates?.length || 0}</div>
              <p className="text-sm text-muted-foreground mt-1">Certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">Overall Course Progress</span>
              <span className="text-sm text-muted-foreground">{completedModules} of {totalModules} modules</span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            {overallProgress === 100 && (
              <p className="text-center text-green-600 font-bold mt-3">
                🎓 Congratulations! You have completed the CMake Mastery Course!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        {(dashboard?.certificates?.length || 0) > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Your Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {dashboard!.certificates.map((cert: any) => (
                  <div key={cert.id} className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
                    <GraduationCap className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                    <p className="font-bold text-sm">
                      {cert.certificateType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Score: {cert.averageScore}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cert.earnedAt).toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="mt-2 text-xs font-mono">
                      {cert.certificateCode}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Module Progress by Track */}
        {Object.entries(TRACK_MODULES).map(([trackId, moduleNums]) => {
          const trackInfo = TRACK_INFO[trackId];
          const trackCompleted = moduleNums.filter((n) => progressMap[n]?.moduleCompleted).length;
          const trackProgress = Math.round((trackCompleted / moduleNums.length) * 100);

          return (
            <Card key={trackId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 ${trackInfo.color}`}>
                    {trackInfo.icon}
                    {trackInfo.label} Track
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {trackCompleted}/{moduleNums.length} complete
                  </span>
                </div>
                <Progress value={trackProgress} className="h-2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {moduleNums.map((n) => {
                    const p = progressMap[n];
                    const isCompleted = p?.moduleCompleted;
                    const sparkDone = p?.sparkCompleted;
                    const gauntletDone = p?.gauntletCompleted;
                    const crucibleDone = p?.crucibleCompleted;
                    const imprintDone = p?.imprintCompleted;

                    return (
                      <Link key={n} href={`/cmake-mastery/module/${n}`}>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                            isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : n}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{MODULE_TITLES[n]}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {[
                                { done: sparkDone, label: 'S' },
                                { done: gauntletDone, label: 'G' },
                                { done: crucibleDone, label: 'C' },
                                { done: imprintDone, label: 'I' },
                              ].map((s, i) => (
                                <div key={i} className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                                  s.done ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                                }`}>
                                  {s.label}
                                </div>
                              ))}
                              {p?.bestQuizScore != null && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  Quiz: {p.bestQuizScore}%
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Next Module CTA */}
        {completedModules < totalModules && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <Target className="w-10 h-10 mx-auto text-primary" />
              <h3 className="font-bold text-lg">Continue Learning</h3>
              <p className="text-muted-foreground text-sm">
                You are {overallProgress}% through the CMake Mastery Course.
                {completedModules < totalModules && ` Module ${completedModules + 1} awaits!`}
              </p>
              <Link href={`/cmake-mastery/module/${completedModules + 1}`}>
                <Button className="gap-2">
                  Continue to Module {completedModules + 1}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
