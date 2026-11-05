"use client";

import { useEffect, useMemo, useState } from "react";
import api, { toApiError } from "@/lib/api";
import EventCard, { EventCardSkeleton } from "@/components/ui/EventCard";
import EmptyState from "@/components/ui/EmptyState";
import ErrorAlert from "@/components/ui/ErrorAlert";
import { EVENT_TYPES, isUpcoming } from "@/lib/events";

export default function EventsBrowser() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("soonest");

  useEffect(() => {
    let cancelled = false;

    api
      .get("/api/events/upcoming", { params: { limit: 100 }, skipAuth: true })
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

  /**
   * Memoized event list based on search query, event type, and sorting preference.
   */
  const visible = useMemo(() => {
    if (!events) return null;

    const needle = query.trim().toLowerCase();

    const filtered = events
      .filter((event) => isUpcoming(event.eventDate))
      .filter((event) => type === "All" || event.eventType === type)
      .filter((event) => {
        if (!needle) return true;
        return [event.title, event.location, event.eventType, event.description]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      });

    return filtered.sort((a, b) => {
      const delta = new Date(a.eventDate) - new Date(b.eventDate);
      return sort === "soonest" ? delta : -delta;
    });
  }, [events, query, type, sort]);

  return (
    <section className="section bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="event-search" className="sr-only">
              Search events
            </label>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or location…"
              className="input input-bordered w-full rounded-full bg-base-100 pl-11"
            />
          </div>

          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <span className="sr-only">Filter by event type</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="select select-bordered rounded-full bg-base-100"
              >
                <option value="All">All types</option>
                {EVENT_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className="sr-only">Sort events</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="select select-bordered rounded-full bg-base-100"
              >
                <option value="soonest">Soonest first</option>
                <option value="latest">Furthest out</option>
              </select>
            </label>
          </div>
        </div>

        {visible && (
          <p className="mt-4 text-sm text-base-content/60" role="status">
            Showing <strong className="text-base-content">{visible.length}</strong>{" "}
            {visible.length === 1 ? "event" : "events"}
            {type !== "All" ? ` in ${type}` : ""}
            {query.trim() ? ` matching “${query.trim()}”` : ""}.
          </p>
        )}

        {error && <ErrorAlert message={error} />}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible === null &&
            Array.from({ length: 6 }, (_, index) => <EventCardSkeleton key={index} />)}

          {visible?.map((event) => <EventCard key={event._id} event={event} />)}
        </div>

        {visible?.length === 0 && !error && (
          <div className="mt-10">
            <EmptyState
              title={events?.length ? "No events match those filters" : "No upcoming events yet"}
              description={
                events?.length
                  ? "Try a different event type, clear the search, or widen your sort."
                  : "The calendar is clear. Post the first drive and give your neighbours something to join."
              }
              action={{ href: "/events/create", label: "Create an event" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
