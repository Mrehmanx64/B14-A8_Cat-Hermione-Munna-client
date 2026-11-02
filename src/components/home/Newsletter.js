"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { EMAIL_PATTERN } from "@/lib/validation";

/**
 * Design-only newsletter band, as the brief requires. Submission validates
 * locally and confirms with a toast; nothing is sent anywhere.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  function handleSubmit(event) {
    event.preventDefault();
    const value = email.trim();

    if (!value) return setError("Enter your email address to subscribe.");
    if (!EMAIL_PATTERN.test(value)) return setError("That email address does not look right.");

    setError("");
    setEmail("");
    toast.success("You're on the list. We'll send the next drive to your inbox.");
  }

  return (
    <section id="newsletter" className="section bg-base-100 pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="wash relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/40 px-6 py-14 sm:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Stay in the loop</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              One email when something nearby needs hands
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base-content/70">
              A short monthly note with the drives opening near you. No spam, no
              forwarding your address — just the next chance to show up.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <div className="flex-1 text-left">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "newsletter-error" : undefined}
                  className={`input input-bordered w-full rounded-full bg-base-100 ${error ? "input-error" : ""}`}
                />
                {error && (
                  <p id="newsletter-error" role="alert" className="mt-2 pl-4 text-xs font-medium text-error">
                    {error}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary rounded-full px-7">
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-xs text-base-content/55">
              Demo only — this form does not send data anywhere.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
