"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api, { toApiError } from "@/lib/api";
import EventCard, { EventCardSkeleton } from "@/components/events/EventCard";

/**
 * The six soonest upcoming events, fetched from the API. The server applies
 * `.sort({ eventDate: 1 }).limit(6)` in MongoDB.
 */
export default function UpcomingPreview() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/events/upcoming", { params: { limit: 6 }, skipAuth: true })
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

  return (
    <section className="section bg-base-200/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Happening soon</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Upcoming events near you</h2>
            <p className="mt-3 max-w-xl text-base-content/70">
              The six nearest dates on the calendar, pulled live from the
              community board.
            </p>
          </div>

          <Link href="/events" className="btn btn-outline rounded-full border-base-300 px-6">
            See all events
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events === null &&
            Array.from({ length: 6 }, (_, index) => <EventCardSkeleton key={index} />)}

          {error && (
            <div className="alert alert-warning col-span-full">
              <span>{error}</span>
            </div>
          )}

          {events?.map((event) => <EventCard key={event._id} event={event} />)}
        </div>

        {events?.length === 0 && !error && (
          <div className="mt-10 rounded-2xl border border-dashed border-base-300 p-10 text-center">
            <p className="font-display text-lg font-semibold">The calendar is open</p>
            <p className="mt-2 text-sm text-base-content/70">
              No events have been posted yet. Be the first to organise one.
            </p>
            <Link href="/events/create" className="btn btn-primary mt-5 rounded-full px-6">
              Create the first event
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
