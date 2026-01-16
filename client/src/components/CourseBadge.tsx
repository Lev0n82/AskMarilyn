import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  Code, 
  MessageSquare, 
  FileText, 
  Trophy,
  Lock
} from "lucide-react";

interface CourseBadgeProps {
  courseId: string;
  courseName: string;
  isEarned: boolean;
  earnedAt?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const courseIcons: Record<string, React.ReactNode> = {
  "abt-fundamentals": <GraduationCap className="w-full h-full" />,
  "coding-style": <Code className="w-full h-full" />,
  "commenting": <MessageSquare className="w-full h-full" />,
  "technical-writing": <FileText className="w-full h-full" />,
  "all-courses": <Trophy className="w-full h-full" />
};

const courseColors: Record<string, { bg: string; border: string; text: string }> = {
  "abt-fundamentals": { 
    bg: "bg-gradient-to-br from-blue-500 to-indigo-600", 
    border: "border-blue-400",
    text: "text-blue-600"
  },
  "coding-style": { 
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600", 
    border: "border-emerald-400",
    text: "text-emerald-600"
  },
  "commenting": { 
    bg: "bg-gradient-to-br from-amber-500 to-orange-600", 
    border: "border-amber-400",
    text: "text-amber-600"
  },
  "technical-writing": { 
    bg: "bg-gradient-to-br from-purple-500 to-pink-600", 
    border: "border-purple-400",
    text: "text-purple-600"
  },
  "all-courses": { 
    bg: "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600", 
    border: "border-yellow-400",
    text: "text-yellow-600"
  }
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24"
};

const iconSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12"
};

export function CourseBadge({ 
  courseId, 
  courseName, 
  isEarned, 
  earnedAt,
  size = "md",
  showLabel = true
}: CourseBadgeProps) {
  const icon = courseIcons[courseId] || <GraduationCap className="w-full h-full" />;
  const colors = courseColors[courseId] || courseColors["abt-fundamentals"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn(
          "relative rounded-full flex items-center justify-center border-4 transition-all duration-300",
          sizeClasses[size],
          isEarned 
            ? cn(colors.bg, colors.border, "shadow-lg") 
            : "bg-muted border-muted-foreground/20"
        )}
      >
        <div className={cn(
          iconSizeClasses[size],
          isEarned ? "text-white" : "text-muted-foreground/40"
        )}>
          {isEarned ? icon : <Lock className="w-full h-full" />}
        </div>
        
        {/* Shine effect for earned badges */}
        {isEarned && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="text-center">
          <p className={cn(
            "text-xs font-medium",
            isEarned ? colors.text : "text-muted-foreground"
          )}>
            {courseName}
          </p>
          {isEarned && earnedAt && (
            <p className="text-[10px] text-muted-foreground">
              Earned {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface CourseBadgeGridProps {
  badges: Array<{
    courseId: string;
    courseName: string;
    isEarned: boolean;
    earnedAt?: string;
  }>;
  size?: "sm" | "md" | "lg";
}

export function CourseBadgeGrid({ badges, size = "md" }: CourseBadgeGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {badges.map((badge) => (
        <CourseBadge
          key={badge.courseId}
          courseId={badge.courseId}
          courseName={badge.courseName}
          isEarned={badge.isEarned}
          earnedAt={badge.earnedAt}
          size={size}
        />
      ))}
    </div>
  );
}
