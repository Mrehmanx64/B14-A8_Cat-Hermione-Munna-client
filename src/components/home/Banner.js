import Link from "next/link";
import CountUp from "@/components/ui/CountUp";

const STATS = [
  { value: 1240, suffix: "+", label: "Volunteers pledged" },
  { value: 86, suffix: "", label: "Events hosted" },
  { value: 12, suffix: "", label: "Dhaka neighbourhoods" },
];

export default function Banner() {
  return (
    <section className="wash relative overflow-hidden">
      {/* Ambient decoration: two slow-drifting colour fields behind the copy. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="hero-blob absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="hero-blob hero-blob-slow absolute -right-24 top-10 h-[24rem] w-[24rem] rounded-full bg-secondary/25 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 md:pb-24 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <span className="hero-rise badge badge-lg border-primary/25 bg-primary/10 px-4 py-3 font-semibold text-primary">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            Community service, organised
          </span>

          <h1 className="hero-rise mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]" style={{ "--hero-delay": "90ms" }}>
            A pledge to serve,
            <span className="relative mx-2 inline-block text-primary">
              together
              <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-2.5 w-full text-secondary" aria-hidden="true">
                <path
                  d="M2 8c40-6 80-6 120-3s58 4 76 1"
                  pathLength="1"
                  className="hero-draw"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            — one neighbourhood at a time.
          </h1>

          <p className="hero-rise mt-6 max-w-xl text-base leading-relaxed text-base-content/75 sm:text-lg" style={{ "--hero-delay": "180ms" }}>
            Shongkolpo brings volunteers and organisers onto one page. Find a
            winter clothing drive in Mirpur, start a plantation day in
            Mohammadpur, and see exactly who is showing up beside you.
          </p>

          <div className="hero-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--hero-delay": "260ms" }}>
            <Link href="/events" className="btn btn-primary rounded-full px-7 text-base">
              Browse upcoming events
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/events/create" className="btn btn-outline rounded-full border-base-300 px-7 text-base">
              Create an event
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-base-300 pt-7">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="hero-rise"
                style={{ "--hero-delay": `${340 + index * 110}ms` }}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold text-primary sm:text-3xl">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-base-content/60 sm:text-sm">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-rise relative mx-auto w-full max-w-lg lg:max-w-none" style={{ "--hero-delay": "200ms" }}>
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- static editorial imagery */}
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=700&q=80"
              alt="Volunteers sorting donated clothing at a community drive"
              className="col-span-2 aspect-[16/10] w-full rounded-3xl object-cover shadow-xl"
              fetchPriority="high"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- static editorial imagery */}
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500&q=80"
              alt="Hands cradling a sapling at a community tree-planting drive"
              className="aspect-square w-full rounded-3xl object-cover shadow-lg"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- static editorial imagery */}
            <img
              src="https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&w=500&q=80"
              alt="Neighbours packing food parcels for distribution"
              className="aspect-square w-full rounded-3xl object-cover shadow-lg"
              loading="lazy"
            />
          </div>

          <div className="hero-float absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100/95 px-4 py-3 shadow-lg backdrop-blur sm:left-6">
            <span className="flex -space-x-2" aria-hidden="true">
              {[
                "photo-1500648767791-00dcc994a43e",
                "photo-1494790108377-be9c29b29330",
                "photo-1507003211169-0a1dd7228f2d",
              ].map((id) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative stack
                <img
                  key={id}
                  src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=80&q=70`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-base-100 object-cover"
                  loading="lazy"
                />
              ))}
            </span>
            <p className="text-xs font-semibold leading-tight text-base-content">
              128 neighbours joined
              <span className="block text-[0.68rem] font-normal text-base-content/60">
                events this month
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
