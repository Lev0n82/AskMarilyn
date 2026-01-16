import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Linkedin, Twitter, Link, Check } from "lucide-react";
import { useState } from "react";

interface ShareBadgeProps {
  badgeName: string;
  courseName: string;
  certificateUrl?: string;
}

export function ShareBadge({ badgeName, courseName, certificateUrl }: ShareBadgeProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just earned the "${badgeName}" badge by completing the ${courseName} course on Ask Marilyn About Software Testing! 🎓`;
  
  const shareUrl = certificateUrl || window.location.origin;

  const handleLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLinkedIn} className="gap-2 cursor-pointer">
          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitter} className="gap-2 cursor-pointer">
          <Twitter className="w-4 h-4 text-[#1DA1F2]" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Link className="w-4 h-4" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
