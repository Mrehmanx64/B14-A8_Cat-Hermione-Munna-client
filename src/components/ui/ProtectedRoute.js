"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCurrentPath } from "@/lib/use-current-path";

function PageSpinner({ label = "Checking your session" }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
      <span className="loading loading-ring loading-lg text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-base-content/60">{label}…</p>
    </div>
  );
}

/**
 * Client-side guard for private pages.
 *
 * Redirects only after the session query has settled, so a signed-in user who
 * reloads a private route is never bounced to /login during the first paint.
 * After signing in, BetterAuth sends the user back to the page they wanted.
 */
export default function ProtectedRoute({ children }) {
  const { isPending, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = useCurrentPath();

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      // `pathname` is null during the very first prerender pass; after mount we
      // read the real path so the user returns here after signing in.
      const target = pathname ?? "/events";
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [isPending, isAuthenticated, pathname, router]);

  if (isPending) return <PageSpinner />;
  if (!isAuthenticated) return <PageSpinner label="Taking you to sign in" />;

  return children;
}
