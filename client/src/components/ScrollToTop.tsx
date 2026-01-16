import { useEffect } from "react";
import { useLocation } from "wouter";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

/**
 * ScrollToTop component that scrolls to the top of the page on route changes.
 * Preserves hash-based section linking when explicitly used (e.g., /page#section).
 * Also enables keyboard navigation shortcuts (Home/End keys).
 */
export function ScrollToTop() {
  const [location] = useLocation();

  // Enable keyboard navigation shortcuts
  useKeyboardNavigation();

  useEffect(() => {
    // Check if there's a hash in the URL
    const hash = window.location.hash;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    if (hash) {
      // If there's a hash, scroll to that element after a brief delay
      // to allow the page to render
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: prefersReducedMotion ? "instant" : "smooth", 
            block: "start" 
          });
        }
      }, 100);
    } else {
      // No hash - scroll to top of page
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location]);

  return null;
}

export default ScrollToTop;
