import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Share2 } from "lucide-react";

interface SocialShareProps {
  score: number;
  total: number;
  type: "quiz" | "refactoring" | "boss";
}

export function SocialShare({ score, total, type }: SocialShareProps) {
  const title = type === "quiz" 
    ? "Certified Logical Tester" 
    : type === "refactoring" 
      ? "Refactoring Master" 
      : "Test Architect";
      
  const message = `I just scored ${score}/${total} on the ${title} challenge in "Ask Marilyn About Software Testing"! Logic is the beginning of wisdom. 🧠✨ #SoftwareTesting #ABT #QualityAssurance`;
  
  const encodedMessage = encodeURIComponent(message);
  const url = encodeURIComponent(window.location.origin);

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}&url=${url}`, "_blank");
  };

  const shareLinkedIn = () => {
    // LinkedIn sharing is simpler, just the URL usually, but we can try to pre-fill title/summary via some tricks or just let user write it.
    // Standard share link:
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-muted/30 rounded-lg border border-border">
      <h3 className="text-lg font-serif font-bold flex items-center gap-2">
        <Share2 className="h-5 w-5" /> Share Your Achievement
      </h3>
      <div className="flex gap-3">
        <Button onClick={shareTwitter} variant="outline" className="gap-2 hover:text-[#1DA1F2] hover:border-[#1DA1F2]">
          <Twitter className="h-4 w-4" /> Twitter
        </Button>
        <Button onClick={shareLinkedIn} variant="outline" className="gap-2 hover:text-[#0A66C2] hover:border-[#0A66C2]">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </Button>
      </div>
    </div>
  );
}
