import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TheImprintProps {
  title: string;
  thoughtExperiment: string;
  visualAid?: string;
  visualAidAlt?: string;
  keyTakeaways: string[];
  memoryAnchor: string;
  onComplete: () => void;
}

export function TheImprint({ 
  title,
  thoughtExperiment, 
  visualAid, 
  visualAidAlt,
  keyTakeaways,
  memoryAnchor,
  onComplete 
}: TheImprintProps) {
  const [currentTakeaway, setCurrentTakeaway] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleNext = () => {
    if (currentTakeaway < keyTakeaways.length - 1) {
      setCurrentTakeaway(c => c + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">The Imprint</h2>
            <span className="text-sm text-muted-foreground">Module Complete!</span>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-bold mb-2">Knowledge Imprinted!</h3>
              <p className="text-muted-foreground">
                You've completed this module. The concepts are now part of your mental toolkit.
              </p>
            </div>

            <div className="bg-white/70 p-6 rounded-lg border border-indigo-200">
              <h4 className="font-bold text-indigo-800 mb-3">🧠 Memory Anchor</h4>
              <p className="font-serif italic text-indigo-700 text-lg">
                "{memoryAnchor}"
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {keyTakeaways.map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              ))}
            </div>

            <Button 
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              Complete Module & Earn Points
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Brain className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">The Imprint</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>2-minute reflection</span>
            <span className="mx-1">•</span>
            <span>Lasting Retention</span>
          </div>
        </div>
      </div>

      {/* Thought Experiment */}
      <Card className="border-2 border-indigo-200">
        <CardContent className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-foreground mb-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed font-serif italic text-lg">
              "{thoughtExperiment}"
            </p>
          </div>

          {/* Visual Aid */}
          {visualAid && (
            <div className="rounded-lg overflow-hidden border border-indigo-200">
              <img 
                src={visualAid} 
                alt={visualAidAlt || "Visual representation of the concept"}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Key Takeaways - Progressive Reveal */}
          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Key Takeaways</h4>
            
            <div className="space-y-3">
              {keyTakeaways.slice(0, currentTakeaway + 1).map((takeaway, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-4 rounded-lg border-l-4 transition-all duration-300",
                    i === currentTakeaway 
                      ? "bg-indigo-50 border-indigo-500" 
                      : "bg-secondary/50 border-secondary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                      i === currentTakeaway 
                        ? "bg-indigo-500 text-white" 
                        : "bg-secondary text-muted-foreground"
                    )}>
                      {i + 1}
                    </span>
                    <p className={cn(
                      "text-sm",
                      i === currentTakeaway ? "text-indigo-900" : "text-muted-foreground"
                    )}>
                      {takeaway}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 py-2">
              {keyTakeaways.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i <= currentTakeaway ? "bg-indigo-500" : "bg-secondary"
                  )}
                />
              ))}
            </div>

            <Button 
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {currentTakeaway < keyTakeaways.length - 1 ? (
                <>
                  Next Takeaway
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Complete The Imprint
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
