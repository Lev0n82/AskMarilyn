import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useParams } from "wouter";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Award,
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  Terminal,
  Zap,
  AlertTriangle,
  Trophy,
  RefreshCw,
  ChevronRight,
  LockIcon,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { usePageMeta } from "@/hooks/usePageMeta";

// ============================================================
// PIVI CELEBRATION (mid-course at module 10 completion)
// ============================================================
function PiviCelebration({ onComplete }: { onComplete: () => void }) {
  const [countdown, setCountdown] = useState(60);
  const [phase, setPhase] = useState<'buzz' | 'celebrate' | 'done'>('buzz');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Buzz phase: 3 seconds
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
  const dancers = ['🤖', '👾', '🦾', '🚀', '⚡', '💥', '🔥', '🌟'];
  const guests = [
    { name: 'Bill Gates', emoji: '💻', quote: 'CMake is the reason Windows builds still exist!' },
    { name: 'Linus Torvalds', emoji: '🐧', quote: 'Finally, a build system that doesn\'t make me angry!' },
    { name: 'Grace Hopper', emoji: '⚓', quote: 'The best build system is one that compiles everywhere!' },
  ];

  if (phase === 'buzz') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center space-y-6 animate-bounce">
          <div className="text-8xl">🚨</div>
          <div className="text-6xl font-black text-red-500 animate-pulse">BUZZ! BUZZ! BUZZ!</div>
          <div className="text-3xl text-white font-bold">HALFWAY THERE!</div>
          <div className="text-xl text-yellow-400">10 MODULES COMPLETE!</div>
          <div className="flex justify-center gap-4 text-5xl">
            {['🎉', '🎊', '🎈', '🎉', '🎊'].map((e, i) => (
              <span key={i} className="animate-spin" style={{ animationDelay: `${i * 0.2}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center space-y-4">
          <div className="text-6xl">🏆</div>
          <div className="text-4xl font-black text-white">BACK TO LEARNING!</div>
          <div className="text-xl text-green-400">CMake Advanced Track Awaits!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Floating Balloons */}
      <div className="absolute inset-0 pointer-events-none">
        {balloons.map((b, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-bounce"
            style={{
              left: `${(i * 8.5) % 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          >
            {b}
          </div>
        ))}
      </div>

      {/* Hyper Dancers */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pb-4">
        {dancers.map((d, i) => (
          <div
            key={i}
            className="text-5xl"
            style={{
              animation: `bounce ${0.3 + Math.random() * 0.3}s infinite alternate`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full space-y-6 px-4">
        <div className="text-7xl animate-pulse">🎓</div>
        <h1 className="text-5xl md:text-7xl font-black text-white text-center leading-tight">
          HALFWAY TO<br />
          <span className="text-yellow-400">CMAKE MASTERY!</span>
        </h1>
        <p className="text-2xl text-cyan-300 text-center font-bold">
          10 Modules Down. 10 More to Go.
        </p>

        {/* Guest Appearances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
          {guests.map((g, i) => (
            <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
              <div className="text-4xl mb-2">{g.emoji}</div>
              <p className="font-bold text-white text-sm">{g.name}</p>
              <p className="text-xs text-cyan-200 italic mt-1">"{g.quote}"</p>
            </div>
          ))}
        </div>

        {/* Pool Party */}
        <div className="bg-blue-500/30 border border-blue-400/50 rounded-2xl p-6 max-w-lg w-full text-center">
          <div className="text-4xl mb-2">🏊</div>
          <p className="text-white font-bold">You've been invited to the CMake Masters Pool Party!</p>
          <p className="text-blue-200 text-sm mt-1">Join Bill, Linus, and Grace for a celebratory swim!</p>
          <div className="flex justify-center gap-2 mt-3 text-3xl">
            {['💻🏊', '🐧🏊', '⚓🏊', '🤖🏊'].map((e, i) => (
              <span key={i}>{e}</span>
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div className="text-center">
          <div className="text-6xl font-black text-yellow-400">{countdown}</div>
          <p className="text-white/70 text-sm">seconds of pure celebration</p>
        </div>

        <Progress value={((60 - countdown) / 60) * 100} className="w-full max-w-md h-4 bg-white/20" />
      </div>
    </div>
  );
}

// ============================================================
// GAMIFIED QUIZ FEEDBACK (Ugo Lord style)
// ============================================================
function QuizFeedback({
  correct,
  explanation,
  correctAnswer,
  options,
  onNext,
}: {
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
        {/* Stamp */}
        <div className={`text-8xl font-black ${correct ? 'text-green-400' : 'text-red-400'} animate-bounce`}>
          {correct ? '✅' : '❌'}
        </div>

        {/* Sound Effect Text */}
        <div className={`text-4xl font-black ${correct ? 'text-green-300' : 'text-red-300'}`}
          style={{ textShadow: correct ? '0 0 20px #4ade80' : '0 0 20px #f87171' }}>
          {correct ? '💥 CORRECT! 💥' : '🔨 WRONG! 🔨'}
        </div>

        {/* Ugo Lord Style Response */}
        {correct ? (
          <div className="space-y-2">
            <p className="text-green-200 text-lg font-bold">
              "That's absolutely RIGHT! You nailed it!"
            </p>
            <p className="text-green-300 text-sm italic">
              — CMake Master Ugo approves this answer
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-red-200 text-lg font-bold">
              "Hmm... I think I have a case.com!"
            </p>
            <div className="bg-red-800/50 rounded-lg p-3 text-left">
              <p className="text-white text-sm font-bold mb-1">The correct answer was:</p>
              <p className="text-yellow-300 text-sm">"{options[correctAnswer]}"</p>
            </div>
            <p className="text-red-200 text-sm">{explanation}</p>
          </div>
        )}

        {correct && (
          <p className="text-green-300 text-sm">{explanation}</p>
        )}

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
  const { data: questions, isLoading } = trpc.cmakeMastery.quiz.getQuestions.useQuery({ moduleId });
  const submitQuiz = trpc.cmakeMastery.quiz.submit.useMutation();

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
        toast.success(`🎯 You scored ${result.score}/${totalQuestions}! Module unlocked!`);
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
                    <p className="text-sm text-green-600 mt-1">
                      ✓ Correct: {r.options[r.correctAnswer]}
                    </p>
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
          <Button onClick={handleRetake} variant="outline" className="w-full gap-2">
            <RefreshCw className="w-4 h-4" /> Retake The Gauntlet
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

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {totalQuestions}</span>
        <Progress value={totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0} className="flex-1 h-2" />
        <div className="flex gap-1">
          {answers.map((a, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${
              i === currentQuestion ? 'bg-primary' :
              a !== null ? 'bg-green-500' : 'bg-muted'
            }`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
              {currentQuestion + 1}
            </div>
            <p className="text-lg font-medium">{question.question}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === i
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                } disabled:cursor-not-allowed`}
              >
                <span className="font-bold mr-2 text-muted-foreground">
                  {String.fromCharCode(65 + i)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>

        {currentQuestion < totalQuestions - 1 ? (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[currentQuestion] === null}
          >
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={answers.some((a) => a === null) || submitQuiz.isPending}
            className="bg-primary gap-2"
          >
            {submitQuiz.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Trophy className="w-4 h-4" />
            )}
            Submit Answers
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// THE CRUCIBLE (Hands-on Challenge)
// ============================================================
function TheCrucible({ moduleId, moduleData, onComplete }: {
  moduleId: number;
  moduleData: any;
  onComplete: () => void;
}) {
  const submitCrucible = trpc.cmakeMastery.progress.submitCrucible.useMutation();
  const [submission, setSubmission] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSample, setShowSample] = useState(false);

  const handleSubmit = async () => {
    if (!submission.trim()) {
      toast.error("Please write your solution before submitting.");
      return;
    }
    try {
      await submitCrucible.mutateAsync({ moduleId, submission });
      setSubmitted(true);
      toast.success("🔥 Crucible complete! Your solution has been recorded.");
      onComplete();
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  if (!moduleData?.cruciblePrompt) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>The Crucible challenge is being prepared for this module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Challenge */}
      <Card className="border-2 border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-600">Your Challenge</span>
          </div>
          <div className="prose prose-sm max-w-none">
            <Streamdown>{moduleData.cruciblePrompt}</Streamdown>
          </div>
        </CardContent>
      </Card>

      {/* Answer Area */}
      {!submitted ? (
        <div className="space-y-4">
          <label className="block text-sm font-medium">Your Solution:</label>
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Write your CMake code or explanation here..."
            className="w-full h-48 p-4 rounded-lg border border-border bg-background font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={submitCrucible.isPending} className="flex-1">
              {submitCrucible.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Submit Solution
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSample(!showSample)}
            >
              {showSample ? 'Hide' : 'Show'} Sample Answer
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="font-bold text-green-600 text-lg">Crucible Complete!</p>
          <p className="text-muted-foreground text-sm mt-1">Your solution has been recorded.</p>
        </div>
      )}

      {/* Sample Answer */}
      {(showSample || submitted) && moduleData.crucibleSample && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-bold text-green-600">Sample Answer</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <Streamdown>{moduleData.crucibleSample}</Streamdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// MODULE INFOGRAPHIC (shock/visual aid)
// ============================================================
const MODULE_INFOGRAPHICS: Record<number, { emoji: string; title: string; tagline: string; bullets: string[]; color: string }> = {
  1: { emoji: '💀', title: 'THE BUILD SYSTEM GRAVEYARD', tagline: 'Every platform-specific build file you write is a nail in your project\'s coffin.', bullets: ['3 Makefiles = 3x the maintenance', 'Out-of-sync = broken builds = angry developers', 'CMake: ONE file. ALL platforms. ZERO excuses.'], color: 'from-red-900 to-black' },
  2: { emoji: '🔧', title: 'THE THREE-STEP DANCE', tagline: 'Miss one step and your build is dead.', bullets: ['Step 1: cmake -S . -B build (CONFIGURE)', 'Step 2: cmake --build build (BUILD)', 'Step 3: cmake --install build (INSTALL)', 'NEVER run cmake in your source directory!'], color: 'from-blue-900 to-black' },
  3: { emoji: '🎯', title: 'TARGET OR DIE', tagline: 'Every include_directories() you write kills a kitten.', bullets: ['include_directories() = GLOBAL POLLUTION', 'target_include_directories() = SURGICAL PRECISION', 'PUBLIC: You AND your consumers get it', 'PRIVATE: Only you get it. Keep your secrets.'], color: 'from-orange-900 to-black' },
  4: { emoji: '🧠', title: 'THE CACHE IS WATCHING YOU', tagline: 'CMakeCache.txt remembers everything. EVERYTHING.', bullets: ['-D writes to the notebook', 'set() without CACHE is temporary', 'Delete build dir to start fresh', 'cmake -L shows what CMake knows about you'], color: 'from-purple-900 to-black' },
  5: { emoji: '⚠️', title: 'SCOPE VIOLATION', tagline: 'Variables that escape their scope are like escaped convicts — dangerous.', bullets: ['Function scope: local prison', 'PARENT_SCOPE: the escape hatch', 'Cache: the permanent record', 'Policies: the law of the land'], color: 'from-yellow-900 to-black' },
  6: { emoji: '♻️', title: 'COPY-PASTE IS A SIN', tagline: 'Every duplicated CMake snippet is technical debt with compound interest.', bullets: ['Write once in a .cmake file', 'list(APPEND CMAKE_MODULE_PATH ...)', 'include() it everywhere', 'DRY: Don\'t Repeat Yourself'], color: 'from-green-900 to-black' },
  7: { emoji: '📦', title: 'WHERE DOES YOUR SOFTWARE LIVE?', tagline: 'Hardcoding "lib" is a war crime in 64-bit Linux.', bullets: ['CMAKE_INSTALL_LIBDIR: lib or lib64?', 'CMAKE_INSTALL_BINDIR: always bin', 'GNUInstallDirs: the treaty that ends the war', 'cmake --install --prefix: your deployment weapon'], color: 'from-teal-900 to-black' },
  8: { emoji: '🔍', title: 'THE DEPENDENCY DETECTIVE', tagline: 'find_package() is your bloodhound. Use imported targets or suffer.', bullets: ['REQUIRED: fail fast, fail loud', 'OpenSSL::SSL: the imported target that carries everything', 'No more Xxx_INCLUDE_DIRS variables!', 'CONFIG mode: the package knows where it lives'], color: 'from-indigo-900 to-black' },
  9: { emoji: '⚙️', title: 'THE BUILD GRAPH IS GOD', tagline: 'Every file is a node. Every dependency is an edge. Violate the graph and face the consequences.', bullets: ['DEPENDS: the incoming edges', 'OUTPUT: the outgoing edges', 'POST_BUILD: the afterlife of compilation', 'The graph decides the order. Not you.'], color: 'from-gray-900 to-black' },
  10: { emoji: '🌍', title: 'CROSS-COMPILE OR DIE TRYING', tagline: 'Building for ARM on x86? The toolchain file is your passport to another world.', bullets: ['CMAKE_SYSTEM_NAME: the target universe', 'CMAKE_TOOLCHAIN_FILE: your interdimensional key', 'CMAKE_FIND_ROOT_PATH: look HERE, not there', 'Leaf-first migration: the only sane path'], color: 'from-emerald-900 to-black' },
  11: { emoji: '🚀', title: 'SHIP OR IT DIDN\'T HAPPEN', tagline: 'A program that can\'t be installed is a program that doesn\'t exist.', bullets: ['DEB, RPM, NSIS, DMG: one config rules them all', 'install() rules → CPack packages', 'include(CPack) LAST or face the consequences', 'COMPONENT: surgical package surgery'], color: 'from-pink-900 to-black' },
  12: { emoji: '🧪', title: 'UNTESTED CODE IS FICTION', tagline: 'You think it works. CTest KNOWS it works. There is a difference.', bullets: ['enable_testing() or your tests don\'t exist', 'gtest_discover_tests(): auto-discover or manually suffer', 'ctest -j 4: parallel testing is mercy', '-L unit: filter by label like a professional'], color: 'from-cyan-900 to-black' },
  13: { emoji: '📊', title: 'INVISIBLE FAILURES ARE INVISIBLE', tagline: 'A test that fails silently is worse than no test at all.', bullets: ['CDash: the all-seeing eye of your CI', 'Experimental, Nightly, Continuous: know the difference', 'ctest -D Experimental: one command to rule them all', 'Trends don\'t lie. Your code does.'], color: 'from-violet-900 to-black' },
  14: { emoji: '🏗️', title: 'THE COMPLETE PICTURE', tagline: 'A project without install rules, tests, and packages is a prototype. Not a product.', bullets: ['$<BUILD_INTERFACE:...>: for development', '$<INSTALL_INTERFACE:...>: for deployment', 'EXPORT: the bridge between build and install', 'Generator expressions: build-time truth'], color: 'from-rose-900 to-black' },
  15: { emoji: '📋', title: 'PRESETS: EXECUTABLE DOCUMENTATION', tagline: 'A README that says "run cmake with these 12 flags" is a README nobody reads.', bullets: ['CMakePresets.json: the README that runs itself', 'inherits: DRY for configurations', 'cmake --preset dev: one command, perfect setup', 'Commit it. It belongs with your code.'], color: 'from-amber-900 to-black' },
  16: { emoji: '🔗', title: 'REPRODUCIBILITY IS NOT OPTIONAL', tagline: '"It works on my machine" is not a deployment strategy.', bullets: ['FetchContent: download at configure time', 'GIT_TAG v1.0.0: pin it or regret it', 'GIT_TAG main: the path to madness', 'find_package() first, FetchContent as fallback'], color: 'from-lime-900 to-black' },
  17: { emoji: '📜', title: 'THE PACKAGE CONTRACT', tagline: 'find_package(MyLib) is a promise. XxxConfig.cmake is the signature.', bullets: ['NAMESPACE MyLib::: clarity and collision prevention', 'XxxConfig.cmake + XxxTargets.cmake + XxxConfigVersion.cmake', '@PACKAGE_INIT@: the magic incantation', 'SameMajorVersion: semantic versioning respect'], color: 'from-sky-900 to-black' },
  18: { emoji: '💻', title: 'ONE CMAKELISTS.TXT TO RULE THEM ALL', tagline: 'VS Code, CLion, Visual Studio, Xcode. One file. Zero excuses.', bullets: ['CMAKE_EXPORT_COMPILE_COMMANDS: the IntelliSense key', 'compile_commands.json: clangd\'s bible', 'CMakePresets.json: the universal IDE config', '.gitignore build/: protect your sanity'], color: 'from-slate-900 to-black' },
  19: { emoji: '⚡', title: 'CONFIGURE TIME IS A LIE', tagline: 'if(CMAKE_BUILD_TYPE STREQUAL Debug) is wrong. $<CONFIG:Debug> is truth.', bullets: ['Generator expressions: build-time reality', '$<$<CONFIG:Debug>:value>: conditional truth', '$<TARGET_FILE:target>: the path that actually exists', 'Multi-config generators: Debug AND Release, simultaneously'], color: 'from-fuchsia-900 to-black' },
  20: { emoji: '🎓', title: 'YOU ARE NOW A CMAKE MASTER', tagline: 'The build graph is clear. The targets are defined. The packages are shipped.', bullets: ['Configure → Build → Test → Package: the sacred cycle', 'Targets, not directories: the modern way', 'Presets, not READMEs: executable documentation', 'Ship it. The world is waiting.'], color: 'from-gold-900 to-black' },
};

// Comprehensive alt text for all 20 module infographics — written for screen reader users
// Each description covers every depicted object, colour, layout, text, and visual metaphor
const MODULE_ALT_TEXT: Record<number, string> = {
  1: "Dramatic horror-movie-style infographic with a dark, stormy sky filled with thick black and grey storm clouds. In the centre, a terrified man with wide eyes and an open mouth screaming is being swallowed by an enormous churning pile of scrolling paper documents and serpentine tentacles made of tangled build files. The paper scrolls are labelled with real build-system filenames: Makefile, GNUmakefile, Android.mk, vcxproj, .pro, configure.ac, Autoconf, aclocal.m4, ltmain.sh, Makefile.am, config.h.in, config.status, CFLAGS, CXXFLAGS, LDFLAGS, and 'platform specific build scripts'. The man's right arm reaches upward desperately toward a beam of bright white light breaking through the clouds. At the top centre, the CMake logo floats in the light: a triangle divided into three sections — blue on the left, red on the right, and green at the bottom — with the word 'CMake' in bold black text beneath it. The bottom reads 'WHY CMAKE?' in massive white distressed block letters, and 'BECAUSE THE ALTERNATIVE IS THIS NIGHTMARE.' with the word 'THIS' in dripping red horror-movie lettering. The overall palette is dark brown, black, and grey with a shaft of golden-white light representing CMake as salvation from build-system chaos.",
  2: "Explosive post-apocalyptic comic-book-style infographic. A massive orange and red nuclear mushroom cloud explosion dominates the upper centre. The sky is filled with floating red error messages: 'CMake Error at CMakeLists.txt:42 (add_executable)', 'Undefined Reference', 'FATAL_ERROR', 'UNKNOWN COMMAND FOOBAR', 'No such file or directory', 'No rule to make target', 'LINK: fatal error LNK120: 1 unresolved externals', 'CMAKE_CXX_COMPILER NOT FOUND', 'Segmentation fault (core dumped)', and 'Policy CMP2xxx is not set'. On the left, a cyan-bordered panel shows the cmake-gui graphical interface with source and binary path fields, a cache variable table (BUILD_SHARED_LIBS, CMAKE_BUILD_TYPE Debug, CMAKE_INSTALL_PREFIX /usr/local, CMAKE_CXX_STANDARD 17), and Configure and Generate buttons. In the centre, a green-bordered panel shows the cmake CLI terminal with a successful cmake -S . -B build -G Ninja command and Hello World output. On the right, a purple-bordered panel shows ccmake, the curses terminal UI, with the same cache variables in a blue highlighted list. In the foreground, a small anime-style developer with a skull-and-crossbones hoodie labelled 'BUILD OR DIE' holds a coffee mug labelled 'C++ Team', thinking 'I JUST WANT TO BUILD HELLO WORLD...'. Broken signs read 'BUILD FAILED', 'LINKER FAILED', 'Makefile broken'. The title reads 'GETTING STARTED: CHOOSE YOUR WEAPON'.",
  3: "Dark fantasy-epic infographic set against a stormy night sky with lightning bolts. The title reads 'WRITING CMakeLists FILES: THE POWER IS REAL' in red horror-style letters. In the centre, a massive glowing stone monolith floats vertically, displaying a complete CMakeLists.txt file in syntax-highlighted code including cmake_minimum_required, project, set commands for C++ standard, a SOURCES list with four .cpp files, add_executable, target_link_libraries with Threads and DARK_FORCES, and target_compile_definitions with UNLEASH_THE_POWER and CMAKE_IS_SUPREME. Blue-white lightning bolts strike the monolith. Four glowing circular orbs float in the corners: top-left cyan orb labelled 'cmake_minimum_required() THE FOUNDATION OF ALL BUILDS'; top-right green orb labelled 'project() DECLARE YOUR DOMAIN'; bottom-left blue-purple orb labelled 'add_executable() GIVE LIFE TO YOUR CREATION'; bottom-right magenta orb labelled 'target_link_libraries() UNLEASH EXTERNAL POWER'. Each orb contains the CMake triangle logo. At the bottom, a lone silhouetted figure with long hair stands with arms outstretched facing the monolith on a rubble-strewn dark landscape.",
  4: "Dark gothic horror-style infographic with a stormy night sky, full moon, and haunted castle silhouette. The title reads 'THE CMAKE CACHE: WHERE YOUR SETTINGS LIVE (AND HAUNT YOU)' in red dripping letters. The centrepiece is a massive rusted iron bank vault door labelled 'CMAKE CACHE', open and radiating blinding golden-yellow light. Inside the vault, three glowing label-tags float: CMAKE_BUILD_TYPE, CMAKE_INSTALL_PREFIX, and CMAKE_CXX_COMPILER. A developer is being physically sucked into the vault, arms and legs flailing. Around the scene, four frustrated developers are in states of despair: one at a desk with a 'CMake Suffer' mug; one in a hoodie labelled 'TRUST THE PROCESS'; one hunched with head in hands; one looking at a checklist reading 'DID YOU: CLEAR THE CACHE? DELETE CMakeCache.txt? USE -D? PRAY TO THE CONFIG GODS? STILL BROKEN!'. All four have speech bubbles reading 'WHY WON'T IT CHANGE?!'. A chalkboard shows crossed-out set() commands. Ghost figures float in the upper corners. A large red badge reads 'cmake -D THE MASTER KEY' with an antique skeleton key bearing the CMake logo. A stone tablet reads 'CACHE: BECAUSE REMEMBERING IS HARD, BUT FORGETTING IS FOREVER.'",
  5: "Sci-fi cyberpunk space infographic set against deep space with stars, galaxies, and asteroids. The title reads 'KEY CONCEPTS: THE MATRIX OF CMAKE — Once you see it, you cannot unsee it.' in pink-to-cyan gradient text. In the centre, a developer with curly dark hair and glasses sits at a desk, head tilted back in awe, staring at a massive glowing network diagram exploding from the CMake logo on their laptop. The network has six large glowing nodes: a green circle labelled PROPERTIES (set_target_properties, get_target_property, TARGET_PROPERTY, INTERFACE, COMPATIBLE); a pink-magenta circle labelled TARGETS (add_executable, add_library, add_custom_target, add_dependencies, target_link_libraries); a blue circle labelled SCOPE (DIRECTORY, FUNCTION, BLOCK, GLOBAL); an orange circle labelled POLICIES (cmake_policy, CMPxxxx, NEW, OLD, BEHAVIOR, VERSION); and a cyan circle labelled GENERATOR EXPRESSIONS ($<CONFIG:Debug>, $<TARGET_PROPERTY:...>, $<IF:...>, $<AND:...>, $<OR:...>). Smaller floating labels include FIND_* MODULES, ALIAS TARGETS, INTERFACE TARGETS, IMPORTED TARGETS, INSTALLATION, TESTING, COMPILER AND FLAGS, VARIABLES, CONDITIONALS, LISTS, LOOPS, MESSAGING, INCLUDE AND REUSE, and PLATFORMS. Floating terminal windows show CMakeLists.txt, build.ninja, CMakePresets.json, and CMakeCache.txt. Neon signs read 'EVERYTHING IS CONNECTED' and 'KNOWLEDGE COMPILES REALITY'.",
  6: "Cinematic sci-fi space infographic set above Earth's curved horizon in deep space. A massive circular space station floats in orbit labelled 'CMAKE MODULE LIBRARY'. Seven glowing book-shaped panels float around it: a large cyan-bordered book labelled 'FindBoost' with the Boost hexagonal logo; an orange-bordered book labelled 'FindOpenSSL' with a padlock icon; a green-bordered book labelled 'FindPython3'; a blue-bordered book labelled 'FindThreads'; a purple-bordered book labelled 'FreePackConfigFig'; a teal-bordered book labelled 'GNUInstallDirs' with a folder icon; and a white-bordered book labelled 'FetchContent' with a cube download icon. Each book emits a light beam to the station. An astronaut in a white spacesuit with the CMake logo on the chest, labelled 'CMAKE EXPLORER', floats reaching toward the FindBoost module. The station has a plaque reading 'BUILT BY GENERATIONS OF DEVELOPERS'. On the left, a developer is crushed under stone blocks labelled COMPLEXITY, DUPLICATION, ERRORS, FRUSTRATION, WASTED TIME. A red sign reads 'WITHOUT MODULES: 1000+ LINES OF MANUAL WORK'. The title reads 'CMAKE MODULES: STAND ON THE SHOULDERS OF GIANTS — Why write 500 lines when one include() does it all?'",
  7: "Epic fantasy-military infographic with a dark stormy sky. The title reads 'INSTALLING FILES: EVERYTHING IN ITS RIGHT PLACE'. A commanding military general in a long dark coat with gold epaulettes stands at a stone podium labelled 'INSTALL WITH PURPOSE, BUILD WITH DISCIPLINE'. Behind the general, a glowing stone tablet labelled 'GNUInstallDirs' lists five CMake installation variables: CMAKE_INSTALL_PREFIX '/usr/local' THE ROOT OF ALL; CMAKE_INSTALL_BINDIR WHERE EXECUTABLES RESIDE; CMAKE_INSTALL_LIBDIR WHERE LIBRARIES DWELL; CMAKE_INSTALL_INCLUDEDIR WHERE HEADERS LIVE; CMAKE_INSTALL_DOCDIR WHERE KNOWLEDGE IS SHARED. The general is labelled 'DEVELOPER: THE ARCHITECT OF ORDER'. From the general's pointing hand, four arcing streams of glowing particles flow to the right: a blue arc carries .h header files to '/usr/include HEADERS'; a green arc carries .so and .a library files to '/usr/lib LIBRARIES'; a yellow arc carries .exe binary files to '/usr/bin BINARIES'; and a purple arc carries .md, .txt, .pdf, and .html documentation files to '/usr/share/doc DOCUMENTATION'. On the left, a dark tornado scatters files randomly with a sign reading 'WITHOUT PROPER INSTALL RULES: CHAOS SPOILS EVERYTHING'. Banners in the crowd read 'REPRODUCIBLE BUILDS', 'HAPPY USERS', 'A CLEAN SYSTEM IS A STRONG SYSTEM', 'EASY MAINTENANCE', 'FUTURE PROOF'.",
  8: "Dark science-fiction interrogation-room infographic. The title reads 'SYSTEM INSPECTION: CMAKE KNOWS YOUR SECRETS — No compiler feature escapes detection.' A massive humanoid robot, constructed of dark grey metal with exposed wiring and a domed head displaying the CMake triangle logo, sits at an examination table facing a small developer. The robot's chest panel reads 'CMAKE' in glowing cyan. Its four mechanical arms are labelled: CheckCXXSourceCompiles, CheckIncludeFile, CheckFunctionExists, and CheckLibraryExists. The robot's chest screen displays a terminal readout of platform information including SYSTEM_NAME Linux, CMAKE_CXX_COMPILER_ID GNU, CMAKE_CXX_COMPILER_VERSION 13.2.1, CMAKE_GENERATOR Ninja, and CMAKE_CXX_STANDARD 20. In the four corners, four platform panels show: Windows (MSVC 19.38, C++20, x86_64, detected features __cpp_modules, __cpp_coroutines, __cpp_concepts, STATUS: PROBED); Linux (GCC 13.2.1, C++23, x86_64, kernel 6.6.13-arch1-1, detected features __cpp_lib_ranges, __cpp_lib_format, STATUS: PROBED); macOS (AppleClang 15.0.0, C++20, arm64, macOS 14.4, detected features __cpp_explicit_this, __cpp_filesystem, STATUS: PROBED); ARM (GCC 12.3.0, C++20, aarch64, ARMv8.4-A, detected features __ARM_NEON, ARM_FEATURE_AES, STATUS: PROBED). A green terminal reads 'DIAGNOSIS IN PROGRESS... NO STONE UNTURNED. NO FEATURE UNCHECKED. NO SECRET SAFE.' A red sign reads 'RESISTANCE IS FUTILE'.",
  9: "Fantasy adventure treasure-hunt infographic set in a dark enchanted forest at night. The title reads 'FINDING PACKAGES: THE GREAT DEPENDENCY HUNT' on a dark wooden banner. An explorer character in a tactical vest with a headlamp kneels on rocky ground studying a treasure map. Wooden signposts near the explorer read 'CMake Registry' (with the CMake triangle logo), '-/usr/lib', '-/etc', '-/opt'. A glowing golden trail of light particles winds through the forest. Along the trail, labels read 'find_package()', 'Config Files', and 'Find Modules'. In the centre, a dark pit glows red-orange from within, with a developer falling into it and the text 'FAILED find_package()' on the pit's edge. On the right, an open wooden treasure chest overflows with gold coins and gems, labelled 'Boost::filesystem' and 'OpenSSL::SSL'. At the bottom, a flow diagram reads: 'Search Order: → CMake Registry → System Paths → HINTS → PATHS'.",
  10: "Dark industrial sci-fi factory infographic inside a massive automated manufacturing plant with high ceilings, exposed pipes, and orange sparks from welding machinery. The title reads 'CUSTOM COMMANDS: AUTOMATE OR SUFFER'. A sign reads 'THE CMAKE WAY: AUTOMATED. RELIABLE. GLORIOUS.' The factory is divided in two. On the left, a miserable developer sits hunched at a cluttered desk with a sign reading 'THE OLD WAY: MANUAL. ERROR-PRONE. PAINFUL.' listing crossed-out steps: Run script.py, Generate files, Copy to build, Hope it works, Repeat, Cry. A speech bubble reads 'WHY ISN'T IT WORKING?!'. On the right, a gleaming automated conveyor belt runs from left to right. An INPUTS hopper contains template.in, data.json, config.yaml. A blue energy beam from the CMake logo transforms the inputs. The belt carries OUTPUTS: generated.cpp, version.h, config.inc, moc_*.cpp. The belt continues through four stations: TRANSFORM INPUTS TO TOOLS; BUILD OBJECTS Compiling .cpp to .o; LINK Creating executable/library; FINAL OUTPUT Your app is ready to run! Three hook panels are labelled PRE_BUILD HOOK, PRE_LINK HOOK, and POST_BUILD HOOK. Code panels show add_custom_command() and add_custom_target() examples. A yellow panel reads 'AUTOMATE ONCE. REAPPLY FOREVER.' with a lightbulb icon.",
  11: "Epic fantasy transformation infographic split into two halves. The title reads 'CONVERTING TO CMAKE: ESCAPE THE DARK AGES'. On the left, a crumbling ancient stone temple labelled 'LEGACY BUILD SYSTEM' is falling apart, with columns collapsing. Three stone tablets lean against the ruins: MAKEFILES, AUTOCONF SCRIPTS, HAND-WRITTEN SCRIPTS. Code fragments show a Makefile with gcc commands and a configure.ac file. A tangled red web shows chaotic dependencies. A panel labelled 'BEFORE: CHAOS' lists five red X items: FRAGILE BUILD PROCESS, HARD TO ONBOARD, PLATFORM-SPECIFIC HACKS, POOR MAINTAINABILITY, UNKNOWN DEPENDENCIES. On the right, a gleaming white marble temple labelled 'CMAKE PROJECT' stands tall with grand columns, bathed in golden sunlight. A banner displays a CMakeLists.txt file with proper cmake_minimum_required, project, add_executable, target_include_directories, target_link_libraries, and install commands. Four icon panels read: CROSS-PLATFORM, MODULAR, MAINTAINABLE. Banners read REPRODUCIBLE, SCALABLE, FUTURE-PROOF. A panel labelled 'AFTER: ORDER' shows a clean directory tree: CMakeLists.txt → src/, include/, tests/, cmake/ → myapp (Executable). In the centre, a wizard in a dark robe with the CMake logo on the back holds a glowing staff, facing a swirling golden portal. Four glowing blue steps float in the portal: AUDIT SOURCES, CREATE CMAKELISTS, REPLACE VARIABLES, TEST BUILDS. A badge reads 'TRANSFORMATION IN PROGRESS...'",
  12: "Dark fantasy sorcerer's workshop infographic depicting cross-compilation as portal magic. The title reads 'CROSS COMPILING: BUILD HERE, RUN ANYWHERE — One toolchain file to rule them all.' A banner reads 'WRITE ONCE, COMPILE ANYWHERE, RUN EVERYWHERE'. A developer in a dark robe labelled 'MASTER OF TOOLCHAINS' sits at a wooden desk in a stone chamber with ivy-covered walls and candlelight, holding up a glowing scroll labelled 'CMAKE_TOOLCHAIN_FILE' containing set() commands for CMAKE_SYSTEM_NAME, CMAKE_SYSTEM_PROCESSOR, CMAKE_SYSROOT, CMAKE_C_COMPILER, CMAKE_CXX_COMPILER, CMAKE_FIND_ROOT_PATH, and CMAKE_FIND_ROOT_PATH_MODE. Four magical portal arches glow different colours on the wall: a green portal labelled 'TARGET: ARM Raspberry Pi' with a Raspberry Pi logo and a green binary cube, producing 'COMPILED BINARY → raspberry_pi'; a blue portal labelled 'TARGET: Windows x64' with a Windows logo, producing 'COMPILED BINARY → app.exe'; a purple portal labelled 'TARGET: WebAssembly WASM32' with the WebAssembly WA logo, producing 'COMPILED BINARY → app.wasm'; and a bright green portal labelled 'TARGET: Android ARM64' with the Android robot logo, producing 'COMPILED BINARY → app.apk'. A BUILD MATRIX panel shows all four platforms checked green. Platform specification panels show ARCH, SYSTEM, ABI, CXX, and SYSROOT details for each target. The CMake triangle logo sits on the desk.",
  13: "Futuristic industrial packaging factory infographic inside a massive automated plant with robotic assembly arms. The title reads 'PACKAGING WITH CPACK: ONE COMMAND, EVERY FORMAT'. A sign reads 'CPACK PACKAGING PLANT' with version number '1.2.3'. Five parallel conveyor belt lines run through the factory, each producing a different package format: a red belt labelled 'DEB DEBIAN PACKAGES' with the Debian swirl logo carrying red boxes; a yellow-orange belt labelled 'RPM RED HAT PACKAGES' with the Red Hat logo; a blue belt labelled 'NSIS WINDOWS INSTALLER' with the Windows logo; a purple belt labelled 'DMG MACOS DISK IMAGE' with the macOS Finder face logo; and a green belt labelled 'TGZ TAR.GZ ARCHIVE'. All five belts converge at a golden exit portal shooting finished packages upward: package-1.2.3.deb, package-1.2.3.rpm, package-1.2.3.exe, and package-1.2.3.dmg. A developer stands at a control console with a large red 'BUILD ALL' button. A green terminal shows: $ cpack → Configuring → Generating → Packaging → COMPLETE: All packages generated successfully! A status panel shows CPACK BUILD MATRIX STATUS: SUCCESS with checkmarks for all five formats. A sign reads 'ONE COMMAND, EVERY PLATFORM, EVERY FORMAT: CPACK'.",
  14: "Dark cyberpunk gladiatorial arena infographic depicting software testing as a Roman colosseum battle. The title reads 'TESTING WITH CTEST: EVERY BUG MUST FACE JUDGMENT' with 'BUG' in bold red. A massive futuristic arena has neon-lit stands filled with spectators and cyberpunk city buildings visible above. Six hanging banners display CTest concepts: 'add_test() SUMMON YOUR GLADIATOR' with crossed swords; 'PASS_REGULAR_EXPRESSION VICTORY THROUGH VERIFICATION' with a golden laurel wreath and checkmark; 'CTEST THE TESTING EMPEROR AUTOMATE. VALIDATE. DOMINATE.' with a large C in a laurel wreath; 'FAIL_REGULAR_EXPRESSION NO MERCY FOR FAILED EXPECTATIONS' with a red X in a laurel wreath; 'TEST FIXTURES PREPARE YOUR ARENA' with a trophy; and 'PARALLEL TESTING SPEED. CONQUER. REPEAT.' with a split-arrow icon. In the arena floor, five gladiator figures fight bug monsters: a green-glowing gladiator labelled 'math addition' with a 'PASS' label in bright green; a gladiator labelled 'core memory' fighting a red exploding creature with a 'FAIL Segmentation fault' label and skull icon; two more green gladiators labelled 'io file_write' and 'util string' both with 'PASS' labels; and a massive dark tentacled monster with glowing red eyes representing 'UNTESTED CODE'. A developer watches from a desk with a 'DEBUG SLEEP REPEAT' mug. A CTest dashboard shows 22/30 tests at 73% progress, with a results table listing math/addition PASS, math/division PASS, core/parser PASS, core/memory FAIL (red), io/file_read PASS, io/file_write PASS, net/socket FAIL (red), util/string PASS. Overall result: 2 FAILED, 20 PASSED, 3 RUNNING.",
  15: "Futuristic mission control centre infographic depicting CDash as a build empire command room. The title reads 'CDASH: YOUR BUILD EMPIRE AT A GLANCE — Continuous integration before CI was cool.' A massive curved command room resembles NASA mission control. A person sits in a high-backed chair at a curved console, seen from behind, with a five-star badge reading 'BUILD GENERAL'. The central wall displays a CDash dashboard with six panels: BUILD RESULTS showing a donut chart with 2,847 Total Builds (2,313 Succeeded, 327 Warnings, 207 Errors); TEST RESULTS showing 18,732 Total Tests (16,597 Passed, 1,432 Failed, 703 Not Run); CODE COVERAGE at 78.4%; BUILD TREND, TEST TREND, and COVERAGE TREND charts. A LATEST BUILDS table shows six recent builds across Linux, Windows, macOS, Ubuntu, Fedora. A NOTIFICATIONS panel shows recent alerts. On the left, a column of BUILD AGENTS shows six platforms: LINUX-DEBUG (Ubuntu 24.04, green), LINUX-RELEASE (Rocky Linux 9, green), WINDOWS-DEBUG (Windows 11, red X), WINDOWS-RELEASE (Windows Server 2022, green), MACOS-ARM64 (macOS 14.5, yellow warning), MACOS-X86_64 (macOS 13.6, green). On the right, six more platforms: FREEBSD-RELEASE (green), ANDROID-ARM64 (green), iOS-ARM64 (yellow warning), SOLARIS-SPARC (red X), AIX-POWER9 (green), WEBASSEMBLY-WASI (green). A status bar shows 50+ AGENTS, 12 PLATFORMS, 1000+ TESTS, 24/7 MONITORING, ONE EMPIRE.",
  16: "Hand-painted fantasy RPG world map infographic depicting the CMake tutorial as a hero's journey on aged parchment. The title on a decorative scroll reads 'THE CMake TUTORIAL: YOUR HERO'S JOURNEY — Every great build begins with a single CMakeLists.txt'. In the lower-left, a young adventurer with a blue cape holds a walking staff and a map, standing at the start of a glowing golden dotted path. The path winds through the landscape past seven numbered waypoints: Step 1 (blue circle) 'BASIC STARTING POINT' near a small village with cottages; Step 2 (green circle) 'ADDING A LIBRARY' with add_library, target_sources, target_include_directories near a workshop town; Step 3 (purple circle) 'USAGE REQUIREMENTS' with target_link_libraries, target_compile_features near a stone arch gateway; Step 4 (gold circle) 'GENERATOR EXPRESSIONS' with $<CONFIG:Debug>, $<PLATFORM_ID:Linux>, $<TARGET_PROPERTY:...> near a magical crystal formation at the mountain peak; Step 5 (red circle) 'INSTALLING' with install(TARGETS), install(FILES), GNUInstallDirs on a mountain road; Step 6 (blue circle) 'TESTING' with enable_testing, add_test, ctest near a stone arena by the coast; and Step 7 (yellow circle) 'CPACK' with include(CPack), set(CPACK_...), package near a harbour with a sailing ship. The path leads to a magnificent white castle on a cliff bathed in golden sunlight with the CMake logo on its gate. A scroll near the castle reads 'You have mastered the art of build systems. Your projects shall thrive across any platform!' A compass rose shows N, S, E, W with the CMake logo at its centre. A navigation bar shows LEARN, BUILD, SHARE, TEST, PACKAGE, DEPLOY icons.",
  17: "Dark steampunk laboratory infographic depicting CMake build configuration as a wizard controlling multiple interfaces. The title reads 'USER INTERACTION GUIDE: HOW USERS SHOULD CONTROL YOUR BUILD — CMake gives you many interfaces. Use them wisely.' A stylish wizard with spiky dark hair, sunglasses, and a long dark coat sits at a central console with both arms outstretched, channelling green lightning energy toward the interfaces on either side. A glowing crystal ball displays the CMake logo and 'CMAKE THE BUILD ORCHESTRATOR'. A speech bubble reads 'I INTERFACE WITH CMAKE THROUGH MANY PATHS AT ONCE.' On the upper-left, a cmake-gui window with a cyan border shows the CMake 3.27.0 graphical interface with source and binary path fields, a cache variable table (BUILD_TESTING, ENABLE_FOO, ENABLE_BAR, USE_BAZ, CMAKE_INSTALL_PREFIX, CMAKE_BUILD_TYPE, FOO_MODE), and Configure and Generate buttons. On the upper-right, a ccmake terminal UI with a blue border shows the same variables in a highlighted list with keyboard shortcuts. In the centre-left, a cmake -D flags panel shows a terminal with cmake -S . -B build commands using -DENABLE_FOO=ON, -DBUILD_TESTING=OFF, -DCMAKE_BUILD_TYPE=RelWithDebInfo, -DCMAKE_INSTALL_PREFIX=/opt/magic, -G Ninja. On the right, a KEY CONCEPTS panel explains option(), cmake_dependent_option(), and CACHE VARIABLES. In the lower-left, a horror-comic panel labelled 'THE WRONG WAY: EDITING CMakeCache.txt (DO NOT DO THIS)' shows a wild-eyed screaming character being electrocuted by purple lightning, holding a CMakeCache.txt file, with five red X items: Lost on next configure, Breaks dependencies, Bypasses validation, Causes undefined behavior, May anger the CMake gods. In the lower-centre, a 'GOLDEN RULE' panel reads 'ALWAYS USE THE APPROVED INTERFACES TO SET OPTIONS.' In the lower-right, 'THE RIGHT WAY: USE THE INTERFACES' shows a calm developer with five green checkmarks: Persists correctly, Respects dependencies, Validated and safe, Reproducible builds, Pleases the CMake gods.",
  18: "Cyberpunk night-city aerial infographic depicting software dependencies as a city of interconnected skyscrapers. The title reads 'USING DEPENDENCIES: THE CITY OF LIBRARIES — Every dependency has its place.' An aerial view of a futuristic city at night shows dark skyscrapers connected by glowing elevated highways. Each skyscraper represents a library: APP (Your Project) — the central largest building glowing cyan; CORE connected by a green highway; DATA connected by a green highway; MATH connected by a blue highway; CONFIG connected by a purple highway; UTILS (Header Only) connected by a green highway; LOGGING connected by a blue highway; NETWORK connected by a green highway; UI connected by a purple highway. The highways are colour-coded: green for PUBLIC connections (propagates to dependents), blue for PRIVATE connections (used privately, hidden from downstream), and purple for INTERFACE connections (header-only, usage requirements). A construction crane builds a new skyscraper labelled 'FetchContent: Constructing new dependency...'. A distant skyscraper is labelled 'THIRD PARTY LIBRARY (External)' with an ExternalProject_Add() label. Three panels explain acquisition methods: find_package() (yellow taxi icon) 'Finds existing libraries in the city'; ExternalProject_Add() (building icon) 'Imports external projects from distant lands'; FetchContent (crane icon) 'Builds new libraries on-demand'. A CMakeLists.txt panel shows target_link_libraries(APP PUBLIC CORE, PUBLIC DATA, PRIVATE CONFIG, INTERFACE UI, PUBLIC NETWORK, PRIVATE LOGGING, PUBLIC UTILS, PRIVATE MATH). A terminal shows cmake --build . --parallel → City is alive. The bottom reads 'CMake: The Urban Planner — Connecting. Building. Linking. Creating something greater together.'",
  19: "Realistic international airport infographic depicting CMake library importing and exporting as global air freight. The title reads 'IMPORTING AND EXPORTING: THE GLOBAL LIBRARY ECONOMY — Share your work with the world.' The scene is a large international airport tarmac labelled 'GLOBAL DEPENDENCY AIRPORT INTERNATIONAL TERMINAL'. Four aeroplanes are parked: a white and blue aeroplane labelled 'Boost 1.85.0'; a white aeroplane labelled 'ZLIB 1.2.13'; a white and green aeroplane labelled 'MyAwesomeLib v2.0.0'; and a white aeroplane labelled 'spdlog 1.13.0'. A blue sign reads 'IMPORT INCOMING LIBRARIES' and a green sign reads 'EXPORT OUTGOING LIBRARIES'. A developer sits at a curved console labelled 'DEVELOPER TERMINAL OPERATOR' with a CMake Terminal coffee mug. On the left, cargo pallets are labelled 'IMPORTED TARGET Boost::filesystem', 'IMPORTED TARGET OpenSSL::SSL', 'IMPORTED TARGET ZLIB::ZLIB'. An IMPORTED TARGETS panel lists: Prebuilt binaries, Headers, Dependencies, Usage requirements, Documentation. On the right, cargo pallets are labelled 'EXPORTED TARGET MyAwesomeLib::Core' and 'EXPORTED TARGET MyAwesomeLib::Lib'. An EXPORTED TARGETS panel lists: Your code, Headers, Config files, Dependencies, Usage requirements, Documentation. An IMPORTING panel shows find_package(Boost REQUIRED) with explanations of FIND_PACKAGE() and IMPORTED TARGETS. An EXPORTING panel shows export(TARGETS MyAwesomeLib ...) with explanations of export() and install(EXPORT). An AIR TRAFFIC CONTROL panel lists MANAGE FLOWS, VERIFY CARGO, DOCUMENT, MONITOR. A CONFIG FILES panel shows three passport-style documents: MyAwesomeLib Config.cmake, Targets.cmake, Version.cmake. An EXPORT() MANIFEST panel shows the export() command with NAMESPACE and FILE parameters. THE GLOBAL LIBRARY PROCESS lists five steps: BUILD, EXPORT, INSTALL, IMPORT, USE. The bottom reads 'THE UNIVERSAL BUILD SYSTEM CONNECTING DEVELOPERS WORLDWIDE' with CROSS-PLATFORM, FINDABLE, REUSABLE, RELIABLE icons.",
  20: "Futuristic cyberpunk developer workspace infographic depicting CMake IDE integration as a unified command centre. The title reads 'IDE INTEGRATION: ONE PROJECT, EVERY EDITOR — CMakePresets.json: the universal language.' A developer with dark hair sits in a gaming chair with the CMake logo on the backrest, arms raised in a welcoming gesture, facing a central glowing CMakePresets.json panel. The panel displays JSON code: version 6, a default configurePreset with generator Ninja, binaryDir set to build, cacheVariables CMAKE_CXX_STANDARD 20 and BUILD_TESTING ON; a build preset; and a test preset. Glowing neon energy lines flow from the central panel to four IDE windows in the four corners. Upper-left: a Visual Studio window with the purple Visual Studio logo showing a Solution Explorer with CMakeLists.txt, include, src (main.cpp, core.cpp), and CMakePresets.json, plus an editor showing cmake_minimum_required, project, add_executable, target_include_directories, and target_link_libraries. Upper-right: a CLion window with the green CLion logo showing cmake-build-debug and cmake-build-release folders and the same CMakeLists.txt. Lower-left: a VS Code window with the blue VS Code logo showing an Explorer panel with .vscode, build, include, src, CMakeLists.txt, and CMakePresets.json, plus a terminal showing cmake -S . -B build -G Ninja, Configure done, Build done, with a status bar showing CMake: [Debug]: Ready and Ninja. Lower-right: an Xcode window with the blue Xcode logo showing a Project Navigator with UnifiedProject, Schemes, cmake-build-debug, CMakeLists.txt, and src files, with a Build Succeeded status. On the left, a dark graveyard has tombstones labelled 'MANUAL BUILD SCRIPTS RIP', 'HARDCODED PATHS RIP', 'IDE-SPECIFIC PROJECT FILES RIP', 'CONFIGURATION DRIFT RIP'. At the bottom, five benefit icons: ONE PROJECT CMakeLists.txt, ONE CONFIGURATION CMakePresets.json, MULTIPLE IDEs All working in harmony, ZERO LOCK-IN Freedom of choice, MAXIMUM PRODUCTIVITY Focus on what matters.",
};

// File paths for the actual infographic PNG images
const MODULE_IMAGE_PATHS: Record<number, string> = {
  1: '/manus-storage/module-01-why-cmake_b1f87939.png',
  2: '/manus-storage/module-02-getting-started_5ad85c2d.png',
  3: '/manus-storage/module-03-cmakelists_5cc00d9c.png',
  4: '/manus-storage/module-04-cache_7ca218d5.png',
  5: '/manus-storage/module-05-key-concepts_53f2e21c.png',
  6: '/manus-storage/module-06-modules_8ba9b3c8.png',
  7: '/manus-storage/module-07-installing_b92ade0e.png',
  8: '/manus-storage/module-08-system-inspection_a2ed1f0a.png',
  9: '/manus-storage/module-09-finding-packages_9ef3a42b.png',
  10: '/manus-storage/module-10-custom-commands_d4c2f049.png',
  11: '/manus-storage/module-11-converting_e2d677d8.png',
  12: '/manus-storage/module-12-cross-compiling_bde2abd2.png',
  13: '/manus-storage/module-13-cpack_e8641d70.png',
  14: '/manus-storage/module-14-ctest_5adf692e.png',
  15: '/manus-storage/module-15-cdash_37c1d243.png',
  16: '/manus-storage/module-16-tutorial_68a18a22.png',
  17: '/manus-storage/module-17-user-interaction_fb9564c5.png',
  18: '/manus-storage/module-18-dependencies_4dd85056.png',
  19: '/manus-storage/module-19-import-export_eb3ec780.png',
  20: '/manus-storage/module-20-ide-integration_79c556cd.png',
};

// ============================================================
// MICRO-INFOGRAPHICS: One focused concept per image
// Each entry: [imagePath, altText]
// ============================================================
const MODULE_MICRO_IMAGES: Record<number, Array<[string, string]>> = {
  1: [
    [
      '/manus-storage/m01-generator-concept_299e420a.png',
      'Micro-infographic titled THE CMAKE GENERATOR CONCEPT on a dark black background with neon colours. A large horizontal flow diagram shows four steps connected by thick yellow arrows. Step 1 in a red box: CMakeLists.txt — labelled your single source of truth. Step 2 in a bright cyan box: cmake -S . -B build — CMake reads your CMakeLists.txt and generates native build files. Step 3 in a green box: Native Build Files — with three sub-boxes showing Makefile, build.ninja, and .vcxproj. Step 4 in an orange box: cmake --build build — runs the native tool. The bottom tagline in yellow reads: CMake does not build your code. It generates the instructions for your native build tool.',
    ],
    [
      '/manus-storage/m01-out-of-source_d85d70e7.png',
      'Micro-infographic titled OUT-OF-SOURCE BUILDS: KEEP YOUR SOURCE CLEAN on a dark black background with neon colours. Left panel with a green border shows the source tree containing CMakeLists.txt, src/, include/, and tests/ — labelled PRISTINE SOURCE — never polluted. Right panel with an orange border shows the build directory containing CMakeCache.txt, Makefile, and compiled .o files — labelled DISPOSABLE BUILD — delete anytime. Centre shows the large cyan monospace command: cmake -S . -B build with annotations: -S . means source is here and -B build means put build files there. Bottom tagline in yellow: Never run cmake inside your source directory. Always use -B to specify a separate build directory.',
    ],
  ],
  2: [
    [
      '/manus-storage/m02-three-step-dance_9a0a5ad7.png',
      'Micro-infographic titled THE THREE-STEP CMAKE DANCE on a dark black background with neon colours. Three large numbered panels arranged vertically. Step 1 with a red border: CONFIGURE — large red monospace: cmake -S . -B build — description: Reads CMakeLists.txt, detects compilers, generates build system files. Run once per project setup. Step 2 with a green border: BUILD — large green monospace: cmake --build build — description: Compiles and links your code. Run every time you change source files. Step 3 with a blue border: INSTALL — large blue monospace: cmake --install build --prefix /usr/local — description: Copies executables, libraries, and headers to the install prefix. Bottom tagline in yellow: These three commands work on every platform. No more platform-specific build instructions.',
    ],
    [
      '/manus-storage/m02-generators_f06c4fdc.png',
      'Micro-infographic titled CMAKE GENERATORS: CHOOSE YOUR BUILD TOOL on a dark black background with neon colours. A large table with three columns: Generator Name, Platform, and Command. Row 1 in red: Unix Makefiles — Linux/macOS — cmake -G Unix Makefiles -S . -B build. Row 2 in green: Ninja — Cross-platform (fastest) — cmake -G Ninja -S . -B build. Row 3 in blue: Visual Studio 17 2022 — Windows — cmake -G Visual Studio 17 2022 -S . -B build. Row 4 in orange: Xcode — macOS — cmake -G Xcode -S . -B build. Row 5 in purple: Ninja Multi-Config — Cross-platform — cmake -G Ninja Multi-Config -S . -B build. Bottom callout in yellow: List all available generators on your system with: cmake --help',
    ],
  ],
  3: [
    [
      '/manus-storage/m03-target-vs-directory_3d964e30.png',
      'Micro-infographic titled TARGET COMMANDS vs DIRECTORY COMMANDS: USE THE SCALPEL on a dark black background with neon colours. Left panel with a red border labelled WRONG shows: include_directories(include/) — description: Applies to ALL targets in this directory AND all subdirectories. A blunt instrument. Causes mysterious include path pollution. Right panel with a green border labelled RIGHT shows: target_include_directories(mylib PUBLIC include/) — description: Applies ONLY to mylib and its consumers via PUBLIC. Precise. Composable. Modern CMake. A large red X covers the left panel and a large green checkmark covers the right panel. A table below shows dangerous directory commands versus their safe target equivalents: include_directories vs target_include_directories, add_definitions vs target_compile_definitions, add_compile_options vs target_compile_options, link_libraries vs target_link_libraries. Bottom tagline in yellow: If a command does not start with target_, think twice before using it.',
    ],
    [
      '/manus-storage/m03-visibility-keywords_e334e626.png',
      'Micro-infographic titled PUBLIC / PRIVATE / INTERFACE: HOW DEPENDENCIES PROPAGATE on a dark black background with neon colours. Three large panels arranged horizontally. Panel 1 with a green border: large green text PRIVATE — description: Used internally by this target only. NOT propagated to consumers. Example in green monospace: target_link_libraries(mylib PRIVATE fmt::fmt) — label: mylib uses fmt, but apps linking mylib do NOT get fmt. Panel 2 with a blue border: large blue text PUBLIC — description: Used by this target AND propagated to all consumers. Example in blue monospace: target_include_directories(mylib PUBLIC include/) — label: mylib uses include/, and apps linking mylib also get include/ on their include path. Panel 3 with an orange border: large orange text INTERFACE — description: NOT used by this target, but propagated to consumers. Example in orange monospace: target_compile_features(mylib INTERFACE cxx_std_17) — label: mylib does not need C++17, but forces consumers to compile with C++17. Bottom tagline in yellow: Rule of thumb — PRIVATE for implementation details, PUBLIC for API, INTERFACE for header-only libraries.',
    ],
  ],
  4: [
    [
      '/manus-storage/m04-cache-vs-normal_75547273.png',
      'Micro-infographic titled CACHE VARIABLES vs NORMAL VARIABLES on a dark black background with neon colours. Left panel with an orange border: large orange text NORMAL VARIABLE — description: Lives in CMake memory during configure. Disappears when cmake exits. Set with: set(MY_VAR value). Scope: function, directory, or global. Large orange monospace: set(MY_VAR hello) then message(${MY_VAR}) with comment: prints hello. Right panel with a cyan border: large cyan text CACHE VARIABLE — description: Written to CMakeCache.txt. Persists between cmake runs. Visible in cmake-gui and ccmake. Set with: set(MY_VAR value CACHE TYPE docstring). Large cyan monospace: set(BUILD_TESTS ON CACHE BOOL Build test suite) then a comment showing how to override from command line: cmake -DBUILD_TESTS=OFF -S . -B build. Bottom callout in yellow: CMakeCache.txt is in your build directory. Delete it to reset all cache variables to defaults. Never edit it by hand.',
    ],
    [
      '/manus-storage/m04-d-flag_0485e4c4.png',
      'Micro-infographic titled THE -D FLAG: INJECT VALUES INTO THE CACHE on a dark black background with neon colours. Centre shows a large code box in bright green monospace with five example -D flag usages: cmake -DCMAKE_BUILD_TYPE=Release -S . -B build to set build type; cmake -DBUILD_SHARED_LIBS=ON -S . -B build to build shared instead of static; cmake -DCMAKE_INSTALL_PREFIX=/opt/myapp -S . -B build to set install location; cmake -DCMAKE_TOOLCHAIN_FILE=arm.cmake -S . -B build to cross-compile; cmake -DCMAKE_VERBOSE_MAKEFILE=ON -S . -B build to see every compiler command. Below the code box, a large table shows the four cache variable types: BOOL for ON/OFF values, STRING for any text, PATH for a directory path, FILEPATH for a file path. Bottom tagline in yellow: -D sets a cache variable. -U unsets or removes a cache variable. Both take effect immediately.',
    ],
  ],
  5: [
    [
      '/manus-storage/m05-policies_57a3d81b.png',
      'Micro-infographic titled CMAKE POLICIES: OLD BEHAVIOUR vs NEW BEHAVIOUR on a dark black background with neon colours. Centre shows a large horizontal timeline with CMake version numbers from 2.8 to 3.30. At each major version, a coloured dot marks a policy change. A large code box in bright green monospace shows: cmake_minimum_required(VERSION 3.20) with annotation: This single line sets the policy baseline. All policies introduced up to version 3.20 are set to NEW behaviour automatically. Below, two panels side by side. Left panel with a red border: OLD BEHAVIOUR — cmake_policy(SET CMP0048 OLD) — description: Opt back into the old, deprecated behaviour. Use only as a last resort when migrating legacy code. Right panel with a green border: NEW BEHAVIOUR — cmake_policy(SET CMP0048 NEW) — description: Use the new, correct behaviour. This is what cmake_minimum_required does for you automatically. Bottom tagline in yellow: Always set cmake_minimum_required(VERSION X.Y) at the top of every CMakeLists.txt. It is not optional.',
    ],
    [
      '/manus-storage/m05-variable-scope_38e65be5.png',
      'Micro-infographic titled VARIABLE SCOPE: WHERE DOES YOUR VARIABLE LIVE? on a dark black background with neon colours. Centre shows four concentric rectangles, each labelled with a scope level. Outermost rectangle with a grey border: ENVIRONMENT SCOPE — $ENV{PATH} — description: Read from the OS environment. Set with: set(ENV{MY_VAR} value). Changes do NOT persist after cmake exits. Second rectangle with a blue border: CACHE SCOPE — ${MY_CACHE_VAR} — description: Persists in CMakeCache.txt between runs. Visible in cmake-gui. Set with CACHE keyword. Third rectangle with a green border: DIRECTORY SCOPE — ${MY_DIR_VAR} — description: Visible in the current CMakeLists.txt and all subdirectories added via add_subdirectory(). Innermost rectangle with an orange border: FUNCTION SCOPE — ${MY_LOCAL_VAR} — description: Visible only inside the function. Use PARENT_SCOPE to propagate a value up one level. Bottom tagline in yellow: Variables do NOT automatically propagate upward. Use PARENT_SCOPE or CACHE to share values between scopes.',
    ],
  ],
  6: [
    [
      '/manus-storage/m06-module-path_8f162adb.png',
      'Micro-infographic titled CMAKE_MODULE_PATH: TEACH CMAKE WHERE YOUR MODULES LIVE on a dark black background with neon colours. Left panel with a cyan border shows the directory structure: MyProject/ with subdirectory cmake/ containing FindMyLib.cmake and MyHelpers.cmake, and root CMakeLists.txt. Right panel with a green border shows the CMakeLists.txt code: list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake) then find_package(MyLib REQUIRED) then include(MyHelpers). Below the panels, a large orange callout: CMAKE_MODULE_PATH is a LIST. Use list(APPEND ...) not set(...) to avoid overwriting the built-in module path. Bottom tagline in yellow: CMake searches CMAKE_MODULE_PATH first, then its own built-in module directory. Your modules take priority.',
    ],
    [
      '/manus-storage/m06-write-module_bce162c5.png',
      'Micro-infographic titled WRITING A FIND MODULE: THE ANATOMY on a dark black background with neon colours. Centre shows a large code box in bright cyan monospace showing a complete minimal FindMyLib.cmake: a comment line, find_path(MYLIB_INCLUDE_DIR NAMES mylib.h PATH_SUFFIXES mylib), find_library(MYLIB_LIBRARY NAMES mylib), include(FindPackageHandleStandardArgs), find_package_handle_standard_args(MyLib REQUIRED_VARS MYLIB_LIBRARY MYLIB_INCLUDE_DIR), then an if block: if(MyLib_FOUND AND NOT TARGET MyLib::MyLib) then add_library(MyLib::MyLib UNKNOWN IMPORTED) then set_target_properties(MyLib::MyLib PROPERTIES IMPORTED_LOCATION ${MYLIB_LIBRARY} INTERFACE_INCLUDE_DIRECTORIES ${MYLIB_INCLUDE_DIR}) then endif(). Bottom tagline in yellow: Always create an IMPORTED target such as MyLib::MyLib. This is the modern way. Never just set variables.',
    ],
  ],
  7: [
    [
      '/manus-storage/m07-install-command_97eaf41a.png',
      'Micro-infographic titled THE install() COMMAND: WHAT GOES WHERE on a dark black background with neon colours. Four large code boxes stacked vertically. Box 1 with a green border: INSTALL TARGETS in green — large green monospace: install(TARGETS myapp mylib RUNTIME DESTINATION bin LIBRARY DESTINATION lib ARCHIVE DESTINATION lib PUBLIC_HEADER DESTINATION include). Box 2 with a blue border: INSTALL FILES in blue — large blue monospace: install(FILES myconfig.h DESTINATION include/mylib). Box 3 with a cyan border: INSTALL DIRECTORY in cyan — large cyan monospace: install(DIRECTORY include/ DESTINATION include). Box 4 with an orange border: INSTALL SCRIPT in orange — large orange monospace: install(SCRIPT post_install.cmake). Bottom callout in yellow: CMAKE_INSTALL_PREFIX defaults to /usr/local on Unix and C:/Program Files on Windows. Override with -DCMAKE_INSTALL_PREFIX=/your/path',
    ],
    [
      '/manus-storage/m07-gnuinstalldirs_ce55d9dc.png',
      'Micro-infographic titled GNUInstallDirs: PORTABLE INSTALL PATHS on a dark black background with neon colours. A large table with three columns: Variable, Default Value on Linux, and Purpose. Row 1 in red: CMAKE_INSTALL_BINDIR — bin — Executables. Row 2 in green: CMAKE_INSTALL_LIBDIR — lib or lib64 — Libraries. Row 3 in blue: CMAKE_INSTALL_INCLUDEDIR — include — Header files. Row 4 in cyan: CMAKE_INSTALL_DATADIR — share — Read-only data. Row 5 in orange: CMAKE_INSTALL_MANDIR — share/man — Man pages. Row 6 in purple: CMAKE_INSTALL_DOCDIR — share/doc/project — Documentation. Below the table, a large code box in bright green monospace: include(GNUInstallDirs) then install(TARGETS myapp RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR} LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}). Bottom tagline in yellow: Always include(GNUInstallDirs) and use its variables. Never hardcode bin, lib, or include.',
    ],
  ],
  8: [
    [
      '/manus-storage/m08-find-package_75226b4c.png',
      'Micro-infographic titled find_package(): MODULE MODE vs CONFIG MODE on a dark black background with neon colours. Left panel with a green border: large green text MODULE MODE — description: CMake searches CMAKE_MODULE_PATH and its built-in modules for FindXxx.cmake. Large green monospace: find_package(OpenSSL REQUIRED) — annotation: CMake runs FindOpenSSL.cmake which sets OpenSSL::SSL and OpenSSL::Crypto targets. Right panel with a blue border: large blue text CONFIG MODE — description: CMake searches standard install paths for XxxConfig.cmake or xxx-config.cmake written by the library itself. Large blue monospace: find_package(Boost 1.80 REQUIRED COMPONENTS filesystem) — annotation: CMake finds BoostConfig.cmake installed by Boost, which provides Boost::filesystem target. Bottom callout in yellow: After find_package(), always use the imported target such as OpenSSL::SSL, never the old-style OPENSSL_LIBRARIES variable.',
    ],
    [
      '/manus-storage/m08-module-vs-config_4b9cddef.png',
      'Micro-infographic titled find_package() FULL SYNTAX: EVERY KEYWORD EXPLAINED on a dark black background with neon colours. Centre shows a large annotated code block in bright cyan monospace: find_package( then Boost as the package name — case-sensitive for Config mode, then 1.80 as the minimum version required, then EXACT meaning the version must match exactly, then REQUIRED meaning a fatal error if not found, then COMPONENTS listing filesystem and thread, then OPTIONAL_COMPONENTS listing python, then CONFIG to force Config mode search only, then HINTS /opt/boost as extra search paths to try first, then NO_DEFAULT_PATH to only search HINTS, then closing parenthesis. Below, a large orange callout: If find_package() fails, check with: cmake --find-package -DNAME=Boost -DCOMPILER_ID=GNU -DLANGUAGE=CXX -DMODE=EXIST. Bottom tagline in yellow: find_package() sets Xxx_FOUND, Xxx_VERSION, and creates imported targets. Always check Xxx_FOUND.',
    ],
  ],
  9: [
    [
      '/manus-storage/m09-check-macros_5b4b2459.png',
      'Micro-infographic titled SYSTEM INSPECTION: CHECK MACROS on a dark black background with neon colours. Four large code boxes. Box 1 with a green border: CHECK FOR A HEADER in green — large green monospace: include(CheckIncludeFile) then check_include_file(unistd.h HAVE_UNISTD_H) then if(HAVE_UNISTD_H) then target_compile_definitions(myapp PRIVATE HAVE_UNISTD_H) then endif(). Box 2 with a blue border: CHECK FOR A FUNCTION in blue — large blue monospace: include(CheckFunctionExists) then check_function_exists(getaddrinfo HAVE_GETADDRINFO). Box 3 with a cyan border: CHECK FOR A SYMBOL in cyan — large cyan monospace: include(CheckSymbolExists) then check_symbol_exists(O_CLOEXEC fcntl.h HAVE_O_CLOEXEC). Box 4 with an orange border: CHECK C++ SOURCE COMPILES in orange — large orange monospace: include(CheckCXXSourceCompiles) then check_cxx_source_compiles with a small inline C++ program that includes optional and tests std::optional, storing the result in HAVE_STD_OPTIONAL. Bottom tagline in yellow: Results are cached. Re-run cmake with --fresh to clear the cache and re-run all checks.',
    ],
  ],
  10: [
    [
      '/manus-storage/m10-custom-command_cd07b59a.png',
      'Micro-infographic titled add_custom_command() vs add_custom_target() on a dark black background with neon colours. Left panel with a green border: large green text add_custom_command() — description: Generates a FILE as a side effect of the build. The output file is tracked as a dependency. Large green monospace: add_custom_command( OUTPUT generated.cpp COMMAND python3 gen.py -o generated.cpp DEPENDS gen.py schema.json COMMENT Generating source code ) then add_executable(myapp main.cpp generated.cpp) — annotation: CMake knows generated.cpp comes from this command. It will re-run gen.py if gen.py or schema.json change. Right panel with an orange border: large orange text add_custom_target() — description: Runs a command on demand. NOT tied to a file output. Always runs when the target is built. Large orange monospace: add_custom_target(format COMMAND clang-format -i src/*.cpp COMMENT Formatting source code ) — annotation: Run with: cmake --build build --target format. Bottom tagline in yellow: Use add_custom_command() for code generation. Use add_custom_target() for utility tasks like formatting and linting.',
    ],
  ],
  11: [
    [
      '/manus-storage/m11-conversion-steps_ea4f3691.png',
      'Micro-infographic titled CONVERTING TO CMAKE: THE 5-STEP MIGRATION on a dark black background with neon colours. Five large numbered steps arranged vertically with coloured borders. Step 1 in a red box: AUDIT YOUR BUILD — description: List all executables, libraries, source files, include paths, and compiler flags. Write them down. Step 2 in an orange box: CREATE cmake_minimum_required + project() — large orange monospace: cmake_minimum_required(VERSION 3.20) then project(MyProject VERSION 1.0 LANGUAGES CXX). Step 3 in a yellow box: ADD TARGETS — large yellow monospace: add_library(mylib src/foo.cpp src/bar.cpp) then add_executable(myapp main.cpp). Step 4 in a green box: WIRE DEPENDENCIES — large green monospace: target_include_directories(mylib PUBLIC include/) then target_link_libraries(myapp PRIVATE mylib). Step 5 in a cyan box: ADD install() RULES — large cyan monospace: install(TARGETS myapp mylib RUNTIME DESTINATION bin LIBRARY DESTINATION lib). Bottom tagline in yellow: Migrate one target at a time. Keep the old build system running in parallel until CMake is proven.',
    ],
    [
      '/manus-storage/m11-generator-expressions_fb36bb4b.png',
      'Micro-infographic titled GENERATOR EXPRESSIONS: BUILD-TIME LOGIC on a dark black background with neon colours. Four large code boxes in a 2x2 grid. Box 1 with a green border: CONDITIONAL ON BUILD TYPE — large green monospace: target_compile_options(myapp PRIVATE $<$<CONFIG:Debug>:-g -O0> $<$<CONFIG:Release>:-O3>) — annotation: Applies -g -O0 only in Debug, -O3 only in Release. Box 2 with a blue border: CONDITIONAL ON COMPILER — large blue monospace: target_compile_options(myapp PRIVATE $<$<CXX_COMPILER_ID:MSVC>:/W4> $<$<CXX_COMPILER_ID:GNU>:-Wall>). Box 3 with a cyan border: TARGET FILE PATH — large cyan monospace: $<TARGET_FILE:mylib> and $<TARGET_FILE_DIR:myapp>. Box 4 with an orange border: INTERFACE vs BUILD — large orange monospace: $<BUILD_INTERFACE:${CMAKE_SOURCE_DIR}/include> and $<INSTALL_INTERFACE:include>. Bottom tagline in yellow: Generator expressions are evaluated at build time, not at configure time. They are not variables.',
    ],
  ],
  12: [
    [
      '/manus-storage/m12-toolchain-file_ce1ea11d.png',
      'Micro-infographic titled CROSS COMPILING: THE TOOLCHAIN FILE on a dark black background with neon colours. Left panel with a cyan border shows the filename arm-linux-toolchain.cmake and large cyan monospace: set(CMAKE_SYSTEM_NAME Linux) then set(CMAKE_SYSTEM_PROCESSOR arm) then set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc) then set(CMAKE_CXX_COMPILER arm-linux-gnueabihf-g++) then set(CMAKE_FIND_ROOT_PATH /sysroot/arm) then set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER) then set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY) then set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY). Right panel with an orange border shows HOW TO USE IT — large orange monospace: cmake -S . -B build-arm -DCMAKE_TOOLCHAIN_FILE=arm-linux-toolchain.cmake — description: The toolchain file tells CMake what system you are targeting, which compiler to use, and where to find libraries for the target. A large yellow callout: NEVER hardcode compiler paths in CMakeLists.txt. Always use a toolchain file. Bottom tagline in yellow: One CMakeLists.txt. Many toolchain files. Build for any platform.',
    ],
  ],
  13: [
    [
      '/manus-storage/m13-cpack-basics_b75da4b8.png',
      'Micro-infographic titled CPack: PACKAGE YOUR SOFTWARE IN 5 LINES on a dark black background with neon colours. Centre shows a large code box in bright green monospace: cmake_minimum_required(VERSION 3.20) then project(MyApp VERSION 2.1.0) then a comment about targets and install() rules then set(CPACK_PACKAGE_NAME MyApp) then set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION}) then set(CPACK_GENERATOR TGZ;DEB;RPM) then set(CPACK_PACKAGE_CONTACT dev@example.com) then include(CPack). Below the code box, a large table with three columns: GENERATOR in yellow, PLATFORM in cyan, and OUTPUT in green. Rows: TGZ/ZIP/TBZ2/7Z for cross-platform archives producing MyApp-2.1.0-Linux.tar.gz; DEB for Debian/Ubuntu producing myapp_2.1.0_amd64.deb; RPM for RHEL/Fedora producing MyApp-2.1.0.x86_64.rpm; NSIS for Windows producing MyApp-2.1.0-win64.exe; DragNDrop for macOS producing MyApp-2.1.0-Darwin.dmg. Bottom tagline in yellow: Run: cmake --build build followed by cpack --config build/CPackConfig.cmake',
    ],
  ],
  14: [
    [
      '/manus-storage/m14-ctest-add-test_dbaa885a.png',
      'Micro-infographic titled CTest: REGISTER AND RUN YOUR TESTS on a dark black background with neon colours. Three large stacked code boxes. Box 1 with a green border: ENABLE TESTING + ADD A TEST — large green monospace: enable_testing() then add_executable(unit_tests tests/main.cpp) then target_link_libraries(unit_tests PRIVATE mylib) then add_test(NAME UnitTests COMMAND unit_tests). Box 2 with a blue border: ADD TESTS WITH ARGUMENTS — large blue monospace: add_test(NAME ParseTest COMMAND myapp --parse input.txt) then add_test(NAME NetworkTest COMMAND myapp --host localhost --port 8080). Box 3 with a cyan border: SET TEST PROPERTIES — large cyan monospace: set_tests_properties(NetworkTest PROPERTIES TIMEOUT 30 LABELS integration WILL_FAIL FALSE). Large yellow callout: Run tests with: ctest --test-dir build -V for verbose output or -j8 for parallel execution. Bottom tagline in yellow: CTest does not care what test framework you use. It just runs commands and checks exit codes.',
    ],
  ],
  15: [
    [
      '/manus-storage/m15-cdash-submit_177aae5a.png',
      'Micro-infographic titled CDash: SUBMIT YOUR TEST RESULTS TO THE DASHBOARD on a dark black background with neon colours. Left panel with a cyan border shows the filename CTestConfig.cmake and large cyan monospace: set(CTEST_PROJECT_NAME MyProject) then set(CTEST_NIGHTLY_START_TIME 00:00:00 UTC) then set(CTEST_DROP_METHOD https) then set(CTEST_DROP_SITE my.cdash.org) then set(CTEST_DROP_LOCATION /submit.php?project=MyProject) then set(CTEST_DROP_SITE_CDASH TRUE). Right panel with an orange border shows THE DASHBOARD WORKFLOW — large orange monospace: ctest -D Experimental for run now submit once, ctest -D Nightly for nightly builds, ctest -D Continuous for continuous integration — description: Experimental runs now and submits once. Nightly runs at midnight. Continuous runs every N minutes. Large yellow callout: CDash aggregates results from ALL platforms. See which tests pass on Windows but fail on ARM. Bottom tagline in yellow: CDash is free and open source. Host it yourself or use my.cdash.org.',
    ],
  ],
  16: [
    [
      '/manus-storage/m16-tutorial-steps_c79d58f6.png',
      'Micro-infographic titled THE CMAKE TUTORIAL: 7 STEPS TO MASTERY on a dark black background with neon colours. Seven large numbered steps in a horizontal flow connected by arrows. Step 1 in a red box: A Basic Starting Point — small red monospace showing cmake_minimum_required, project, add_executable. Step 2 in an orange box: Adding a Library — small orange monospace showing add_library, target_link_libraries. Step 3 in a yellow box: Usage Requirements — small yellow monospace showing PRIVATE / PUBLIC / INTERFACE. Step 4 in a green box: Generator Expressions — small green monospace showing $<CONFIG:Debug>. Step 5 in a cyan box: Installing and Testing — small cyan monospace showing install() and enable_testing(). Step 6 in a blue box: Adding Export Config — small blue monospace showing install(EXPORT...) and CMakePackageConfigHelpers. Step 7 in a purple box: Packaging with CPack — small purple monospace showing include(CPack). Bottom tagline in yellow: The official CMake tutorial at cmake.org/cmake/help/latest/guide/tutorial/ is the best starting point.',
    ],
  ],
  17: [
    [
      '/manus-storage/m17-user-interaction_a0ce0993.png',
      'Micro-infographic titled THREE WAYS USERS CONFIGURE YOUR BUILD on a dark black background with neon colours. Three large panels side by side. Panel 1 with a green border: COMMAND LINE: -D FLAG — large green monospace: cmake -S . -B build -DBUILD_TESTS=ON -DCMAKE_BUILD_TYPE=Release — description: Best for CI/CD pipelines and scripted builds. Explicit and reproducible. Panel 2 with a blue border: TERMINAL GUI: ccmake — large blue monospace: ccmake build/ — description: A curses-based terminal UI. Shows all cache variables. Press c to configure, g to generate. Great for SSH sessions. Panel 3 with an orange border: GRAPHICAL GUI: cmake-gui — large orange monospace: cmake-gui — description: A full desktop GUI. Browse all variables, see help text, configure and generate with a click. Best for new users. Large yellow callout: All three tools read and write the SAME CMakeCache.txt. They are interchangeable. Bottom tagline in yellow: Use cmake-gui to explore. Use -D flags in production. Use ccmake over SSH.',
    ],
  ],
  18: [
    [
      '/manus-storage/m18-fetchcontent_c64e1381.png',
      'Micro-infographic titled FetchContent: DOWNLOAD DEPENDENCIES AT CONFIGURE TIME on a dark black background with neon colours. Left panel with a green border: THE PATTERN — large green monospace: include(FetchContent) then FetchContent_Declare(googletest GIT_REPOSITORY https://github.com/google/googletest.git GIT_TAG v1.14.0) then FetchContent_MakeAvailable(googletest) then a comment: Now use it like a local target: then target_link_libraries(my_tests PRIVATE GTest::gtest_main). Right panel with an orange border: FETCHCONTENT vs find_package — large table: FetchContent downloads source and builds it, always works with no install needed; find_package finds a pre-installed library and is faster using the system package; CPM.cmake is a wrapper around FetchContent that adds caching and version locking. Large yellow callout with a warning triangle: Pin dependencies with GIT_TAG. Never use GIT_TAG main in production. Bottom tagline in yellow: FetchContent replaced ExternalProject_Add for most use cases. Use it for test frameworks and small deps.',
    ],
  ],
  19: [
    [
      '/manus-storage/m19-export-config_36031d40.png',
      'Micro-infographic titled EXPORTING YOUR LIBRARY FOR OTHER PROJECTS on a dark black background with neon colours. Three large stacked code boxes. Box 1 with a green border: STEP 1: INSTALL WITH EXPORT — large green monospace: install(TARGETS mylib EXPORT mylibTargets LIBRARY DESTINATION lib ARCHIVE DESTINATION lib INCLUDES DESTINATION include) then install(EXPORT mylibTargets FILE mylibTargets.cmake NAMESPACE mylib:: DESTINATION lib/cmake/mylib). Box 2 with a blue border: STEP 2: GENERATE CONFIG FILE — large blue monospace: include(CMakePackageConfigHelpers) then configure_package_config_file(Config.cmake.in ${CMAKE_CURRENT_BINARY_DIR}/mylibConfig.cmake INSTALL_DESTINATION lib/cmake/mylib) then install(FILES ${CMAKE_CURRENT_BINARY_DIR}/mylibConfig.cmake DESTINATION lib/cmake/mylib). Box 3 with a cyan border: STEP 3: CONSUMER USES IT — large cyan monospace: find_package(mylib REQUIRED) then target_link_libraries(myapp PRIVATE mylib::mylib). Bottom tagline in yellow: The double-colon namespace such as mylib::mylib is the sign of a properly exported modern CMake library.',
    ],
  ],
  20: [
    [
      '/manus-storage/m20-cmake-presets_99a5c25d.png',
      'Micro-infographic titled CMakePresets.json: ONE FILE, ALL IDEs on a dark black background with neon colours. Left panel with a green border shows the filename CMakePresets.json and large green monospace of a JSON structure with version 3, a configurePresets array containing two presets: the debug preset with generator Ninja, binaryDir set to ${sourceDir}/build/debug, and cacheVariables containing CMAKE_BUILD_TYPE set to Debug; and the release preset that inherits from debug with CMAKE_BUILD_TYPE set to Release. Right panel with an orange border: HOW EACH IDE USES IT — a large table with four rows, each with an IDE logo icon. VS Code: Reads presets automatically via CMake Tools extension. Select preset from status bar. CLion: Reads presets since CLion 2022.1. File > Settings > Build > CMake > Load Presets. Visual Studio: Reads presets natively since VS 2019 16.10. Select from dropdown in toolbar. CLI with a terminal icon: cmake --preset debug then cmake --build --preset debug. Large yellow callout: CMakePresets.json is committed to git. CMakeUserPresets.json is gitignored for personal settings. Bottom tagline in yellow: Presets replace the need for IDE-specific project files. One source of truth for all developers.',
    ],
  ],
};

// ============================================================
// MICRO-INFOGRAPHIC GALLERY COMPONENT
// Renders focused single-concept images inline within the Spark section
// ============================================================
function ModuleMicroGallery({ moduleNumber }: { moduleNumber: number }) {
  const images = MODULE_MICRO_IMAGES[moduleNumber];
  if (!images || images.length === 0) return null;
  return (
    <section
      className="my-10 space-y-6"
      aria-label={`Focused concept reference cards for Module ${moduleNumber}`}
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-6">
        <div className="w-2 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
          Key Concepts — Visual Reference Cards
        </h3>
      </div>
      <div className="space-y-8">
        {images.map(([src, alt], idx) => (
          <figure key={idx} className="group">
            <img
              src={src}
              alt={alt}
              className="w-full rounded-xl border border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="sr-only">{alt}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function ModuleInfographic({ moduleNumber }: { moduleNumber: number }) {
  const info = MODULE_INFOGRAPHICS[moduleNumber] || MODULE_INFOGRAPHICS[1];
  const imgSrc = MODULE_IMAGE_PATHS[moduleNumber];
  const altText = MODULE_ALT_TEXT[moduleNumber] || `CMake Mastery Module ${moduleNumber} infographic`;
  return (
    <figure className="my-8" aria-label={`Module ${moduleNumber} infographic: ${info.title}`}>
      {/* Actual infographic image — full alt text for screen readers */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={altText}
          className="w-full rounded-2xl border border-white/10 shadow-2xl"
          loading="lazy"
          decoding="async"
        />
      )}
      {/* Text summary card — visible to all users, also serves as a text fallback */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${info.color} p-8 text-white mt-4 border border-white/10`}
        role="complementary"
        aria-label={`Key takeaways for Module ${moduleNumber}: ${info.title}`}
      >
        <div className="text-center mb-6">
          <div className="text-8xl mb-4" aria-hidden="true">{info.emoji}</div>
          <h3 className="text-2xl font-black tracking-wider">{info.title}</h3>
          <p className="text-white/70 italic mt-2 text-lg">"{info.tagline}"</p>
        </div>
        <div className="space-y-3" role="list" aria-label="Key takeaways">
          {info.bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-3" role="listitem">
              <ChevronRight className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-white/90 font-mono text-sm">{b}</p>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="sr-only">
        Module {moduleNumber} infographic — {info.title}. {info.tagline}
      </figcaption>
    </figure>
  );
}

// ============================================================
// MAIN MODULE PAGE
// ============================================================
export default function CMakeModule() {
  usePageMeta({
    title: "CMake Mastery - Module",
    description: "Educational module from the CMake Mastery course covering build system concepts. Part of GRACE Academy curriculum.",
    keywords: "CMake module education, build system training, software engineering course, GRACE Academy"
  });

  const { moduleNumber: moduleNumberStr } = useParams<{ moduleNumber: string }>();
  const moduleNumber = parseInt(moduleNumberStr || '1', 10);
  const { user, isAuthenticated } = useAuth();

  const { data: module, isLoading: moduleLoading } = trpc.cmakeMastery.modules.getByNumber.useQuery(
    { moduleNumber },
    { enabled: !isNaN(moduleNumber) }
  );

  const { data: progressData, refetch: refetchProgress } = trpc.cmakeMastery.progress.getModule.useQuery(
    { moduleId: moduleNumber },
    { enabled: isAuthenticated && !isNaN(moduleNumber) }
  );

  const markComplete = trpc.cmakeMastery.progress.markComplete.useMutation();

  const [activeTab, setActiveTab] = useState('spark');
  const [showPivi, setShowPivi] = useState(false);

  // Check if this is module 10 completion (mid-course celebration)
  const handleSectionComplete = async (section: 'spark' | 'gauntlet' | 'crucible' | 'imprint') => {
    if (!isAuthenticated) return;
    try {
      const result = await markComplete.mutateAsync({ moduleId: moduleNumber, section });
      refetchProgress();
      if (section === 'imprint' && moduleNumber === 10) {
        setShowPivi(true);
      }
      if (result.certificatesAwarded?.length > 0) {
        result.certificatesAwarded.forEach((cert: string) => {
          toast.success(`🎓 Certificate earned: ${cert.replace(/_/g, ' ').toUpperCase()}!`, { duration: 6000 });
        });
      }
      toast.success(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} completed!`);
    } catch {
      toast.error("Failed to save progress.");
    }
  };

  if (isNaN(moduleNumber) || moduleNumber < 1 || moduleNumber > 20) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Invalid module number.</p>
          <Link href="/cmake-mastery">
            <Button className="mt-4">Back to Course</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const trackNames: Record<string, string> = {
    foundations: 'Foundations',
    build_system: 'Build System',
    advanced: 'Advanced',
    tools: 'Tools & Ecosystem',
  };

  const sectionProgress = [
    { key: 'spark', label: 'Spark', done: progressData?.sparkCompleted },
    { key: 'gauntlet', label: 'Gauntlet', done: progressData?.gauntletCompleted },
    { key: 'crucible', label: 'Crucible', done: progressData?.crucibleCompleted },
    { key: 'imprint', label: 'Imprint', done: progressData?.imprintCompleted },
  ];

  return (
    <Layout>
      {showPivi && <PiviCelebration onComplete={() => setShowPivi(false)} />}

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/cmake-mastery">
              <span className="hover:text-primary cursor-pointer">CMake Mastery</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{module ? trackNames[module.track] || module.track : 'Loading...'}</span>
            <ChevronRight className="w-4 h-4" />
            <span>Module {moduleNumber}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">
                {moduleLoading ? 'Loading...' : module?.title || `Module ${moduleNumber}`}
              </h1>
              {module?.subtitle && (
                <p className="text-muted-foreground mt-1">{module.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {module?.estimatedMinutes && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {module.estimatedMinutes} min
                </Badge>
              )}
              {progressData?.moduleCompleted ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Complete
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Section Progress Dots */}
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {sectionProgress.map((s) => (
                <div key={s.key} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${s.done ? 'bg-green-500' : 'bg-muted'}`} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-center gap-3">
              <LockIcon className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <a href={getLoginUrl()} className="text-primary hover:underline">Sign in</a> to track your progress and earn certificates.
              </p>
            </div>
          )}
        </div>

        {/* Module Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="spark" className="gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Spark</span>
              {progressData?.sparkCompleted ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="gauntlet" className="gap-1.5">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Gauntlet</span>
              {progressData?.gauntletCompleted ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="crucible" className="gap-1.5">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Crucible</span>
              {progressData?.crucibleCompleted ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : null}
            </TabsTrigger>
            <TabsTrigger value="imprint" className="gap-1.5">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Imprint</span>
              {progressData?.imprintCompleted ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : null}
            </TabsTrigger>
          </TabsList>

          {/* THE SPARK */}
          <TabsContent value="spark" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Spark</h2>
                <p className="text-sm text-muted-foreground">3-minute reading — core concepts in Marilyn's style</p>
              </div>
            </div>

            {moduleLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
              </div>
            ) : module?.sparkContent ? (
              <div className="prose prose-lg max-w-none">
                <Streamdown>{module.sparkContent}</Streamdown>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Content is being prepared for this module.</p>
              </div>
            )}

            {/* Focused micro-infographics — one concept per card, inline with teaching content */}
            <ModuleMicroGallery moduleNumber={moduleNumber} />

            {/* Overview infographic — the dramatic chapter-cover visual */}
            <ModuleInfographic moduleNumber={moduleNumber} />

            {isAuthenticated && !progressData?.sparkCompleted && (
              <Button
                onClick={() => { handleSectionComplete('spark'); setActiveTab('gauntlet'); }}
                className="w-full"
                disabled={markComplete.isPending}
              >
                Mark as Read & Continue to Gauntlet
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
            {progressData?.sparkCompleted && (
              <Button variant="outline" onClick={() => setActiveTab('gauntlet')} className="w-full">
                Continue to Gauntlet <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </TabsContent>

          {/* THE GAUNTLET */}
          <TabsContent value="gauntlet" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Gauntlet</h2>
                <p className="text-sm text-muted-foreground">5-minute quiz — 5 questions, instant gamified feedback</p>
              </div>
            </div>
            <TheGauntlet
              moduleId={moduleNumber}
              onComplete={() => {
                refetchProgress();
                setActiveTab('crucible');
              }}
            />
          </TabsContent>

          {/* THE CRUCIBLE */}
          <TabsContent value="crucible" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Crucible</h2>
                <p className="text-sm text-muted-foreground">5-minute challenge — apply the knowledge in real scenarios</p>
              </div>
            </div>
            {!isAuthenticated ? (
              <div className="text-center py-12">
                <LockIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Sign in to complete The Crucible and save your progress.</p>
                <a href={getLoginUrl()}>
                  <Button>Sign In</Button>
                </a>
              </div>
            ) : (
              <TheCrucible
                moduleId={moduleNumber}
                moduleData={module}
                onComplete={() => {
                  refetchProgress();
                  setActiveTab('imprint');
                }}
              />
            )}
          </TabsContent>

          {/* THE IMPRINT */}
          <TabsContent value="imprint" className="space-y-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Imprint</h2>
                <p className="text-sm text-muted-foreground">2-minute thought experiment — for lasting retention</p>
              </div>
            </div>

            {moduleLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                ))}
              </div>
            ) : module?.imprintContent ? (
              <div className="prose prose-lg max-w-none">
                <Streamdown>{module.imprintContent}</Streamdown>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>The Imprint is being prepared for this module.</p>
              </div>
            )}

            {/* Module completion */}
            {isAuthenticated && !progressData?.imprintCompleted && (
              <Button
                onClick={() => handleSectionComplete('imprint')}
                className="w-full"
                disabled={markComplete.isPending}
              >
                <CheckCircle2 className="mr-2 w-4 h-4" />
                Complete Module {moduleNumber}
                {moduleNumber === 10 ? ' 🎉' : ''}
              </Button>
            )}
            {progressData?.imprintCompleted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-green-600">Module {moduleNumber} Complete!</p>
                {progressData.bestQuizScore !== null && progressData.bestQuizScore !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">Best quiz score: {progressData.bestQuizScore}%</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-border">
          {moduleNumber > 1 ? (
            <Link href={`/cmake-mastery/module/${moduleNumber - 1}`}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Module {moduleNumber - 1}
              </Button>
            </Link>
          ) : (
            <Link href="/cmake-mastery">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Course Overview
              </Button>
            </Link>
          )}

          {moduleNumber < 20 ? (
            <Link href={`/cmake-mastery/module/${moduleNumber + 1}`}>
              <Button>
                Module {moduleNumber + 1} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/cmake-mastery/dashboard">
              <Button className="bg-gradient-to-r from-amber-500 to-purple-600">
                <GraduationCap className="mr-2 h-4 w-4" /> View My Diploma
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
