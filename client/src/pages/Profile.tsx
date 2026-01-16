import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useProgress } from "@/contexts/ProgressContext";
import { Link } from "wouter";
import { 
  User, 
  Trophy, 
  MessageSquare, 
  Award, 
  CheckCircle, 
  Clock, 
  Loader2,
  BookOpen,
  Code,
  Target,
  Zap,
  Crown,
  Star,
  Sparkles,
  Medal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareBadge } from "@/components/ShareBadge";

const badgeInfo: Record<string, { name: string; icon: React.ReactNode; description: string; color: string }> = {
  perfect_quiz: { 
    name: "Quiz Master", 
    icon: <Trophy className="h-6 w-6" />, 
    description: "Scored 100% on the Final Assessment",
    color: "text-yellow-500"
  },
  perfect_refactoring: { 
    name: "Code Surgeon", 
    icon: <Code className="h-6 w-6" />, 
    description: "Perfect score on the Refactoring Game",
    color: "text-blue-500"
  },
  perfect_boss: { 
    name: "Test Architect", 
    icon: <Target className="h-6 w-6" />, 
    description: "Perfect score on the Architect's Challenge",
    color: "text-purple-500"
  },
  first_attempt: { 
    name: "Natural Talent", 
    icon: <Sparkles className="h-6 w-6" />, 
    description: "Passed on the first try",
    color: "text-green-500"
  },
  speed_runner: { 
    name: "Speed Runner", 
    icon: <Zap className="h-6 w-6" />, 
    description: "Completed a challenge in under 2 minutes",
    color: "text-orange-500"
  },
  master_logician: { 
    name: "Master Logician", 
    icon: <Crown className="h-6 w-6" />, 
    description: "Achieved 90%+ overall course score",
    color: "text-indigo-500"
  },
  early_adopter: { 
    name: "Early Adopter", 
    icon: <Star className="h-6 w-6" />, 
    description: "One of the first 100 users",
    color: "text-pink-500"
  },
  completionist: { 
    name: "Completionist", 
    icon: <Medal className="h-6 w-6" />, 
    description: "Completed all course modules",
    color: "text-teal-500"
  },
  streak_master: { 
    name: "Streak Master", 
    icon: <Zap className="h-6 w-6" />, 
    description: "Maintained a 7-day learning streak",
    color: "text-amber-500"
  },
  abt_fundamentals_complete: {
    name: "ABT Graduate",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Completed the ABT Fundamentals course",
    color: "text-blue-500"
  },
  coding_style_complete: {
    name: "Style Master",
    icon: <Code className="h-6 w-6" />,
    description: "Completed the Coding Style Guide course",
    color: "text-emerald-500"
  },
  commenting_complete: {
    name: "Comment Connoisseur",
    icon: <MessageSquare className="h-6 w-6" />,
    description: "Completed The Fine Art of Commenting course",
    color: "text-amber-500"
  },
  technical_writing_complete: {
    name: "Wordsmith",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Completed the Technical Writing course",
    color: "text-purple-500"
  },
  all_courses_complete: {
    name: "Renaissance Developer",
    icon: <Trophy className="h-6 w-6" />,
    description: "Completed all available courses",
    color: "text-yellow-500"
  },
};

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { progress } = useProgress();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: badges, isLoading: badgesLoading } = trpc.badges.getUserBadges.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: forumPosts, isLoading: postsLoading } = trpc.forum.getPosts.useQuery(
    {},
    { enabled: isAuthenticated }
  );

  const { data: streakData } = trpc.streaks.getStreak.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Filter posts by current user
  const userPosts = forumPosts?.filter(post => post.userId === user?.id) || [];

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12 space-y-6">
          <User className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <h1 className="text-3xl font-serif font-bold text-primary">Your Profile</h1>
          <p className="text-muted-foreground">
            Sign in to view your learning progress, earned badges, and forum activity.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const completedModulesCount = progress.completedModules.length;
  const totalModules = 5;
  const progressPercentage = Math.round((completedModulesCount / totalModules) * 100);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Profile Header */}
        <section className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">{user?.name || "Learner"}</h1>
            <p className="text-muted-foreground">ABT Course Student</p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{completedModulesCount}/{totalModules}</p>
              <p className="text-xs text-muted-foreground">Modules Completed</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
              <p className="text-2xl font-bold">{badges?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">{progress.quizScore !== null ? `${progress.quizScore}/5` : "-"}</p>
              <p className="text-xs text-muted-foreground">Quiz Score</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <MessageSquare className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{userPosts.length}</p>
              <p className="text-xs text-muted-foreground">Forum Posts</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{streakData?.currentStreak || 0}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Progress Bar */}
            <Card className="border-border paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Learning Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Completion</span>
                  <span className="font-bold">{progressPercentage}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  {[
                    { path: "/module-1", label: "The Testing Paradox" },
                    { path: "/module-2", label: "The Three Layers" },
                    { path: "/module-3", label: "Anti-Patterns" },
                    { path: "/module-4", label: "Architecture" },
                    { path: "/module-5", label: "Language of Logic" },
                  ].map((module) => (
                    <div key={module.path} className="flex items-center gap-2 text-sm">
                      {progress.completedModules.includes(module.path) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                      )}
                      <span className={cn(
                        progress.completedModules.includes(module.path) 
                          ? "text-foreground" 
                          : "text-muted-foreground"
                      )}>
                        {module.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scores */}
            <Card className="border-border paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Challenge Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      Final Assessment
                    </span>
                    <span className="font-bold">
                      {progress.quizScore !== null ? `${progress.quizScore}/5` : "Not taken"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      Refactoring Game
                    </span>
                    <span className="font-bold">
                      {progress.refactoringScore !== null ? `${progress.refactoringScore}/5` : "Not taken"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      Architect's Challenge
                    </span>
                    <span className="font-bold">
                      {progress.bossScore !== null ? `${progress.bossScore}/4` : "Not taken"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <Card className="border-border paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Your Badges</CardTitle>
              </CardHeader>
              <CardContent>
                {badgesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : !badges || badges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No badges earned yet. Complete challenges to earn badges!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {badges.map((badge) => {
                      const info = badgeInfo[badge.badgeType] || {
                        name: badge.badgeType,
                        icon: <Award className="h-6 w-6" />,
                        description: "Achievement unlocked",
                        color: "text-primary"
                      };
                      return (
                        <div 
                          key={badge.id} 
                          className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className={cn("p-3 bg-background rounded-full", info.color)}>
                            {info.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{info.name}</p>
                            <p className="text-xs text-muted-foreground">{info.description}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(badge.awardedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ShareBadge 
                            badgeName={info.name} 
                            courseName={info.description.includes('course') ? info.description.split('the ')[1]?.split(' course')[0] || 'Ask Marilyn' : 'Ask Marilyn'}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Available Badges */}
                <div className="mt-8">
                  <h4 className="font-semibold mb-4 text-muted-foreground">Available Badges</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(badgeInfo).map(([type, info]) => {
                      const earned = badges?.some(b => b.badgeType === type);
                      return (
                        <div 
                          key={type}
                          className={cn(
                            "flex flex-col items-center p-3 rounded-lg text-center",
                            earned ? "bg-muted/50" : "bg-muted/20 opacity-50"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-full mb-2",
                            earned ? info.color : "text-muted-foreground"
                          )}>
                            {info.icon}
                          </div>
                          <p className="text-xs font-medium">{info.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="border-border paper-shadow">
              <CardHeader>
                <CardTitle className="font-serif">Forum Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {postsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      You haven't posted anything yet.
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                      <Link href="/forum">Visit Forum</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userPosts.map((post) => (
                      <Link key={post.id} href="/forum">
                        <div className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                          <p className="font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
