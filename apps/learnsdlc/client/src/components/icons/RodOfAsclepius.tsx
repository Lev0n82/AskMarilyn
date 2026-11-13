import { forwardRef } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Rod of Asclepius icon — a serpent entwined around a staff,
 * the ancient Greek symbol of medicine and healing.
 */
export const RodOfAsclepius = forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* The rod/staff */}
      <line x1="12" y1="2" x2="12" y2="22" />
      {/* Snake body wrapping around the rod — sinusoidal curves */}
      <path d="M12 4 C8 5, 8 7, 12 8 C16 9, 16 11, 12 12 C8 13, 8 15, 12 16 C16 17, 16 19, 12 20" />
      {/* Snake head at top */}
      <circle cx="9" cy="3.5" r="1.5" fill="currentColor" stroke="none" />
      {/* Snake tongue */}
      <path d="M7.5 3 L6 2 M7.5 3.5 L6 4" strokeWidth="1.5" />
    </svg>
  )
);

RodOfAsclepius.displayName = "RodOfAsclepius";
