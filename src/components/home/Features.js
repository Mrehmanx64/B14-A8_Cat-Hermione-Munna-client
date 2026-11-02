const FEATURES = [
  {
    title: "Create in under a minute",
    body: "Give your drive a title, a location and a date. Everything else — volunteer list, join tracking — is handled for you.",
    icon: "M12 5v14M5 12h14",
  },
  {
    title: "Join with one tap",
    body: "Volunteers see the full plan before committing, then join with a single click. Your spot is stored against the event immediately.",
    icon: "M20 6 9 17l-5-5",
  },
  {
    title: "Know who is coming",
    body: "See the volunteer count on every card, and a sorted list of the events you have pledged to attend.",
    icon: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M21 21v-2a4 4 0 0 0-3-3.87",
  },
  {
    title: "Only your events, editable",
    body: "Manage Events lists exactly what you created. Update details or remove a drive — nobody else can touch it.",
    icon: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  },
  {
    title: "Past events stay out",
    body: "The upcoming list is filtered by date at the database level, so finished drives never clutter what is next.",
    icon: "M12 8v4l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  },
  {
    title: "Light and dark, everywhere",
    body: "One toggle flips the whole platform, including forms, cards and the dashboard. Your choice is remembered.",
    icon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  },
];

export default function Features() {
  return (
    <section id="features" className="section bg-base-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="eyebrow">Why Shongkolpo</span>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Built for the people who actually show up
          </h2>
          <p className="text-base-content/70">
            No sign-up sheets, no group chats lost in the scroll. Just a clear
            list of what is happening, who is running it, and how to take part.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="group rounded-2xl border border-base-300 bg-base-100 p-6 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d={feature.icon} />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
