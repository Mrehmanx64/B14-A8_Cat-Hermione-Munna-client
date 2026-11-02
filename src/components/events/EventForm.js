"use client";

import { useState } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import Field, { inputClass } from "@/components/ui/Field";
import { EVENT_TYPES, toDateInput, todayString } from "@/lib/events";
import { validateEvent } from "@/lib/validation";

const EMPTY = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

/**
 * Shared create/update form. `onSubmit` receives the validated payload and is
 * responsible for navigation and toasts, so create and edit can differ.
 */
export default function EventForm({
  initialValues,
  onSubmit,
  submitLabel = "Create event",
  pendingLabel = "Publishing…",
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initialValues,
    eventDate: toDateInput(initialValues?.eventDate),
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateEvent(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      const firstMessage = Object.values(nextErrors)[0];
      toast.error(firstMessage);
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        thumbnail: form.thumbnail.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  const previewOk = form.thumbnail.trim().startsWith("http");

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="grid gap-5">
        <Field label="Event title" name="title" error={errors.title} required
          hint="Keep it specific — “Blanket Distribution for the Needy” beats “Winter drive”.">
          {({ id, errorId }) => (
            <input
              id={id}
              name="title"
              value={form.title}
              onChange={update("title")}
              maxLength={120}
              placeholder="Winter Clothes Distribution"
              className={inputClass(Boolean(errors.title), "rounded-xl")}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? errorId : undefined}
            />
          )}
        </Field>

        <Field label="Description" name="description" error={errors.description} required
          hint="What should volunteers bring, expect, and know before they arrive?">
          {({ id, errorId }) => (
            <textarea
              id={id}
              name="description"
              value={form.description}
              onChange={update("description")}
              rows={6}
              maxLength={2000}
              placeholder="We are collecting warm clothes for families in Mirpur 10. Sorting starts at 9am, distribution at 11am."
              className={`textarea textarea-bordered w-full rounded-xl leading-relaxed ${errors.description ? "textarea-error" : ""}`}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? errorId : undefined}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Event type" name="eventType" error={errors.eventType} required>
            {({ id, errorId }) => (
              <select
                id={id}
                name="eventType"
                value={form.eventType}
                onChange={update("eventType")}
                className={`select select-bordered w-full rounded-xl ${errors.eventType ? "select-error" : ""}`}
                aria-invalid={Boolean(errors.eventType)}
                aria-describedby={errors.eventType ? errorId : undefined}
              >
                <option value="">Choose a type</option>
                {EVENT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Event date" name="eventDate" error={errors.eventDate} required
            hint="Past dates are rejected. Today is allowed.">
            {({ id, errorId }) => (
              <input
                id={id}
                type="date"
                name="eventDate"
                min={todayString()}
                value={form.eventDate}
                onChange={update("eventDate")}
                className={inputClass(Boolean(errors.eventDate), "rounded-xl")}
                aria-invalid={Boolean(errors.eventDate)}
                aria-describedby={errors.eventDate ? errorId : undefined}
              />
            )}
          </Field>
        </div>

        <Field label="Location" name="location" error={errors.location} required
          hint="Area and landmark help volunteers find you.">
          {({ id, errorId }) => (
            <input
              id={id}
              name="location"
              value={form.location}
              onChange={update("location")}
              placeholder="Mirpur 10, Dhaka"
              className={inputClass(Boolean(errors.location), "rounded-xl")}
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? errorId : undefined}
            />
          )}
        </Field>

        <Field label="Thumbnail image URL" name="thumbnail" error={errors.thumbnail} required
          hint="A direct image link (jpg, png, webp) from any host.">
          {({ id, errorId }) => (
            <input
              id={id}
              type="url"
              name="thumbnail"
              value={form.thumbnail}
              onChange={update("thumbnail")}
              placeholder="https://images.unsplash.com/photo-..."
              className={inputClass(Boolean(errors.thumbnail), "rounded-xl")}
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={errors.thumbnail ? errorId : undefined}
            />
          )}
        </Field>

        <button type="submit" disabled={submitting} className="btn btn-primary rounded-full sm:justify-self-start sm:px-8">
          {submitting ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              {pendingLabel}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>

      {/* Live preview so organisers see the card before publishing. */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
          Card preview
        </p>

        <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          {previewOk ? (
            // eslint-disable-next-line @next/next/no-img-element -- live user-provided URL preview
            <img
              src={form.thumbnail}
              alt=""
              className="aspect-[16/10] w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="aspect-[16/10] w-full bg-base-200" aria-hidden="true" />
          )}

          <div className="grid gap-2 p-5">
            <span className="badge badge-sm w-fit border-0 bg-primary/10 font-semibold text-primary">
              {form.eventType || "Event type"}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug">
              {form.title || "Your event title"}
            </h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-base-content/65">
              {form.description || "Your description will appear here, trimmed to three lines on the card."}
            </p>
            <p className="mt-1 text-sm text-base-content/70">
              {form.location || "Location"}
              {form.eventDate ? ` · ${form.eventDate}` : ""}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-base-content/55">
          Your email is stored with this event so only you can edit or delete it
          later from Manage Events.
        </p>
      </aside>
    </form>
  );
}
