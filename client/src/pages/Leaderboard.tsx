import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Trophy, Medal, Award, Crown, Loader2 } from "lucide-react";

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  }
}

function LeaderboardTable({ gameType }: { gameType: "refactoring" | "boss" }) {
  const { data: scores, isLoading } = trpc.leaderboard.getTopScores.useQuery({
    gameType,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground font-serif">No scores yet. Be the first to claim the throne!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {scores.map((entry, index) => (
        <div
          key={entry.id}
          className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
            index === 0
              ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              : index === 1
              ? "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              : index === 2
              ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
              : "bg-card border border-border"
          }`}
        >
          <div className="flex items-center justify-center w-8">
            {getRankIcon(index + 1)}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{entry.userName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-serif text-primary">
              {entry.score}
            </p>
            <p className="text-xs text-muted-foreground">
              / {entry.maxScore} points
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">Hall of Champions</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif italic">
            "The greatest glory in living lies not in never falling, but in rising every time we fall."
          </p>
        </section>

        <Card className="border-border paper-shadow">
          <CardHeader>
            <CardTitle className="font-serif">Global Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="refactoring" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="refactoring" className="font-serif">
                  Refactoring Game
                </TabsTrigger>
                <TabsTrigger value="boss" className="font-serif">
                  Architect's Challenge
                </TabsTrigger>
              </TabsList>
              <TabsContent value="refactoring">
                <LeaderboardTable gameType="refactoring" />
              </TabsContent>
              <TabsContent value="boss">
                <LeaderboardTable gameType="boss" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
