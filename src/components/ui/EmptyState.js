import Link from "next/link";

export default function EmptyState({ title, description, action, icon }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-3xl border border-dashed border-base-300 bg-base-100 px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon ?? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7" aria-hidden="true">
            <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4M9 15h6" />
          </svg>
        )}
      </span>

      <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-base-content/70">{description}</p>

      {action && (
        <Link href={action.href} className="btn btn-primary mt-6 rounded-full px-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
