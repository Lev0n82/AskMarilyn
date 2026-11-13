import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swords, Clock, CheckCircle2, XCircle, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface TheGauntletProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

export function TheGauntlet({ questions, onComplete }: TheGauntletProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctIndex;

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    const correct = index === question.correctIndex;
    if (correct) {
      setScore(s => s + 1);
    }
    setAnswers([...answers, correct]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsComplete(true);
      onComplete(score + (isCorrect ? 0 : 0), questions.length);
    }
  };

  if (isComplete) {
    const finalScore = answers.filter(Boolean).length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Swords className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary">The Gauntlet</h2>
            <span className="text-sm text-muted-foreground">Quiz Complete!</span>
          </div>
        </div>

        <Card className={cn(
          "border-2",
          passed ? "bg-green-50 border-green-300" : "bg-amber-50 border-amber-300"
        )}>
          <CardContent className="p-8 text-center space-y-6">
            <div className={cn(
              "w-24 h-24 mx-auto rounded-full flex items-center justify-center",
              passed ? "bg-green-500" : "bg-amber-500"
            )}>
              {passed ? (
                <Trophy className="h-12 w-12 text-white" />
              ) : (
                <Zap className="h-12 w-12 text-white" />
              )}
            </div>
            
            <div>
              <h3 className="text-3xl font-serif font-bold mb-2">
                {passed ? "Victory!" : "Almost There!"}
              </h3>
              <p className="text-xl text-muted-foreground">
                You scored <span className="font-bold text-foreground">{finalScore}/{questions.length}</span> ({percentage}%)
              </p>
            </div>

            <div className="flex justify-center gap-2">
              {answers.map((correct, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
                    correct ? "bg-green-500" : "bg-red-500"
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {passed ? (
              <p className="font-serif italic text-green-700">
                "Excellent! Your logical mind has conquered The Gauntlet. Proceed to The Crucible."
              </p>
            ) : (
              <p className="font-serif italic text-amber-700">
                "A worthy attempt, but mastery requires 80% or higher. Review the concepts and try again."
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Swords className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-primary">The Gauntlet</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>5-minute quiz</span>
            <span className="mx-1">•</span>
            <span>Question {currentQuestion + 1} of {questions.length}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="border-2 border-purple-200">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-serif font-bold text-foreground">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showFeedback}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-purple-400 hover:bg-purple-50",
                  selectedAnswer === index && showFeedback && isCorrect && "border-green-500 bg-green-50",
                  selectedAnswer === index && showFeedback && !isCorrect && "border-red-500 bg-red-50",
                  showFeedback && index === question.correctIndex && "border-green-500 bg-green-50",
                  !showFeedback && "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    selectedAnswer === index && showFeedback && isCorrect && "bg-green-500 text-white",
                    selectedAnswer === index && showFeedback && !isCorrect && "bg-red-500 text-white",
                    showFeedback && index === question.correctIndex && selectedAnswer !== index && "bg-green-500 text-white",
                    !showFeedback && "bg-purple-100 text-purple-700"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && index === question.correctIndex && (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  )}
                  {showFeedback && selectedAnswer === index && !isCorrect && (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={cn(
              "p-4 rounded-lg",
              isCorrect ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"
            )}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "font-bold mb-1",
                    isCorrect ? "text-green-800" : "text-red-800"
                  )}>
                    {isCorrect ? "Correct!" : "Not quite right."}
                  </p>
                  <p className={cn(
                    "text-sm",
                    isCorrect ? "text-green-700" : "text-red-700"
                  )}>
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showFeedback && (
            <Button 
              onClick={handleNext}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
