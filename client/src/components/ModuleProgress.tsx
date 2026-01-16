import { Clock } from "lucide-react";

interface ModuleProgressProps {
  moduleNumber: number;
  totalModules: number;
  estimatedMinutes: number;
  courseName?: string;
}

export function ModuleProgress({ 
  moduleNumber, 
  totalModules, 
  estimatedMinutes,
  courseName = "ABT Fundamentals"
}: ModuleProgressProps) {
  const progressPercent = Math.round((moduleNumber / totalModules) * 100);
  
  return (
    <div className="flex flex-col items-end gap-1">
      <p className="text-sm text-muted-foreground">
        Module {moduleNumber} of {totalModules}
      </p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>~{estimatedMinutes} min read</span>
      </div>
      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
        <div 
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

// Estimated reading times for each module (in minutes)
export const MODULE_READING_TIMES: Record<number, number> = {
  1: 4,   // The Testing Paradox
  2: 5,   // The Three Layers
  3: 4,   // Anti-Patterns
  4: 5,   // Architecture
  5: 4,   // Language of Logic
  6: 6,   // Test Life-Cycle
  7: 7,   // Building Test Modules
  8: 6,   // Advanced Techniques
  9: 5,   // Anti-Pattern Gallery
  10: 6,  // Test Design Template
};

// Total modules in ABT Fundamentals course
export const TOTAL_ABT_MODULES = 10;
