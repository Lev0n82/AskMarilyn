import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link, useParams } from "wouter";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Target,
  Award,
  Brain,
  CheckCircle2,
  Clock,
  ImageIcon,
  GraduationCap
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

// Quiz Component - The Gauntlet
function TheGauntlet({ moduleId, onComplete }: { moduleId: number; onComplete: () => void }) {
  const { data: questions, isLoading } = trpc.graceAcademy.quiz.getQuestions.useQuery({ moduleId });
  const submitQuiz = trpc.graceAcademy.quiz.submit.useMutation();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [startTime] = useState(Date.now());

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
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const validAnswers = answers.filter((a): a is number => a !== null);
    if (validAnswers.length !== 5) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    try {
      const result = await submitQuiz.mutateAsync({
        moduleId,
        answers: validAnswers,
        timeTaken,
      });
      
      setResults(result);
      setSubmitted(true);
      
      if (result.passed) {
        toast.success(`Congratulations! You scored ${result.score}/5!`);
        onComplete();
      } else {
        toast.error(`You scored ${result.score}/5. You need 3/5 to pass.`);
      }
      
      if (result.certificatesAwarded?.length > 0) {
        result.certificatesAwarded.forEach((cert: string) => {
          toast.success(`🎉 You earned the ${cert.replace('_', ' ').toUpperCase()} certificate!`);
        });
      }
    } catch (error) {
      toast.error("Failed to submit quiz. Please try again.");
    }
  };

  const handleRetake = () => {
    setAnswers([null, null, null, null, null]);
    setCurrentQuestion(0);
    setSubmitted(false);
    setResults(null);
  };

  if (submitted && results) {
    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-xl ${results.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-2 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.score}/5
            </div>
            <p className={`text-lg ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
              {results.passed ? 'Congratulations! You passed!' : 'Keep learning and try again!'}
            </p>
          </div>
        </div>
        
        {!results.passed && (
          <Button onClick={handleRetake} className="w-full">
            Retake Quiz
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of 5</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                answers[idx] !== null ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedAnswer === idx
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion < 4 ? (
          <Button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={selectedAnswer === null}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={answers.some(a => a === null) || submitQuiz.isPending}
          >
            {submitQuiz.isPending ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
}

// Crucible Component - The Crucible
function TheCrucible({ moduleId, onComplete }: { moduleId: number; onComplete: () => void }) {
  const { data: challenge, isLoading } = trpc.graceAcademy.crucible.getChallenge.useQuery({ moduleId });
  const submitCrucible = trpc.graceAcademy.crucible.submit.useMutation();
  const [submission, setSubmission] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>The Crucible challenge is being prepared for this module.</p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (submission.length < 50) {
      toast.error("Please write at least 50 characters");
      return;
    }

    try {
      const result = await submitCrucible.mutateAsync({
        moduleId,
        submission,
      });
      
      toast.success("Your response has been submitted!");
      onComplete();
      
      if (result.certificatesAwarded?.length > 0) {
        result.certificatesAwarded.forEach((cert: string) => {
          toast.success(`🎉 You earned the ${cert.replace('_', ' ').toUpperCase()} certificate!`);
        });
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-6">
          <h3 className="font-serif font-bold text-lg mb-3">The Challenge:</h3>
          <Streamdown>{challenge.challengePrompt}</Streamdown>
        </CardContent>
      </Card>

      <div>
        <label className="block text-sm font-medium mb-2">Your Response:</label>
        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          className="w-full h-48 p-4 border rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Write your response here... (minimum 50 characters)"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {submission.length}/50 characters minimum
        </p>
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={submission.length < 50 || submitCrucible.isPending}
        className="w-full"
      >
        {submitCrucible.isPending ? 'Submitting...' : 'Submit Response'}
      </Button>
    </div>
  );
}

export default function GraceModule() {
  const params = useParams<{ moduleNumber: string }>();
  const moduleNumber = parseInt(params.moduleNumber || '1', 10);
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { data: moduleData, isLoading } = trpc.graceAcademy.modules.getByNumber.useQuery({ moduleNumber });
  const { data: progressData, refetch: refetchProgress } = trpc.graceAcademy.progress.forModule.useQuery(
    { moduleId: moduleNumber },
    { enabled: isAuthenticated }
  );
  const markComplete = trpc.graceAcademy.progress.markComplete.useMutation();
  
  const [activeTab, setActiveTab] = useState('spark');

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, authLoading]);

  const handleSectionComplete = async (section: 'spark' | 'gauntlet' | 'crucible' | 'imprint') => {
    if (!isAuthenticated) return;
    
    try {
      const result = await markComplete.mutateAsync({ moduleId: moduleNumber, section });
      refetchProgress();
      
      if (result.certificatesAwarded?.length > 0) {
        result.certificatesAwarded.forEach((cert: string) => {
          toast.success(`🎉 You earned the ${cert.replace('_', ' ').toUpperCase()} certificate!`);
        });
      }
    } catch (error) {
      console.error('Failed to mark section complete:', error);
    }
  };

  if (isLoading || authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!moduleData?.module) {
    return (
      <Layout>
        <div className="text-center py-24">
          <h1 className="text-2xl font-serif mb-4">Module Not Found</h1>
          <Link href="/grace-academy">
            <Button>Back to GRACE Academy</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const { module } = moduleData;
  const track = module.track;
  const trackColor = track === 'foundation' ? 'blue' : track === 'intermediate' ? 'amber' : 'purple';

  return (
    <Layout>
      <div className="space-y-8">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${trackColor}-500/20 text-${trackColor}-600`}>
                {track.charAt(0).toUpperCase() + track.slice(1)} Track
              </span>
              <span className="text-xs text-muted-foreground">Module {moduleNumber}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">{module.title}</h1>
            {module.subtitle && (
              <p className="text-lg text-muted-foreground mt-1">{module.subtitle}</p>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~{module.estimatedMinutes || 15} min</span>
            </div>
            {progressData?.moduleCompleted ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Module Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="spark" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">The Spark</span>
              {progressData?.sparkCompleted ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : null}
            </TabsTrigger>
            <TabsTrigger value="gauntlet" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">The Gauntlet</span>
              {progressData?.gauntletCompleted ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : null}
            </TabsTrigger>
            <TabsTrigger value="crucible" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">The Crucible</span>
              {progressData?.crucibleCompleted ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : null}
            </TabsTrigger>
            <TabsTrigger value="imprint" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">The Imprint</span>
              {progressData?.imprintCompleted ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : null}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="spark" className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Spark</h2>
                <p className="text-sm text-muted-foreground">3-minute reading</p>
              </div>
            </div>
            
            {module.sparkContent ? (
              <div className="prose prose-lg max-w-none">
                <Streamdown>{module.sparkContent}</Streamdown>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Content is being prepared for this module.</p>
              </div>
            )}

            {module.visualAidDescription && (
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Visual Aid</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{module.visualAidDescription}</p>
                </CardContent>
              </Card>
            )}

            {!progressData?.sparkCompleted && (
              <Button 
                onClick={() => {
                  handleSectionComplete('spark');
                  setActiveTab('gauntlet');
                }}
                className="w-full"
              >
                Mark as Complete & Continue
              </Button>
            )}
          </TabsContent>

          <TabsContent value="gauntlet">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Gauntlet</h2>
                <p className="text-sm text-muted-foreground">5-minute quiz</p>
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

          <TabsContent value="crucible">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Crucible</h2>
                <p className="text-sm text-muted-foreground">5-minute challenge</p>
              </div>
            </div>
            
            <TheCrucible 
              moduleId={moduleNumber} 
              onComplete={() => {
                refetchProgress();
                setActiveTab('imprint');
              }} 
            />
          </TabsContent>

          <TabsContent value="imprint" className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-serif">The Imprint</h2>
                <p className="text-sm text-muted-foreground">2-minute thought experiment</p>
              </div>
            </div>
            
            {module.imprintContent ? (
              <div className="prose prose-lg max-w-none">
                <Streamdown>{module.imprintContent}</Streamdown>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>The Imprint is being prepared for this module.</p>
              </div>
            )}

            {!progressData?.imprintCompleted && (
              <Button 
                onClick={() => handleSectionComplete('imprint')}
                className="w-full"
              >
                Complete Module
              </Button>
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between pt-8 border-t border-border">
          {moduleNumber > 1 ? (
            <Link href={`/grace-academy/module-${moduleNumber - 1}`}>
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous Module
              </Button>
            </Link>
          ) : (
            <Link href="/grace-academy">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" /> Course Overview
              </Button>
            </Link>
          )}
          
          {moduleNumber < 30 ? (
            <Link href={`/grace-academy/module-${moduleNumber + 1}`}>
              <Button>
                Next Module <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/grace-academy/diploma">
              <Button className="bg-gradient-to-r from-amber-500 to-purple-600">
                <GraduationCap className="mr-2 h-4 w-4" /> View Diploma
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
