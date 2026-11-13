import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft, Brain, Lightbulb, Flame, Swords, FlaskConical, Sparkles, ChevronRight, Lock, CheckCircle2, Trophy, BookOpen, PenLine } from "lucide-react";
import { ModuleProgress } from "@/components/ModuleProgress";
import { TheSpark } from "@/components/grace/TheSpark";
import { TheGauntlet } from "@/components/grace/TheGauntlet";
import { TheCrucible } from "@/components/grace/TheCrucible";
import { TheImprint } from "@/components/grace/TheImprint";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getModuleImages } from "@/data/moduleImages";
import { Textarea } from "@/components/ui/textarea";

const TOTAL_GRACE_MODULES = 30;

// Full module content with four-part structure
export interface GraceModuleFullContent {
  moduleNumber: number;
  title: string;
  subtitle: string;
  track: "foundation" | "intermediate" | "advanced";
  
  // Ask Marilyn - Reader's Dilemma and Marilyn's Reply
  askMarilyn: {
    readerDilemma: string;
    marilynReply: string;
    keyQuote?: string;
  };
  
  // The Spark - 3 min reading
  spark: {
    title: string;
    content: string;
    keyInsight: string;
  };
  
  // The Gauntlet - 5 min quiz
  gauntlet: {
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  };
  
  // The Crucible - 5 min hands-on
  crucible: {
    scenario: string;
    task: string;
    hints: string[];
    sampleSolution: string;
    evaluationCriteria: string[];
  };
  
  // The Imprint - 2 min thought experiment
  imprint: {
    title: string;
    thoughtExperiment: string;
    visualAid?: string;
    visualAidAlt?: string;
    keyTakeaways: string[];
    memoryAnchor: string;
  };
  
  prevModule: { path: string; label: string };
  nextModule: { path: string; label: string };
}

