export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status">
      <span className="loading loading-ring loading-lg text-primary" aria-hidden="true" />
      <p className="text-sm font-medium text-base-content/60">Loading…</p>
    </div>
  );
}
