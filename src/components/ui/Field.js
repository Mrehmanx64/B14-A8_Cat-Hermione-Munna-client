"use client";

/**
 * Labelled form control with inline error messaging and accessible wiring
 * (aria-invalid / aria-describedby). Used by every form in the app so error
 * presentation stays consistent.
 */
export default function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
  className = "",
  htmlFor,
}) {
  const id = htmlFor ?? name;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`form-control w-full ${className}`}>
      <label className="label pb-1.5" htmlFor={id}>
        <span className="label-text text-sm font-semibold text-base-content">
          {label}
          {required && <span className="ml-0.5 text-error" aria-hidden="true">*</span>}
        </span>
      </label>

      {children({ id, errorId, hintId, invalid: Boolean(error) })}

      {hint && !error && (
        <span id={hintId} className="mt-1.5 block text-xs leading-relaxed text-base-content/60">
          {hint}
        </span>
      )}

      {error && (
        <span
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-error"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 7.5v5M12 16.2h.01" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

export function inputClass(invalid, extra = "") {
  return `input input-bordered w-full ${invalid ? "input-error" : ""} ${extra}`.trim();
}
