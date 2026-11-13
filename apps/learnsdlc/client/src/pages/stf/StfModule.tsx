import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useParams } from "wouter";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  ArrowRight, ArrowLeft, Sparkles, Target, Award, Brain,
  CheckCircle2, Clock, GraduationCap, Zap, AlertTriangle,
  Trophy, RefreshCw, ChevronRight, LockIcon, Gamepad2,
  Shuffle, Timer, Star, ThumbsUp,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";

// ============================================================
// PIVI CELEBRATION (mid-course at module 8 completion)
// ============================================================
function PiviCelebration({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(60);
  const [phase, setPhase] = useState<'buzz' | 'celebrate' | 'done'>('buzz');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const buzzTimeout = setTimeout(() => setPhase('celebrate'), 3000);
    return () => clearTimeout(buzzTimeout);
  }, []);

  useEffect(() => {
    if (phase === 'celebrate') {
      intervalRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(intervalRef.current!);
            setPhase('done');
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') {
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const balloons = ['🎈', '🎉', '🎊', '🎈', '🎉', '🎊', '🎈', '🎉', '🎊', '🎈', '🎉', '🎊'];
  const dancers = ['🧪', '🔬', '🐛', '🚀', '⚡', '💥', '🔥', '🌟'];
  const guests = [
    { name: 'Alan Turing', emoji: '🖥️', quote: 'A machine can test, but only a human can question!' },
    { name: 'Grace Hopper', emoji: '⚓', quote: 'The most dangerous phrase: We\'ve always tested it this way!' },
    { name: 'Marilyn vos Savant', emoji: '🧠', quote: 'Testing is the art of asking the right questions!' },
  ];

  if (phase === 'buzz') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-9xl mb-4">🚨</div>
          <div className="text-6xl font-black text-red-500 animate-bounce">
            BZZZZT! BZZZZT! BZZZZT!
          </div>
          <div className="text-2xl text-white mt-4">HALFWAY POINT REACHED!</div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-6xl">🏆</div>
          <div className="text-3xl font-black text-yellow-400">HALFWAY HERO!</div>
          <div className="text-xl text-white">Returning to your quest...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Balloons */}
      {balloons.map((b, i) => (
        <div
          key={`balloon-${i}`}
          className="absolute text-5xl animate-bounce"
          style={{
            left: `${(i * 8) + 2}%`,
            top: `${Math.random() * 60}%`,
            animationDelay: `${i * 0.15}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        >
          {b}
        </div>
      ))}

      {/* Dancers */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-around">
        {dancers.map((d, i) => (
          <div
            key={`dancer-${i}`}
            className="text-6xl"
            style={{
              animation: `spin ${0.5 + Math.random() * 0.5}s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-6 z-10">
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 animate-pulse">
            🎉 HALFWAY! 🎉
          </div>
          <div className="text-3xl font-bold text-white">
            You've conquered 7 of 15 modules!
          </div>

          {/* Guest Appearances */}
          <div className="flex gap-6 justify-center mt-8">
            {guests.map((g, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-[200px] animate-bounce"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                <div className="text-4xl mb-2">{g.emoji}</div>
                <div className="text-sm font-bold text-yellow-300">{g.name}</div>
                <div className="text-xs text-white/80 italic mt-1">"{g.quote}"</div>
              </div>
            ))}
          </div>

          <div className="text-6xl font-black text-yellow-400 mt-4">{countdown}s</div>

          <Button
            onClick={() => { setPhase('done'); }}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 mt-4"
          >
            Skip Celebration →
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QUIZ FEEDBACK OVERLAY
// ============================================================
function QuizFeedback({ correct, explanation, correctAnswer, options, onNext }: {
  correct: boolean;
  explanation: string;
  correctAnswer: number;
  options: string[];
  onNext: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/70 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onNext}
    >
      <div
        className={`max-w-lg w-full mx-4 rounded-2xl p-8 text-center space-y-4 transform transition-all duration-500 ${
          visible ? 'scale-100' : 'scale-50'
        } ${correct ? 'bg-green-900 border-4 border-green-400' : 'bg-red-900 border-4 border-red-400'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`text-8xl font-black ${correct ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
          {correct ? '✅' : '❌'}
        </div>
        <div className={`text-4xl font-black ${correct ? 'text-green-300' : 'text-red-300'}`}
          style={{ textShadow: correct ? '0 0 20px #4ade80' : '0 0 20px #f87171' }}>
          {correct ? '💥 CORRECT! 💥' : '🔨 WRONG! 🔨'}
        </div>
        {correct ? (
          <div className="space-y-2">
            <p className="text-green-200 text-lg font-bold">"Brilliant! Marilyn would be proud!"</p>
            <p className="text-green-300 text-sm italic">— Your testing instincts are sharp</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-red-200 text-lg font-bold">"Not quite — but every mistake is a learning opportunity!"</p>
            <div className="bg-red-800/50 rounded-lg p-3 text-left">
              <p className="text-white text-sm font-bold mb-1">The correct answer was:</p>
              <p className="text-yellow-300 text-sm">"{options[correctAnswer]}"</p>
            </div>
            <p className="text-red-200 text-sm">{explanation}</p>
          </div>
        )}
        {correct && <p className="text-green-300 text-sm">{explanation}</p>}
        <Button
          onClick={onNext}
          className={`w-full ${correct ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
        >
          {correct ? 'Continue! →' : 'Got it — Next Question →'}
        </Button>
        <p className="text-white/40 text-xs">Click anywhere to continue</p>
      </div>
    </div>
  );
}

// ============================================================
// THE GAUNTLET (Quiz)
// ============================================================
function TheGauntlet({ moduleId, onComplete }: { moduleId: number; onComplete: () => void }) {
  const { data: questions, isLoading } = trpc.stf.quiz.getQuestions.useQuery({ moduleId });
  const submitQuiz = trpc.stf.quiz.submit.useMutation();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const totalQuestions = questions?.length ?? 0;

  // Sync answers array length when questions load
  useEffect(() => {
    if (questions && questions.length > 0 && answers.length !== questions.length) {
      setAnswers(new Array(questions.length).fill(null));
    }
  }, [questions?.length]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Quiz questions are being prepared for this module.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (submitted || showFeedback) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setPendingAnswer(answerIndex);
    const isCorrect = answerIndex === question.correctAnswer;
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
  };

  const handleFeedbackNext = () => {
    setShowFeedback(false);
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    const validAnswers = answers.filter((a): a is number => a !== null);
    if (validAnswers.length !== totalQuestions) {
      toast.error("Please answer all questions before submitting");
      return;
    }
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const result = await submitQuiz.mutateAsync({ moduleId, answers: validAnswers, timeTaken });
      setResults(result);
      setSubmitted(true);
      if (result.passed) {
        toast.success(`🎯 You scored ${result.score}/${totalQuestions}! Quiz passed!`);
        onComplete();
      } else {
        const needed = Math.ceil(totalQuestions * 0.6);
        toast.error(`You scored ${result.score}/${totalQuestions}. You need ${needed}/${totalQuestions} to pass. Try again!`);
      }
      if (result.certificatesAwarded?.length > 0) {
        result.certificatesAwarded.forEach((cert: string) => {
          toast.success(`🎓 Certificate earned: ${cert.replace(/_/g, ' ').toUpperCase()}!`, { duration: 6000 });
        });
      }
    } catch {
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  const handleRetake = () => {
    setAnswers(new Array(totalQuestions).fill(null));
    setCurrentQuestion(0);
    setSubmitted(false);
    setResults(null);
    setPendingAnswer(null);
  };

  if (submitted && results) {
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-xl ${results.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="text-center">
            <div className={`text-7xl font-black mb-2 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.score}/{totalQuestions}
            </div>
            <p className={`text-xl font-bold ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.passed ? '🏆 You Passed The Gauntlet!' : '💪 Keep Studying — Try Again!'}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {results.results.map((r: any, i: number) => (
            <div key={i} className={`p-4 rounded-lg border ${r.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 ${r.correct ? 'text-green-500' : 'text-red-500'}`}>
                  {r.correct ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{r.question}</p>
                  {!r.correct && (
                    <p className="text-sm text-green-600 mt-1">✓ Correct: {r.options[r.correctAnswer]}</p>
                  )}
                  {r.explanation && (
                    <p className="text-xs text-muted-foreground mt-1">{r.explanation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {!results.passed && (
          <Button onClick={handleRetake} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" /> Retake The Gauntlet
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFeedback && pendingAnswer !== null && (
        <QuizFeedback
          correct={lastAnswerCorrect}
          explanation={question.explanation || ''}
          correctAnswer={question.correctAnswer}
          options={question.options}
          onNext={handleFeedbackNext}
        />
      )}
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          Question {currentQuestion + 1} of {totalQuestions}
        </Badge>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === currentQuestion ? 'bg-primary' :
                answers[i] !== null ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="p-6 rounded-xl bg-card border border-border">
        <h3 className="text-lg font-bold mb-4">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option: string, i: number) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === i
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              <span className="font-mono text-sm text-muted-foreground mr-3">
                {String.fromCharCode(65 + i)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        {currentQuestion === totalQuestions - 1 && answers[totalQuestions - 1] !== null ? (
          <Button onClick={handleSubmit} disabled={submitQuiz.isPending}>
            {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'} <Trophy className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
            disabled={currentQuestion === totalQuestions - 1 || answers[currentQuestion] === null}
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// THE CRUCIBLE (Interactive Game)
// ============================================================
function TheCrucible({ moduleId, moduleData, onComplete }: {
  moduleId: number;
  moduleData: any;
  onComplete: () => void;
}) {
  const submitGame = trpc.stf.game.submitScore.useMutation();
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [answerOptions, setAnswerOptions] = useState<string[][]>([]);
  const [showFeedback, setShowFeedback] = useState<null | { isCorrect: boolean; correct: string }>(null);

  // Parse the crucible config from the module data
  const config = useMemo(() => {
    try {
      return moduleData?.crucibleConfig ? JSON.parse(moduleData.crucibleConfig) : null;
    } catch {
      return null;
    }
  }, [moduleData?.crucibleConfig]);

  const gameName = config?.gameName || 'Knowledge Challenge';
  const gameType = config?.type || 'drag-match';

  // Generate options for each item based on game type
  const generateOptions = (allItems: any[], currentIdx: number): string[] => {
    if (gameType === 'ordering') {
      // For ordering games, options are position numbers
      const positions = allItems.map((_, i) => String(i + 1));
      return positions.sort(() => Math.random() - 0.5);
    }
    // For drag-match games, collect all unique answers and shuffle
    const correctAnswer = allItems[currentIdx].answer;
    const allAnswers = Array.from(new Set(allItems.map((it: any) => it.answer)));
    // If we have enough unique answers, pick 3 wrong + 1 correct
    const wrongAnswers = allAnswers.filter(a => a !== correctAnswer);
    const shuffledWrong = wrongAnswers.sort(() => Math.random() - 0.5);
    const optionSet = [correctAnswer, ...shuffledWrong.slice(0, Math.min(3, shuffledWrong.length))];
    return optionSet.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setScore(0);
    setCurrentItem(0);
    setUserAnswers([]);
    setShowFeedback(null);

    if (config?.items) {
      // Shuffle items for variety
      const shuffled = [...config.items].sort(() => Math.random() - 0.5);
      setItems(shuffled);
      setMaxScore(shuffled.length);
      // Pre-generate options for each item
      const opts = shuffled.map((_, idx) => generateOptions(shuffled, idx));
      setAnswerOptions(opts);
    } else {
      setItems([]);
      setMaxScore(0);
      setAnswerOptions([]);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!items[currentItem] || showFeedback) return;

    const item = items[currentItem];
    // Determine correct answer based on game type
    const correctAnswer = gameType === 'ordering'
      ? String(item.correctPosition)
      : item.answer;
    const isCorrect = answer === correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const questionText = item.defect || item.item || item.question || '';
    setUserAnswers([...userAnswers, { item: questionText, answer, correct: correctAnswer, isCorrect }]);

    // Show brief feedback
    setShowFeedback({ isCorrect, correct: correctAnswer });

    setTimeout(() => {
      setShowFeedback(null);
      if (currentItem + 1 >= items.length) {
        // Game over
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        setGameState('results');
        submitGame.mutate(
          { moduleId, gameName, score: newScore, maxScore: items.length, timeTaken },
          {
            onSuccess: (result) => {
              if (result.passed) {
                toast.success(`🎮 Game complete! ${newScore}/${items.length} — Crucible conquered!`);
                onComplete();
              } else {
                toast.info(`Game complete! ${newScore}/${items.length}. Score 60%+ to pass.`);
              }
              if (result.certificatesAwarded?.length > 0) {
                result.certificatesAwarded.forEach((cert: string) => {
                  toast.success(`🎓 Certificate earned: ${cert.replace(/_/g, ' ').toUpperCase()}!`, { duration: 6000 });
                });
              }
            },
          }
        );
      } else {
        setCurrentItem(currentItem + 1);
      }
    }, 1200);
  };

  if (!config) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Gamepad2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>The interactive game for this module is being prepared.</p>
        <Button onClick={onComplete} variant="outline" className="mt-4">
          Skip for now →
        </Button>
      </div>
    );
  }

  if (gameState === 'intro') {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="text-6xl animate-bounce">🎮</div>
        <h3 className="text-2xl font-bold">{gameName}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {gameType === 'ordering'
            ? 'Put the items in the correct order!'
            : 'Match each statement to its correct answer!'}
        </p>
        <div className="flex gap-4 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><Target className="w-4 h-4" /> {config.items?.length || 0} questions</div>
          <div className="flex items-center gap-1"><Star className="w-4 h-4" /> 60% to pass</div>
        </div>
        <Button onClick={startGame} size="lg" className="text-lg px-8">
          <Gamepad2 className="w-5 h-5 mr-2" /> Start Game
        </Button>
      </div>
    );
  }

  if (gameState === 'results') {
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 60;
    return (
      <div className="space-y-6">
        <div className={`p-8 rounded-xl text-center ${passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-orange-500/10 border border-orange-500/30'}`}>
          <div className={`text-7xl font-black mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
            {score}/{maxScore}
          </div>
          <p className={`text-xl font-bold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
            {passed ? '🏆 Crucible Conquered!' : '💪 Good effort — try again!'}
          </p>
          <p className="text-muted-foreground mt-2">{percentage}% correct</p>
        </div>
        <div className="space-y-2">
          {userAnswers.map((a, i) => (
            <div key={i} className={`p-3 rounded-lg border text-sm ${a.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <span className={a.isCorrect ? 'text-green-600' : 'text-red-600'}>
                {a.isCorrect ? '✓' : '✗'}
              </span>{' '}
              <span className="font-medium">{a.item}</span>
              {!a.isCorrect && (
                <span className="text-muted-foreground"> → Correct: {a.correct}</span>
              )}
            </div>
          ))}
        </div>
        {!passed && (
          <Button onClick={startGame} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" /> Play Again
          </Button>
        )}
      </div>
    );
  }

  // Playing state
  const item = items[currentItem];
  const questionText = item.defect || item.item || item.question || '';
  const options = answerOptions[currentItem] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{currentItem + 1} / {items.length}</Badge>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4" /> {score} pts
        </div>
      </div>
      <Progress value={((currentItem) / items.length) * 100} className="h-2" />
      <div className="p-6 rounded-xl bg-card border border-border">
        {gameType === 'ordering' && (
          <p className="text-sm text-muted-foreground mb-2 text-center">What position does this belong in?</p>
        )}
        <p className="text-lg font-bold mb-6 text-center">{questionText}</p>
        <div className={`grid gap-3 ${options.length <= 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {options.map((opt: string, i: number) => {
            const correctAnswer = gameType === 'ordering' ? String(item.correctPosition) : item.answer;
            let btnClass = 'p-4 rounded-lg border-2 transition-all text-left font-medium ';
            if (showFeedback) {
              if (opt === correctAnswer) {
                btnClass += 'border-green-500 bg-green-500/10 text-green-700';
              } else if (opt === userAnswers[userAnswers.length - 1]?.answer && !showFeedback.isCorrect) {
                btnClass += 'border-red-500 bg-red-500/10 text-red-700';
              } else {
                btnClass += 'border-border opacity-50';
              }
            } else {
              btnClass += 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!showFeedback}
                className={btnClass}
                aria-label={`Answer option: ${opt}`}
              >
                {gameType === 'ordering' ? `Position ${opt}` : opt}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${showFeedback.isCorrect ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
            {showFeedback.isCorrect ? '✓ Correct!' : `✗ Incorrect — the answer is: ${showFeedback.correct}`}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN MODULE PAGE
// ============================================================
export default function StfModule() {
  const params = useParams<{ moduleNumber: string }>();
  const moduleNumber = parseInt(params.moduleNumber || '1', 10);
  const { user, isAuthenticated } = useAuth();

  const { data: moduleData, isLoading } = trpc.stf.modules.getByNumber.useQuery({ moduleNumber });
  const { data: allModules } = trpc.stf.modules.getAll.useQuery();
  const { data: progress } = trpc.stf.progress.getModule.useQuery(
    { moduleId: moduleNumber },
    { enabled: isAuthenticated }
  );
  const markComplete = trpc.stf.progress.markComplete.useMutation();

  const [activeTab, setActiveTab] = useState('spark');
  const [showPivi, setShowPivi] = useState(false);
  const [piviShown, setPiviShown] = useState(false);

  usePageMeta({
    title: moduleData ? `Module ${moduleNumber}: ${moduleData.title} — Software Testing Fundamentals` : 'Loading...',
    description: moduleData?.subtitle || 'Software Testing Fundamentals educational course module',
    keywords: 'software testing, QA, ISTQB, education, testing fundamentals',
  });

  // Check if mid-course celebration should trigger
  useEffect(() => {
    if (moduleNumber === 8 && progress?.sparkCompleted && !piviShown) {
      // Check if modules 1-7 are all complete
      // We trigger Pivi when entering module 8 for the first time
      setShowPivi(true);
      setPiviShown(true);
    }
  }, [moduleNumber, progress, piviShown]);

  const handleSectionComplete = (section: 'spark' | 'gauntlet' | 'crucible' | 'imprint') => {
    if (!isAuthenticated) return;
    markComplete.mutate(
      { moduleId: moduleNumber, section },
      {
        onSuccess: (result) => {
          if (result.certificatesAwarded?.length > 0) {
            result.certificatesAwarded.forEach((cert) => {
              toast.success(`🎓 Certificate earned: ${cert.replace(/_/g, ' ').toUpperCase()}!`, { duration: 6000 });
            });
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold">Module Not Found</h2>
          <Link href="/stf">
            <Button>← Back to Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  const prevModule = moduleNumber > 1 ? moduleNumber - 1 : null;
  const nextModule = allModules && moduleNumber < allModules.length ? moduleNumber + 1 : null;

  const trackColors: Record<string, string> = {
    foundations: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    sdlc_models: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    methodologies: 'bg-green-500/10 text-green-600 border-green-500/30',
    techniques: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    professional_practice: 'bg-red-500/10 text-red-600 border-red-500/30',
  };

  const trackLabels: Record<string, string> = {
    foundations: 'Foundations',
    sdlc_models: 'SDLC Models',
    methodologies: 'Methodologies',
    techniques: 'Techniques',
    professional_practice: 'Professional Practice',
  };

  return (
    <div className="min-h-screen bg-background">
      {showPivi && <PiviCelebration onComplete={() => setShowPivi(false)} />}

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container max-w-5xl py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/stf" className="hover:text-primary transition-colors">Software Testing Fundamentals</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Module {moduleNumber}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className={`${trackColors[moduleData.track]} border`}>
                  {trackLabels[moduleData.track]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" /> {moduleData.estimatedMinutes} min
                </Badge>
              </div>
              <h1 className="text-3xl font-bold">
                Module {moduleNumber}: {moduleData.title}
              </h1>
              {moduleData.subtitle && (
                <p className="text-muted-foreground text-lg">{moduleData.subtitle}</p>
              )}
            </div>

            {/* Progress indicator */}
            {isAuthenticated && progress && (
              <div className="flex gap-2 flex-shrink-0">
                {[
                  { key: 'spark', done: progress.sparkCompleted, icon: Sparkles, label: 'Spark' },
                  { key: 'gauntlet', done: progress.gauntletCompleted, icon: Target, label: 'Quiz' },
                  { key: 'crucible', done: progress.crucibleCompleted, icon: Gamepad2, label: 'Game' },
                  { key: 'imprint', done: progress.imprintCompleted, icon: Brain, label: 'Imprint' },
                ].map(({ key, done, icon: Icon, label }) => (
                  <div
                    key={key}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${
                      done ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                    {done ? <CheckCircle2 className="w-3 h-3" /> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="spark" className="gap-2">
              <Sparkles className="w-4 h-4" /> The Spark
            </TabsTrigger>
            <TabsTrigger value="gauntlet" className="gap-2">
              <Target className="w-4 h-4" /> The Gauntlet
            </TabsTrigger>
            <TabsTrigger value="crucible" className="gap-2">
              <Gamepad2 className="w-4 h-4" /> The Crucible
            </TabsTrigger>
            <TabsTrigger value="imprint" className="gap-2">
              <Brain className="w-4 h-4" /> The Imprint
            </TabsTrigger>
          </TabsList>

          {/* THE SPARK */}
          <TabsContent value="spark" className="space-y-6">
            {/* Infographic */}
            {moduleData.visualAidUrl && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={moduleData.visualAidUrl}
                    alt={`Module ${moduleNumber} infographic`}
                    className="w-full object-contain max-h-[500px]"
                    loading="lazy"
                  />
                  {moduleData.infographicTakeaway && (
                    <div className="p-4 bg-primary/5 border-t border-border">
                      <p className="text-center font-bold text-primary italic">
                        💡 Key Takeaway: {moduleData.infographicTakeaway}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Lesson Content */}
            {moduleData.sparkContent && (
              <Card>
                <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown>{moduleData.sparkContent}</Streamdown>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center">
              <div />
              <Button
                onClick={() => {
                  handleSectionComplete('spark');
                  setActiveTab('gauntlet');
                }}
              >
                Continue to The Gauntlet <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </TabsContent>

          {/* THE GAUNTLET */}
          <TabsContent value="gauntlet" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">🎯 The Gauntlet</h2>
              <p className="text-muted-foreground">5 questions. 3 correct to pass. No mercy.</p>
            </div>
            {!isAuthenticated ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <LockIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p>Please log in to take the quiz and track your progress.</p>
                  <a href={getLoginUrl()}>
                    <Button>Log In to Continue</Button>
                  </a>
                </CardContent>
              </Card>
            ) : (
              <TheGauntlet
                moduleId={moduleNumber}
                onComplete={() => handleSectionComplete('gauntlet')}
              />
            )}
          </TabsContent>

          {/* THE CRUCIBLE */}
          <TabsContent value="crucible" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">🎮 The Crucible</h2>
              <p className="text-muted-foreground">An interactive game to embed the knowledge in your memory.</p>
            </div>
            {!isAuthenticated ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <LockIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p>Please log in to play the game and track your scores.</p>
                  <a href={getLoginUrl()}>
                    <Button>Log In to Continue</Button>
                  </a>
                </CardContent>
              </Card>
            ) : (
              <TheCrucible
                moduleId={moduleNumber}
                moduleData={moduleData}
                onComplete={() => handleSectionComplete('crucible')}
              />
            )}
          </TabsContent>

          {/* THE IMPRINT */}
          <TabsContent value="imprint" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">🧠 The Imprint</h2>
              <p className="text-muted-foreground">Key takeaways and connections to cement your understanding.</p>
            </div>
            {moduleData.imprintContent && (
              <Card>
                <CardContent className="p-6 prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown>{moduleData.imprintContent}</Streamdown>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => {
                  handleSectionComplete('imprint');
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Complete
              </Button>
              {nextModule && (
                <Link href={`/stf/module/${nextModule}`}>
                  <Button>
                    Next Module: Module {nextModule} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          {prevModule ? (
            <Link href={`/stf/module/${prevModule}`}>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Module {prevModule}
              </Button>
            </Link>
          ) : (
            <Link href="/stf">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Course Overview
              </Button>
            </Link>
          )}
          <Link href="/stf/dashboard">
            <Button variant="ghost">
              <GraduationCap className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          </Link>
          {nextModule ? (
            <Link href={`/stf/module/${nextModule}`}>
              <Button>
                Module {nextModule} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href="/stf/dashboard">
              <Button>
                Course Dashboard <Trophy className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
