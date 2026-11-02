"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api, { toApiError } from "@/lib/api";
import { updateUser } from "@/lib/auth-client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { validateProfile } from "@/lib/validation";
import Field, { inputClass } from "@/components/ui/Field";
import UserAvatar from "@/components/ui/UserAvatar";

export default function ProfileEditor() {
  const { user, refetch } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ name: "", image: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  // Seed the fields from the session, again whenever the session user changes
  // (first load, or the save that just succeeded). Adjusting state during
  // render is React's documented alternative to a syncing effect.
  const [seededFor, setSeededFor] = useState(null);
  const sessionKey = user ? `${user.id}:${user.name ?? ""}:${user.image ?? ""}` : null;

  if (sessionKey && sessionKey !== seededFor) {
    setSeededFor(sessionKey);
    setForm({ name: user.name ?? "", image: user.image ?? "" });
  }

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/profile/stats")
      .then(({ data }) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setStats({ created: 0, joined: 0 });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error(Object.values(nextErrors)[0]);
      return;
    }

    setSaving(true);
    try {
      // BetterAuth owns the user record, so the name/photo write goes through it.
      const { error } = await updateUser({
        name: form.name.trim(),
        image: form.image.trim(),
      });

      if (error) {
        toast.error(error.message || "We could not save your profile.");
        return;
      }

      await refetch();
      toast.success("Profile updated.");
    } catch {
      toast.error("We could not save your profile. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  const dirty =
    Boolean(user) &&
    (form.name.trim() !== (user.name ?? "") || form.image.trim() !== (user.image ?? ""));
  const previewUser = { ...user, name: form.name, image: form.image };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8"
      >
        <h2 className="font-display text-xl font-semibold">Your details</h2>
        <p className="mt-1 text-sm text-base-content/65">
          This name and photo appear on the events you post and on the volunteer
          lists you join.
        </p>

        <div className="mt-6 grid gap-5">
          <Field label="Full name" name="name" error={errors.name} required>
            {({ id, errorId }) => (
              <div className="flex items-center gap-4">
                <UserAvatar user={previewUser} size={54} />
                <input
                  id={id}
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  maxLength={60}
                  className={inputClass(Boolean(errors.name), "rounded-xl")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? errorId : undefined}
                />
              </div>
            )}
          </Field>

          <Field
            label="Photo URL"
            name="image"
            error={errors.image}
            hint="A direct link to an image. If it ever breaks, your initials are shown instead."
            required
          >
            {({ id, errorId }) => (
              <input
                id={id}
                type="url"
                name="image"
                value={form.image}
                onChange={update("image")}
                placeholder="https://images.example.com/me.jpg"
                className={inputClass(Boolean(errors.image), "rounded-xl")}
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? errorId : undefined}
              />
            )}
          </Field>

          <Field label="Email" name="email" hint="Email comes from your sign-in method and cannot be changed here.">
            {({ id }) => (
              <input
                id={id}
                type="email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="input input-bordered w-full rounded-xl bg-base-200/60"
              />
            )}
          </Field>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving || !dirty} className="btn btn-primary rounded-full px-7">
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm" aria-hidden="true" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({ name: user?.name ?? "", image: user?.image ?? "" });
              setErrors({});
            }}
            disabled={saving || !dirty}
            className="btn btn-ghost rounded-full"
          >
            Reset
          </button>

          {dirty && !saving && (
            <span className="text-xs font-medium text-base-content/55">Unsaved changes</span>
          )}
        </div>
      </form>

      <aside className="grid gap-4">
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold">At a glance</h2>

          <dl className="mt-4 grid gap-3">
            <StatRow
              label="Events organised"
              value={stats?.created}
              href="/dashboard/manage"
            />
            <StatRow
              label="Events joined"
              value={stats?.joined}
              href="/dashboard/joined"
            />
          </dl>

          <div className="mt-5 grid gap-2">
            <Link href="/events/create" className="btn btn-primary btn-sm rounded-full">
              Create an event
            </Link>
            <Link href="/events" className="btn btn-outline btn-sm rounded-full">
              Browse the calendar
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-base-300 bg-base-200/40 p-6">
          <p className="text-sm font-semibold">Signed in as</p>
          <p className="mt-1 break-all text-xs text-base-content/65">{user?.email}</p>
          <p className="mt-3 text-xs leading-relaxed text-base-content/55">
            Shongkolpo uses email and social sign-in only. There is no email
            verification or password reset flow in this build.
          </p>
        </div>
      </aside>
    </div>
  );
}

function StatRow({ label, value, href }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-base-200/60 px-4 py-3">
      <dt className="text-sm text-base-content/70">{label}</dt>
      <dd className="flex items-center gap-3">
        <span className="text-lg font-semibold tabular-nums">
          {value === undefined ? <span className="skeleton-tint inline-block h-5 w-6 rounded" /> : value}
        </span>
        {href && (
          <Link href={href} className="text-xs font-semibold text-primary hover:underline">
            View
          </Link>
        )}
      </dd>
    </div>
  );
}
