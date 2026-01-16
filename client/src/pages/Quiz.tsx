import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { CheckCircle, XCircle, RefreshCw, Home, ArrowRight, ArrowLeft, Award } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SocialShare } from "@/components/SocialShare";
import { FeedbackForm } from "@/components/FeedbackForm";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const questions = [
  {
    id: 1,
    question: "What is the primary goal of Action-Based Testing?",
    options: [
      { id: "a", text: "To write as many test scripts as possible." },
      { id: "b", text: "To organize tests into reusable, logical actions." },
      { id: "c", text: "To eliminate the need for manual testing entirely." },
      { id: "d", text: "To make tests look like complex code." },
    ],
    correct: "b",
    explanation: "Correct! ABT focuses on modularity and reusability to make testing maintainable."
  },
  {
    id: 2,
    question: "Which layer of the ABT hierarchy handles direct UI interactions?",
    options: [
      { id: "a", text: "High-Level Actions" },
      { id: "b", text: "Mid-Level Actions" },
      { id: "c", text: "Low-Level Actions" },
      { id: "d", text: "The Business Layer" },
    ],
    correct: "c",
    explanation: "Correct! Low-Level Actions are the only place where UI details (like clicks and typing) should reside."
  },
  {
    id: 3,
    question: "Why is the 'Enter, Enter, Click' approach considered an anti-pattern?",
    options: [
      { id: "a", text: "It is too fast for the computer to process." },
      { id: "b", text: "It makes tests brittle and hard to maintain when the UI changes." },
      { id: "c", text: "It doesn't use enough keyboard shortcuts." },
      { id: "d", text: "It is not detailed enough." },
    ],
    correct: "b",
    explanation: "Correct! Over-specifying mechanics makes tests break easily. Focus on the intent instead."
  },
  {
    id: 4,
    question: "What is the difference between Business Objects and Business Flows?",
    options: [
      { id: "a", text: "Objects are for developers, Flows are for testers." },
      { id: "b", text: "Objects focus on entities (like Invoices), Flows focus on processes (like Ordering)." },
      { id: "c", text: "There is no difference; they are synonyms." },
      { id: "d", text: "Flows are always automated, Objects are always manual." },
    ],
    correct: "b",
    explanation: "Correct! Business Objects handle entity-specific actions (CRUD), while Business Flows connect multiple objects to achieve a goal."
  },
  {
    id: 5,
    question: "Why do we use Interface Definitions (The Rosetta Stone)?",
    options: [
      { id: "a", text: "To make the code look more complex." },
      { id: "b", text: "To translate logical names (Submit Button) to technical IDs (#btn_submit)." },
      { id: "c", text: "To prevent developers from changing the code." },
      { id: "d", text: "To speed up the test execution time." },
    ],
    correct: "b",
    explanation: "Correct! Interface Definitions decouple the test from the implementation, allowing the UI to change without breaking the test logic."
  },
  // Module 6: Test Life-Cycle
  {
    id: 6,
    question: "In ABT, which three parallel life-cycles must be managed?",
    options: [
      { id: "a", text: "Design, Code, Deploy" },
      { id: "b", text: "System Under Test, Test Development, Test Automation" },
      { id: "c", text: "Plan, Execute, Report" },
      { id: "d", text: "Unit, Integration, System" },
    ],
    correct: "b",
    explanation: "Correct! ABT manages three parallel life-cycles: the System Under Test (what you're testing), Test Development (creating test cases), and Test Automation (implementing automated tests)."
  },
  {
    id: 7,
    question: "When should test automation development ideally begin in an Agile sprint?",
    options: [
      { id: "a", text: "After the feature is fully deployed to production" },
      { id: "b", text: "In parallel with feature development, starting with high-level actions" },
      { id: "c", text: "Only after all manual testing is complete" },
      { id: "d", text: "Before the sprint planning meeting" },
    ],
    correct: "b",
    explanation: "Correct! In Agile, test automation should begin in parallel with development. High-level actions can be defined early, with low-level implementation following as the UI stabilizes."
  },
  // Module 7: Building Test Modules
  {
    id: 8,
    question: "What is a Test Module in ABT?",
    options: [
      { id: "a", text: "A single automated test script" },
      { id: "b", text: "A spreadsheet-like container that groups related test cases" },
      { id: "c", text: "A programming library for testing" },
      { id: "d", text: "A report generated after test execution" },
    ],
    correct: "b",
    explanation: "Correct! A Test Module is a container (often spreadsheet-like) that groups related test cases, typically organized around a Business Object or Business Flow."
  },
  {
    id: 9,
    question: "What is the purpose of the 'Test Objective' in a test case?",
    options: [
      { id: "a", text: "To describe the technical implementation details" },
      { id: "b", text: "To clearly state what the test is trying to verify" },
      { id: "c", text: "To list all the bugs found" },
      { id: "d", text: "To assign the test to a specific tester" },
    ],
    correct: "b",
    explanation: "Correct! The Test Objective clearly states the purpose of the test - what behavior or requirement is being verified."
  },
  // Module 8: Advanced Techniques
  {
    id: 10,
    question: "What are 'Variations' in ABT used for?",
    options: [
      { id: "a", text: "To create random test data" },
      { id: "b", text: "To handle multiple versions or configurations of the same application" },
      { id: "c", text: "To make tests run faster" },
      { id: "d", text: "To generate test reports" },
    ],
    correct: "b",
    explanation: "Correct! Variations allow you to maintain a single test suite that works across multiple versions, platforms, or configurations of your application."
  },
  {
    id: 11,
    question: "When should you use regular expressions in ABT?",
    options: [
      { id: "a", text: "For all text comparisons to be safe" },
      { id: "b", text: "When verifying dynamic content like timestamps or generated IDs" },
      { id: "c", text: "Never - they are too complex" },
      { id: "d", text: "Only in low-level actions" },
    ],
    correct: "b",
    explanation: "Correct! Regular expressions are useful for verifying content that changes (like dates, IDs, or timestamps) while still validating the format and structure."
  },
  // Module 9: Anti-Pattern Gallery
  {
    id: 12,
    question: "What is the 'Lifeless' anti-pattern?",
    options: [
      { id: "a", text: "Tests that run too slowly" },
      { id: "b", text: "Tests that have no checks or verifications" },
      { id: "c", text: "Tests that use too many variables" },
      { id: "d", text: "Tests that are too short" },
    ],
    correct: "b",
    explanation: "Correct! A 'Lifeless' test performs actions but never verifies the results. It's like going through the motions without actually checking if anything worked."
  },
  {
    id: 13,
    question: "What is the 'Swiss Army Knife' anti-pattern?",
    options: [
      { id: "a", text: "Using too many different testing tools" },
      { id: "b", text: "Creating an action that tries to do too many things" },
      { id: "c", text: "Having too many test cases" },
      { id: "d", text: "Testing on multiple browsers" },
    ],
    correct: "b",
    explanation: "Correct! A 'Swiss Army Knife' action tries to do everything - it has too many parameters and responsibilities. Actions should be focused and single-purpose."
  },
  // Module 10: Test Design Template
  {
    id: 14,
    question: "According to the Test Design Template, which category tests how the system handles invalid inputs?",
    options: [
      { id: "a", text: "Happy Path Testing" },
      { id: "b", text: "Negative Testing" },
      { id: "c", text: "Performance Testing" },
      { id: "d", text: "Integration Testing" },
    ],
    correct: "b",
    explanation: "Correct! Negative Testing verifies that the system properly handles invalid inputs, error conditions, and boundary cases."
  },
  {
    id: 15,
    question: "What is the benefit of organizing tests by Business Objects?",
    options: [
      { id: "a", text: "It makes the code run faster" },
      { id: "b", text: "It creates a natural, maintainable structure that mirrors the domain" },
      { id: "c", text: "It reduces the number of tests needed" },
      { id: "d", text: "It eliminates the need for documentation" },
    ],
    correct: "b",
    explanation: "Correct! Organizing by Business Objects (like Customer, Invoice, Product) creates a structure that mirrors how the business thinks about the system, making tests easier to find and maintain."
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { saveQuizScore } = useProgress();
  const { isAuthenticated } = useAuth();
  const awardBadgeMutation = trpc.badges.awardBadge.useMutation();
  const recordActivityMutation = trpc.streaks.recordActivity.useMutation();
  const sendCompletionMutation = trpc.courseCompletion.sendCompletionEmail.useMutation();

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const isCorrect = selectedOption === questions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      const finalScore = score + (selectedOption === questions[currentQuestion].correct ? 1 : 0);
      setShowResults(true);
      saveQuizScore(finalScore);
      
      // Award badges if authenticated
      if (isAuthenticated) {
        if (finalScore === questions.length) {
          awardBadgeMutation.mutate({ badgeType: "perfect_quiz" }, {
            onSuccess: (data) => {
              const result = data.result as { alreadyAwarded?: boolean } | undefined;
              if (!result?.alreadyAwarded) {
                toast.success("🏆 Badge Earned: Quiz Master!", {
                  description: "You scored 100% on the Final Assessment!",
                });
              }
            }
          });
        }
        if (finalScore >= questions.length * 0.9) {
          awardBadgeMutation.mutate({ badgeType: "master_logician" }, {
            onSuccess: (data) => {
              const result = data.result as { alreadyAwarded?: boolean } | undefined;
              if (!result?.alreadyAwarded) {
                toast.success("👑 Badge Earned: Master Logician!", {
                  description: "You achieved 90%+ overall course score!",
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
            } else if (data && data.isNewStreak) {
              toast.info(`🔥 ${data.currentStreak} day streak!`, {
                description: "Keep learning daily to earn the Streak Master badge!",
              });
            }
          }
        });
        
        // Send course completion notification if passed
        if (finalScore >= 3) {
          sendCompletionMutation.mutate({
            quizScore: finalScore,
            totalModules: 5,
          });
        }
      }
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary">Assessment Complete</h1>
          <p className="text-xl font-sans">
            You scored <span className="font-bold text-accent">{score}</span> out of <span className="font-bold">{questions.length}</span>
          </p>
          
          <div className="bg-card p-8 rounded-xl border border-border paper-shadow space-y-8">
            <p className="font-serif italic text-lg text-muted-foreground">
              {score === questions.length 
                ? "\"Logic is the anatomy of thought.\" - You have demonstrated a strong understanding of Action-Based Testing principles."
                : "\"Success is achieved by developing our strengths, not by eliminating our weaknesses.\" - Review the modules and try again to master the logic."}
            </p>
            
            <SocialShare score={score} total={questions.length} type="quiz" />
            
            <div className="flex justify-center gap-4">
              <Button onClick={handleRestart} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Quiz
              </Button>
              <Link href="/">
                <Button>
                  <Home className="mr-2 h-4 w-4" /> Return Home
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <FeedbackForm />
          </div>
        </div>
      </Layout>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">Final Assessment</p>
            <h1 className="text-3xl font-serif font-bold text-primary mt-1">Test Your Logic</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>

        <Card className="border-border paper-shadow">
          <CardContent className="p-8">
            <h2 className="text-xl font-serif font-bold mb-6">{question.question}</h2>
            
            <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} disabled={isSubmitted}>
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div key={option.id} className={cn(
                    "flex items-center space-x-3 border border-border rounded-lg p-4 transition-colors",
                    selectedOption === option.id && "border-primary bg-primary/5",
                    isSubmitted && option.id === question.correct && "border-green-500 bg-green-50",
                    isSubmitted && selectedOption === option.id && selectedOption !== question.correct && "border-destructive bg-destructive/5"
                  )}>
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer font-sans text-base">
                      {option.text}
                    </Label>
                    {isSubmitted && option.id === question.correct && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {isSubmitted && selectedOption === option.id && selectedOption !== question.correct && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>

            {isSubmitted && (
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in">
                <p className="font-sans text-sm">
                  <span className="font-bold">Explanation:</span> {question.explanation}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              {!isSubmitted ? (
                <Button onClick={handleSubmit} disabled={!selectedOption} className="font-serif px-8">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="font-serif px-8">
                  {currentQuestion < questions.length - 1 ? "Next Question" : "View Results"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between pt-8 border-t border-border">
          <Link href="/boss-level">
            <Button variant="ghost" className="font-sans">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous: Architect's Challenge
            </Button>
          </Link>
          <Link href="/certificate">
            <Button className="font-serif bg-primary text-primary-foreground px-8">
              Get Your Certificate <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
