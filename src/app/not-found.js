import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="section">
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
        <p className="font-display text-7xl font-semibold text-primary/25">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold">This page slipped away</h1>
        <p className="mt-3 text-base leading-relaxed text-base-content/70">
          The link may be old, or the event it pointed to has been removed by its
          organiser.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary rounded-full px-6">
            Back home
          </Link>
          <Link href="/events" className="btn btn-outline rounded-full px-6">
            Upcoming events
          </Link>
        </div>
      </div>
    </section>
  );
}
