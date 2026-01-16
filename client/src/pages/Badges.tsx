import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Award, Trophy, Zap, Star, Crown, Target, Clock, CheckCircle2, Loader2, Lock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const badgeDefinitions: BadgeInfo[] = [
  {
    id: "perfect_quiz",
    name: "Quiz Master",
    description: "Score 100% on the Final Assessment",
    icon: <CheckCircle2 className="h-8 w-8" />,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "perfect_refactoring",
    name: "Code Surgeon",
    description: "Perfect score on the Refactoring Game",
    icon: <Zap className="h-8 w-8" />,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    id: "perfect_boss",
    name: "Test Architect",
    description: "Find all violations in the Boss Level",
    icon: <Trophy className="h-8 w-8" />,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    id: "first_attempt",
    name: "Natural Talent",
    description: "Pass any challenge on the first try",
    icon: <Target className="h-8 w-8" />,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    id: "speed_runner",
    name: "Speed Runner",
    description: "Complete the Refactoring Game in under 2 minutes",
    icon: <Clock className="h-8 w-8" />,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    id: "master_logician",
    name: "Master Logician",
    description: "Achieve 90%+ overall course score",
    icon: <Crown className="h-8 w-8" />,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Be among the first 100 users to complete the course",
    icon: <Star className="h-8 w-8" />,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete all modules and challenges",
    icon: <Award className="h-8 w-8" />,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

export default function Badges() {
  const { isAuthenticated } = useAuth();
  const { data: userBadges, isLoading } = trpc.badges.getUserBadges.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const earnedBadgeIds = userBadges?.map(b => b.badgeType) || [];

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="space-y-8">
          <section className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold">Your Badges</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sign in to track your achievements and earn badges!
            </p>
          </section>

          <Card className="border-border paper-shadow max-w-md mx-auto">
            <CardContent className="p-8 text-center space-y-4">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Badges are unlocked as you complete challenges and achieve milestones.
              </p>
              <Link href="/">
                <Button>Start Learning</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Award className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">Your Badges</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif italic">
            "The reward of a thing well done is having done it."
          </p>
          <p className="text-sm text-muted-foreground">
            {earnedBadgeIds.length} of {badgeDefinitions.length} badges earned
          </p>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badgeDefinitions.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id as any);
              return (
                <Card
                  key={badge.id}
                  className={`border-border paper-shadow transition-all ${
                    isEarned ? "" : "opacity-50 grayscale"
                  }`}
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${badge.color}`}>
                      {badge.icon}
                    </div>
                    <h3 className="font-serif font-bold">{badge.name}</h3>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {isEarned ? (
                      <span className="inline-block text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                        Earned!
                      </span>
                    ) : (
                      <span className="inline-block text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 inline mr-1" />
                        Locked
                      </span>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
