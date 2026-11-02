"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

const ThemeContext = createContext(null);

export const THEMES = {
  light: "shongkolpo",
  dark: "shongkolpo-dark",
};

const STORAGE_KEY = "shongkolpo-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Reads what the pre-paint inline script already put on <html>. */
function readAppliedTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === THEMES.dark ? "dark" : "light";
}

/**
 * The applied theme lives on the <html> element, written there before paint by
 * the inline script in the layout. Treating the DOM as an external store means
 * React reads the real value on the client instead of hydrating a guess and
 * then correcting it in an effect.
 */
function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const serverTheme = () => "light";

/** True once hydration has happened — this never changes afterwards. */
const subscribeNever = () => () => {};
const clientMounted = () => true;
const serverMounted = () => false;

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, readAppliedTheme, serverTheme);
  const mounted = useSyncExternalStore(subscribeNever, clientMounted, serverMounted);

  const applyTheme = useCallback((next) => {
    const resolved = next === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = THEMES[resolved];
    document.documentElement.style.colorScheme = resolved;

    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      // Private mode or blocked storage: the theme still applies for this tab.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", setTheme: applyTheme, toggleTheme, mounted }),
    [theme, applyTheme, toggleTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return ctx;
}

/** Runs before first paint so a stored dark theme never flashes light. */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("${DARK_QUERY}").matches;
    var name = dark ? "${THEMES.dark}" : "${THEMES.light}";
    document.documentElement.dataset.theme = name;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();
`;