// Module 1 full content as example
export const graceModulesFull: Record<number, GraceModuleFullContent> = {
  1: {
    moduleNumber: 1,
    title: "Introduction to Action-Based Testing",
    subtitle: "The foundation of structured test automation",
    track: "foundation",
    
    askMarilyn: {
      readerDilemma: `Dear Marilyn,

I work in software development, and our testing process is a mess. We have hundreds of automated tests, but every time the application changes, we spend more time fixing broken tests than we do developing new features. It feels like we're running on a hamster wheel—the more tests we write, the more maintenance we create. Is there a more logical way to approach test automation?

— Frustrated in Phoenix`,
      marilynReply: `Dear Frustrated,

Your predicament reminds me of a locksmith who creates a unique key for every door in a building. When a lock changes, they must recut that specific key. Multiply this by hundreds of doors, and you've created a maintenance nightmare.

The solution isn't to stop making keys—it's to create a master key system. In testing, this principle is called Action-Based Testing (ABT). Instead of encoding the mechanics of testing (click here, type there, wait for this), you encode the intent (login, add to cart, checkout).

The mechanics live in one place—the Action definition. When the application changes, you update one definition. All your tests continue to work. It's the difference between O(n) maintenance and O(1) maintenance.

The cost of test automation isn't in writing tests—it's in maintaining them. ABT shifts that cost from linear to constant.`,
      keyQuote: "The cost of test automation isn't in writing tests—it's in maintaining them."
    },
    
    spark: {
      title: "The Maintenance Trap",
      content: `
        <p>Imagine you're a locksmith who has created 500 different keys for 500 different doors. Every time a lock is changed, you must recut the key. Now imagine if, instead, you had a master key system where changing a lock only required updating one master template.</p>
        
        <p class="mt-4">This is the fundamental problem with traditional test automation. You've written 500 tests, each with its own hardcoded steps, selectors, and assumptions. When the application changes—and it will—you're recuting 500 keys.</p>
        
        <p class="mt-4"><strong>Action-Based Testing (ABT)</strong> introduces the master key concept to testing. Instead of encoding the mechanics of testing (click here, type there, wait for this), you encode the <em>intent</em> of testing (login, add to cart, checkout).</p>
        
        <p class="mt-4">The mechanics live in one place—the Action definition. The tests reference the Action by name. When the mechanics change, you update one definition. All 500 tests continue to work.</p>
      `,
      keyInsight: "The cost of test automation isn't in writing tests—it's in maintaining them. ABT shifts that cost from O(n) to O(1) by centralizing implementation details in reusable Actions."
    },
    
    gauntlet: {
      questions: [
        {
          id: 1,
          question: "What is the primary problem that Action-Based Testing solves?",
          options: [
            "Tests run too slowly",
            "Tests break when the application changes, requiring widespread updates",
            "Tests are too difficult to write initially",
            "Tests consume too much memory"
          ],
          correctIndex: 1,
          explanation: "ABT addresses the maintenance burden by centralizing implementation details in Actions, so changes only need to be made in one place."
        },
        {
          id: 2,
          question: "In the 'master key' analogy, what does the master key represent?",
          options: [
            "The test runner",
            "The application under test",
            "A reusable Action that encapsulates implementation details",
            "The test data"
          ],
          correctIndex: 2,
          explanation: "The master key represents an Action—a single definition that can be used across many tests, updated in one place when changes occur."
        },
        {
          id: 3,
          question: "What does ABT encode instead of mechanics?",
          options: [
            "Performance metrics",
            "Intent or business purpose",
            "Database queries",
            "Network requests"
          ],
          correctIndex: 1,
          explanation: "ABT focuses on encoding the intent (what you want to test) rather than the mechanics (how to interact with the UI)."
        },
        {
          id: 4,
          question: "How does ABT change the maintenance cost from O(n) to O(1)?",
          options: [
            "By running tests in parallel",
            "By reducing the number of tests",
            "By centralizing implementation details in reusable Actions",
            "By using faster programming languages"
          ],
          correctIndex: 2,
          explanation: "When implementation details live in one Action definition, updating that definition fixes all tests that use it—hence O(1) instead of O(n)."
        },
        {
          id: 5,
          question: "Which statement best describes the ABT philosophy?",
          options: [
            "Write fewer tests to reduce maintenance",
            "Separate what you're testing from how you're testing it",
            "Automate everything, including test creation",
            "Focus on UI testing over API testing"
          ],
          correctIndex: 1,
          explanation: "ABT's core philosophy is separation of concerns: the 'what' (business intent) from the 'how' (technical implementation)."
        }
      ]
    },
    
    crucible: {
      scenario: "You've inherited a test suite for an e-commerce application. The suite has 200 tests, and 150 of them start with the same login sequence: navigate to login page, enter username, enter password, click submit, wait for dashboard. The login page is being redesigned next sprint.",
      task: "Design an Action-Based approach to handle this situation. Describe: (1) What Action(s) you would create, (2) What parameters they would accept, (3) How the 150 tests would change.",
      hints: [
        "Think about what 'Login' means at a business level vs. technical level",
        "Consider what variations of login might exist (different users, remember me, etc.)",
        "The goal is to update ONE thing when the login page changes"
      ],
      sampleSolution: `Action: Login
Parameters: 
- username (string)
- password (string)  
- rememberMe (boolean, optional, default: false)

Implementation (hidden from tests):
1. Navigate to /login
2. Enter username in #username-field
3. Enter password in #password-field
4. If rememberMe, check #remember-checkbox
5. Click #submit-button
6. Wait for #dashboard to be visible

Test changes:
Before: 150 tests each with 6 steps
After: 150 tests each call Login(user, pass)

When login page changes:
- Update ONE Action definition
- Zero test changes required`,
      evaluationCriteria: [
        "Identified the need for a centralized Login Action",
        "Defined appropriate parameters for flexibility",
        "Explained how tests would reference the Action by name",
        "Demonstrated understanding that implementation changes stay in one place"
      ]
    },
    
    imprint: {
      title: "The Locksmith's Wisdom",
      thoughtExperiment: "Picture two locksmiths. The first creates a unique key for every door—500 doors, 500 keys, 500 potential points of failure. The second creates a master key system—one template, infinite doors, one point of control. When a lock changes, the first locksmith works overtime. The second updates one template and goes home for dinner. Which locksmith are you?",
      keyTakeaways: [
        "Traditional test automation creates 'unique keys'—each test encodes its own implementation details",
        "ABT creates 'master keys'—Actions that centralize implementation and can be reused across tests",
        "The cost of change in traditional automation is proportional to the number of tests (O(n))",
        "The cost of change in ABT is constant—update one Action, fix all tests (O(1))",
        "The choice between approaches determines whether automation is an asset or a liability"
      ],
      memoryAnchor: "One Action, One Update, Zero Test Changes"
    },
    
    prevModule: { path: "/grace-academy", label: "Course Overview" },
    nextModule: { path: "/grace-academy/module-2", label: "The Philosophy of ABT" }
  }
};

