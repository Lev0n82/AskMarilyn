import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Bug, Check, X, Trophy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { SocialShare } from "@/components/SocialShare";
import { useProgress } from "@/contexts/ProgressContext";

interface Line {
  id: number;
  code: string;
  isBug: boolean;
  reason?: string;
}

const testModule: Line[] = [
  { id: 1, code: "test_case: purchase_laptop_flow", isBug: false },
  { id: 2, code: "  login(\"user\", \"pass\")", isBug: false },
  { id: 3, code: "  click(\"#nav_electronics\")", isBug: true, reason: "Low-level action (click) in a high-level flow. Use 'navigate_to_category(\"Electronics\")' instead." },
  { id: 4, code: "  select_product(\"MacBook Pro\")", isBug: false },
  { id: 5, code: "  add_to_cart()", isBug: false },
  { id: 6, code: "  verify_text_present(\"Cart: 1 Item\")", isBug: true, reason: "Brittle verification. Use 'check_cart_count(1)' to abstract the UI check." },
  { id: 7, code: "  checkout()", isBug: false },
  { id: 8, code: "  enter_text(\"#cc_field\", \"4111...\")", isBug: true, reason: "Low-level interaction. Encapsulate in 'enter_payment_details(...)'." },
  { id: 9, code: "  submit_order()", isBug: false }
];

export default function BossLevel() {
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { saveBossScore } = useProgress();
  const { user, isAuthenticated } = useAuth();
  const submitScoreMutation = trpc.leaderboard.submitScore.useMutation();
  const awardBadgeMutation = trpc.badges.awardBadge.useMutation();

  const toggleLine = (id: number) => {
    if (isSubmitted) return;
    setSelectedLines(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    let currentScore = 0;
    const bugs = testModule.filter(l => l.isBug).map(l => l.id);
    
    // Calculate score: +1 for correctly identifying a bug, -1 for false positive
    selectedLines.forEach(id => {
      if (bugs.includes(id)) {
        currentScore++;
      } else {
        currentScore--;
      }
    });

    // Normalize score to 0 if negative
    const finalScore = Math.max(0, currentScore);
    const maxScore = bugs.length;
    
    setScore(finalScore);
    setIsSubmitted(true);
    saveBossScore(finalScore);
    
    // Submit to leaderboard if authenticated
    if (isAuthenticated) {
      submitScoreMutation.mutate({
        gameType: "boss",
        score: finalScore,
        maxScore: maxScore,
      });
      
      // Award badges
      if (finalScore === maxScore) {
        awardBadgeMutation.mutate({ badgeType: "perfect_boss" }, {
          onSuccess: (data) => {
            const result = data.result as { alreadyAwarded?: boolean } | undefined;
            if (!result?.alreadyAwarded) {
              toast.success("🏗️ Badge Earned: Test Architect!", {
                description: "Perfect score on the Architect's Challenge!",
              });
            }
          }
        });
      }
    } 
  };

  if (isSubmitted) {
    const bugs = testModule.filter(l => l.isBug);
    const maxScore = bugs.length;
    const isPerfect = score === maxScore && selectedLines.length === maxScore;

    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-8 py-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-primary">Assessment Complete</h1>
            <p className="text-xl font-sans">
              You found <span className="font-bold text-accent">{score}</span> out of <span className="font-bold">{maxScore}</span> architectural violations.
            </p>
          </div>

          <Card className="border-border paper-shadow">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg">Code Review Analysis:</h3>
              {testModule.map((line) => (
                <div key={line.id} className={cn(
                  "p-3 rounded-md text-sm font-mono border-l-4",
                  line.isBug && selectedLines.includes(line.id) ? "bg-green-50 border-green-500" :
                  line.isBug && !selectedLines.includes(line.id) ? "bg-red-50 border-red-500" :
                  !line.isBug && selectedLines.includes(line.id) ? "bg-yellow-50 border-yellow-500" :
                  "bg-muted/30 border-transparent"
                )}>
                  <div className="flex justify-between items-start">
                    <span>{line.code}</span>
                    {line.isBug && (
                      <span className="text-xs font-sans bg-white px-2 py-1 rounded border border-border ml-4">
                        {line.reason}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <SocialShare score={score} total={maxScore} type="boss" />

          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Boss Level</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Architect's Challenge</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Review the Test Module below. Click on the lines that violate ABT principles (e.g., low-level actions in a high-level flow, brittle checks, or bad naming).
            </p>
          </div>
        </div>

        <Card className="border-border paper-shadow overflow-hidden max-w-3xl mx-auto">
          <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <span className="ml-2 text-xs font-mono text-muted-foreground">purchase_flow.tm</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedLines.length} lines selected
            </div>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {testModule.map((line) => (
                <div 
                  key={line.id}
                  onClick={() => toggleLine(line.id)}
                  className={cn(
                    "group flex items-center gap-4 p-4 cursor-pointer transition-colors font-mono text-sm hover:bg-muted/50",
                    selectedLines.includes(line.id) && "bg-red-50/50 dark:bg-red-900/20"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                    selectedLines.includes(line.id) 
                      ? "bg-destructive border-destructive text-destructive-foreground" 
                      : "border-muted-foreground/30 group-hover:border-destructive/50"
                  )}>
                    {selectedLines.includes(line.id) && <Bug className="w-3 h-3" />}
                  </div>
                  <span className={cn(
                    selectedLines.includes(line.id) && "text-destructive font-medium"
                  )}>
                    {line.code}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
            <Button onClick={handleSubmit} size="lg" disabled={selectedLines.length === 0}>
              Submit Review
            </Button>
          </div>
        </Card>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/refactoring-challenge">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Refactoring Game
            </Button>
          </Link>
          <Link href="/quiz">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: Final Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
