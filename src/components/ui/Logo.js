import Link from "next/link";
import { SITE } from "@/lib/events";

/**
 * Brand mark: two hands cradling a rising sun — the pledge ("shongkolpo")
 * to show up for your neighbourhood.
 */
export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      role="img"
      aria-label={`${SITE.name} logo`}
    >
      <rect width="40" height="40" rx="11" className="fill-primary" />
      <circle cx="20" cy="15.5" r="4.6" className="fill-secondary" />
      <path
        d="M8.5 20.5c2.2 0 3.6 1.1 4.6 2.3m18.4-2.3c-2.2 0-3.6 1.1-4.6 2.3"
        className="stroke-primary-content"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        d="M7.8 26.8c2.6-1.1 4.6-.2 6.4 1.2 1.4 1.1 3 1.4 4.6.7l5.9-2.6c1-.4 2 .1 2.4 1.1.4 1-.1 2-1.1 2.4l-5.6 2.4c-2.9 1.3-6.2.8-8.7-1.1l-3.9-3c-.9-.7-.8-1.8 0-2.1Z"
        className="fill-primary-content"
        opacity="0.92"
      />
    </svg>
  );
}

export default function Logo({ href = "/", compact = false }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      aria-label={`${SITE.name} — home`}
    >
      <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-6" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl font-semibold tracking-tight text-base-content">
            {SITE.name}
          </span>
          <span className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-base-content/55">
            Community events
          </span>
        </span>
      )}
    </Link>
  );
}
