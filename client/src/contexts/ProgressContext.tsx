import React, { createContext, useContext, useEffect, useState } from "react";

interface ProgressState {
  completedModules: string[];
  quizScore: number | null;
  refactoringScore: number | null;
  bossScore: number | null;
}

interface ProgressContextType {
  progress: ProgressState;
  markModuleComplete: (moduleId: string) => void;
  saveQuizScore: (score: number) => void;
  saveRefactoringScore: (score: number) => void;
  saveBossScore: (score: number) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem("abt-course-progress");
    return saved
      ? JSON.parse(saved)
      : { completedModules: [], quizScore: null, refactoringScore: null, bossScore: null };
  });

  useEffect(() => {
    localStorage.setItem("abt-course-progress", JSON.stringify(progress));
  }, [progress]);

  const markModuleComplete = (moduleId: string) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleId)) return prev;
      return { ...prev, completedModules: [...prev.completedModules, moduleId] };
    });
  };

  const saveQuizScore = (score: number) => {
    setProgress((prev) => ({ ...prev, quizScore: score }));
  };

  const saveRefactoringScore = (score: number) => {
    setProgress((prev) => ({ ...prev, refactoringScore: score }));
  };

  const saveBossScore = (score: number) => {
    setProgress((prev) => ({ ...prev, bossScore: score }));
  };

  const resetProgress = () => {
    setProgress({ completedModules: [], quizScore: null, refactoringScore: null, bossScore: null });
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markModuleComplete,
        saveQuizScore,
        saveRefactoringScore,
        saveBossScore,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
