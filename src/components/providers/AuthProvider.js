"use client";

import { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut as authSignOut } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

const AuthContext = createContext(null);

/**
 * Wraps BetterAuth's session hook so the whole tree shares one session
 * source. `isPending` only covers the very first fetch; afterwards a session
 * refetch never flashes the UI back into a signed-out state.
 */
export function AuthProvider({ children }) {
  const { data, isPending, error, refetch } = useSession();
  const router = useRouter();

  const value = useMemo(() => {
    const user = data?.user ?? null;

    return {
      user,
      session: data?.session ?? null,
      isPending,
      error,
      isAuthenticated: Boolean(user),
      refetch,
      async signOut({ redirectTo = "/" } = {}) {
        clearTokenCache();
        await authSignOut();
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      },
    };
  }, [data, isPending, error, refetch, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}
