import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  GraduationCap, Trophy, Target, Brain, Gamepad2,
  CheckCircle2, Star, Award, ArrowRight, Clock,
  Sparkles, BarChart3, BookOpen,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const trackLabels: Record<string, { label: string; icon: string; total: number }> = {
  foundations: { label: 'Foundations', icon: '🏗️', total: 2 },
  sdlcModels: { label: 'SDLC Models', icon: '🔄', total: 3 },
  methodologies: { label: 'Methodologies', icon: '⚡', total: 2 },
  techniques: { label: 'Techniques', icon: '🎯', total: 3 },
  professionalPractice: { label: 'Professional Practice', icon: '🏆', total: 5 },
};

export default function StfDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: dashboard, isLoading } = trpc.stf.progress.getDashboard.useQuery(undefined, { enabled: isAuthenticated });
  const { data: modules } = trpc.stf.modules.getAll.useQuery();

  usePageMeta({
    title: 'Dashboard — Software Testing Fundamentals',
    description: 'Track your progress, quiz scores, game scores, and certificates for the Software Testing Fundamentals course.',
    keywords: 'software testing, dashboard, progress, QA education',
  });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-20 space-y-6">
          <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-3xl font-bold">Software Testing Fundamentals Dashboard</h1>
          <p className="text-muted-foreground">Please log in to view your progress and scores.</p>
          <a href={getLoginUrl()}>
            <Button size="lg">Log In</Button>
          </a>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!dashboard) return null;

  const overallProgress = Math.round((dashboard.completedModules / dashboard.totalModules) * 100);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">Software Testing Fundamentals</p>
          </div>
          <Link href="/stf">
            <Button variant="outline">
              <BookOpen className="w-4 h-4 mr-2" /> Course Overview
            </Button>
          </Link>
        </div>

        {/* Overall Progress */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Overall Progress</h2>
              <span className="text-2xl font-black text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-4 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-black text-primary">{dashboard.completedModules}</div>
                <div className="text-xs text-muted-foreground">Modules Complete</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">{dashboard.averageQuizScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Quiz Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-600">{dashboard.averageGameScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Game Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-600">
                  {dashboard.bestExamScore !== null ? `${dashboard.bestExamScore}%` : '—'}
                </div>
                <div className="text-xs text-muted-foreground">Best Exam Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Track Progress */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Track Progress
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(trackLabels).map(([key, { label, icon, total }]) => {
              const completed = (dashboard.trackProgress as any)[key] || 0;
              const pct = Math.round((completed / total) * 100);
              return (
                <Card key={key}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{icon}</span>
                        <span className="font-bold text-sm">{label}</span>
                      </div>
                      <Badge variant={pct === 100 ? 'default' : 'outline'}>
                        {completed}/{total}
                      </Badge>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Module-by-Module Progress */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5" /> Module Progress
          </h2>
          <div className="space-y-2">
            {(modules || []).map((mod: any) => {
              const modProgress = dashboard.progress?.find((p: any) => p.moduleId === mod.moduleNumber);
              const sections = modProgress
                ? [
                    { key: 'Spark', done: modProgress.sparkCompleted, icon: Sparkles },
                    { key: 'Quiz', done: modProgress.gauntletCompleted, icon: Target },
                    { key: 'Game', done: modProgress.crucibleCompleted, icon: Gamepad2 },
                    { key: 'Imprint', done: modProgress.imprintCompleted, icon: Brain },
                  ]
                : [
                    { key: 'Spark', done: false, icon: Sparkles },
                    { key: 'Quiz', done: false, icon: Target },
                    { key: 'Game', done: false, icon: Gamepad2 },
                    { key: 'Imprint', done: false, icon: Brain },
                  ];
              const completedSections = sections.filter(s => s.done).length;
              const quizScore = modProgress?.bestQuizScore;
              const gameScore = modProgress?.bestGameScore;

              return (
                <Link key={mod.moduleNumber} href={`/stf/module/${mod.moduleNumber}`}>
                  <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          completedSections === 4
                            ? 'bg-green-500 text-white'
                            : completedSections > 0
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {completedSections === 4 ? <CheckCircle2 className="w-5 h-5" /> : mod.moduleNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm truncate">{mod.title}</h3>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {sections.map(({ key, done, icon: Icon }) => (
                              <span
                                key={key}
                                className={`flex items-center gap-1 text-xs ${
                                  done ? 'text-green-600' : 'text-muted-foreground'
                                }`}
                              >
                                <Icon className="w-3 h-3" />
                                {key}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                          {quizScore !== null && quizScore !== undefined && (
                            <span className="text-muted-foreground">Quiz: {quizScore}%</span>
                          )}
                          {gameScore !== null && gameScore !== undefined && (
                            <span className="text-muted-foreground">Game: {gameScore}%</span>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Certificates */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="w-5 h-5" /> Certificates
          </h2>
          {dashboard.certificates && dashboard.certificates.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard.certificates.map((cert: any, i: number) => (
                <Card key={i} className="bg-gradient-to-r from-yellow-500/5 to-orange-500/5 border-yellow-500/20">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="text-4xl">🎓</div>
                    <div>
                      <h3 className="font-bold">{cert.badgeType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</h3>
                      <p className="text-xs text-muted-foreground">
                        Earned {new Date(cert.awardedAt).toLocaleDateString()}
                      </p>
                      {cert.verificationCode && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Code: {cert.verificationCode}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Complete modules and pass quizzes to earn certificates!</p>
                <p className="text-sm mt-2">Track certificates: Foundations, SDLC, Methodologies, Techniques, Professional Practice, and the full course diploma.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
}
