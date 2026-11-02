import Link from "next/link";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import EventCreateForm from "@/components/events/EventCreateForm";

export const metadata = {
  title: "Create an event",
  description:
    "Post a cleanup, plantation day, clothing drive or any social service event and invite your community to join.",
};

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <section className="wash border-b border-base-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-base-content/60">
            <Link href="/events" className="link link-hover font-medium">
              Upcoming events
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-base-content/80">Create</span>
          </nav>

          <span className="eyebrow mt-6 block">Organise a drive</span>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Create an event</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-base-content/75 sm:text-lg">
            Describe the drive, pick a date and place, and publish. It appears
            in Upcoming Events immediately, and only you can edit or delete it.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <EventCreateForm />
        </div>
      </section>
    </ProtectedRoute>
  );
}
