import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, BookOpen, Clock, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

// Module metadata for ABT Fundamentals
const ABT_MODULES = [
  { id: 1, title: "The Testing Paradox", path: "/module-1", estimatedMinutes: 4 },
  { id: 2, title: "The Three Layers", path: "/module-2", estimatedMinutes: 5 },
  { id: 3, title: "Anti-Patterns", path: "/module-3", estimatedMinutes: 4 },
  { id: 4, title: "Architecture", path: "/module-4", estimatedMinutes: 5 },
  { id: 5, title: "Language of Logic", path: "/module-5", estimatedMinutes: 4 },
  { id: 6, title: "Test Life-Cycle", path: "/module-6", estimatedMinutes: 6 },
  { id: 7, title: "Building Test Modules", path: "/module-7", estimatedMinutes: 7 },
  { id: 8, title: "Advanced Techniques", path: "/module-8", estimatedMinutes: 6 },
  { id: 9, title: "Anti-Pattern Gallery", path: "/module-9", estimatedMinutes: 5 },
  { id: 10, title: "Test Design Template", path: "/module-10", estimatedMinutes: 6 },
];

// Bonus courses
const BONUS_COURSES = [
  { id: "coding-style", title: "C# Coding Style Guide", path: "/coding-style-guide", estimatedMinutes: 90 },
  { id: "commenting", title: "The Fine Art of Commenting", path: "/commenting-guide", estimatedMinutes: 60 },
  { id: "technical-writing", title: "Technical Writing Made Easier", path: "/technical-writing-guide", estimatedMinutes: 120 },
];

interface ResumeData {
  courseName: string;
  moduleTitle: string;
  modulePath: string;
  progress: number;
  estimatedMinutes: number;
  isNewUser: boolean;
}

interface CourseProgressItem {
  courseId: string;
  topicsCompleted: number;
  totalTopics: number;
}

function getResumeDataFromProgress(progressData: CourseProgressItem[] | undefined): ResumeData | null {
  // Check if user has any progress
  if (!progressData || progressData.length === 0) {
    return {
      courseName: "ABT Fundamentals",
      moduleTitle: "The Testing Paradox",
      modulePath: "/module-1",
      progress: 0,
      estimatedMinutes: 4,
      isNewUser: true
    };
  }

  // Find ABT progress
  const abtProgress = progressData.find(p => p.courseId === "abt-fundamentals");
  const abtCompleted = abtProgress && abtProgress.topicsCompleted >= abtProgress.totalTopics;
  
  if (!abtCompleted) {
    // Calculate which module to resume
    const completedModules = abtProgress?.topicsCompleted || 0;
    const nextModuleIndex = Math.min(completedModules, ABT_MODULES.length - 1);
    const nextModule = ABT_MODULES[nextModuleIndex];
    
    return {
      courseName: "ABT Fundamentals",
      moduleTitle: nextModule.title,
      modulePath: nextModule.path,
      progress: Math.round((completedModules / ABT_MODULES.length) * 100),
      estimatedMinutes: nextModule.estimatedMinutes,
      isNewUser: completedModules === 0
    };
  }

  // ABT is complete, check bonus courses
  for (const course of BONUS_COURSES) {
    const courseProgress = progressData.find(p => p.courseId === course.id);
    const courseCompleted = courseProgress && courseProgress.topicsCompleted >= courseProgress.totalTopics;
    if (!courseCompleted) {
      return {
        courseName: course.title,
        moduleTitle: "Continue Learning",
        modulePath: course.path,
        progress: 100, // ABT is complete
        estimatedMinutes: course.estimatedMinutes,
        isNewUser: false
      };
    }
  }

  // All courses complete
  return null;
}

export function ResumeLearning() {
  const { user, isAuthenticated } = useAuth();
  
  // Get user's learning progress
  const { data: progressData, isLoading } = trpc.progress.getCourseProgress.useQuery(
    {},
    { enabled: isAuthenticated }
  );

  // For non-authenticated users, show a simple start button
  if (!isAuthenticated) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Ready to Start Learning?</h3>
                <p className="text-sm text-muted-foreground">
                  Begin with ABT Fundamentals — the foundation of quality testing
                </p>
              </div>
            </div>
            <Link href="/module-1">
              <Button className="gap-2">
                Start Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/20 animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const resumeData = getResumeDataFromProgress(progressData);

  // All courses complete
  if (!resumeData) {
    return (
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-green-700">All Courses Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Congratulations! You've mastered all available courses.
                </p>
              </div>
            </div>
            <Link href="/learning-progress">
              <Button variant="outline" className="gap-2">
                View Progress
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {resumeData.isNewUser ? "Start Your Journey" : "Resume Learning"}
              </p>
              <h3 className="font-display font-bold text-lg">{resumeData.courseName}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>{resumeData.moduleTitle}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{resumeData.estimatedMinutes} min
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!resumeData.isNewUser && (
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">ABT Progress</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${resumeData.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{resumeData.progress}%</span>
                </div>
              </div>
            )}
            <Link href={resumeData.modulePath}>
              <Button className="gap-2">
                {resumeData.isNewUser ? "Start Learning" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
