import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { SITE } from "@/lib/events";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/events", label: "Upcoming events" },
      { href: "/events/create", label: "Create an event" },
      { href: "/dashboard/joined", label: "Joined events" },
      { href: "/dashboard/manage", label: "Manage events" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/#features", label: "Why Shongkolpo" },
      { href: "/#gallery", label: "Gallery" },
      { href: "/#newsletter", label: "Newsletter" },
      { href: "/profile", label: "Your profile" },
    ],
  },
];

/** X (formerly Twitter) — the 2023 rebrand mark, not the old bird. */
function XIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.53 3h3.02l-6.6 7.55L21.75 21h-6.1l-4.77-6.23L5.4 21H2.38l7.06-8.07L2.25 3h6.25l4.31 5.7L17.53 3Zm-1.06 16.19h1.68L7.6 4.72H5.8l10.67 14.47Z" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.5-1.46h1.6V4.44A21 21 0 0 0 14.27 4c-2.34 0-3.94 1.43-3.94 4.05v2.45H7.7v3h2.63V21h3.17Z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Prerendered and cached so reading the clock never blocks static rendering. */
async function copyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await copyrightYear();

  return (
    <footer className="mt-auto border-t border-base-300 bg-base-200/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-xl font-semibold">{SITE.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-base-content/70">{SITE.description}</p>

            <div className="mt-5 flex items-center gap-2">
              {[
                { label: "Shongkolpo on X", Icon: XIcon },
                { label: "Shongkolpo on Facebook", Icon: FacebookIcon },
                { label: "Shongkolpo on Instagram", Icon: InstagramIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="btn btn-ghost btn-circle btn-sm border border-base-300 text-base-content/70 hover:border-primary hover:text-primary"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-base-content/50">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-base-content/75 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-base-content/50">
              Reach us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-base-content/75">
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.6" />
                </svg>
                <span>House 12, Road 5, Dhanmondi, Dhaka 1205</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m3.5 7 8.5 6 8.5-6" />
                </svg>
                <span>hello@shongkolpo.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true">
                  <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z" />
                </svg>
                <span>+880 1700 000000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-base-300 pt-6 text-xs text-base-content/60 sm:flex-row">
          <p>© {year} {SITE.name}. Built for community service.</p>
          <p>
            Made with care in Dhaka ·{" "}
            <Link href="/events" className="link link-hover text-primary">
              Find your next event
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
