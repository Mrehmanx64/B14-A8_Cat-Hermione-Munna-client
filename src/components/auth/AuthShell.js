import Link from "next/link";
import Logo from "@/components/ui/Logo";

/**
 * Shared two-column frame for login/register: an editorial panel on the left
 * (hidden on phones) and the form on the right.
 */
export default function AuthShell({ title, subtitle, children, side }) {
  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-[1fr_1.05fr]">
      <aside className="wash relative hidden overflow-hidden border-r border-base-300 bg-base-200/50 p-12 lg:flex lg:flex-col lg:justify-between">
        <Logo />

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            {side?.heading ?? "Showing up is easier when you know where to go."}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-base-content/70">
            {side?.body ??
              "Every drive on Shongkolpo is posted by a neighbour, with a clear date, place and organiser. Join the ones that fit your week."}
          </p>

          <ul className="mt-10 space-y-4">
            {(side?.points ?? [
              "Create a drive in under a minute",
              "Join with a single tap, tracked against your profile",
              "Manage only the events you actually created",
            ]).map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-base-content/80">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-base-content/50">
          © Shongkolpo · Community service events
        </p>
      </aside>

      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-xs text-base-content/50">
            By continuing you agree to keep the neighbourhood kind.{" "}
            <Link href="/" className="link link-hover text-primary">
              Back to home
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
