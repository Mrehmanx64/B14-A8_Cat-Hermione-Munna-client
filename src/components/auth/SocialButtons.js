"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/providers/ToastProvider";

const PROVIDERS = [
  {
    id: "google",
    label: "Continue with Google",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.45a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.79Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
        <path fill="#FBBC05" d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l3.98-3.09Z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.87 8.87 4.75 12 4.75Z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "Continue with GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
      </svg>
    ),
  },
];

export default function SocialButtons({ callbackURL = "/" }) {
  const [pending, setPending] = useState(null);
  const toast = useToast();

  async function handleSignIn(provider) {
    setPending(provider);

    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL });

      if (error) {
        toast.error(
          error.message || `We could not start ${provider} sign-in. Please try again.`
        );
        setPending(null);
      }
      // On success the browser navigates to the provider, so the button stays
      // in its pending state until the redirect happens.
    } catch {
      toast.error(`We could not start ${provider} sign-in. Please try again.`);
      setPending(null);
    }
  }

  return (
    <div className="grid gap-3">
      {PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleSignIn(provider.id)}
          disabled={Boolean(pending)}
          className="btn btn-outline w-full justify-center gap-3 rounded-full border-base-300 normal-case"
        >
          {pending === provider.id ? (
            <span className="loading loading-spinner loading-sm" aria-hidden="true" />
          ) : (
            provider.icon
          )}
          {provider.label}
        </button>
      ))}

      <div className="divider my-1 text-xs uppercase tracking-widest text-base-content/40">
        or use your email
      </div>
    </div>
  );
}
