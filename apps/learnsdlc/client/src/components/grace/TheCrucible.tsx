import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlaskConical, Clock, CheckCircle2, Lightbulb, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface TheCrucibleProps {
  scenario: string;
  task: string;
  hints: string[];
  sampleSolution: string;
  evaluationCriteria: string[];
  onComplete: () => void;
}

export function TheCrucible({ 
  scenario, 
  task, 
  hints, 
  sampleSolution, 
  evaluationCriteria,
  onComplete 
}: TheCrucibleProps) {
  const [userSolution, setUserSolution] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = () => {
    if (userSolution.trim().length < 20) return;
    setIsSubmitted(true);
  };

  const handleNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(c => c + 1);
    }
  };

  if (isSubmitted) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <FlaskConical className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">The Crucible</h2>
            <span className="text-sm text-muted-foreground">Challenge Submitted!</span>
          </div>
        </div>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <h3 className="text-xl font-serif font-bold text-emerald-800">
                Well Done, Challenger!
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-foreground mb-2">Your Solution:</h4>
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <p className="whitespace-pre-wrap text-sm">{userSolution}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-2">Evaluation Criteria:</h4>
                <ul className="space-y-2">
                  {evaluationCriteria.map((criterion, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
                className="w-full"
              >
                {showSolution ? "Hide" : "View"} Sample Solution
              </Button>

              {showSolution && (
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <h4 className="font-bold text-foreground mb-2">Sample Solution:</h4>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {sampleSolution}
                  </p>
                </div>
              )}

              <p className="font-serif italic text-emerald-700 text-center">
                "The crucible of experience forges the strongest understanding. You've proven your mettle."
              </p>

              <Button 
                onClick={onComplete}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Continue to The Imprint
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <FlaskConical className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">The Crucible</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>5-minute challenge</span>
            <span className="mx-1">•</span>
            <span>Apply Your Knowledge</span>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <Card className="border-2 border-emerald-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">📋 Scenario</h3>
            <p className="text-muted-foreground leading-relaxed">{scenario}</p>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">🎯 Your Task</h3>
            <p className="text-emerald-700">{task}</p>
          </div>

          {/* Hints Section */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="mb-3"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {showHints ? "Hide Hints" : "Need a Hint?"}
            </Button>

            {showHints && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
                {hints.slice(0, currentHint + 1).map((hint, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded">
                      Hint {i + 1}
                    </span>
                    <p className="text-sm text-amber-800">{hint}</p>
                  </div>
                ))}
                {currentHint < hints.length - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextHint}
                    className="text-amber-700"
                  >
                    Show Next Hint ({currentHint + 1}/{hints.length})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Solution Input */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Your Solution</h3>
            <Textarea
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              placeholder="Write your solution here. Be specific and explain your reasoning..."
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Minimum 20 characters required. {userSolution.length}/20
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={userSolution.trim().length < 20}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Solution
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
