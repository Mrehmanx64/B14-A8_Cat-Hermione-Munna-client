"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn btn-ghost btn-circle btn-sm sm:btn-md ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={mounted ? isDark : undefined}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Both icons render; CSS hides the one that does not match the theme,
          so the first paint is correct even before React hydrates. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 dark:hidden"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden h-5 w-5 dark:block"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
    </button>
  );
}
