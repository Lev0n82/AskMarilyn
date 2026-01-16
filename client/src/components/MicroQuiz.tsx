import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle, RefreshCw, Lightbulb, Baby, Users, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface MicroQuizProps {
  courseId: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  eli5Explanation: string;
  questionId?: string;
}

export function MicroQuiz({
  courseId,
  topicId,
  question,
  options,
  correctAnswer,
  explanation,
  eli5Explanation,
  questionId,
}: MicroQuizProps) {
  const { data: user } = trpc.auth.me.useQuery();
  const recordAttemptMutation = trpc.quiz.recordAttempt.useMutation();
  const addToQueueMutation = trpc.spacedRepetition.addToQueue.useMutation();
  const updateStatsMutation = trpc.community.updateStats.useMutation();
  const { data: communityStats } = trpc.community.getStats.useQuery(
    { courseId, topicId },
    { enabled: !!user }
  );
  const { data: userRank } = trpc.community.getUserRank.useQuery(
    { courseId },
    { enabled: !!user }
  );
  const { data: dueReviews } = trpc.spacedRepetition.getDueReviews.useQuery(
    undefined,
    { enabled: !!user }
  );

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEli5, setShowEli5] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCommunityStats, setShowCommunityStats] = useState(false);

  const actualQuestionId = questionId || `${topicId}-q1`;

  // Check if this question is due for review
  const isDueForReview = dueReviews?.some(
    r => r.courseId === courseId && r.topicId === topicId && r.questionId === actualQuestionId
  );

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Record the attempt using trpc
    if (user) {
      setIsLoading(true);
      try {
        await recordAttemptMutation.mutateAsync({
          courseId,
          topicId,
          questionId: actualQuestionId,
          selectedAnswer: options[selectedAnswer],
          isCorrect: correct ? 1 : 0,
          attemptNumber,
          usedSimplifiedExplanation: showEli5 ? 1 : 0,
        });

        // If incorrect, add to spaced repetition queue
        if (!correct) {
          await addToQueueMutation.mutateAsync({
            courseId,
            topicId,
            questionId: actualQuestionId,
          });
        }

        // Update community stats
        await updateStatsMutation.mutateAsync({
          courseId,
          topicId,
        });
      } catch (error) {
        console.error("Failed to record quiz attempt:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowEli5(true);
    setAttemptNumber(prev => prev + 1);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowEli5(false);
    setAttemptNumber(1);
    setIsCorrect(false);
  };

  const topicStats = communityStats?.[0];

  return (
    <Card className={`my-8 border-2 ${isDueForReview ? 'border-amber-400 bg-amber-50/50' : 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h4 className="font-display text-lg font-bold">Quick Check</h4>
          {attemptNumber > 1 && (
            <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-1 rounded-full">
              Attempt {attemptNumber}
            </span>
          )}
          {isDueForReview && (
            <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Review Due
            </span>
          )}
        </div>

        <p className="text-foreground mb-4 font-medium">{question}</p>

        {/* Show ELI5 explanation before retry */}
        {showEli5 && !isSubmitted && (
          <Card className="mb-4 bg-amber-500/10 border-amber-500/30">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Baby className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-bold text-amber-600 mb-2">Let me explain it simply...</h5>
                  <p className="text-sm text-muted-foreground">{eli5Explanation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2 mb-4">
          {options.map((option, index) => {
            let buttonClass = "w-full justify-start text-left p-4 h-auto";
            
            if (isSubmitted) {
              if (index === correctAnswer) {
                buttonClass += " bg-teal/20 border-teal text-teal hover:bg-teal/20";
              } else if (index === selectedAnswer && !isCorrect) {
                buttonClass += " bg-coral/20 border-coral text-coral hover:bg-coral/20";
              } else {
                buttonClass += " opacity-50";
              }
            } else if (selectedAnswer === index) {
              buttonClass += " bg-primary/20 border-primary";
            }

            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
                disabled={isSubmitted}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {isSubmitted && index === correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-teal ml-auto" />
                  )}
                  {isSubmitted && index === selectedAnswer && !isCorrect && (
                    <XCircle className="w-5 h-5 text-coral ml-auto" />
                  )}
                </span>
              </Button>
            );
          })}
        </div>

        {!isSubmitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedAnswer === null || isLoading}
            className="w-full"
          >
            {isLoading ? "Submitting..." : "Check Answer"}
          </Button>
        ) : (
          <div className="space-y-4">
            {/* Result message */}
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-teal/10 border border-teal/30' : 'bg-coral/10 border border-coral/30'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-teal mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-coral mt-0.5" />
                )}
                <div>
                  <h5 className={`font-bold ${isCorrect ? 'text-teal' : 'text-coral'}`}>
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </h5>
                  <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
                </div>
              </div>
            </div>

            {/* Spaced repetition notice for incorrect answers */}
            {!isCorrect && user && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium text-amber-700">Added to review queue!</span>
                  <span className="text-amber-600 ml-1">This question will resurface tomorrow for spaced repetition practice.</span>
                </div>
              </div>
            )}

            {/* Community Stats Toggle */}
            {user && topicStats && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCommunityStats(!showCommunityStats)}
                className="w-full text-xs text-muted-foreground"
              >
                <Users className="w-3 h-3 mr-1" />
                {showCommunityStats ? 'Hide' : 'Show'} how others performed
              </Button>
            )}

            {/* Community Stats Panel */}
            {showCommunityStats && topicStats && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <h5 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  Community Performance
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-2 bg-white rounded border">
                    <div className="text-lg font-bold text-blue-600">{topicStats.averageAccuracy}%</div>
                    <div className="text-xs text-slate-500">Avg Accuracy</div>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <div className="text-lg font-bold text-green-600">{topicStats.totalUsers}</div>
                    <div className="text-xs text-slate-500">Learners</div>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <div className="text-lg font-bold text-amber-600">{topicStats.eli5UsageRate}%</div>
                    <div className="text-xs text-slate-500">Used ELI5</div>
                  </div>
                  <div className="p-2 bg-white rounded border">
                    <div className="text-lg font-bold text-purple-600">{topicStats.averageAttemptsToPass}</div>
                    <div className="text-xs text-slate-500">Avg Attempts</div>
                  </div>
                </div>
                
                {/* User's rank */}
                {userRank && userRank.rank > 0 && (
                  <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded border border-yellow-200 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">
                        You're in the <span className="font-bold text-yellow-700">top {100 - userRank.percentile}%</span> with{' '}
                        <span className="font-bold">{userRank.userAccuracy}%</span> accuracy
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {!isCorrect && (
                <Button 
                  variant="outline" 
                  onClick={handleTryAgain}
                  className="flex-1 gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Explain Simply & Try Again
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={handleReset}
                className={isCorrect ? "flex-1" : ""}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {isCorrect ? "Practice Again" : "Start Over"}
              </Button>
            </div>
          </div>
        )}

        {/* Progress indicator for logged-in users */}
        {user && isSubmitted && isCorrect && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            ✓ Progress saved to your learning record
          </p>
        )}
      </CardContent>
    </Card>
  );
}
