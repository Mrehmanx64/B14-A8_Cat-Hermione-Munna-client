"use client";

import Link from "next/link";
import { useState } from "react";
import {
  EVENT_TYPE_STYLES,
  formatDate,
  relativeDay,
  daysUntil,
} from "@/lib/events";

export default function EventCard({ event, footer, href }) {
  const [imageBroken, setImageBroken] = useState(false);
  const days = daysUntil(event.eventDate);
  const isPast = days !== null && days < 0;
  const titleId = `title-${event._id}`;
  const to = href ?? `/events/${event._id}`;

  return (
    <article className="event-card card overflow-hidden border border-base-300 bg-base-100 shadow-sm" aria-labelledby={titleId}>
      <figure className="relative overflow-hidden bg-base-300">
        {imageBroken || !event.thumbnail ? (
          <div className="card-media flex items-center justify-center bg-base-200" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-10 w-10 text-base-content/25">
              <rect x="3" y="4" width="18" height="16" rx="2.5" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="m4 18 5-5 3.5 3.5L16 13l4 4" />
            </svg>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- event thumbnails are arbitrary user URLs
          <img
            src={event.thumbnail}
            alt=""
            loading="lazy"
            className="card-media transition-transform duration-500 hover:scale-[1.04]"
            onError={() => setImageBroken(true)}
          />
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className={`badge badge-sm sm:badge-md border-0 font-semibold ${EVENT_TYPE_STYLES[event.eventType] ?? "badge-neutral"}`}>
            {event.eventType}
          </span>

          {isPast ? (
            <span className="badge badge-sm border-0 bg-base-100/90 font-semibold text-base-content/70 backdrop-blur">
              Ended
            </span>
          ) : (
            <span className="badge badge-sm border-0 bg-base-100/90 font-semibold text-base-content backdrop-blur">
              {relativeDay(event.eventDate)}
            </span>
          )}
        </div>
      </figure>

      <div className="card-body gap-3 p-5">
        <h3 id={titleId} className="font-display text-lg font-semibold leading-snug">
          <Link href={to} className="transition-colors hover:text-primary">
            {event.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-base-content/70">
          {event.description}
        </p>

        <dl className="mt-auto grid gap-2 text-sm text-base-content/75">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4 w-4 shrink-0 text-primary" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
            <dd className="truncate">{event.location}</dd>
          </div>

          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4 w-4 shrink-0 text-primary" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            <dd>
              <time dateTime={event.eventDate}>{formatDate(event.eventDate)}</time>
            </dd>
          </div>
        </dl>

        <div className="mt-1 flex items-center justify-between gap-3 border-t border-base-300 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content/60">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-4 w-4" aria-hidden="true">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16 5.2a3.2 3.2 0 0 1 0 5.6M17.4 20a6.2 6.2 0 0 0-2-4.6" />
            </svg>
            {event.joinCount ?? 0} {(event.joinCount ?? 0) === 1 ? "volunteer" : "volunteers"}
          </span>

          {footer ?? (
            <Link href={to} className="btn btn-primary btn-sm rounded-full px-4">
              View Event
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card overflow-hidden border border-base-300 bg-base-100">
      <div className="skeleton-tint aspect-[16/10] w-full" />
      <div className="card-body gap-3 p-5">
        <div className="skeleton-tint h-5 w-3/4 rounded" />
        <div className="skeleton-tint h-4 w-full rounded" />
        <div className="skeleton-tint h-4 w-5/6 rounded" />
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton-tint h-4 w-24 rounded" />
          <div className="skeleton-tint h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
