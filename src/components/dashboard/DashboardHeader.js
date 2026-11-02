import Link from "next/link";

const TABS = [
  { href: "/dashboard/manage", label: "Manage events" },
  { href: "/dashboard/joined", label: "Joined events" },
];

export default function DashboardHeader({ active, eyebrow, title, description, action }) {
  return (
    <section className="wash border-b border-base-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">{description}</p>
          </div>

          {action && (
            <Link href={action.href} className="btn btn-primary shrink-0 rounded-full px-6">
              {action.label}
            </Link>
          )}
        </div>

        <div role="tablist" className="tabs tabs-border mt-8">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={active === tab.href}
              className={`tab font-semibold ${active === tab.href ? "tab-active text-primary" : "text-base-content/65"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
