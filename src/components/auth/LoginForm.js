"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { validateLogin } from "@/lib/validation";
import { inputClass } from "@/components/ui/Field";
import Field from "@/components/ui/Field";
import SocialButtons from "@/components/auth/SocialButtons";

function EyeIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4.5 w-4.5" aria-hidden="true">
      {open ? (
        <>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.8" />
        </>
      ) : (
        <>
          <path d="M2.5 3.5 21.5 20.5M10.6 6.1A9.6 9.6 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.4 3.9M6.5 7.9A17 17 0 0 0 2 12s3.6 6 10 6a9.7 9.7 0 0 0 3.6-.7" />
          <path d="M9.9 10.2a2.9 2.9 0 0 0 4 4" />
        </>
      )}
    </svg>
  );
}

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch } = useAuth();

  const redirectTarget = (() => {
    const target = searchParams.get("redirect");
    return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
  })();

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);

    try {
      const { error } = await signIn.email({
        email: form.email.trim(),
        password: form.password,
        rememberMe: true,
      });

      if (error) {
        const message =
          error.status === 401 || /invalid|credential/i.test(error.message ?? "")
            ? "That email and password combination does not match an account."
            : error.message || "We could not sign you in. Please try again.";
        toast.error(message);
        setSubmitting(false);
        return;
      }

      toast.success("Signed in. Welcome back to Shongkolpo.");
      await refetch();
      router.replace(redirectTarget);
      router.refresh();
    } catch {
      toast.error("We could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <SocialButtons callbackURL={redirectTarget} />

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <Field label="Email" name="email" error={errors.email} required>
          {({ id, errorId }) => (
            <input
              id={id}
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className={inputClass(Boolean(errors.email))}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? errorId : undefined}
            />
          )}
        </Field>

        <Field label="Password" name="password" error={errors.password} required>
          {({ id, errorId }) => (
            <div className="relative">
              <input
                id={id}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={update("password")}
                placeholder="Your password"
                className={inputClass(Boolean(errors.password), "pr-11")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? errorId : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="btn btn-ghost btn-sm btn-circle absolute right-1 top-1/2 -translate-y-1/2 text-base-content/60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          )}
        </Field>

        <button type="submit" disabled={submitting} className="btn btn-primary mt-2 rounded-full">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}
