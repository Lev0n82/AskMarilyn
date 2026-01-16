import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/SocialShare";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Code, Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const challenges = [
  {
    id: 1,
    bad: "invoice_new",
    good: "create_invoice",
    hint: "Start with the action (verb), then the object (noun)."
  },
  {
    id: 2,
    bad: "balance_check",
    good: "check_balance",
    hint: "Flip it! Verb first."
  },
  {
    id: 3,
    bad: "user_login_process_and_check_home",
    good: "login",
    hint: "Keep it simple. Don't describe the implementation, just the intent."
  },
  {
    id: 4,
    bad: "click_submit_button",
    good: "submit_form",
    hint: "Focus on the business intent, not the UI mechanic (click)."
  },
  {
    id: 5,
    bad: "data_entry_customer",
    good: "enter_customer_data",
    hint: "Make it a sentence: 'I want to...'"
  }
];

export default function RefactoringChallenge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { saveRefactoringScore } = useProgress();
  const { user, isAuthenticated } = useAuth();
  const submitScoreMutation = trpc.leaderboard.submitScore.useMutation();
  const awardBadgeMutation = trpc.badges.awardBadge.useMutation();
  const recordActivityMutation = trpc.streaks.recordActivity.useMutation();
  const [startTime] = useState(() => Date.now());

  const currentChallenge = challenges[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedInput = input.trim().toLowerCase().replace(/\s+/g, "_");
    
    if (normalizedInput === currentChallenge.good) {
      setStatus("success");
      setScore(score + 1);
    } else {
      setStatus("error");
    }
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setInput("");
      setStatus("idle");
    } else {
      const finalScore = score + (status === "success" ? 1 : 0);
      setShowResults(true);
      saveRefactoringScore(finalScore);
      
      // Submit to leaderboard if authenticated
      if (isAuthenticated) {
        submitScoreMutation.mutate({
          gameType: "refactoring",
          score: finalScore,
          maxScore: challenges.length,
        });
        
        // Award badges
        if (finalScore === challenges.length) {
          awardBadgeMutation.mutate({ badgeType: "perfect_refactoring" }, {
            onSuccess: (data) => {
              const result = data.result as { alreadyAwarded?: boolean } | undefined;
              if (!result?.alreadyAwarded) {
                toast.success("⚡ Badge Earned: Code Surgeon!", {
                  description: "Perfect score on the Refactoring Game!",
                });
              }
            }
          });
        }
        
        // Speed runner badge: under 2 minutes
        const elapsedTime = (Date.now() - startTime) / 1000;
        if (elapsedTime < 120 && finalScore >= challenges.length * 0.8) {
          awardBadgeMutation.mutate({ badgeType: "speed_runner" }, {
            onSuccess: (data) => {
              const result = data.result as { alreadyAwarded?: boolean } | undefined;
              if (!result?.alreadyAwarded) {
                toast.success("⏱️ Badge Earned: Speed Runner!", {
                  description: "Completed in under 2 minutes!",
                });
              }
            }
          });
        }
        
        // Record activity for streak tracking
        recordActivityMutation.mutate(undefined, {
          onSuccess: (data) => {
            if (data && data.currentStreak >= 7) {
              toast.success("🔥 Streak Master!", {
                description: `You've maintained a ${data.currentStreak}-day learning streak!`,
              });
            }
          }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setInput("");
    setStatus("idle");
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary">Refactoring Complete</h1>
          <p className="text-xl font-sans">
            You refactored <span className="font-bold text-accent">{score}</span> out of <span className="font-bold">{challenges.length}</span> actions correctly.
          </p>
          
          <div className="bg-card p-8 rounded-xl border border-border paper-shadow space-y-8">
            <p className="font-serif italic text-lg text-muted-foreground">
              "Simplicity is the ultimate sophistication."
            </p>
            
            <SocialShare score={score} total={challenges.length} type="refactoring" />
            
            <div className="flex justify-center gap-4">
              <Button onClick={handleRestart} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </Button>
              <Link href="/">
                <Button>
                  Return Home
                </Button>
              </Link>
            </div>
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
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Challenge</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">The Refactoring Game</h1>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-muted-foreground">Challenge {currentIndex + 1} of {challenges.length}</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-border paper-shadow overflow-hidden">
            <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>
              <span className="ml-2 text-xs font-mono text-muted-foreground">refactor_legacy_code.ts</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-sans">Rename this bad action:</p>
                <div className="inline-block bg-destructive/10 text-destructive px-4 py-2 rounded-md font-mono text-lg md:text-xl font-bold border border-destructive/20 break-all">
                  {currentChallenge.bad}()
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (status !== "idle") setStatus("idle");
                    }}
                    placeholder="Enter the correct name..."
                    className={cn(
                      "font-mono text-base md:text-lg h-12 text-center",
                      status === "success" && "border-green-500 bg-green-50 text-green-700",
                      status === "error" && "border-destructive bg-destructive/50 text-destructive"
                    )}
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  {status === "success" && (
                    <div className="absolute right-3 top-3 text-green-600 animate-in zoom-in">
                      <Check className="h-6 w-6" />
                    </div>
                  )}
                  {status === "error" && (
                    <div className="absolute right-3 top-3 text-destructive animate-in zoom-in">
                      <X className="h-6 w-6" />
                    </div>
                  )}
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive text-center animate-in fade-in">
                    Hint: {currentChallenge.hint}
                  </p>
                )}

                <div className="flex justify-center pt-4">
                  {status === "success" ? (
                    <Button type="button" onClick={handleNext} className="w-full md:w-auto px-8 bg-green-600 hover:bg-green-700 text-white">
                      Next Challenge <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!input} className="w-full md:w-auto px-8">
                      Check Answer
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/module-10">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Test Design Template
            </Button>
          </Link>
          <Link href="/boss-level">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Next: The Architect's Challenge <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