// Generate placeholder content for modules 2-30
for (let i = 2; i <= 30; i++) {
  const track = i <= 10 ? "foundation" : i <= 20 ? "intermediate" : "advanced";
  const trackNames = {
    foundation: "ABT Foundations",
    intermediate: "AI Agent Mastery", 
    advanced: "Enterprise Leadership"
  };
  
  graceModulesFull[i] = {
    moduleNumber: i,
    title: `Module ${i} Content`,
    subtitle: `${trackNames[track]} - Module ${i}`,
    track,
    askMarilyn: {
      readerDilemma: `Dear Marilyn,\n\nI'm working through Module ${i} of the ${trackNames[track]} track and I'm curious about the core concepts. What should I focus on to truly understand this material?\n\n— Eager Learner`,
      marilynReply: `Dear Eager Learner,\n\nModule ${i} builds upon the foundations you've established. The key is to understand not just the 'how' but the 'why' behind each concept.\n\nAs you progress through this module, pay attention to the patterns that emerge. They will serve you well in your testing journey.`,
      keyQuote: "Understanding the 'why' is more valuable than memorizing the 'how'."
    },
    spark: {
      title: `Core Concept ${i}`,
      content: `<p>This module's Spark content is being developed. Check back soon for the full learning experience.</p>`,
      keyInsight: "Content coming soon for this module."
    },
    gauntlet: {
      questions: [
        {
          id: 1,
          question: "Placeholder question for Module " + i,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0,
          explanation: "This is a placeholder question. Full quiz content coming soon."
        }
      ]
    },
    crucible: {
      scenario: "Scenario for Module " + i + " is being developed.",
      task: "Complete the hands-on challenge for this module.",
      hints: ["Hint 1", "Hint 2"],
      sampleSolution: "Sample solution coming soon.",
      evaluationCriteria: ["Criteria 1", "Criteria 2"]
    },
    imprint: {
      title: "Thought Experiment " + i,
      thoughtExperiment: "The thought experiment for this module is being crafted to ensure lasting retention.",
      keyTakeaways: ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
      memoryAnchor: "Memory anchor for Module " + i
    },
    prevModule: { 
      path: i === 1 ? "/grace-academy" : `/grace-academy/module-${i-1}`, 
      label: i === 1 ? "Course Overview" : `Module ${i-1}` 
    },
    nextModule: { 
      path: i === 30 ? "/grace-academy" : `/grace-academy/module-${i+1}`, 
      label: i === 30 ? "Complete Course" : `Module ${i+1}` 
    }
  };
}

type Section = "overview" | "spark" | "gauntlet" | "crucible" | "imprint" | "complete";

interface GraceModuleFullPageProps {
  moduleNumber: number;
}

