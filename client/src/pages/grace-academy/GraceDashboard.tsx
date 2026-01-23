import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useEffect } from "react";
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Trophy,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star
} from "lucide-react";

const TRACK_INFO = {
  foundation: { name: 'Foundation', color: 'blue', modules: [1, 10] },
  intermediate: { name: 'Intermediate', color: 'amber', modules: [11, 20] },
  advanced: { name: 'Advanced', color: 'purple', modules: [21, 30] },
};

export default function GraceDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: dashboard, isLoading } = trpc.graceAcademy.progress.getDashboard.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, authLoading]);

  if (isLoading || authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const overallProgress = dashboard ? Math.round((dashboard.completedModules / 30) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">GRACE Academy</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">Your Progress</h1>
          </div>
          <Link href="/grace-academy">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" /> View Curriculum
            </Button>
          </Link>
        </div>

        {/* Overall Progress */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold">Overall Progress</h2>
                <p className="text-muted-foreground">
                  {dashboard?.completedModules || 0} of 30 modules completed
                </p>
              </div>
              <div className="text-4xl font-bold text-primary">{overallProgress}%</div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Track Progress */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(TRACK_INFO).map(([key, track]) => {
            const trackKey = key as keyof typeof TRACK_INFO;
            const completed = trackKey === 'foundation' 
              ? dashboard?.foundationProgress || 0
              : trackKey === 'intermediate'
              ? dashboard?.intermediateProgress || 0
              : dashboard?.advancedProgress || 0;
            const percentage = (completed / 10) * 100;
            const isComplete = completed === 10;
            
            return (
              <Card key={key} className={`border-${track.color}-500/30`}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span className={`text-${track.color}-600`}>{track.name} Track</span>
                    {isComplete && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Modules {track.modules[0]}-{track.modules[1]}</span>
                      <span className="font-medium">{completed}/10</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    {!isComplete && (
                      <Link href={`/grace-academy/module-${track.modules[0] + completed}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          Continue <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{dashboard?.completedModules || 0}</div>
              <p className="text-sm text-muted-foreground">Modules Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <div className="text-2xl font-bold">{dashboard?.averageScore || 0}%</div>
              <p className="text-sm text-muted-foreground">Average Quiz Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{dashboard?.certificates?.length || 0}</div>
              <p className="text-sm text-muted-foreground">Certificates Earned</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{30 - (dashboard?.completedModules || 0)}</div>
              <p className="text-sm text-muted-foreground">Modules Remaining</p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Your Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.certificates && dashboard.certificates.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {dashboard.certificates.map((cert: any) => (
                  <Card key={cert.id} className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-amber-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                          {cert.certificateType === 'grace_diploma' ? (
                            <GraduationCap className="w-6 h-6 text-amber-600" />
                          ) : (
                            <Award className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif font-bold">
                            {cert.certificateType === 'grace_diploma' 
                              ? 'GRACE Diploma'
                              : `${cert.certificateType.charAt(0).toUpperCase() + cert.certificateType.slice(1)} Certificate`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Code: {cert.certificateCode}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Earned: {new Date(cert.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Complete tracks to earn certificates!</p>
                <p className="text-sm mt-2">
                  Foundation (10 modules) → Intermediate (10 modules) → Advanced (10 modules) → GRACE Diploma
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Continue Learning CTA */}
        {dashboard && dashboard.completedModules < 30 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold">Continue Your Journey</h3>
                  <p className="text-muted-foreground">
                    {30 - dashboard.completedModules} modules remaining to earn your GRACE Diploma
                  </p>
                </div>
                <Link href={`/grace-academy/module-${dashboard.completedModules + 1}`}>
                  <Button>
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
