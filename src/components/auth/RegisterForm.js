"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { useToast } from "@/components/providers/ToastProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { validateRegister, passwordIssues } from "@/lib/validation";
import Field, { inputClass } from "@/components/ui/Field";
import SocialButtons from "@/components/auth/SocialButtons";
import UserAvatar from "@/components/ui/UserAvatar";

const RULES = [
  { key: "length", label: "At least 6 characters", test: (p) => p.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
];

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { refetch } = useAuth();

  const passwordState = useMemo(() => RULES.map((rule) => ({ ...rule, passed: rule.test(form.password) })), [form.password]);
  const passwordValid = passwordState.every((rule) => rule.passed);
  const previewUser = { name: form.name, email: form.email, image: form.image };

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateRegister(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      if (nextErrors.password) toast.error(nextErrors.password);
      else toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image.trim(),
      });

      if (error) {
        const message = /exist/i.test(error.message ?? "")
          ? "An account already uses that email. Try signing in instead."
          : error.message || "We could not create your account. Please try again.";
        toast.error(message);
        setSubmitting(false);
        return;
      }

      toast.success("Account created. Welcome to Shongkolpo!");
      await refetch();
      router.replace("/events");
      router.refresh();
    } catch {
      toast.error("We could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <SocialButtons callbackURL="/events" />

      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        <Field label="Full name" name="name" error={errors.name} required>
          {({ id, errorId }) => (
            <input
              id={id}
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={update("name")}
              placeholder="Ayesha Rahman"
              className={inputClass(Boolean(errors.name))}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? errorId : undefined}
            />
          )}
        </Field>

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

        <Field
          label="Photo URL"
          name="image"
          error={errors.image}
          hint="A direct link to a square photo works best. We fall back to your initials if it breaks."
          required
        >
          {({ id, errorId }) => (
            <div className="flex items-center gap-3">
              <UserAvatar user={previewUser} size={44} />
              <input
                id={id}
                type="url"
                name="image"
                autoComplete="photo"
                value={form.image}
                onChange={update("image")}
                placeholder="https://images.example.com/me.jpg"
                className={inputClass(Boolean(errors.image))}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? errorId : undefined}
              />
            </div>
          )}
        </Field>

        <Field label="Password" name="password" error={errors.password} required>
          {({ id, errorId }) => (
            <div className="relative">
              <input
                id={id}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                value={form.password}
                onChange={update("password")}
                placeholder="Create a password"
                className={inputClass(Boolean(errors.password), "pr-11")}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? errorId : "password-rules"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="btn btn-ghost btn-sm btn-circle absolute right-1 top-1/2 -translate-y-1/2 text-base-content/60"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4.5 w-4.5" aria-hidden="true">
                  {showPassword ? (
                    <>
                      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="2.8" />
                    </>
                  ) : (
                    <path d="M2.5 3.5 21.5 20.5M10.6 6.1A9.6 9.6 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.4 3.9M6.5 7.9A17 17 0 0 0 2 12s3.6 6 10 6a9.7 9.7 0 0 0 3.6-.7M9.9 10.2a2.9 2.9 0 0 0 4 4" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </Field>

        <ul id="password-rules" className="grid gap-1.5 text-xs" aria-live="polite">
          {passwordState.map((rule) => (
            <li
              key={rule.key}
              className={`flex items-center gap-2 ${rule.passed ? "text-success" : "text-base-content/55"}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5" aria-hidden="true">
                {rule.passed ? <path d="M20 6 9 17l-5-5" /> : <circle cx="12" cy="12" r="8" />}
              </svg>
              {rule.label}
            </li>
          ))}
        </ul>

        <Field label="Confirm password" name="confirm" error={errors.confirm} required>
          {({ id, errorId }) => (
            <input
              id={id}
              type={showPassword ? "text" : "password"}
              name="confirm"
              autoComplete="new-password"
              value={form.confirm}
              onChange={update("confirm")}
              placeholder="Repeat your password"
              className={inputClass(Boolean(errors.confirm))}
              aria-invalid={Boolean(errors.confirm)}
              aria-describedby={errors.confirm ? errorId : undefined}
            />
          )}
        </Field>

        <button type="submit" disabled={submitting} className="btn btn-primary mt-2 rounded-full">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>

        {!passwordValid && form.password.length > 0 && (
          <p className="text-center text-xs text-base-content/55">
            {passwordIssues(form.password).length
              ? `Still needed: ${passwordIssues(form.password).join(", ")}.`
              : ""}
          </p>
        )}
      </form>
    </div>
  );
}
