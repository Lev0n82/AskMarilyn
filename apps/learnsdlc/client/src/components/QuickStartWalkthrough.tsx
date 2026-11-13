import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw,
  Layers,
  Code,
  TestTube,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalkthroughStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
  duration: number;
}

const steps: WalkthroughStep[] = [
  {
    id: 1,
    title: "The Problem",
    description: "Traditional tests break when UI changes. You spend more time fixing tests than finding bugs.",
    icon: <TestTube className="w-8 h-8" />,
    highlight: "bg-red-500/20 border-red-500",
    duration: 4000
  },
  {
    id: 2,
    title: "The ABT Solution",
    description: "Three layers separate WHAT you test from HOW you test it. UI changes? Update one place.",
    icon: <Layers className="w-8 h-8" />,
    highlight: "bg-blue-500/20 border-blue-500",
    duration: 4000
  },
  {
    id: 3,
    title: "Write Once, Reuse Forever",
    description: "Build test modules like LEGO blocks. Snap them together for any scenario.",
    icon: <Code className="w-8 h-8" />,
    highlight: "bg-teal-500/20 border-teal-500",
    duration: 4000
  },
  {
    id: 4,
    title: "Master the Craft",
    description: "Learn coding style, commenting, and technical writing. Become the developer everyone wants on their team.",
    icon: <Sparkles className="w-8 h-8" />,
    highlight: "bg-amber-500/20 border-amber-500",
    duration: 4000
  },
  {
    id: 5,
    title: "Start Your Journey",
    description: "Interactive quizzes, certificates, and a community of learners. Your path to excellence begins now.",
    icon: <CheckCircle className="w-8 h-8" />,
    highlight: "bg-green-500/20 border-green-500",
    duration: 4000
  }
];

export function QuickStartWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const stepDuration = steps[currentStep]?.duration || 4000;
    const intervalTime = 50;
    const increment = (intervalTime / stepDuration) * 100;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    const stepTimeout = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setProgress(0);
      } else {
        setCurrentStep(0);
        setProgress(0);
      }
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep, isPlaying]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(0);
    }
    setProgress(0);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const currentStepData = steps[currentStep];

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Play className="w-3 h-3" />
              Quick Start
            </Badge>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Main Content */}
        <div className="p-8 min-h-[280px] flex flex-col items-center justify-center text-center">
          <div 
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 transition-all duration-500",
              currentStepData.highlight
            )}
          >
            <div className="text-primary animate-pulse">
              {currentStepData.icon}
            </div>
          </div>
          
          <h3 className="font-display text-2xl font-bold mb-3 transition-all duration-300">
            {currentStepData.title}
          </h3>
          
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            {currentStepData.description}
          </p>

          {currentStep === steps.length - 1 && (
            <Button className="mt-6 gap-2" size="lg">
              Begin Module 1
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Step Indicators */}
        <div className="p-4 border-t bg-muted/20">
          <div className="flex justify-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentStep 
                    ? "bg-primary scale-125" 
                    : index < currentStep 
                      ? "bg-primary/50" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              />
            ))}
          </div>
          
          {/* Step Labels */}
          <div className="flex justify-between mt-4 px-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={cn(
                  "text-xs transition-all duration-300 max-w-[80px] text-center",
                  index === currentStep 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
