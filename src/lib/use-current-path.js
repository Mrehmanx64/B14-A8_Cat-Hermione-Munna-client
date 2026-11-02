"use client";

import { useEffect, useState } from "react";

/**
 * A Suspense-free alternative to `usePathname()`.
 *
 * With Cache Components enabled, `usePathname()` suspends on any route whose
 * dynamic params are not statically known — and since the Navbar lives in the
 * root layout, that would force every such page to wrap the whole header in a
 * Suspense boundary (and lose the header while it streams). Reading the path
 * after mount keeps the header in the prerendered shell instead.
 *
 * It returns `null` until hydration finishes, so active-link styling simply
 * appears a tick later. Navigation is tracked by listening for `popstate` and
 * for a custom event dispatched when the History API is patched — Next's
 * client router uses `history.pushState`/`replaceState` under the hood.
 */
const HISTORY_CHANGE_EVENT = "shongkolpo:history-change";

let patchInstalled = false;

function installHistoryPatch() {
  if (patchInstalled || typeof window === "undefined") return;
  patchInstalled = true;

  for (const method of ["pushState", "replaceState"]) {
    const original = window.history[method];
    window.history[method] = function patchedHistoryMethod(...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event(HISTORY_CHANGE_EVENT));
      return result;
    };
  }
}

export function useCurrentPath() {
  const [pathname, setPathname] = useState(null);

  useEffect(() => {
    installHistoryPatch();

    const sync = () => setPathname(window.location.pathname);
    sync();

    window.addEventListener("popstate", sync);
    window.addEventListener(HISTORY_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(HISTORY_CHANGE_EVENT, sync);
    };
  }, []);

  return pathname;
}
