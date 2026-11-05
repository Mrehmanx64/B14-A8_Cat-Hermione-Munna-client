"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api, { toApiError } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import EventCard, { EventCardSkeleton } from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";

export default function ManageEvents() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/events/mine")
      .then(({ data }) => {
        if (!cancelled) setEvents(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(toApiError(err).message);
          setEvents([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id) {
    setBusyId(id);
    try {
      await api.delete(`/api/events/${id}`);
      setEvents((current) => current.filter((event) => event._id !== id));
      toast.success("Event deleted.");
      setConfirmId(null);
    } catch (err) {
      toast.error(toApiError(err).message);
    } finally {
      setBusyId(null);
    }
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  if (events === null) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="You have not created any events yet"
        description="Post the first drive you want to run. You can edit or delete it any time from this page."
        action={{ href: "/events/create", label: "Create your first event" }}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          footer={
            <div className="flex items-center gap-1.5">
              <Link
                href={`/events/${event._id}/edit`}
                className="btn btn-ghost btn-sm rounded-full px-3"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setConfirmId(event._id)}
                className="btn btn-ghost btn-sm rounded-full px-3 text-error hover:bg-error/10"
                aria-label={`Delete ${event.title}`}
              >
                Delete
              </button>
            </div>
          }
        />
      ))}

      {confirmId && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-neutral/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => busyId === null && setConfirmId(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl"
            onClick={(click) => click.stopPropagation()}
          >
            <h2 id="delete-title" className="font-display text-xl font-semibold">
              Delete this event?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              {events.find((event) => event._id === confirmId)?.title} will be
              removed for everyone, and its volunteer list will be cleared. This
              cannot be undone.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(confirmId)}
                disabled={busyId !== null}
                className="btn btn-error flex-1 rounded-full"
              >
                {busyId !== null ? "Deleting…" : "Delete event"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                disabled={busyId !== null}
                className="btn btn-ghost flex-1 rounded-full"
                autoFocus
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
