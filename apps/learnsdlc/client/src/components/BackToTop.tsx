import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop component - A floating button that appears when users scroll down
 * and smoothly scrolls them back to the top of the page when clicked.
 * 
 * Accessibility features:
 * - Visible focus ring for keyboard users
 * - aria-label for screen readers
 * - Respects reduced motion preferences
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    // Check initial scroll position
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-primary focus:ring-offset-2"
      size="icon"
      aria-label="Scroll to top of page"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}

export default BackToTop;