// Section Navigation Component - appears at the end of each section
function SectionNavigation({ 
  sections, 
  currentSection, 
  completedSections,
  onNavigate 
}: { 
  sections: { id: Section; label: string; icon: React.ReactNode; time: string }[];
  currentSection: Section;
  completedSections: Set<Section>;
  onNavigate: (section: Section) => void;
}) {
  return (
    <Card className="bg-gradient-to-br from-secondary/50 to-secondary/30 border-border mt-8">
      <CardContent className="p-6">
        <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Your Learning Journey
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {sections.map((section, index) => {
            const isCompleted = completedSections.has(section.id);
            const isCurrent = currentSection === section.id;
            const isLocked = !isCompleted && !isCurrent && index > 0 && !completedSections.has(sections[index - 1].id);
            
            return (
              <button
                key={section.id}
                onClick={() => !isLocked && onNavigate(section.id)}
                disabled={isLocked}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-lg text-sm font-medium transition-all",
                  isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                  isCompleted && !isCurrent && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                  isLocked && "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60",
                  !isCurrent && !isCompleted && !isLocked && "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  {section.icon}
                  {isCompleted && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-3 w-3 text-green-600" />
                  )}
                  {isLocked && (
                    <Lock className="absolute -top-1 -right-1 h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <span className="text-xs text-center">{section.label}</span>
                <span className="text-[10px] opacity-70">({section.time})</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Document Enlightenment Component
function DocumentEnlightenment({ 
  moduleNumber, 
  onSave 
}: { 
  moduleNumber: number;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800 mt-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
            <PenLine className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-amber-800 dark:text-amber-200">Document Your Enlightenment</h3>
            <p className="text-sm text-amber-600 dark:text-amber-400">Capture your key insights and "aha" moments</p>
          </div>
        </div>
        
        <Textarea
          placeholder="What did you learn? What surprised you? How will you apply this knowledge?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] bg-white/80 dark:bg-gray-900/50 border-amber-200 dark:border-amber-800"
        />
        
        <div className="flex justify-between items-center">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Your notes are saved to your profile for future reference
          </p>
          <Button 
            onClick={handleSave}
            variant="outline" 
            className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            {saved ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Saved!
              </>
            ) : (
              <>
                <PenLine className="mr-2 h-4 w-4" /> Save Notes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GraceModuleFullPage({ moduleNumber }: GraceModuleFullPageProps) {
  const [currentSection, setCurrentSection] = useState<Section>("overview");
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());
  const [gauntletScore, setGauntletScore] = useState<{ score: number; total: number } | null>(null);
  const [crucibleComplete, setCrucibleComplete] = useState(false);
  
  const content = graceModulesFull[moduleNumber];
  const moduleImgs = getModuleImages(moduleNumber);

  usePageMeta({
    title: content ? `GRACE Module ${moduleNumber} - ${content.title}` : `GRACE Module ${moduleNumber}`,
    description: content ? `Educational module: ${content.subtitle}. Part of GRACE Academy professional certification program.` : 'GRACE Academy educational module.',
    keywords: 'GRACE Academy education, ABT certification, quality engineering training, professional development'
  });
  const completeSectionMutation = trpc.sections.complete.useMutation();
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);
  
  if (!content) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Module Not Found</h1>
          <p className="text-muted-foreground mt-2">Module {moduleNumber} content is coming soon.</p>
        </div>
      </Layout>
    );
  }

  const trackLabel = content.track === "foundation" ? "ABT Foundations" : 
                     content.track === "intermediate" ? "AI Agent Mastery" : "Enterprise Leadership";

  const sections: { id: Section; label: string; icon: React.ReactNode; time: string }[] = [
    { id: "overview", label: "Overview", icon: <Brain className="h-4 w-4" />, time: "1 min" },
    { id: "spark", label: "The Spark", icon: <Flame className="h-4 w-4" />, time: "3 min" },
    { id: "gauntlet", label: "The Gauntlet", icon: <Swords className="h-4 w-4" />, time: "5 min" },
    { id: "crucible", label: "The Crucible", icon: <FlaskConical className="h-4 w-4" />, time: "5 min" },
    { id: "imprint", label: "The Imprint", icon: <Sparkles className="h-4 w-4" />, time: "2 min" },
  ];

  const markSectionComplete = (section: Section) => {
    setCompletedSections(prev => new Set(Array.from(prev).concat(section)));
  };

  const handleOverviewComplete = () => {
    markSectionComplete("overview");
    setCurrentSection("spark");
  };

  const handleSparkComplete = () => {
    markSectionComplete("spark");
    setCurrentSection("gauntlet");
  };

  const handleGauntletComplete = (score: number, total: number) => {
    setGauntletScore({ score, total });
    if (score / total >= 0.8) {
      markSectionComplete("gauntlet");
      // Auto-advance if passed
      setTimeout(() => setCurrentSection("crucible"), 2000);
    }
  };

  const handleCrucibleComplete = () => {
    setCrucibleComplete(true);
    markSectionComplete("crucible");
    setCurrentSection("imprint");
  };

  const handleImprintComplete = async () => {
    markSectionComplete("imprint");
    // Record completion
    try {
      await completeSectionMutation.mutateAsync({
        courseId: "grace-academy",
        sectionPath: `module-${moduleNumber}`,
        sectionType: "lesson"
      });
    } catch (e) {
      console.error("Failed to record completion:", e);
    }
    setCurrentSection("complete");
  };

  const handleSaveNotes = (notes: string) => {
    // In a real implementation, this would save to the database
    console.log("Saving notes for module", moduleNumber, ":", notes);
  };

  const navigateToSection = (section: Section) => {
    setCurrentSection(section);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-sm font-sans text-accent font-bold uppercase tracking-wider">
              {trackLabel} • Module {content.moduleNumber}
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-1">
              {content.title}
            </h1>
            <p className="text-muted-foreground mt-1">{content.subtitle}</p>
          </div>
          <div className="hidden md:block">
            <ModuleProgress 
              moduleNumber={content.moduleNumber} 
              totalModules={TOTAL_GRACE_MODULES} 
              estimatedMinutes={15} 
            />
          </div>
        </div>

        {/* Section Content */}
        <div className="min-h-[500px]">
          {currentSection === "overview" && (
            <div className="space-y-8">
              {/* Primary Editorial Illustration */}
              {moduleImgs && (
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl paper-shadow border border-border">
                  <img 
                    src={moduleImgs.primary} 
                    alt={`Module ${moduleNumber} illustration`} 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Ask Marilyn Section */}
              <div className="space-y-6">
                {/* Reader's Dilemma */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">
                      The Reader's Dilemma
                    </h2>
                    <div className="relative pl-6 border-l-4 border-accent">
                      <div className="absolute -left-3 top-0 w-6 h-6 bg-accent rotate-45"></div>
                      <p className="font-sans text-card-foreground leading-relaxed whitespace-pre-line">
                        {content.askMarilyn.readerDilemma}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Marilyn's Reply */}
                <Card className="bg-secondary/30 border-border">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-bold text-primary border-b border-border pb-2 mb-4">
                      Marilyn's Reply
                    </h2>
                    <p className="font-sans text-foreground leading-relaxed whitespace-pre-line">
                      {content.askMarilyn.marilynReply}
                    </p>
                    {content.askMarilyn.keyQuote && (
                      <blockquote className="mt-4 p-4 bg-primary/5 border-l-4 border-primary italic font-serif text-lg">
                        "{content.askMarilyn.keyQuote}"
                      </blockquote>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Document Enlightenment */}
              <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

              {/* Section Navigation at End */}
              <SectionNavigation 
                sections={sections}
                currentSection={currentSection}
                completedSections={completedSections}
                onNavigate={navigateToSection}
              />

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleOverviewComplete}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue to The Spark <Flame className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {currentSection === "spark" && (
            <div className="space-y-6">
              <TheSpark 
                title={content.spark.title}
                content={content.spark.content}
                keyInsight={content.spark.keyInsight}
              />
              
              {/* Document Enlightenment */}
              <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

              {/* Section Navigation at End */}
              <SectionNavigation 
                sections={sections}
                currentSection={currentSection}
                completedSections={completedSections}
                onNavigate={navigateToSection}
              />

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSparkComplete}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Continue to The Gauntlet <Swords className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {currentSection === "gauntlet" && (
            <div className="space-y-6">
              <TheGauntlet 
                questions={content.gauntlet.questions}
                onComplete={handleGauntletComplete}
              />
              
              {gauntletScore && gauntletScore.score / gauntletScore.total >= 0.8 && (
                <>
                  {/* Achievement Unlocked */}
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="h-8 w-8 text-amber-500" />
                        <h3 className="text-xl font-serif font-bold text-green-800 dark:text-green-200">
                          Achievement Unlocked!
                        </h3>
                      </div>
                      <p className="text-green-700 dark:text-green-300">
                        You passed The Gauntlet with {Math.round(gauntletScore.score / gauntletScore.total * 100)}%! 
                        The Crucible is now unlocked.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Document Enlightenment */}
                  <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

                  {/* Section Navigation at End */}
                  <SectionNavigation 
                    sections={sections}
                    currentSection={currentSection}
                    completedSections={completedSections}
                    onNavigate={navigateToSection}
                  />
                </>
              )}
            </div>
          )}

          {currentSection === "crucible" && (
            <div className="space-y-6">
              <TheCrucible 
                scenario={content.crucible.scenario}
                task={content.crucible.task}
                hints={content.crucible.hints}
                sampleSolution={content.crucible.sampleSolution}
                evaluationCriteria={content.crucible.evaluationCriteria}
                onComplete={handleCrucibleComplete}
              />
              
              {/* Document Enlightenment */}
              <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

              {/* Section Navigation at End */}
              <SectionNavigation 
                sections={sections}
                currentSection={currentSection}
                completedSections={completedSections}
                onNavigate={navigateToSection}
              />
            </div>
          )}

          {currentSection === "imprint" && (
            <div className="space-y-6">
              <TheImprint 
                title={content.imprint.title}
                thoughtExperiment={content.imprint.thoughtExperiment}
                visualAid={content.imprint.visualAid}
                visualAidAlt={content.imprint.visualAidAlt}
                keyTakeaways={content.imprint.keyTakeaways}
                memoryAnchor={content.imprint.memoryAnchor}
                onComplete={handleImprintComplete}
              />
              
              {/* Document Enlightenment */}
              <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

              {/* Section Navigation at End */}
              <SectionNavigation 
                sections={sections}
                currentSection={currentSection}
                completedSections={completedSections}
                onNavigate={navigateToSection}
              />
            </div>
          )}

          {currentSection === "complete" && (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                
                <div>
                  <h2 className="text-3xl font-serif font-bold text-green-800 dark:text-green-200">Module Complete!</h2>
                  <p className="text-green-700 dark:text-green-300 mt-2">
                    You've earned <span className="font-bold">100 points</span> and unlocked the next module.
                  </p>
                </div>

                {/* Badge Award */}
                {moduleImgs && (
                  <div className="bg-white/80 dark:bg-gray-900/50 p-6 rounded-xl border border-green-200 dark:border-green-800 space-y-4">
                    <h3 className="text-lg font-serif font-bold text-green-800 dark:text-green-200">Badge Unlocked!</h3>
                    <div className="relative w-32 h-32 mx-auto">
                      <img 
                        src={moduleImgs.badge} 
                        alt={moduleImgs.badgeTitle}
                        className="w-full h-full object-cover rounded-lg shadow-lg ring-4 ring-amber-400 ring-offset-2"
                      />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">{moduleImgs.badgeTitle}</p>
                    <p className="text-xs text-muted-foreground">This badge has been added to your profile!</p>
                  </div>
                )}

                {gauntletScore && (
                  <div className="bg-white/70 dark:bg-gray-900/30 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Quiz Score: {gauntletScore.score}/{gauntletScore.total} ({Math.round(gauntletScore.score / gauntletScore.total * 100)}%)
                    </p>
                  </div>
                )}

                {/* Final Document Enlightenment */}
                <DocumentEnlightenment moduleNumber={moduleNumber} onSave={handleSaveNotes} />

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href={content.nextModule.path}>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Continue to {content.nextModule.label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Navigation */}
        {currentSection !== "complete" && (
          <div className="flex justify-between pt-8 border-t border-border">
            <Link href={content.prevModule.path}>
              <Button variant="ghost" className="font-sans">
                <ArrowLeft className="mr-2 h-4 w-4" /> {content.prevModule.label}
              </Button>
            </Link>
            <Link href={content.nextModule.path}>
              <Button variant="outline" className="font-sans">
                Skip to {content.nextModule.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
