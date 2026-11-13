import { useEffect } from "react";

/**
 * useKeyboardNavigation hook - Adds keyboard shortcuts for page navigation.
 * 
 * Supported shortcuts:
 * - Home: Scroll to top of page
 * - End: Scroll to bottom of page
 * 
 * These shortcuts are disabled when the user is focused on an input,
 * textarea, or contenteditable element to avoid interfering with text editing.
 */
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with input fields, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      const isEditableElement =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[contenteditable]");

      if (isEditableElement) {
        return;
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const scrollBehavior = prefersReducedMotion ? "instant" : "smooth";

      switch (event.key) {
        case "Home":
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: scrollBehavior });
          break;
        case "End":
          event.preventDefault();
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: scrollBehavior,
          });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}

export default useKeyboardNavigation;
