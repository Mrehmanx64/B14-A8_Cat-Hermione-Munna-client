"use client";

import { useEffect, useMemo, useState } from "react";
import api, { toApiError } from "@/lib/api";
import EventCard, { EventCardSkeleton } from "@/components/events/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import { isUpcoming } from "@/lib/events";

export default function JoinedEvents() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/events/joined")
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

  const { upcoming, past } = useMemo(() => {
    const list = events ?? [];
    return {
      upcoming: list.filter((event) => isUpcoming(event.eventDate)),
      past: list.filter((event) => !isUpcoming(event.eventDate)).reverse(),
    };
  }, [events]);

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
        title="You have not joined any events yet"
        description="Browse the calendar and add your name to a drive that needs hands. Every event you join shows up here."
        action={{ href: "/events", label: "Find an event to join" }}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
            <circle cx="9" cy="8" r="3.2" />
            <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16.5 11.5 18 13l3-3" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid gap-12">
      <section>
        <div className="mb-5 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Coming up</h2>
          <span className="text-sm text-base-content/60">
            {upcoming.length} {upcoming.length === 1 ? "event" : "events"}
          </span>
        </div>

        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-base-300 px-5 py-8 text-center text-sm text-base-content/65">
            None of your joined events are still ahead. Browse the calendar for
            something new.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <div className="mb-5 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Already happened</h2>
            <span className="text-sm text-base-content/60">
              {past.length} {past.length === 1 ? "event" : "events"}
            </span>
          </div>

          <div className="grid gap-6 opacity-80 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
