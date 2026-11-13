import { useCallback } from "react";

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

/**
 * Skip Navigation Link - WCAG 2.2 AAA Compliance
 * Allows keyboard users to skip repetitive navigation and jump to main content
 */
export function SkipLink({ targetId = "main-content", children = "Skip to main content" }: SkipLinkProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [targetId]);

  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={typeof children === "string" ? children : "Skip to main content"}
    >
      {children}
    </a>
  );
}

export default SkipLink;
