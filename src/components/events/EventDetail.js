"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { toApiError } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import UserAvatar from "@/components/ui/UserAvatar";
import { EVENT_TYPE_STYLES, formatDate, relativeDay, isUpcoming } from "@/lib/events";

export default function EventDetail({ eventId }) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { user, isPending: authPending, isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Refetch whenever the event changes *or* the signed-in identity settles:
  // `joined` and `isOwner` depend on who is asking, so a late session must not
  // leave the page showing another viewer's buttons.
  const viewerId = user?.id ?? null;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.get(`/api/events/${eventId}`);
        if (cancelled) return;
        setEvent(data);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(toApiError(err).message);
        setEvent(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId, viewerId, authPending]);

  async function handleJoin() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setJoining(true);
    try {
      const { data } = await api.post(`/api/events/${eventId}/join`);
      setEvent((current) =>
        current
          ? { ...current, joined: true, joinCount: data.joinCount ?? current.joinCount + 1 }
          : current
      );
      toast.success(
        data.alreadyJoined
          ? "You are already on the list for this event."
          : "You are in! Thank you for pledging to serve."
      );
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setJoining(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/api/events/${eventId}`);
      toast.success("Event deleted.");
      router.replace("/dashboard/manage");
      router.refresh();
    } catch (err) {
      toast.error(toApiError(err).message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (!event && !error) {
    return <DetailSkeleton />;
  }

  if (error || !event) {
    return (
      <section className="section">
        <div className="mx-auto flex max-w-lg flex-col items-center px-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4.5M12 16h.01" />
            </svg>
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold">Event not found</h1>
          <p className="mt-2 text-sm leading-relaxed text-base-content/70">
            {error || "That event may have been deleted by its organiser."}
          </p>
          <Link href="/events" className="btn btn-primary mt-6 rounded-full px-6">
            Browse upcoming events
          </Link>
        </div>
      </section>
    );
  }

  const upcoming = isUpcoming(event.eventDate);
  const typeStyle = EVENT_TYPE_STYLES[event.eventType] ?? "badge-neutral";

  return (
    <article>
      {/* Hero */}
      <div className="relative isolate overflow-hidden border-b border-base-300 bg-base-300">
        <div className="aspect-[16/9] w-full sm:aspect-[21/9]">
          {event.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URL
            <img
              src={event.thumbnail}
              alt={`Photo for ${event.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-base-200" aria-hidden="true" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/70 to-transparent" />
      </div>

      <section className="section pt-0">
        <div className="mx-auto -mt-24 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-base-content/60">
            <Link href="/events" className="link link-hover font-medium">
              Upcoming events
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-base-content/80">{event.eventType}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`badge border-0 font-semibold ${typeStyle}`}>{event.eventType}</span>
                {upcoming ? (
                  <span className="badge badge-outline font-semibold">{relativeDay(event.eventDate)}</span>
                ) : (
                  <span className="badge badge-neutral font-semibold">Ended</span>
                )}
                {event.isOwner && (
                  <span className="badge badge-primary border-0 font-semibold">You organise this</span>
                )}
              </div>

              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {event.title}
              </h1>

              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <InfoRow
                  label="Date"
                  icon="M3.5 5h17v15h-17zM3.5 10h17M8 3v4M16 3v4"
                  value={<time dateTime={event.eventDate}>{formatDate(event.eventDate)}</time>}
                />
                <InfoRow
                  label="Location"
                  icon="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z M12 12.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
                  value={event.location}
                />
                <InfoRow
                  label="Volunteers"
                  icon="M9 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.2 3.2 0 0 1 0 5.6M17.4 20a6.2 6.2 0 0 0-2-4.6"
                  value={`${event.joinCount ?? 0} ${(event.joinCount ?? 0) === 1 ? "person joined" : "people joined"}`}
                />
                <InfoRow
                  label="Posted"
                  icon="M12 8v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                  value={formatDate(event.createdAt)}
                />
              </dl>

              <div className="mt-8 border-t border-base-300 pt-8">
                <h2 className="font-display text-xl font-semibold">About this event</h2>
                <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-relaxed text-base-content/80">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Action rail */}
            <aside className="grid gap-4 lg:sticky lg:top-24">
              <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/50">
                  Organiser
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <UserAvatar
                    user={{ name: event.createdByName, email: event.createdByEmail, image: event.createdByImage }}
                    size={44}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {event.createdByName || "Shongkolpo organiser"}
                    </p>
                    <p className="truncate text-xs text-base-content/60">
                      {event.createdByEmail || "Community member"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  {event.isOwner ? (
                    <div className="grid gap-2">
                      <Link href={`/events/${event._id}/edit`} className="btn btn-primary rounded-full">
                        Edit event
                      </Link>

                      {confirmDelete ? (
                        <div className="rounded-2xl border border-error/40 bg-error/5 p-4">
                          <p className="text-sm font-medium text-base-content">
                            Delete this event for good?
                          </p>
                          <p className="mt-1 text-xs text-base-content/65">
                            Everyone who joined will lose their spot. This cannot be undone.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={handleDelete}
                              disabled={deleting}
                              className="btn btn-error btn-sm flex-1 rounded-full"
                            >
                              {deleting ? "Deleting…" : "Yes, delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(false)}
                              disabled={deleting}
                              className="btn btn-ghost btn-sm flex-1 rounded-full"
                            >
                              Keep it
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(true)}
                          className="btn btn-outline btn-error rounded-full"
                        >
                          Delete event
                        </button>
                      )}

                      <p className="mt-1 text-center text-xs text-base-content/55">
                        Organisers count as part of the event, so there is no
                        join button on your own drive.
                      </p>
                    </div>
                  ) : !upcoming ? (
                    <div className="rounded-2xl border border-base-300 bg-base-200/50 px-4 py-3 text-center text-sm text-base-content/70">
                      This event has already taken place.
                    </div>
                  ) : event.joined ? (
                    <div className="rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-center">
                      <p className="text-sm font-semibold text-success">You are going</p>
                      <p className="mt-1 text-xs text-base-content/65">
                        See you there. Check{" "}
                        <Link href="/dashboard/joined" className="link font-semibold">
                          Joined Events
                        </Link>{" "}
                        any time.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleJoin}
                      disabled={joining || authPending}
                      className="btn btn-primary w-full rounded-full"
                    >
                      {joining ? (
                        <>
                          <span className="loading loading-spinner loading-sm" aria-hidden="true" />
                          Joining…
                        </>
                      ) : (
                        "Join this event"
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-base-300 bg-base-200/40 p-6">
                <p className="text-sm font-semibold">A note on pledging</p>
                <p className="mt-2 text-xs leading-relaxed text-base-content/65">
                  Joining adds your name to the volunteer list so the organiser
                  can plan supplies. If your plans change, contact the organiser
                  directly.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}

function InfoRow({ label, icon, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-base-200/50 px-4 py-3">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true">
        <path d={icon} />
      </svg>
      <div className="min-w-0">
        <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-base-content/50">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm font-medium text-base-content">{value}</dd>
      </div>
    </div>
  );
}

/**
 * Shared with the route's Suspense fallback so the shell that streams in and
 * the skeleton the component shows while fetching are the same shape — no
 * jump when one hands off to the other.
 */
export function DetailSkeleton() {
  return (
    <div className="section" role="status">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="sr-only">Loading event…</span>
        <div className="skeleton-tint aspect-[16/9] w-full rounded-3xl sm:aspect-[21/9]" />
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="grid gap-4 rounded-3xl border border-base-300 bg-base-100 p-8">
            <div className="skeleton-tint h-5 w-32 rounded" />
            <div className="skeleton-tint h-9 w-3/4 rounded" />
            <div className="skeleton-tint h-4 w-full rounded" />
            <div className="skeleton-tint h-4 w-5/6 rounded" />
            <div className="skeleton-tint h-40 w-full rounded-2xl" />
          </div>
          <div className="skeleton-tint h-64 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
