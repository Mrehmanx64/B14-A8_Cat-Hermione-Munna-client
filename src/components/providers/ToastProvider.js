"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

let idSeed = 0;

const ICONS = {
  success: "M20 6 9 17l-5-5",
  error: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  info: "M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  warning: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
};

const TONES = {
  success: { cls: "alert-success", icon: ICONS.success },
  error: { cls: "alert-error", icon: ICONS.error },
  info: { cls: "alert-info", icon: ICONS.info },
  warning: { cls: "alert-warning", icon: ICONS.warning },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (tone, message, { duration = 4200 } = {}) => {
      if (!message) return;
      const id = ++idSeed;
      setToasts((current) => [...current.slice(-3), { id, tone, message }]);

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const api = useMemo(
    () => ({
      success: (message, options) => push("success", message, options),
      error: (message, options) => push("error", message, options),
      info: (message, options) => push("info", message, options),
      warning: (message, options) => push("warning", message, options),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        className="toast toast-end toast-top z-[100] max-w-[calc(100vw-2rem)]"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.info;
          return (
            <div
              key={toast.id}
              className={`alert ${tone.cls} pointer-events-auto w-full max-w-sm items-start gap-3 shadow-lg`}
              role="status"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                <path d={tone.icon} />
              </svg>

              <p className="min-w-0 flex-1 text-sm font-medium leading-snug">{toast.message}</p>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="btn btn-ghost btn-xs btn-circle -mr-1 shrink-0"
                aria-label="Dismiss notification"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>.");
  return ctx;
}
