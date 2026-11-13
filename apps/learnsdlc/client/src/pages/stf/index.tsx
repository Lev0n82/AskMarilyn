import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  ArrowRight, GraduationCap, Clock, BookOpen, Target,
  CheckCircle2, Brain, Gamepad2, Sparkles, ChevronRight,
} from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const trackInfo: Record<string, { label: string; color: string; icon: string; description: string }> = {
  foundations: {
    label: 'Foundations',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    icon: '🏗️',
    description: 'Why we test, the seven principles, and the fundamentals that underpin all quality assurance.',
  },
  sdlc_models: {
    label: 'SDLC Models',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    icon: '🔄',
    description: 'Waterfall, V-Model, and Iterative/Incremental — how testing fits into each lifecycle.',
  },
  methodologies: {
    label: 'Methodologies',
    color: 'bg-green-500/10 text-green-600 border-green-500/30',
    icon: '⚡',
    description: 'Agile testing, DevOps pipelines, and choosing the right test approach for your context.',
  },
  techniques: {
    label: 'Techniques',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    icon: '🎯',
    description: 'Test levels, types, design techniques, traceability, documentation, and defect management.',
  },
  professional_practice: {
    label: 'Professional Practice',
    color: 'bg-red-500/10 text-red-600 border-red-500/30',
    icon: '🏆',
    description: 'Test automation fundamentals and the capstone that ties everything together.',
  },
};

const trackOrder = ['foundations', 'sdlc_models', 'methodologies', 'techniques', 'professional_practice'];

export default function StfIndex() {
  const { data: modules, isLoading } = trpc.stf.modules.getAll.useQuery();
  const { isAuthenticated } = useAuth();
  const { data: dashboard } = trpc.stf.progress.getDashboard.useQuery(undefined, { enabled: isAuthenticated });

  usePageMeta({
    title: 'Software Testing Fundamentals — Educational Course',
    description: 'A comprehensive 15-module course covering ISTQB CTFL topics, SDLC models, Agile, DevOps, test design techniques, and requirement-to-test-case traceability.',
    keywords: 'software testing, ISTQB, CTFL, QA, education, testing fundamentals, Agile testing, DevOps, traceability',
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const modulesByTrack = trackOrder.reduce((acc, track) => {
    acc[track] = (modules || []).filter((m: any) => m.track === track);
    return acc;
  }, {} as Record<string, any[]>);

  const totalModules = modules?.length || 15;
  const completedModules = dashboard?.completedModules || 0;
  const overallProgress = Math.round((completedModules / totalModules) * 100);

  return (
    <Layout>
      <div className="space-y-10">
        {/* Hero */}
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 text-[200px] leading-none">🧪</div>
            </div>
            <div className="relative z-10 max-w-3xl">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                15 Modules • 75 Quiz Questions • 15 Interactive Games
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Software Testing Fundamentals
              </h1>
              <p className="text-xl text-blue-100 mb-2 italic font-serif">
                "The question isn't whether your software has bugs — it's whether you'll find them before your users do."
              </p>
              <p className="text-blue-200 mb-6">
                A comprehensive course covering ISTQB CTFL topics, SDLC models (Waterfall, Agile, DevOps),
                test design techniques, and the foundational practice of requirement-to-test-case traceability.
                Integrates AT*SQA micro-credential content for Test Approaches, Agile, and DevOps.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/stf/module/1">
                  <Button size="lg" className="bg-white text-indigo-900 hover:bg-blue-50 font-bold">
                    Start Learning <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/stf/dashboard">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <GraduationCap className="w-5 h-5 mr-2" /> View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Progress bar (if logged in) */}
          {isAuthenticated && dashboard && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">{completedModules}/{totalModules} modules</span>
                </div>
                <Progress value={overallProgress} className="h-3" />
              </CardContent>
            </Card>
          )}
        </section>

        {/* Course Structure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Course Structure</h2>
          <p className="text-muted-foreground">
            Each module follows the Ask Marilyn methodology with four phases:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, label: 'The Spark', desc: 'Learn the concepts with engaging content and infographics', color: 'text-yellow-500' },
              { icon: Target, label: 'The Gauntlet', desc: '5-question quiz to test your understanding', color: 'text-red-500' },
              { icon: Gamepad2, label: 'The Crucible', desc: 'Interactive game to embed knowledge in memory', color: 'text-green-500' },
              { icon: Brain, label: 'The Imprint', desc: 'Key takeaways and connections for lasting retention', color: 'text-purple-500' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <Card key={label}>
                <CardContent className="p-4 text-center space-y-2">
                  <Icon className={`w-8 h-8 mx-auto ${color}`} />
                  <h3 className="font-bold text-sm">{label}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Modules by Track */}
        {trackOrder.map((track) => {
          const info = trackInfo[track];
          const trackModules = modulesByTrack[track] || [];
          if (trackModules.length === 0) return null;

          return (
            <section key={track} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{info.icon}</span>
                <div>
                  <h2 className="text-xl font-bold">{info.label}</h2>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trackModules.map((mod: any) => {
                  const modProgress = dashboard?.progress?.find((p: any) => p.moduleId === mod.moduleNumber);
                  const sectionsComplete = modProgress
                    ? [modProgress.sparkCompleted, modProgress.gauntletCompleted, modProgress.crucibleCompleted, modProgress.imprintCompleted].filter(Boolean).length
                    : 0;

                  return (
                    <Link key={mod.moduleNumber} href={`/stf/module/${mod.moduleNumber}`}>
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="outline" className="text-xs">
                              Module {mod.moduleNumber}
                            </Badge>
                            {sectionsComplete === 4 && (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <h3 className="font-bold group-hover:text-primary transition-colors">
                            {mod.title}
                          </h3>
                          {mod.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{mod.subtitle}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {mod.estimatedMinutes} min
                            </span>
                            {isAuthenticated && modProgress && (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> {sectionsComplete}/4
                              </span>
                            )}
                          </div>
                          {isAuthenticated && modProgress && sectionsComplete > 0 && sectionsComplete < 4 && (
                            <Progress value={(sectionsComplete / 4) * 100} className="h-1.5" />
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </Layout>
  );
}
