import { Suspense } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import EventEditForm from "@/components/events/EventEditForm";

export const metadata = { title: "Edit event" };

/** Keeps the `params` read inside a Suspense boundary so the App Shell stays URL-independent. */
async function EditBody({ params }) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <section className="wash border-b border-base-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-base-content/60">
            <Link href="/dashboard/manage" className="link link-hover font-medium">
              Manage events
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link href={`/events/${id}`} className="link link-hover font-medium">
              Event
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-base-content/80">Edit</span>
          </nav>

          <span className="eyebrow mt-6 block">Make a change</span>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Edit event</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/75 sm:text-lg">
            Update the details and save. Everyone who joined sees the latest
            version when they open the event.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <EventEditForm eventId={id} />
        </div>
      </section>
    </ProtectedRoute>
  );
}

export default function EditEventPage({ params }) {
  return (
    <Suspense fallback={<EditFallback />}>
      <EditBody params={params} />
    </Suspense>
  );
}

function EditFallback() {
  return (
    <div className="section" role="status">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="sr-only">Loading event…</span>
        <div className="skeleton-tint h-10 w-2/5 rounded" />
        <div className="mt-8 grid gap-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="skeleton-tint h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
