import Link from "next/link";
import EventsBrowser from "@/components/events/EventsBrowser";

export const metadata = {
  title: "Upcoming events",
  description:
    "Browse every upcoming social service event on Shongkolpo — clean-ups, plantation days, clothing drives and more.",
};

export default function EventsPage() {
  return (
    <>
      <section className="wash border-b border-base-300">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="eyebrow">The calendar</span>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Upcoming events</h1>
            <p className="mt-4 text-base leading-relaxed text-base-content/75 sm:text-lg">
              Every drive posted by the community, soonest first. Pick one, read
              the details, and add your name.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/events/create" className="btn btn-primary rounded-full px-6">
              Create an event
            </Link>
            <span className="text-sm text-base-content/60">
              Only events on today or later are listed here.
            </span>
          </div>
        </div>
      </section>

      <EventsBrowser />
    </>
  );
}
