"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

/**
 * Sends an already-signed-in visitor away from /login and /register, honouring
 * the ?redirect= target set by the private-route guard.
 */
export default function RedirectIfAuthed({ fallback = "/" }) {
  const { isAuthenticated, isPending } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isPending || !isAuthenticated) return;

    const target = searchParams.get("redirect");
    const safeTarget = target && target.startsWith("/") && !target.startsWith("//") ? target : fallback;

    router.replace(safeTarget);
  }, [isAuthenticated, isPending, router, searchParams, fallback]);

  return null;
}
