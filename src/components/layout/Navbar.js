"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/ui/Logo";
import UserAvatar from "@/components/ui/UserAvatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCurrentPath } from "@/lib/use-current-path";

const PUBLIC_LINKS = [{ href: "/events", label: "Upcoming Events" }];

const PRIVATE_LINKS = [
  { href: "/events/create", label: "Create Event" },
  { href: "/dashboard/manage", label: "Manage Events" },
  { href: "/dashboard/joined", label: "Joined Events" },
];

const linkIcon = (href) => {
  if (href.includes("create")) return "M12 5v14M5 12h14";
  if (href.includes("manage")) return "M4 6h16M4 12h10M4 18h7";
  return "M9 12.5l2.2 2.2L15.5 10M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z";
};

export default function Navbar() {
  const { user, isPending, isAuthenticated, signOut } = useAuth();
  const pathname = useCurrentPath();
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef(null);

  // The drawer closes on the click that follows a link, so navigating never
  // leaves it open behind the new page.
  const closeOnNavigate = (event) => {
    if (event.target.closest("a")) setMobileOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/events") {
      return pathname === "/events" || (pathname.startsWith("/events/") && !pathname.endsWith("/create"));
    }
    return pathname === href;
  };

  const navLink = (href, label, extraClass = "") => (
    <Link
      key={href}
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        isActive(href)
          ? "bg-primary/10 text-primary"
          : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
      } ${extraClass}`}
      aria-current={isActive(href) ? "page" : undefined}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Logo />

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {PUBLIC_LINKS.map((link) => navLink(link.href, link.label))}
          {isAuthenticated && PRIVATE_LINKS.slice(0, 2).map((link) => navLink(link.href, link.label))}
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <ThemeToggle />

          {isPending ? (
            <span className="skeleton-tint h-10 w-24 rounded-full" aria-hidden="true" />
          ) : isAuthenticated ? (
            <div className="dropdown dropdown-end group" ref={profileRef}>
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost h-auto gap-2 rounded-full px-1.5 py-1.5 normal-case"
                aria-label={`Account menu for ${user?.name ?? "your account"}`}
              >
                <UserAvatar user={user} size={34} />
                {/* Display name appears on hover for pointer users. */}
                <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-base-content group-hover:inline md:inline-block md:max-w-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-300 md:group-hover:max-w-[9rem] md:group-hover:opacity-100">
                  {user?.name}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="hidden h-4 w-4 text-base-content/50 sm:block"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu z-[60] mt-3 w-60 gap-1 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl"
              >
                <li className="menu-title !px-3 !py-2">
                  <div className="flex flex-col">
                    <span className="truncate text-sm font-semibold text-base-content">{user?.name}</span>
                    <span className="truncate text-xs font-normal text-base-content/60">{user?.email}</span>
                  </div>
                </li>
                <li>
                  <Link href="/profile" className="gap-2.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-70" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                    My Profile
                  </Link>
                </li>
                {PRIVATE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="gap-2.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-70" aria-hidden="true">
                        <path d={linkIcon(link.href)} />
                      </svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <div className="my-1 h-px bg-base-300" />
                <li>
                  <button
                    type="button"
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="gap-2.5 text-error hover:bg-error/10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm rounded-full px-5 sm:btn-md">
              Login
            </Link>
          )}

          <button
            type="button"
            className="btn btn-ghost btn-circle btn-sm md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-base-300 bg-base-100 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1" onClick={closeOnNavigate}>
            {PUBLIC_LINKS.map((link) => navLink(link.href, link.label, "block"))}
            {isAuthenticated &&
              PRIVATE_LINKS.map((link) => navLink(link.href, link.label, "block"))}
            {isAuthenticated && navLink("/profile", "My Profile", "block")}

            {!isAuthenticated && !isPending && (
              <Link href="/login" className="btn btn-primary mt-2 rounded-full">
                Login
              </Link>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/" })}
                className="btn btn-ghost mt-1 justify-start rounded-full text-error"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
